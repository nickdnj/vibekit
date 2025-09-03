import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';

const execAsync = promisify(exec);

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
export async function checkFlutterFireCLI(): Promise<boolean> {
  try {
    await execAsync('flutterfire --version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Install FlutterFire CLI
 */
export async function installFlutterFireCLI(): Promise<void> {
  const spinner = ora('Installing FlutterFire CLI...').start();
  
  try {
    await execAsync('dart pub global activate flutterfire_cli');
    spinner.succeed('FlutterFire CLI installed successfully!');
  } catch (error) {
    spinner.fail('Failed to install FlutterFire CLI');
    throw new Error(`FlutterFire CLI installation failed: ${error}`);
  }
}

/**
 * Generate firebase_options.dart using FlutterFire CLI
 */
export async function generateFirebaseOptions(projectId: string): Promise<void> {
  const spinner = ora('Generating firebase_options.dart...').start();
  
  try {
    // Use FlutterFire CLI to configure the project
    const configCommand = `flutterfire configure --project=${projectId} --platforms=web,ios,android --yes`;
    
    await execAsync(configCommand);
    
    spinner.succeed('firebase_options.dart generated successfully!');
    
    console.log(chalk.green('\n✅ Firebase configuration files updated:'));
    console.log(chalk.cyan('  • lib/firebase_options.dart'), chalk.gray('- Flutter Firebase config'));
    console.log(chalk.cyan('  • android/app/google-services.json'), chalk.gray('- Android config'));
    console.log(chalk.cyan('  • ios/Runner/GoogleService-Info.plist'), chalk.gray('- iOS config'));
    console.log(chalk.cyan('  • web/'), chalk.gray('- Web Firebase SDK config\n'));
    
  } catch (error) {
    spinner.fail('Failed to generate Firebase options');
    throw new Error(`Firebase options generation failed: ${error}`);
  }
}

/**
 * Backup existing firebase_options.dart
 */
export async function backupExistingConfig(): Promise<void> {
  const configPath = path.join(process.cwd(), 'lib', 'firebase_options.dart');
  const backupPath = path.join(process.cwd(), 'lib', 'firebase_options.dart.backup');
  
  if (await fs.pathExists(configPath)) {
    await fs.copy(configPath, backupPath);
    console.log(chalk.yellow('📁 Existing firebase_options.dart backed up as firebase_options.dart.backup'));
  }
}

/**
 * Validate generated Firebase configuration
 */
export async function validateFirebaseConfig(): Promise<boolean> {
  const configPath = path.join(process.cwd(), 'lib', 'firebase_options.dart');
  
  if (!(await fs.pathExists(configPath))) {
    return false;
  }
  
  try {
    const content = await fs.readFile(configPath, 'utf-8');
    
    // Check for placeholder values
    const hasPlaceholders = content.includes('VIBEKIT_') || 
                           content.includes('vibekit-template');
    
    if (hasPlaceholders) {
      console.log(chalk.yellow('⚠️  Configuration still contains placeholder values'));
      return false;
    }
    
    // Check for required Firebase config keys
    const hasApiKey = content.includes('apiKey:');
    const hasProjectId = content.includes('projectId:');
    const hasAppId = content.includes('appId:');
    
    if (!hasApiKey || !hasProjectId || !hasAppId) {
      console.log(chalk.yellow('⚠️  Configuration appears incomplete'));
      return false;
    }
    
    return true;
    
  } catch (error) {
    return false;
  }
}

/**
 * Update pubspec.yaml with Firebase dependencies (if needed)
 */
export async function updatePubspecDependencies(): Promise<void> {
  const pubspecPath = path.join(process.cwd(), 'pubspec.yaml');
  
  if (!(await fs.pathExists(pubspecPath))) {
    console.log(chalk.yellow('⚠️  pubspec.yaml not found, skipping dependency update'));
    return;
  }
  
  const spinner = ora('Checking Flutter dependencies...').start();
  
  try {
    const content = await fs.readFile(pubspecPath, 'utf-8');
    
    // Check if Firebase dependencies are present
    const hasFirebaseCore = content.includes('firebase_core:');
    const hasFirebaseAuth = content.includes('firebase_auth:');
    const hasFirestore = content.includes('cloud_firestore:');
    
    if (hasFirebaseCore && hasFirebaseAuth && hasFirestore) {
      spinner.succeed('Flutter dependencies are up to date');
      return;
    }
    
    spinner.warn('Some Firebase dependencies may be missing');
    console.log(chalk.yellow('💡 Tip: Run '), chalk.cyan('flutter pub get'), chalk.yellow(' to ensure all dependencies are installed'));
    
  } catch (error) {
    spinner.fail('Failed to check dependencies');
  }
}

/**
 * Generate Firebase environment configuration
 */
export async function generateEnvironmentConfig(projectId: string): Promise<void> {
  const envConfig = {
    firebase: {
      projectId: projectId,
      configured: true,
      configuredAt: new Date().toISOString(),
      services: {
        auth: true,
        firestore: true,
        storage: true,
        hosting: true,
        functions: true,
        analytics: true,
        messaging: true
      }
    }
  };
  
  const configPath = path.join(process.cwd(), '.vibekit', 'config.json');
  await fs.ensureDir(path.dirname(configPath));
  await fs.writeJson(configPath, envConfig, { spaces: 2 });
  
  console.log(chalk.green('✅ VibeKit configuration saved to .vibekit/config.json'));
}

/**
 * Complete Firebase configuration generation
 */
export async function generateCompleteFirebaseConfig(projectId: string): Promise<void> {
  console.log(chalk.cyan('\n🔧 Firebase Configuration Generation\n'));
  
  // Step 1: Check FlutterFire CLI
  let hasFlutterFire = await checkFlutterFireCLI();
  
  if (!hasFlutterFire) {
    console.log(chalk.yellow('⚠️  FlutterFire CLI not found'));
    console.log(chalk.white('Installing FlutterFire CLI...\n'));
    
    await installFlutterFireCLI();
    hasFlutterFire = true;
  } else {
    console.log(chalk.green('✅ FlutterFire CLI found'));
  }
  
  // Step 2: Backup existing configuration
  await backupExistingConfig();
  
  // Step 3: Generate Firebase options
  try {
    await generateFirebaseOptions(projectId);
  } catch (error) {
    console.log(chalk.red(`❌ FlutterFire configuration failed: ${error}`));
    console.log(chalk.yellow('\n🔧 Attempting manual configuration...\n'));
    
    // Fallback: Manual configuration
    await generateManualFirebaseConfig(projectId);
  }
  
  // Step 4: Validate configuration
  const isValid = await validateFirebaseConfig();
  
  if (isValid) {
    console.log(chalk.green('✅ Firebase configuration is valid'));
  } else {
    console.log(chalk.yellow('⚠️  Configuration validation failed'));
    console.log(chalk.gray('You may need to manually update firebase_options.dart'));
  }
  
  // Step 5: Update dependencies
  await updatePubspecDependencies();
  
  // Step 6: Generate environment config
  await generateEnvironmentConfig(projectId);
  
  console.log(chalk.green('\n🎉 Firebase configuration generation complete!\n'));
}

/**
 * Manual Firebase configuration generation (fallback)
 */
async function generateManualFirebaseConfig(projectId: string): Promise<void> {
  console.log(chalk.cyan('📝 Generating manual Firebase configuration...\n'));
  
  const manualConfig = `// File generated by VibeKit CLI
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example for ${projectId}
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        return windows;
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  // TODO: Replace with actual Firebase configuration from Firebase Console
  // Get config from: https://console.firebase.google.com/project/${projectId}/settings/general
  
  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'YOUR_WEB_API_KEY',
    appId: 'YOUR_WEB_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: '${projectId}',
    authDomain: '${projectId}.firebaseapp.com',
    storageBucket: '${projectId}.appspot.com',
    measurementId: 'YOUR_MEASUREMENT_ID',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'YOUR_ANDROID_API_KEY',
    appId: 'YOUR_ANDROID_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: '${projectId}',
    storageBucket: '${projectId}.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'YOUR_IOS_API_KEY',
    appId: 'YOUR_IOS_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: '${projectId}',
    storageBucket: '${projectId}.appspot.com',
    iosBundleId: 'com.vibekit.${projectId.replace('-', '')}',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'YOUR_MACOS_API_KEY',
    appId: 'YOUR_MACOS_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: '${projectId}',
    storageBucket: '${projectId}.appspot.com',
    iosBundleId: 'com.vibekit.${projectId.replace('-', '')}',
  );

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'YOUR_WINDOWS_API_KEY',
    appId: 'YOUR_WINDOWS_APP_ID',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    projectId: '${projectId}',
  );
}`;

  const configPath = path.join(process.cwd(), 'lib', 'firebase_options.dart');
  await fs.writeFile(configPath, manualConfig);
  
  console.log(chalk.yellow('📝 Manual configuration template created'));
  console.log(chalk.white('📋 Next steps:'));
  console.log(chalk.cyan('  1. Visit Firebase Console: '), chalk.blue(`https://console.firebase.google.com/project/${projectId}/settings/general`));
  console.log(chalk.cyan('  2. Add your app platforms (Web, Android, iOS)'));
  console.log(chalk.cyan('  3. Copy the configuration values'));
  console.log(chalk.cyan('  4. Replace the placeholder values in firebase_options.dart\n'));
}
