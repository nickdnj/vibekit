import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/task_model.dart';
import '../repositories/task_repository.dart';
import 'firebase_providers.dart';

part 'task_providers.g.dart';

/// Task repository provider
@riverpod
TaskRepository taskRepository(TaskRepositoryRef ref) {
  return TaskRepository();
}

/// User tasks provider - streams all tasks for current user
@riverpod
Stream<List<TaskModel>> userTasks(UserTasksRef ref) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value([]);

  final repository = ref.watch(taskRepositoryProvider);
  return repository.getUserTasks(user.uid);
}

/// User tasks by status provider
@riverpod
Stream<List<TaskModel>> userTasksByStatus(
  UserTasksByStatusRef ref,
  String status,
) {
  final user = ref.watch(currentUserProvider);
  if (user == null) return Stream.value([]);

  final repository = ref.watch(taskRepositoryProvider);
  return repository.getUserTasksByStatus(user.uid, status);
}

/// Single task provider
@riverpod
Future<TaskModel?> task(TaskRef ref, String taskId) {
  final repository = ref.watch(taskRepositoryProvider);
  return repository.getTask(taskId);
}

/// All tasks provider (admin only)
@riverpod
Stream<List<TaskModel>> allTasks(AllTasksRef ref) {
  final repository = ref.watch(taskRepositoryProvider);
  return repository.getAllTasks();
}

/// Task creation provider
@riverpod
class TaskCreator extends _$TaskCreator {
  @override
  FutureOr<TaskModel?> build() {
    return null;
  }

  Future<TaskModel> createTask({
    required String title,
    required String description,
    String status = 'todo',
    DateTime? dueDate,
    Map<String, dynamic>? metadata,
  }) async {
    final user = ref.read(currentUserProvider);
    if (user == null) throw Exception('No user signed in');

    state = const AsyncLoading();

    try {
      final repository = ref.read(taskRepositoryProvider);
      final task = await repository.createTask(
        ownerId: user.uid,
        title: title,
        description: description,
        status: status,
        dueDate: dueDate,
        metadata: metadata,
      );

      state = AsyncData(task);
      return task;
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    }
  }
}

/// Task updater provider
@riverpod
class TaskUpdater extends _$TaskUpdater {
  @override
  FutureOr<TaskModel?> build() {
    return null;
  }

  Future<TaskModel> updateTask({
    required String taskId,
    String? title,
    String? description,
    String? status,
    DateTime? dueDate,
    Map<String, dynamic>? metadata,
  }) async {
    state = const AsyncLoading();

    try {
      final repository = ref.read(taskRepositoryProvider);
      final task = await repository.updateTask(
        taskId: taskId,
        title: title,
        description: description,
        status: status,
        dueDate: dueDate,
        metadata: metadata,
      );

      state = AsyncData(task);
      return task;
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    }
  }
}

/// Task deleter provider
@riverpod
class TaskDeleter extends _$TaskDeleter {
  @override
  FutureOr<bool> build() {
    return false;
  }

  Future<void> deleteTask(String taskId) async {
    state = const AsyncLoading();

    try {
      final repository = ref.read(taskRepositoryProvider);
      await repository.deleteTask(taskId);
      state = const AsyncData(true);
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      rethrow;
    }
  }
}

/// Task search provider
@riverpod
class TaskSearcher extends _$TaskSearcher {
  @override
  FutureOr<List<TaskModel>> build() {
    return [];
  }

  Future<List<TaskModel>> searchTasks(String searchTerm) async {
    final user = ref.read(currentUserProvider);
    if (user == null) return [];

    if (searchTerm.isEmpty) {
      state = const AsyncData([]);
      return [];
    }

    state = const AsyncLoading();

    try {
      final repository = ref.read(taskRepositoryProvider);
      final results = await repository.searchTasks(
        userId: user.uid,
        searchTerm: searchTerm,
      );

      state = AsyncData(results);
      return results;
    } catch (e) {
      state = AsyncError(e, StackTrace.current);
      return [];
    }
  }
}
