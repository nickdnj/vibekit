import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/user_model.dart';

class UserRepository {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  /// Get all users (admin only)
  Stream<List<UserModel>> getAllUsersStream() {
    return _firestore
        .collection('users')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => UserModel.fromJson({
                  'uid': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get users by role
  Stream<List<UserModel>> getUsersByRoleStream(UserRole role) {
    return _firestore
        .collection('users')
        .where('role', isEqualTo: role.name)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => UserModel.fromJson({
                  'uid': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get user by ID
  Future<UserModel?> getUserById(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists) {
        return UserModel.fromJson({
          'uid': doc.id,
          ...doc.data()!,
        });
      }
      return null;
    } catch (e) {
      throw Exception('Failed to get user: $e');
    }
  }

  /// Update user profile
  Future<void> updateUserProfile(String uid, Map<String, dynamic> data) async {
    try {
      await _firestore.collection('users').doc(uid).update(data);
    } catch (e) {
      throw Exception('Failed to update user profile: $e');
    }
  }

  /// Update user role (admin only)
  Future<void> updateUserRole(String uid, UserRole newRole) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        'role': newRole.name,
      });
    } catch (e) {
      throw Exception('Failed to update user role: $e');
    }
  }

  /// Create or update user profile
  Future<void> createOrUpdateUser(UserModel user) async {
    try {
      await _firestore.collection('users').doc(user.uid).set(
            user.toJson()..remove('uid'), // Remove uid from data
            SetOptions(merge: true),
          );
    } catch (e) {
      throw Exception('Failed to create/update user: $e');
    }
  }

  /// Delete user (admin only - soft delete by setting role to inactive)
  Future<void> deactivateUser(String uid) async {
    try {
      await _firestore.collection('users').doc(uid).update({
        'role': 'inactive',
      });
    } catch (e) {
      throw Exception('Failed to deactivate user: $e');
    }
  }

  /// Get user statistics
  Future<Map<String, int>> getUserStatistics() async {
    try {
      final usersSnapshot = await _firestore.collection('users').get();
      final users = usersSnapshot.docs
          .map((doc) => UserModel.fromJson({
                'uid': doc.id,
                ...doc.data(),
              }))
          .toList();

      return {
        'total': users.length,
        'admins': users.where((u) => u.userRole == UserRole.admin).length,
        'users': users.where((u) => u.userRole == UserRole.user).length,
        'inactive': users.where((u) => u.userRole == UserRole.inactive).length,
      };
    } catch (e) {
      throw Exception('Failed to get user statistics: $e');
    }
  }

  /// Search users by email or display name
  Future<List<UserModel>> searchUsers(String query) async {
    try {
      if (query.isEmpty) return [];

      final emailQuery = await _firestore
          .collection('users')
          .where('email', isGreaterThanOrEqualTo: query)
          .where('email', isLessThanOrEqualTo: '$query\uf8ff')
          .limit(20)
          .get();

      final displayNameQuery = await _firestore
          .collection('users')
          .where('displayName', isGreaterThanOrEqualTo: query)
          .where('displayName', isLessThanOrEqualTo: '$query\uf8ff')
          .limit(20)
          .get();

      final Set<String> seenUids = {};
      final List<UserModel> results = [];

      // Add email search results
      for (final doc in emailQuery.docs) {
        if (!seenUids.contains(doc.id)) {
          seenUids.add(doc.id);
          results.add(UserModel.fromJson({
            'uid': doc.id,
            ...doc.data(),
          }));
        }
      }

      // Add display name search results
      for (final doc in displayNameQuery.docs) {
        if (!seenUids.contains(doc.id)) {
          seenUids.add(doc.id);
          results.add(UserModel.fromJson({
            'uid': doc.id,
            ...doc.data(),
          }));
        }
      }

      return results;
    } catch (e) {
      throw Exception('Failed to search users: $e');
    }
  }
}
