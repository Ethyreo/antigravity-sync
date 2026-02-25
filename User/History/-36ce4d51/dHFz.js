// ===== Sample News Data =====
const newsData = [
    {
        id: "1",
        type: "article",
        title: "Apple Unveils Revolutionary AI Chip",
        summary: "Apple's new M4 Ultra chip brings on-device AI processing to unprecedented levels, enabling real-time language translation and image generation without cloud connectivity.",
        keyPoints: [
            "40% faster than M3 Ultra",
            "Neural engine with 38 trillion ops/sec",
            "Available in Mac Studio this spring"
        ],
        category: "Technology",
        sentiment: "Positive",
        originalURL: "https://example.com/apple-ai",
        timestamp: new Date(),
        sourceName: "The Verge"
    },
    {
        id: "2",
        type: "video",
        title: "The Future of Remote Work is Async",
        summary: "A deep dive into why the world's top companies are abandoning real-time meetings in favor of asynchronous communication tools.",
        keyPoints: [
            "Meetings cost companies $25B annually",
            "Async-first companies report 23% higher productivity",
            "Tools like Loom and Notion lead the shift"
        ],
        category: "Business",
        sentiment: "Neutral",
        originalURL: "https://youtube.com/watch?v=example",
        timestamp: new Date(Date.now() - 3600000),
        sourceName: "Y Combinator"
    },
    {
        id: "3",
        type: "article",
        title: "SpaceX Starship Completes First Orbital Flight",
        summary: "After years of development and multiple test failures, SpaceX's Starship successfully completed its first full orbital mission.",
        keyPoints: [
            "Flight lasted 90 minutes",
            "Successful ocean landing of both stages",
            "Paves way for Mars missions"
        ],
        category: "Science",
        sentiment: "Positive",
        originalURL: "https://example.com/starship",
        timestamp: new Date(Date.now() - 7200000),
        sourceName: "Ars Technica"
    },
    {
        id: "4",
        type: "article",
        title: "Global Markets Rally on Fed Rate Cut",
        summary: "Stock markets worldwide surged after the Federal Reserve announced a 0.5% interest rate cut, signaling confidence in economic recovery.",
        keyPoints: [
            "S&P 500 up 2.3%",
            "Tech sector leads gains",
            "Bond yields fall sharply"
        ],
        category: "Business",
        sentiment: "Positive",
        originalURL: "https://example.com/markets",
        timestamp: new Date(Date.now() - 10800000),
        sourceName: "Bloomberg"
    },
    {
        id: "5",
        type: "video",
        title: "Why I Left Big Tech After 10 Years",
        summary: "A senior engineer shares their journey from burnout to founding a sustainable startup, offering insights on work-life balance.",
        keyPoints: [
            "Burnout is a systemic issue, not personal failure",
            "Small teams can outperform large ones",
            "Purpose trumps compensation long-term"
        ],
        category: "Technology",
        sentiment: "Neutral",
        originalURL: "https://youtube.com/watch?v=example2",
        timestamp: new Date(Date.now() - 14400000),
        sourceName: "Tech Lead Journal"
    }
];

// ===== State =====
let currentIndex = 0;
let items = [...newsData];
let activeCategories = new Set();
const allCategories = [...new Set(newsData.map(item => item.category))];

// ===== DOM Elements =====
const cardStack = document.getElementById('cardStack');
const filterBtn = document.getElementById('filterBtn');
const filterModal = document.getElementById('filterModal');
const filterChips = document.getElementById('filterChips');
const closeFilter = document.getElementById('closeFilter');
const applyFilter = document.getElementById('applyFilter');
const skipBtn = document.getElementById('skipBtn');
const saveBtn = document.getElementById('saveBtn');
const openBtn = document.getElementById('openBtn');
const currentIndexEl = document.getElementById('currentIndex');
const totalCountEl = document.getElementById('totalCount');

// ===== Helpers =====
function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

function getTypeIcon(type) {
    if (type === 'video') {
        return `<svg class="type-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor"/>
        </svg>`;
    }
    return `<svg class="type-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2"/>
        <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`;
}

