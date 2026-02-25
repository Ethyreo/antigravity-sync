import Foundation

struct NewsItem: Identifiable, Codable {
    let id: String
    let type: String // "article" or "video"
    let title: String
    let summary: String
    let keyPoints: [String]
    let category: String
    let sentiment: String
    let originalURL: String
    let timestamp: Date
    let sourceName: String
    let imageURL: String?
    
    // For multi-category filtering
    var categories: [String] {
        return [category]
    }
}

// MARK: - Sample Data for UI Testing
extension NewsItem {
    static let sampleData: [NewsItem] = [
        NewsItem(
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
            timestamp: Date(),
            sourceName: "The Verge",
            imageURL: nil
        ),
        NewsItem(
            id: "2",
            type: "video",
            title: "The Future of Remote Work is Async",
            summary: "A deep dive into why the world's top companies are abandoning real-time meetings in favor of asynchronous communication tools and documentation-first cultures.",
            keyPoints: [
                "Meetings cost companies $25B annually",
                "Async-first companies report 23% higher productivity",
                "Tools like Loom and Notion lead the shift"
            ],
            category: "Business",
            sentiment: "Neutral",
            originalURL: "https://youtube.com/watch?v=example",
            timestamp: Date().addingTimeInterval(-3600),
            sourceName: "Y Combinator",
            imageURL: nil
        ),
        NewsItem(
            id: "3",
            type: "article",
            title: "SpaceX Starship Completes First Orbital Flight",
            summary: "After years of development and multiple test failures, SpaceX's Starship successfully completed its first full orbital mission, marking a new era in space exploration.",
            keyPoints: [
                "Flight lasted 90 minutes",
                "Successful ocean landing of both stages",
                "Paves way for Mars missions"
            ],
            category: "Science",
            sentiment: "Positive",
            originalURL: "https://example.com/starship",
            timestamp: Date().addingTimeInterval(-7200),
            sourceName: "Ars Technica",
            imageURL: nil
        ),
        NewsItem(
            id: "4",
            type: "article",
            title: "Global Markets Rally on Fed Rate Cut",
            summary: "Stock markets worldwide surged after the Federal Reserve announced a 0.5% interest rate cut, signaling confidence in the economic recovery.",
            keyPoints: [
                "S&P 500 up 2.3%",
                "Tech sector leads gains",
                "Bond yields fall sharply"
            ],
            category: "Business",
            sentiment: "Positive",
            originalURL: "https://example.com/markets",
            timestamp: Date().addingTimeInterval(-10800),
            sourceName: "Bloomberg",
            imageURL: nil
        ),
        NewsItem(
            id: "5",
            type: "video",
            title: "Why I Left Big Tech After 10 Years",
            summary: "A senior engineer shares their journey from burnout to founding a sustainable startup, offering insights on work-life balance and finding purpose in tech.",
            keyPoints: [
                "Burnout is a systemic issue, not personal failure",
                "Small teams can outperform large ones",
                "Purpose trumps compensation long-term"
            ],
            category: "Technology",
            sentiment: "Neutral",
            originalURL: "https://youtube.com/watch?v=example2",
            timestamp: Date().addingTimeInterval(-14400),
            sourceName: "Tech Lead Journal",
            imageURL: nil
        )
    ]
}
