import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:uuid/uuid.dart';
import '../models/task_model.dart';
import '../services/firebase_service.dart';

class TaskRepository {
  final FirebaseFirestore _firestore = FirebaseService.instance.firestore;
  final Uuid _uuid = const Uuid();

  /// Get all tasks for a user
  Stream<List<TaskModel>> getUserTasks(String userId) {
    return _firestore
        .collection('tasks')
        .where('ownerId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TaskModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get tasks by status for a user
  Stream<List<TaskModel>> getUserTasksByStatus(String userId, String status) {
    return _firestore
        .collection('tasks')
        .where('ownerId', isEqualTo: userId)
        .where('status', isEqualTo: status)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TaskModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get a single task by ID
  Future<TaskModel?> getTask(String taskId) async {
    try {
      final doc = await _firestore.collection('tasks').doc(taskId).get();
      if (doc.exists) {
        return TaskModel.fromJson({
          'id': doc.id,
          ...doc.data()!,
        });
      }
      return null;
    } catch (e) {
      throw Exception('Failed to get task: $e');
    }
  }

  /// Create a new task
  Future<TaskModel> createTask({
    required String ownerId,
    required String title,
    required String description,
    String status = 'todo',
    DateTime? dueDate,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final taskId = _uuid.v4();
      final now = DateTime.now();

      final task = TaskModel(
        id: taskId,
        ownerId: ownerId,
        title: title,
        description: description,
        status: status,
        createdAt: now,
        dueDate: dueDate,
        metadata: metadata,
      );

      await _firestore
          .collection('tasks')
          .doc(taskId)
          .set(task.toJson()..remove('id')); // Remove id from data

      return task;
    } catch (e) {
      throw Exception('Failed to create task: $e');
    }
  }

  /// Update a task
  Future<TaskModel> updateTask({
    required String taskId,
    String? title,
    String? description,
    String? status,
    DateTime? dueDate,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final updateData = <String, dynamic>{
        'updatedAt': FieldValue.serverTimestamp(),
      };

      if (title != null) updateData['title'] = title;
      if (description != null) updateData['description'] = description;
      if (status != null) updateData['status'] = status;
      if (dueDate != null) updateData['dueDate'] = Timestamp.fromDate(dueDate);
      if (metadata != null) updateData['metadata'] = metadata;

      await _firestore.collection('tasks').doc(taskId).update(updateData);

      // Get updated task
      final updatedTask = await getTask(taskId);
      if (updatedTask == null) {
        throw Exception('Task not found after update');
      }

      return updatedTask;
    } catch (e) {
      throw Exception('Failed to update task: $e');
    }
  }

  /// Delete a task
  Future<void> deleteTask(String taskId) async {
    try {
      await _firestore.collection('tasks').doc(taskId).delete();
    } catch (e) {
      throw Exception('Failed to delete task: $e');
    }
  }

  /// Get all tasks (admin only)
  Stream<List<TaskModel>> getAllTasks() {
    return _firestore
        .collection('tasks')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => TaskModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get tasks with pagination
  Future<List<TaskModel>> getTasksPaginated({
    required String userId,
    int limit = 20,
    DocumentSnapshot? startAfter,
  }) async {
    try {
      Query query = _firestore
          .collection('tasks')
          .where('ownerId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .limit(limit);

      if (startAfter != null) {
        query = query.startAfterDocument(startAfter);
      }

      final snapshot = await query.get();
      return snapshot.docs
          .map((doc) => TaskModel.fromJson({
                'id': doc.id,
                ...doc.data() as Map<String, dynamic>,
              }))
          .toList();
    } catch (e) {
      throw Exception('Failed to get paginated tasks: $e');
    }
  }

  /// Search tasks
  Future<List<TaskModel>> searchTasks({
    required String userId,
    required String searchTerm,
    int limit = 20,
  }) async {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation that filters client-side
      final allTasks = await _firestore
          .collection('tasks')
          .where('ownerId', isEqualTo: userId)
          .limit(100) // Limit to avoid too much data
          .get();

      final searchTermLower = searchTerm.toLowerCase();
      final filteredTasks = allTasks.docs
          .where((doc) {
            final data = doc.data();
            final title = (data['title'] as String? ?? '').toLowerCase();
            final description = (data['description'] as String? ?? '').toLowerCase();
            return title.contains(searchTermLower) || 
                   description.contains(searchTermLower);
          })
          .take(limit)
          .map((doc) => TaskModel.fromJson({
                'id': doc.id,
                ...doc.data(),
              }))
          .toList();

      return filteredTasks;
    } catch (e) {
      throw Exception('Failed to search tasks: $e');
    }
  }
}
