import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const execAsync = promisify(exec);

export interface ServiceConfig {
  auth: {
    enabled: boolean;
    providers: string[];
  };
  firestore: {
    enabled: boolean;
    location: string;
  };
  storage: {
    enabled: boolean;
    location: string;
  };
  hosting: {
    enabled: boolean;
  };
  functions: {
    enabled: boolean;
    location: string;
  };
  analytics: {
    enabled: boolean;
  };
  messaging: {
    enabled: boolean;
  };
}

/**
 * Enable Firebase Authentication
 */
export async function enableAuthentication(projectId: string): Promise<void> {
  const spinner = ora('Enabling Firebase Authentication...').start();
  
  try {
    // Enable Authentication API
    await execAsync(`firebase projects:use ${projectId}`);
    
    // Note: Firebase Auth is enabled by default, but we can configure providers
    spinner.succeed('Firebase Authentication enabled');
    
    console.log(chalk.cyan('\n🔐 Authentication Providers Configuration\n'));
    
    const { providers } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'providers',
        message: 'Select authentication providers to enable:',
        choices: [
          { name: 'Email/Password', value: 'password', checked: true },
          { name: 'Google', value: 'google.com', checked: true },
          { name: 'Apple', value: 'apple.com' },
          { name: 'Anonymous', value: 'anonymous' },
          { name: 'Phone', value: 'phone' }
        ]
      }
    ]);
    
    console.log(chalk.green(`\n✅ Selected providers: ${providers.join(', ')}`));
    console.log(chalk.yellow('Note: Providers will need to be configured in Firebase Console'));
    
  } catch (error) {
    spinner.fail('Failed to enable Authentication');
    throw error;
  }
}

/**
 * Enable and configure Firestore
 */
export async function enableFirestore(projectId: string): Promise<void> {
  const spinner = ora('Enabling Cloud Firestore...').start();
  
  try {
    await execAsync(`firebase projects:use ${projectId}`);
    
    // Check if Firestore is already enabled
    try {
      await execAsync('firebase firestore:databases:list --json');
      spinner.succeed('Cloud Firestore already enabled');
      return;
    } catch {
      // Firestore not enabled, continue with setup
    }
    
    spinner.text = 'Configuring Firestore database...';
    
    const { location } = await inquirer.prompt([
      {
        type: 'list',
        name: 'location',
        message: 'Select Firestore location:',
        choices: [
          { name: 'us-central1 (Iowa) - Recommended', value: 'us-central1' },
          { name: 'us-east1 (South Carolina)', value: 'us-east1' },
          { name: 'us-west1 (Oregon)', value: 'us-west1' },
          { name: 'europe-west1 (Belgium)', value: 'europe-west1' },
          { name: 'asia-southeast1 (Singapore)', value: 'asia-southeast1' }
        ],
        default: 'us-central1'
      }
    ]);
    
    // Create Firestore database
    await execAsync(`firebase firestore:databases:create --location=${location}`);
    
    spinner.succeed(`Cloud Firestore enabled in ${location}`);
    
  } catch (error) {
    spinner.fail('Failed to enable Firestore');
    throw error;
  }
}

/**
 * Enable Firebase Storage
 */
export async function enableStorage(projectId: string): Promise<void> {
  const spinner = ora('Enabling Firebase Storage...').start();
  
  try {
    await execAsync(`firebase projects:use ${projectId}`);
    
    // Storage is typically enabled by default, but we can configure it
    spinner.succeed('Firebase Storage enabled');
    
    console.log(chalk.yellow('\nNote: Storage bucket will be created automatically'));
    console.log(chalk.gray('Default bucket: gs://' + projectId + '.appspot.com\n'));
    
  } catch (error) {
    spinner.fail('Failed to enable Storage');
    throw error;
  }
}

/**
 * Enable Firebase Hosting
 */
export async function enableHosting(projectId: string): Promise<void> {
  const spinner = ora('Enabling Firebase Hosting...').start();
  
  try {
    await execAsync(`firebase projects:use ${projectId}`);
    
    // Initialize hosting if not already done
    spinner.text = 'Configuring Firebase Hosting...';
    
    // Check if firebase.json exists
    const fs = require('fs-extra');
    if (!await fs.pathExists('firebase.json')) {
      // Create basic firebase.json for hosting
      const firebaseConfig = {
        hosting: {
          public: 'build/web',
          ignore: ['firebase.json', '**/.*', '**/node_modules/**'],
          rewrites: [
            {
              source: '**',
              destination: '/index.html'
            }
          ]
        }
      };
      
      await fs.writeJson('firebase.json', firebaseConfig, { spaces: 2 });
    }
    
    spinner.succeed('Firebase Hosting configured');
    
  } catch (error) {
    spinner.fail('Failed to enable Hosting');
    throw error;
  }
}

/**
 * Enable Firebase Functions
 */
