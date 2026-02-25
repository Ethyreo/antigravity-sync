import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class GameScaffold extends StatelessWidget {
  final String title;
  final Widget body;
  final List<Widget>? actions;

  const GameScaffold({
    super.key,
    required this.title,
    required this.body,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Immersive feel
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.go('/'),
        ),
        title: Text(
          title,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: actions,
      ),
      body: SafeArea(child: body),
    );
  }
}
