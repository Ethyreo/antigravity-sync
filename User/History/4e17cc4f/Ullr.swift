import SwiftUI

struct CardStackView: View {
    @State private var items: [NewsItem] = NewsItem.sampleData
    @State private var offset: CGSize = .zero
    @State private var currentIndex: Int = 0
    
    // Background
    private let backgroundDark = Color(red: 0.08, green: 0.07, blue: 0.06) // Deep charcoal
    
    var body: some View {
        ZStack {
            // Background
            backgroundDark
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Header
                headerView
                
                Spacer().frame(height: 20)
                
                // Card Stack
                ZStack {
                    ForEach(visibleCards) { item in
                        let index = items.firstIndex(where: { $0.id == item.id }) ?? 0
                        let relativeIndex = index - currentIndex
                        
                        CardView(item: item)
                            .frame(height: 520)
                            .padding(.horizontal, 20)
                            .scaleEffect(scaleFor(relativeIndex: relativeIndex))
                            .offset(y: offsetYFor(relativeIndex: relativeIndex))
                            .offset(x: relativeIndex == 0 ? offset.width : 0)
                            .rotationEffect(.degrees(relativeIndex == 0 ? Double(offset.width / 20) : 0))
                            .opacity(opacityFor(relativeIndex: relativeIndex))
                            .zIndex(Double(items.count - index))
                            .gesture(relativeIndex == 0 ? dragGesture : nil)
                    }
                }
                
                Spacer()
                
                // Swipe Indicators
                swipeIndicators
                
                Spacer().frame(height: 30)
            }
        }
    }
    
    // MARK: - Header
    private var headerView: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Good Morning")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.white.opacity(0.5))
                
                Text("Your Feed")
                    .font(.system(size: 28, weight: .bold, design: .serif))
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            // Filter Button
            Button(action: {}) {
                Image(systemName: "line.3.horizontal.decrease.circle")
                    .font(.system(size: 24))
                    .foregroundColor(.white.opacity(0.7))
            }
        }
        .padding(.horizontal, 24)
        .padding(.top, 16)
    }
    
    // MARK: - Swipe Indicators
    private var swipeIndicators: some View {
        HStack(spacing: 40) {
            // Skip
            Circle()
                .stroke(Color.white.opacity(0.2), lineWidth: 2)
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: "xmark")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white.opacity(0.4))
                )
            
            // Save
            Circle()
                .stroke(Color(red: 0.76, green: 0.60, blue: 0.42), lineWidth: 2)
                .frame(width: 70, height: 70)
                .overlay(
                    Image(systemName: "bookmark")
                        .font(.system(size: 24, weight: .medium))
                        .foregroundColor(Color(red: 0.76, green: 0.60, blue: 0.42))
                )
            
            // Open
            Circle()
                .stroke(Color.white.opacity(0.2), lineWidth: 2)
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: "arrow.up.right")
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(.white.opacity(0.4))
                )
        }
    }
    
    // MARK: - Visible Cards
    private var visibleCards: [NewsItem] {
        let endIndex = min(currentIndex + 3, items.count)
        guard currentIndex < endIndex else { return [] }
        return Array(items[currentIndex..<endIndex])
    }
    
    // MARK: - Gesture
    private var dragGesture: some Gesture {
        DragGesture()
            .onChanged { gesture in
                offset = gesture.translation
            }
            .onEnded { gesture in
                withAnimation(.spring(response: 0.4, dampingFraction: 0.8)) {
                    if abs(gesture.translation.width) > 120 {
                        // Swipe detected
                        if gesture.translation.width > 0 {
                            // Right swipe - Save/Like
                            swipeRight()
                        } else {
                            // Left swipe - Skip
                            swipeLeft()
                        }
                    }
                    offset = .zero
                }
            }
    }
    
    // MARK: - Actions
    private func swipeLeft() {
        if currentIndex < items.count - 1 {
            currentIndex += 1
        }
    }
    
    private func swipeRight() {
        // Could add to saved items here
        if currentIndex < items.count - 1 {
            currentIndex += 1
        }
    }
    
    // MARK: - Layout Helpers
    private func scaleFor(relativeIndex: Int) -> CGFloat {
        switch relativeIndex {
        case 0: return 1.0
        case 1: return 0.95
        case 2: return 0.90
        default: return 0.85
        }
    }
    
    private func offsetYFor(relativeIndex: Int) -> CGFloat {
        switch relativeIndex {
        case 0: return 0
        case 1: return 15
        case 2: return 30
        default: return 45
        }
    }
    
    private func opacityFor(relativeIndex: Int) -> Double {
        switch relativeIndex {
        case 0: return 1.0
        case 1: return 0.7
        case 2: return 0.4
        default: return 0.0
        }
    }
}

#Preview {
    CardStackView()
}
