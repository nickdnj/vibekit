import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class TasksScreen extends ConsumerWidget {
  const TasksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.task, size: 64),
          SizedBox(height: 16),
          Text('Tasks feature coming soon!'),
          SizedBox(height: 8),
          Text('This will show your Firebase-backed task list.'),
        ],
      ),
    );
  }
}
