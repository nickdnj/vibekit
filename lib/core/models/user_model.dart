import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String uid,
    required String email,
    required String displayName,
    @Default('user') String role,
    required DateTime createdAt,
    DateTime? updatedAt,
    String? photoURL,
    Map<String, dynamic>? metadata,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

enum UserRole {
  user,
  admin,
  inactive,
}

extension UserRoleExtension on UserRole {
  String get value {
    switch (this) {
      case UserRole.user:
        return 'user';
      case UserRole.admin:
        return 'admin';
      case UserRole.inactive:
        return 'inactive';
    }
  }
  
  String get name {
    switch (this) {
      case UserRole.user:
        return 'user';
      case UserRole.admin:
        return 'admin';
      case UserRole.inactive:
        return 'inactive';
    }
  }
}

extension UserModelExtension on UserModel {
  bool get isAdmin => role == UserRole.admin.value;
  bool get isUser => role == UserRole.user.value;
  bool get isInactive => role == UserRole.inactive.value;
  
  UserRole get userRole {
    switch (role) {
      case 'admin':
        return UserRole.admin;
      case 'inactive':
        return UserRole.inactive;
      default:
        return UserRole.user;
    }
  }
}
