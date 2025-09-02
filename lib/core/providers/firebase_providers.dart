import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../services/firebase_service.dart';
import '../services/auth_service.dart';
import '../models/user_model.dart';

part 'firebase_providers.g.dart';

/// Firebase service provider
@riverpod
FirebaseService firebaseService(FirebaseServiceRef ref) {
  return FirebaseService.instance;
}

/// Auth service provider
@riverpod
AuthService authService(AuthServiceRef ref) {
  return AuthService();
}

/// Auth state provider - streams the current Firebase user
@riverpod
Stream<User?> authState(AuthStateRef ref) {
  final authService = ref.watch(authServiceProvider);
  return authService.authStateChanges;
}

/// Current user provider - gets the current Firebase user
@riverpod
User? currentUser(CurrentUserRef ref) {
  final authState = ref.watch(authStateProvider);
  return authState.when(
    data: (user) => user,
    loading: () => null,
    error: (_, __) => null,
  );
}

/// Current user data provider - gets the UserModel from Firestore
@riverpod
Future<UserModel?> currentUserData(CurrentUserDataRef ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return null;

  final authService = ref.watch(authServiceProvider);
  return await authService.currentUserData;
}

/// Admin status provider - checks if current user is admin
@riverpod
Future<bool> isAdmin(IsAdminRef ref) async {
  final user = ref.watch(currentUserProvider);
  if (user == null) return false;

  final authService = ref.watch(authServiceProvider);
  return await authService.isAdmin();
}
