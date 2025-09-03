"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableAuthentication = enableAuthentication;
exports.enableFirestore = enableFirestore;
exports.enableStorage = enableStorage;
exports.enableHosting = enableHosting;
exports.enableFunctions = enableFunctions;
exports.deploySecurityRules = deploySecurityRules;
exports.createAdminUser = createAdminUser;
exports.configureAllServices = configureAllServices;
const child_process_1 = require("child_process");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Enable Firebase Authentication
 */
async function enableAuthentication(projectId) {
    const spinner = (0, ora_1.default)('Enabling Firebase Authentication...').start();
    try {
        // Enable Authentication API
        await execAsync(`firebase projects:use ${projectId}`);
        // Note: Firebase Auth is enabled by default, but we can configure providers
        spinner.succeed('Firebase Authentication enabled');
        console.log(chalk_1.default.cyan('\n🔐 Authentication Providers Configuration\n'));
        const { providers } = await inquirer_1.default.prompt([
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
        console.log(chalk_1.default.green(`\n✅ Selected providers: ${providers.join(', ')}`));
        console.log(chalk_1.default.yellow('Note: Providers will need to be configured in Firebase Console'));
    }
    catch (error) {
        spinner.fail('Failed to enable Authentication');
        throw error;
    }
}
/**
 * Enable and configure Firestore
 */
async function enableFirestore(projectId) {
    const spinner = (0, ora_1.default)('Enabling Cloud Firestore...').start();
    try {
        await execAsync(`firebase projects:use ${projectId}`);
        // Check if Firestore is already enabled
        try {
            await execAsync('firebase firestore:databases:list --json');
            spinner.succeed('Cloud Firestore already enabled');
            return;
        }
        catch {
            // Firestore not enabled, continue with setup
        }
        spinner.text = 'Configuring Firestore database...';
        const { location } = await inquirer_1.default.prompt([
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
    }
    catch (error) {
        spinner.fail('Failed to enable Firestore');
        throw error;
    }
}
/**
 * Enable Firebase Storage
 */
async function enableStorage(projectId) {
    const spinner = (0, ora_1.default)('Enabling Firebase Storage...').start();
    try {
        await execAsync(`firebase projects:use ${projectId}`);
        // Storage is typically enabled by default, but we can configure it
        spinner.succeed('Firebase Storage enabled');
        console.log(chalk_1.default.yellow('\nNote: Storage bucket will be created automatically'));
        console.log(chalk_1.default.gray('Default bucket: gs://' + projectId + '.appspot.com\n'));
    }
    catch (error) {
        spinner.fail('Failed to enable Storage');
        throw error;
    }
}
/**
 * Enable Firebase Hosting
 */
async function enableHosting(projectId) {
    const spinner = (0, ora_1.default)('Enabling Firebase Hosting...').start();
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
    }
    catch (error) {
        spinner.fail('Failed to enable Hosting');
        throw error;
    }
}
/**
 * Enable Firebase Functions
 */
async function enableFunctions(projectId) {
    const spinner = (0, ora_1.default)('Setting up Firebase Functions...').start();
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
    }
    catch (error) {
        spinner.fail('Failed to setup Functions');
        throw error;
    }
}
/**
 * Deploy security rules
 */
async function deploySecurityRules(projectId) {
    const spinner = (0, ora_1.default)('Deploying Firestore and Storage rules...').start();
    try {
        await execAsync(`firebase projects:use ${projectId}`);
        // Deploy Firestore rules
        await execAsync('firebase deploy --only firestore:rules');
        // Deploy Storage rules  
        await execAsync('firebase deploy --only storage');
        spinner.succeed('Security rules deployed successfully');
    }
    catch (error) {
        spinner.fail('Failed to deploy security rules');
        throw error;
    }
}
/**
 * Create admin user
 */
async function createAdminUser(projectId) {
    console.log(chalk_1.default.cyan('\n👑 Admin User Setup\n'));
    const { adminEmail, confirm } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'adminEmail',
            message: 'Enter admin user email:',
            validate: (input) => {
                if (!input || !input.includes('@')) {
                    return 'Please enter a valid email address';
                }
                return true;
            }
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => `Grant admin privileges to ${answers.adminEmail}?`,
            default: true
        }
    ]);
    if (!confirm) {
        console.log(chalk_1.default.yellow('Admin user setup skipped'));
        return;
    }
    console.log(chalk_1.default.yellow(`\n⚠️  Manual step required:`));
    console.log(chalk_1.default.white(`1. The user ${adminEmail} must sign up in your app first`));
    console.log(chalk_1.default.white(`2. Then run this command to grant admin privileges:`));
    console.log(chalk_1.default.cyan(`   firebase functions:shell`));
    console.log(chalk_1.default.cyan(`   setUserRole({uid: 'USER_UID', role: 'admin'})`));
    console.log(chalk_1.default.gray(`\nAlternatively, use the admin dashboard once it's deployed.\n`));
}
/**
 * Configure all Firebase services
 */
async function configureAllServices(projectId) {
    console.log(chalk_1.default.cyan('\n🔥 Firebase Services Configuration\n'));
    const { services } = await inquirer_1.default.prompt([
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
    const config = {
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
                    console.log(chalk_1.default.green('✅ Analytics will be enabled automatically'));
                    break;
                case 'messaging':
                    config.messaging.enabled = true;
                    console.log(chalk_1.default.green('✅ Cloud Messaging will be enabled automatically'));
                    break;
            }
        }
        catch (error) {
            console.log(chalk_1.default.red(`❌ Failed to configure ${service}: ${error}`));
        }
    }
    // Deploy security rules if Firestore or Storage is enabled
    if (config.firestore.enabled || config.storage.enabled) {
        try {
            await deploySecurityRules(projectId);
        }
        catch (error) {
            console.log(chalk_1.default.yellow('⚠️  Security rules deployment failed, you can deploy them manually later'));
        }
    }
    // Setup admin user
    if (config.auth.enabled) {
        await createAdminUser(projectId);
    }
    return config;
}
//# sourceMappingURL=firebase-services.js.map