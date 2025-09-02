import 'dart:io';
import 'dart:typed_data';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:uuid/uuid.dart';
import '../models/media_model.dart';
import '../services/firebase_service.dart';

class MediaRepository {
  final FirebaseFirestore _firestore = FirebaseService.instance.firestore;
  final FirebaseStorage _storage = FirebaseService.instance.storage;
  final Uuid _uuid = const Uuid();

  /// Upload file to Firebase Storage and create media document
  Future<MediaModel> uploadFile({
    required String ownerId,
    required String fileName,
    required String mediaType,
    File? file,
    Uint8List? data,
    String? description,
    Map<String, dynamic>? metadata,
  }) async {
    if (file == null && data == null) {
      throw Exception('Either file or data must be provided');
    }

    try {
      final mediaId = _uuid.v4();
      final fileExtension = fileName.split('.').last;
      final storagePath = 'media/$ownerId/$mediaId.$fileExtension';
      
      // Upload to Firebase Storage
      final ref = _storage.ref().child(storagePath);
      
      UploadTask uploadTask;
      if (file != null) {
        uploadTask = ref.putFile(file);
      } else {
        uploadTask = ref.putData(data!);
      }

      final snapshot = await uploadTask;
      final downloadUrl = await snapshot.ref.getDownloadURL();
      
      // Get file size
      final fileSize = file != null ? await file.length() : data!.length;

      // Create media document
      final mediaModel = MediaModel(
        id: mediaId,
        ownerId: ownerId,
        type: mediaType,
        url: downloadUrl,
        name: fileName,
        size: fileSize,
        createdAt: DateTime.now(),
        description: description,
        metadata: {
          'storagePath': storagePath,
          'fileExtension': fileExtension,
          ...?metadata,
        },
      );

      await _firestore
          .collection('media')
          .doc(mediaId)
          .set(mediaModel.toJson()..remove('id'));

      return mediaModel;
    } catch (e) {
      throw Exception('Failed to upload file: $e');
    }
  }

  /// Get all media for a user
  Stream<List<MediaModel>> getUserMedia(String userId) {
    return _firestore
        .collection('media')
        .where('ownerId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MediaModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get media by type for a user
  Stream<List<MediaModel>> getUserMediaByType(String userId, String type) {
    return _firestore
        .collection('media')
        .where('ownerId', isEqualTo: userId)
        .where('type', isEqualTo: type)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MediaModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get a single media item by ID
  Future<MediaModel?> getMedia(String mediaId) async {
    try {
      final doc = await _firestore.collection('media').doc(mediaId).get();
      if (doc.exists) {
        return MediaModel.fromJson({
          'id': doc.id,
          ...doc.data()!,
        });
      }
      return null;
    } catch (e) {
      throw Exception('Failed to get media: $e');
    }
  }

  /// Update media metadata
  Future<MediaModel> updateMedia({
    required String mediaId,
    String? name,
    String? description,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final updateData = <String, dynamic>{
        'updatedAt': FieldValue.serverTimestamp(),
      };

      if (name != null) updateData['name'] = name;
      if (description != null) updateData['description'] = description;
      if (metadata != null) updateData['metadata'] = metadata;

      await _firestore.collection('media').doc(mediaId).update(updateData);

      final updatedMedia = await getMedia(mediaId);
      if (updatedMedia == null) {
        throw Exception('Media not found after update');
      }

      return updatedMedia;
    } catch (e) {
      throw Exception('Failed to update media: $e');
    }
  }

  /// Delete media (both storage and document)
  Future<void> deleteMedia(String mediaId) async {
    try {
      // Get media document to find storage path
      final media = await getMedia(mediaId);
      if (media == null) {
        throw Exception('Media not found');
      }

      // Delete from Firebase Storage
      final storagePath = media.metadata?['storagePath'] as String?;
      if (storagePath != null) {
        try {
          await _storage.ref().child(storagePath).delete();
        } catch (e) {
          // Continue even if storage deletion fails
        }
      }

      // Delete document from Firestore
      await _firestore.collection('media').doc(mediaId).delete();
    } catch (e) {
      throw Exception('Failed to delete media: $e');
    }
  }

  /// Get all media (admin only)
  Stream<List<MediaModel>> getAllMedia() {
    return _firestore
        .collection('media')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => MediaModel.fromJson({
                  'id': doc.id,
                  ...doc.data(),
                }))
            .toList());
  }

  /// Get media with pagination
  Future<List<MediaModel>> getMediaPaginated({
    required String userId,
    int limit = 20,
    DocumentSnapshot? startAfter,
  }) async {
    try {
      Query query = _firestore
          .collection('media')
          .where('ownerId', isEqualTo: userId)
          .orderBy('createdAt', descending: true)
          .limit(limit);

      if (startAfter != null) {
        query = query.startAfterDocument(startAfter);
      }

      final snapshot = await query.get();
      return snapshot.docs
          .map((doc) => MediaModel.fromJson({
                'id': doc.id,
                ...doc.data() as Map<String, dynamic>,
              }))
          .toList();
    } catch (e) {
      throw Exception('Failed to get paginated media: $e');
    }
  }

  /// Search media
  Future<List<MediaModel>> searchMedia({
    required String userId,
    required String searchTerm,
    int limit = 20,
  }) async {
    try {
      final allMedia = await _firestore
          .collection('media')
          .where('ownerId', isEqualTo: userId)
          .limit(100)
          .get();

      final searchTermLower = searchTerm.toLowerCase();
      final filteredMedia = allMedia.docs
          .where((doc) {
            final data = doc.data();
            final name = (data['name'] as String? ?? '').toLowerCase();
            final description = (data['description'] as String? ?? '').toLowerCase();
            return name.contains(searchTermLower) || 
                   description.contains(searchTermLower);
          })
          .take(limit)
          .map((doc) => MediaModel.fromJson({
                'id': doc.id,
                ...doc.data(),
              }))
          .toList();

      return filteredMedia;
    } catch (e) {
      throw Exception('Failed to search media: $e');
    }
  }

  /// Get storage usage for a user
  Future<int> getUserStorageUsage(String userId) async {
    try {
      final mediaQuery = await _firestore
          .collection('media')
          .where('ownerId', isEqualTo: userId)
          .get();

      int totalSize = 0;
      for (final doc in mediaQuery.docs) {
        final size = doc.data()['size'] as int? ?? 0;
        totalSize += size;
      }

      return totalSize;
    } catch (e) {
      throw Exception('Failed to get storage usage: $e');
    }
  }
}