// ===== Render Cards =====
function renderCards() {
    cardStack.innerHTML = '';
    
    if (items.length === 0 || currentIndex >= items.length) {
        cardStack.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <h3>All Caught Up!</h3>
                <p>You've reviewed all your news. Check back later for fresh content.</p>
            </div>
        `;
        updateProgress();
        return;
    }
    
    // Render up to 3 cards
    const visibleItems = items.slice(currentIndex, currentIndex + 3);
    
    visibleItems.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = i;
        card.dataset.id = item.id;
        
        card.innerHTML = `
            <div class="card-header">
                <span class="category-pill">${item.category}</span>
                ${getTypeIcon(item.type)}
            </div>
            <h2 class="card-title">${item.title}</h2>
            <p class="card-summary">${item.summary}</p>
            <div class="key-points">
                ${item.keyPoints.map(point => `<div class="key-point">${point}</div>`).join('')}
            </div>
            <div class="card-footer">
                <span class="source">${item.sourceName}</span>
                <span class="time-ago">${timeAgo(item.timestamp)}</span>
            </div>
            <div class="swipe-indicator skip">SKIP</div>
            <div class="swipe-indicator save">SAVE</div>
        `;
        
        cardStack.appendChild(card);
        
        // Only add gesture to top card
        if (i === 0) {
            addSwipeGesture(card);
        }
    });
    
    updateProgress();
}

// ===== Update Progress =====
function updateProgress() {
    currentIndexEl.textContent = Math.min(currentIndex + 1, items.length);
    totalCountEl.textContent = items.length;
}

// ===== Swipe Gesture =====
function addSwipeGesture(card) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let isDragging = false;
    
    const onStart = (e) => {
        isDragging = true;
        card.classList.add('dragging');
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    };
    
    const onMove = (e) => {
        if (!isDragging) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = clientX - startX;
        
        const rotation = currentX / 15;
        const opacity = 1 - Math.abs(currentX) / 500;
        
        card.style.transform = `translateX(${currentX}px) rotate(${rotation}deg)`;
        card.style.opacity = Math.max(0.5, opacity);
        
        // Show swipe indicators
        const skipIndicator = card.querySelector('.swipe-indicator.skip');
        const saveIndicator = card.querySelector('.swipe-indicator.save');
        
        if (currentX < -50) {
            skipIndicator.style.opacity = Math.min(1, Math.abs(currentX + 50) / 100);
            saveIndicator.style.opacity = 0;
        } else if (currentX > 50) {
            saveIndicator.style.opacity = Math.min(1, (currentX - 50) / 100);
            skipIndicator.style.opacity = 0;
        } else {
            skipIndicator.style.opacity = 0;
            saveIndicator.style.opacity = 0;
        }
    };
    
    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        
        if (currentX > 100) {
            // Save / Right swipe
            swipeCard('right');
        } else if (currentX < -100) {
            // Skip / Left swipe
            swipeCard('left');
        } else {
            // Reset
            card.style.transform = '';
            card.style.opacity = '';
            card.querySelector('.swipe-indicator.skip').style.opacity = 0;
            card.querySelector('.swipe-indicator.save').style.opacity = 0;
        }
        
        currentX = 0;
    };
    
    // Mouse events
    card.addEventListener('mousedown', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    
    // Touch events
    card.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onEnd);
}

// ===== Swipe Card =====
function swipeCard(direction) {
    const topCard = cardStack.querySelector('.card[data-index="0"]');
    if (!topCard) return;
    
    topCard.classList.add(direction === 'left' ? 'exiting-left' : 'exiting-right');
    
    setTimeout(() => {
        currentIndex++;
        renderCards();
    }, 350);
}

// ===== Filter Modal =====
function renderFilterChips() {
    filterChips.innerHTML = allCategories.map(cat => `
        <button class="filter-chip ${activeCategories.has(cat) ? 'active' : ''}" data-category="${cat}">
            ${cat}
        </button>
    `).join('');
    
    // Add click handlers
    filterChips.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cat = chip.dataset.category;
            if (activeCategories.has(cat)) {
                activeCategories.delete(cat);
                chip.classList.remove('active');
            } else {
                activeCategories.add(cat);
                chip.classList.add('active');
            }
        });
    });
}

function applyFilters() {
    if (activeCategories.size === 0) {
        items = [...newsData];
    } else {
        items = newsData.filter(item => activeCategories.has(item.category));
    }
    currentIndex = 0;
    renderCards();
    filterModal.classList.remove('active');
}

// ===== Event Listeners =====
filterBtn.addEventListener('click', () => {
    renderFilterChips();
    filterModal.classList.add('active');
});

closeFilter.addEventListener('click', () => {
    filterModal.classList.remove('active');
});

applyFilter.addEventListener('click', applyFilters);

filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.classList.remove('active');
    }
});

skipBtn.addEventListener('click', () => swipeCard('left'));
saveBtn.addEventListener('click', () => swipeCard('right'));
openBtn.addEventListener('click', () => {
    if (items[currentIndex]) {
        window.open(items[currentIndex].originalURL, '_blank');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') swipeCard('left');
    if (e.key === 'ArrowRight') swipeCard('right');
    if (e.key === 'Escape') filterModal.classList.remove('active');
});

// ===== Initialize =====
renderCards();
