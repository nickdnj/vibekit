import 'package:freezed_annotation/freezed_annotation.dart';

part 'media_model.freezed.dart';
part 'media_model.g.dart';

@freezed
class MediaModel with _$MediaModel {
  const factory MediaModel({
    required String id,
    required String ownerId,
    required String type,
    required String url,
    required String name,
    required int size,
    required DateTime createdAt,
    DateTime? updatedAt,
    String? description,
    Map<String, dynamic>? metadata,
  }) = _MediaModel;

  factory MediaModel.fromJson(Map<String, dynamic> json) =>
      _$MediaModelFromJson(json);
}

enum MediaType {
  image,
  video,
  audio,
  pdf,
  document,
  other,
}

extension MediaTypeExtension on MediaType {
  String get value {
    switch (this) {
      case MediaType.image:
        return 'image';
      case MediaType.video:
        return 'video';
      case MediaType.audio:
        return 'audio';
      case MediaType.pdf:
        return 'pdf';
      case MediaType.document:
        return 'document';
      case MediaType.other:
        return 'other';
    }
  }

  String get displayName {
    switch (this) {
      case MediaType.image:
        return 'Image';
      case MediaType.video:
        return 'Video';
      case MediaType.audio:
        return 'Audio';
      case MediaType.pdf:
        return 'PDF';
      case MediaType.document:
        return 'Document';
      case MediaType.other:
        return 'Other';
    }
  }

  List<String> get allowedExtensions {
    switch (this) {
      case MediaType.image:
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      case MediaType.video:
        return ['mp4', 'mov', 'avi', 'mkv', 'webm'];
      case MediaType.audio:
        return ['mp3', 'wav', 'aac', 'ogg', 'm4a'];
      case MediaType.pdf:
        return ['pdf'];
      case MediaType.document:
        return ['doc', 'docx', 'txt', 'rtf', 'md'];
      case MediaType.other:
        return [];
    }
  }
}

extension MediaModelExtension on MediaModel {
  MediaType get typeEnum {
    switch (type) {
      case 'image':
        return MediaType.image;
      case 'video':
        return MediaType.video;
      case 'audio':
        return MediaType.audio;
      case 'pdf':
        return MediaType.pdf;
      case 'document':
        return MediaType.document;
      default:
        return MediaType.other;
    }
  }

  String get formattedSize {
    if (size < 1024) return '$size B';
    if (size < 1024 * 1024) return '${(size / 1024).toStringAsFixed(1)} KB';
    if (size < 1024 * 1024 * 1024) {
      return '${(size / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
    return '${(size / (1024 * 1024 * 1024)).toStringAsFixed(1)} GB';
  }

  String get fileExtension {
    final parts = name.split('.');
    return parts.length > 1 ? parts.last.toLowerCase() : '';
  }
}
