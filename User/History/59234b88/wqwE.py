import os
import json
import hashlib
from datetime import datetime
import google.generativeai as genai
from youtube_transcript_api import YouTubeTranscriptApi
from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-pro')

CACHE_FILE = "backend/processed_cache.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=4)

def get_content_hash(content_id):
    """Simple hash to track if we've processed this item."""
    return hashlib.md5(content_id.encode()).hexdigest()

def summarize_text(text, type="article"):
    """
    Uses Gemini to summarize text.
    Prompt is optimized for the 'Tinder-card' format: Title, Summary, Key Points.
    """
    prompt = f"""
    You are an expert news curator. Analyze the following {type} text:
    
    "{text[:10000]}" # Limit input to avoid token limits/costs
    
    Output strictly in JSON format with these keys:
    - "title": A catchy, short headline (max 10 words).
    - "summary": A 2-sentence summary of the core message.
    - "key_points": An array of 3-5 bullet points strings.
    - "category": Best fit category (Technology, Business, Science, Politics, Entertainment, Sports).
    - "sentiment": "Positive", "Neutral", or "Negative".
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean up code blocks if Gemini adds them
        text_response = response.text.replace("```json", "").replace("```", "")
        return json.loads(text_response)
    except Exception as e:
        print(f"Error communicating with Gemini: {e}")
        return None

def process_youtube_video(video_id):
    cache = load_cache()
    if video_id in cache:
        print(f"Skipping {video_id} (Already processed)")
        return cache[video_id]

    print(f"Processing YouTube Video: {video_id}")
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([t['text'] for t in transcript_list])
        
        # Summarize
        ai_data = summarize_text(full_text, type="video transcript")
        
        if ai_data:
            result = {
                "id": video_id,
                "type": "video",
                "original_url": f"https://www.youtube.com/watch?v={video_id}",
                "timestamp": datetime.now().isoformat(),
                **ai_data
            }
            
            # Save to cache
            cache[video_id] = result
            save_cache(cache)
            return result
            
    except Exception as e:
        print(f"Failed to process video {video_id}: {e}")
        return None

def process_article(url):
    hashed_url = get_content_hash(url)
    cache = load_cache()
    if hashed_url in cache:
        print(f"Skipping {url} (Already processed)")
        return cache[hashed_url]

    print(f"Processing Article: {url}")
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # very basic extraction - can be improved
        paragraphs = soup.find_all('p')
        full_text = " ".join([p.get_text() for p in paragraphs])
        
        if len(full_text) < 500: # Skip if content is too short/failed scrape
            return None

        ai_data = summarize_text(full_text, type="article")
        
        if ai_data:
            result = {
                "id": hashed_url,
                "type": "article",
                "original_url": url,
                "timestamp": datetime.now().isoformat(),
                **ai_data
            }
            
            # Save to cache
            cache[hashed_url] = result
            save_cache(cache)
            return result
            
    except Exception as e:
        print(f"Failed to process article {url}: {e}")
        return None