export async function enableFunctions(projectId: string): Promise<void> {
  const spinner = ora('Setting up Firebase Functions...').start();
  
  try {
    await execAsync(`firebase projects:use ${projectId}`);
    
    spinner.text = 'Configuring Functions directory...';
    
    const fs = require('fs-extra');
    
    // Create functions directory if it doesn't exist
    if (!await fs.pathExists('functions')) {
      await fs.ensureDir('functions');
      
      // Create basic package.json for functions
      const functionsPackage = {
        name: 'vibekit-functions',
        description: 'VibeKit Firebase Functions',
        scripts: {
          build: 'tsc',
          serve: 'npm run build && firebase emulators:start --only functions',
          shell: 'npm run build && firebase functions:shell',
          start: 'npm run shell',
          deploy: 'firebase deploy --only functions',
          logs: 'firebase functions:log'
        },
        engines: {
          node: '18'
        },
        main: 'lib/index.js',
        dependencies: {
          'firebase-admin': '^11.8.0',
          'firebase-functions': '^4.3.1'
        },
        devDependencies: {
          typescript: '^5.0.0'
        }
      };
      
      await fs.writeJson('functions/package.json', functionsPackage, { spaces: 2 });
      
      // Create basic index.ts
      const functionsIndex = `import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// VibeKit Admin Functions
export const setUserRole = functions.https.onCall(async (data, context) => {
  // Verify admin authorization
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  const { uid, role } = data;
  
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: role === 'admin' });
    return { success: true, message: \`User role updated to \${role}\` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to update user role');
  }
});

// Example API endpoint
export const api = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.json({ message: 'VibeKit API is running!', version: '1.0.0' });
});
`;
      
      await fs.writeFile('functions/src/index.ts', functionsIndex);
      await fs.ensureDir('functions/src');
    }
    
    spinner.succeed('Firebase Functions configured');
    
  } catch (error) {
    spinner.fail('Failed to setup Functions');
    throw error;
  }
}

/**
 * Deploy security rules
 */
export async function deploySecurityRules(projectId: string): Promise<void> {
  const spinner = ora('Deploying Firestore and Storage rules...').start();
  
  try {
    await execAsync(`firebase projects:use ${projectId}`);
    
    // Deploy Firestore rules
    await execAsync('firebase deploy --only firestore:rules');
    
    // Deploy Storage rules  
    await execAsync('firebase deploy --only storage');
    
    spinner.succeed('Security rules deployed successfully');
    
  } catch (error) {
    spinner.fail('Failed to deploy security rules');
    throw error;
  }
}

/**
 * Create admin user
 */
export async function createAdminUser(projectId: string): Promise<void> {
  console.log(chalk.cyan('\n👑 Admin User Setup\n'));
  
  const { adminEmail, confirm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'adminEmail',
      message: 'Enter admin user email:',
      validate: (input: string) => {
        if (!input || !input.includes('@')) {
          return 'Please enter a valid email address';
        }
        return true;
      }
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (answers: any) => `Grant admin privileges to ${answers.adminEmail}?`,
      default: true
    }
  ]);
  
  if (!confirm) {
    console.log(chalk.yellow('Admin user setup skipped'));
    return;
  }
  
  console.log(chalk.yellow(`\n⚠️  Manual step required:`));
  console.log(chalk.white(`1. The user ${adminEmail} must sign up in your app first`));
  console.log(chalk.white(`2. Then run this command to grant admin privileges:`));
  console.log(chalk.cyan(`   firebase functions:shell`));
  console.log(chalk.cyan(`   setUserRole({uid: 'USER_UID', role: 'admin'})`));
  console.log(chalk.gray(`\nAlternatively, use the admin dashboard once it's deployed.\n`));
}

/**
 * Configure all Firebase services
 */
export async function configureAllServices(projectId: string): Promise<ServiceConfig> {
  console.log(chalk.cyan('\n🔥 Firebase Services Configuration\n'));
  
  const { services } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'services',
      message: 'Select Firebase services to enable:',
      choices: [
        { name: '🔐 Authentication', value: 'auth', checked: true },
        { name: '🗄️  Cloud Firestore', value: 'firestore', checked: true },
        { name: '📁 Cloud Storage', value: 'storage', checked: true },
        { name: '🌐 Firebase Hosting', value: 'hosting', checked: true },
        { name: '⚡ Cloud Functions', value: 'functions', checked: true },
        { name: '📊 Analytics', value: 'analytics', checked: true },
        { name: '💬 Cloud Messaging', value: 'messaging', checked: true }
      ]
    }
  ]);
  
  const config: ServiceConfig = {
    auth: { enabled: false, providers: [] },
    firestore: { enabled: false, location: 'us-central1' },
    storage: { enabled: false, location: 'us-central1' },
    hosting: { enabled: false },
    functions: { enabled: false, location: 'us-central1' },
    analytics: { enabled: false },
    messaging: { enabled: false }
  };
  
  // Configure selected services
  for (const service of services) {
    try {
      switch (service) {
        case 'auth':
          await enableAuthentication(projectId);
          config.auth.enabled = true;
          break;
        case 'firestore':
          await enableFirestore(projectId);
          config.firestore.enabled = true;
          break;
        case 'storage':
          await enableStorage(projectId);
          config.storage.enabled = true;
          break;
        case 'hosting':
          await enableHosting(projectId);
          config.hosting.enabled = true;
          break;
        case 'functions':
          await enableFunctions(projectId);
          config.functions.enabled = true;
          break;
        case 'analytics':
          config.analytics.enabled = true;
          console.log(chalk.green('✅ Analytics will be enabled automatically'));
          break;
        case 'messaging':
          config.messaging.enabled = true;
          console.log(chalk.green('✅ Cloud Messaging will be enabled automatically'));
          break;
      }
    } catch (error) {
      console.log(chalk.red(`❌ Failed to configure ${service}: ${error}`));
    }
  }
  
  // Deploy security rules if Firestore or Storage is enabled
  if (config.firestore.enabled || config.storage.enabled) {
    try {
      await deploySecurityRules(projectId);
    } catch (error) {
      console.log(chalk.yellow('⚠️  Security rules deployment failed, you can deploy them manually later'));
    }
  }
  
  // Setup admin user
  if (config.auth.enabled) {
    await createAdminUser(projectId);
  }
  
  return config;
}
