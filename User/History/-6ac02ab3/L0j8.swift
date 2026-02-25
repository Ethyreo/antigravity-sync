import SwiftUI

struct CardView: View {
    let item: NewsItem
    
    // Warm, luxurious color palette
    private let cardBackground = Color(red: 0.98, green: 0.96, blue: 0.93) // Warm cream
    private let accentWarm = Color(red: 0.76, green: 0.60, blue: 0.42) // Warm bronze
    private let textPrimary = Color(red: 0.20, green: 0.18, blue: 0.16) // Rich charcoal
    private let textSecondary = Color(red: 0.45, green: 0.42, blue: 0.38) // Muted brown
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Category & Source Header
            headerSection
            
            Spacer().frame(height: 24)
            
            // Title
            Text(item.title)
                .font(.system(size: 26, weight: .semibold, design: .serif))
                .foregroundColor(textPrimary)
                .lineSpacing(4)
                .fixedSize(horizontal: false, vertical: true)
            
            Spacer().frame(height: 20)
            
            // Summary
            Text(item.summary)
                .font(.system(size: 17, weight: .regular, design: .default))
                .foregroundColor(textSecondary)
                .lineSpacing(6)
                .fixedSize(horizontal: false, vertical: true)
            
            Spacer().frame(height: 28)
            
            // Key Points
            keyPointsSection
            
            Spacer()
            
            // Bottom Bar
            bottomSection
        }
        .padding(28)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(cardBackground)
        .cornerRadius(24)
        .shadow(color: Color.black.opacity(0.08), radius: 20, x: 0, y: 10)
    }
    
    // MARK: - Header
    private var headerSection: some View {
        HStack {
            // Category Pill
            Text(item.category.uppercased())
                .font(.system(size: 11, weight: .semibold, design: .default))
                .tracking(1.2)
                .foregroundColor(accentWarm)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(accentWarm.opacity(0.12))
                .cornerRadius(20)
            
            Spacer()
            
            // Type Icon
            Image(systemName: item.type == "video" ? "play.circle.fill" : "doc.text.fill")
                .font(.system(size: 18))
                .foregroundColor(accentWarm.opacity(0.7))
        }
    }
    
    // MARK: - Key Points
    private var keyPointsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            ForEach(item.keyPoints.prefix(3), id: \.self) { point in
                HStack(alignment: .top, spacing: 12) {
                    Circle()
                        .fill(accentWarm)
                        .frame(width: 6, height: 6)
                        .offset(y: 7)
                    
                    Text(point)
                        .font(.system(size: 15, weight: .regular))
                        .foregroundColor(textSecondary)
                        .lineSpacing(4)
                }
            }
        }
    }
    
    // MARK: - Bottom
    private var bottomSection: some View {
        HStack {
            // Source
            Text(item.sourceName)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(textSecondary.opacity(0.7))
            
            Spacer()
            
            // Time ago
            Text(timeAgo(from: item.timestamp))
                .font(.system(size: 13, weight: .regular))
                .foregroundColor(textSecondary.opacity(0.5))
        }
    }
    
    // MARK: - Helpers
    private func timeAgo(from date: Date) -> String {
        let interval = Date().timeIntervalSince(date)
        if interval < 3600 {
            return "\(Int(interval / 60))m ago"
        } else if interval < 86400 {
            return "\(Int(interval / 3600))h ago"
        } else {
            return "\(Int(interval / 86400))d ago"
        }
    }
}

#Preview {
    CardView(item: NewsItem.sampleData[0])
        .frame(height: 550)
        .padding(20)
        .background(Color(red: 0.12, green: 0.11, blue: 0.10))
}
