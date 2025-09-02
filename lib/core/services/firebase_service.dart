import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_app_check/firebase_app_check.dart';
import '../../firebase_options.dart';

/// Core Firebase service for initializing and accessing Firebase services
class FirebaseService {
  static FirebaseService? _instance;
  static FirebaseService get instance => _instance ??= FirebaseService._();
  
  FirebaseService._();

  bool _initialized = false;
  bool get initialized => _initialized;

  /// Firebase service instances
  FirebaseAuth get auth => FirebaseAuth.instance;
  FirebaseFirestore get firestore => FirebaseFirestore.instance;
  FirebaseStorage get storage => FirebaseStorage.instance;
  FirebaseAnalytics get analytics => FirebaseAnalytics.instance;
  FirebaseMessaging get messaging => FirebaseMessaging.instance;

  /// Initialize Firebase services
  Future<void> initialize() async {
    if (_initialized) return;

    try {
      await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform,
      );

      // Initialize App Check for security
      await FirebaseAppCheck.instance.activate(
        // Use debug token for development
        webProvider: ReCaptchaV3Provider('VIBEKIT_RECAPTCHA_SITE_KEY'),
        androidProvider: AndroidProvider.debug,
        appleProvider: AppleProvider.debug,
      );

      // Configure Firestore settings
      firestore.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );

      _initialized = true;
    } catch (e) {
      throw Exception('Failed to initialize Firebase: $e');
    }
  }

  /// Configure Firebase Auth settings
  Future<void> configureAuth() async {
    await auth.setSettings(
      appVerificationDisabledForTesting: false,
      userAccessGroup: null,
    );
  }

  /// Configure Analytics
  Future<void> configureAnalytics() async {
    await analytics.setAnalyticsCollectionEnabled(true);
  }

  /// Configure Messaging
  Future<void> configureMessaging() async {
    final settings = await messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      // Get FCM token
      final token = await messaging.getToken();
      if (token != null) {
        // Send token to server if needed
      }
    }

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Handle foreground message
    });

    // Handle background messages
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  }

  /// Clean up resources
  Future<void> dispose() async {
    // Add any cleanup logic here
  }
}

/// Background message handler
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  // Handle background message
}
