import 'package:flutter/material.dart';
import '../services/mock_data.dart';
import '../models/creator_models.dart';
import 'creator_editor.dart';
import '../widgets/settings_sheet.dart';

class CreatorDashboard extends StatefulWidget {
  const CreatorDashboard({super.key});

  @override
  State<CreatorDashboard> createState() => _CreatorDashboardState();
}

class _CreatorDashboardState extends State<CreatorDashboard> {
  int _selectedIndex = 0;

  // Screens
  final List<Widget> _screens = [
    const MatchesScreen(),
    const CreatorEditor(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) => setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.notifications_active_outlined),
            selectedIcon: Icon(Icons.notifications_active),
            label: 'Requests',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class MatchesScreen extends StatefulWidget {
  const MatchesScreen({super.key});

  @override
  State<MatchesScreen> createState() => _MatchesScreenState();
}

class _MatchesScreenState extends State<MatchesScreen> {
  List<BrandProfile> requests = List.from(MockDataService.incomingRequests);

  void _handleAction(String brandName, bool accepted) {
    setState(() {
      requests.removeWhere((b) => b.name == brandName);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(accepted ? 'Accepted match with $brandName!' : 'Declined $brandName'),
        backgroundColor: accepted ? Colors.green : Colors.grey,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.home),
          onPressed: () {
            // Dummy action
          },
        ),
        title: const Text('Incoming Matches'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => showSettings(context),
          ),
        ],
      ),
      body: requests.isEmpty
          ? const Center(child: Text('No pending requests', style: TextStyle(color: Colors.grey)))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: requests.length,
              itemBuilder: (context, index) {
                final brand = requests[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            CircleAvatar(
                              radius: 24,
                              backgroundColor: Colors.white10,
                              child: Text(brand.name[0], style: const TextStyle(fontWeight: FontWeight.bold)),
                            ),
                            const SizedBox(width: 12),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(brand.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                Text(brand.industry, style: const TextStyle(color: Colors.grey, fontSize: 12)),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(brand.description, style: const TextStyle(color: Colors.white70)),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton(
                                onPressed: () => _handleAction(brand.name, false),
                                style: OutlinedButton.styleFrom(foregroundColor: Colors.redAccent),
                                child: const Text('Decline'),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () => _handleAction(brand.name, true),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Theme.of(context).primaryColor,
                                  foregroundColor: Colors.white,
                                ),
                                child: const Text('Accept'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
