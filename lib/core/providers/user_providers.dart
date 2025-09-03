import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../repositories/user_repository.dart';

// User Repository Provider
final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository();
});

// All Users Stream Provider (Admin only)
final allUsersProvider = StreamProvider<List<UserModel>>((ref) {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getAllUsersStream();
});

// Users by Role Provider
final usersByRoleProvider = StreamProvider.family<List<UserModel>, UserRole>((ref, role) {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUsersByRoleStream(role);
});

// User Statistics Provider
final userStatisticsProvider = FutureProvider<Map<String, int>>((ref) {
  final repository = ref.watch(userRepositoryProvider);
  return repository.getUserStatistics();
});

// Search Users Provider
final searchUsersProvider = FutureProvider.family<List<UserModel>, String>((ref, query) {
  final repository = ref.watch(userRepositoryProvider);
  return repository.searchUsers(query);
});

// User Search Query State
final userSearchQueryProvider = StateProvider<String>((ref) => '');

// Selected User for Management
final selectedUserProvider = StateProvider<UserModel?>((ref) => null);

// Admin Actions Loading State
final adminActionLoadingProvider = StateProvider<bool>((ref) => false);
