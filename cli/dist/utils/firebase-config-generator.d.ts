export interface FirebaseConfig {
    projectId: string;
    platforms: {
        web?: any;
        android?: any;
        ios?: any;
    };
}
/**
 * Check if FlutterFire CLI is installed
 */
export declare function checkFlutterFireCLI(): Promise<boolean>;
/**
 * Install FlutterFire CLI
 */
export declare function installFlutterFireCLI(): Promise<void>;
/**
 * Generate firebase_options.dart using FlutterFire CLI
 */
export declare function generateFirebaseOptions(projectId: string): Promise<void>;
/**
 * Backup existing firebase_options.dart
 */
export declare function backupExistingConfig(): Promise<void>;
/**
 * Validate generated Firebase configuration
 */
export declare function validateFirebaseConfig(): Promise<boolean>;
/**
 * Update pubspec.yaml with Firebase dependencies (if needed)
 */
export declare function updatePubspecDependencies(): Promise<void>;
/**
 * Generate Firebase environment configuration
 */
export declare function generateEnvironmentConfig(projectId: string): Promise<void>;
/**
 * Complete Firebase configuration generation
 */
export declare function generateCompleteFirebaseConfig(projectId: string): Promise<void>;
//# sourceMappingURL=firebase-config-generator.d.ts.map