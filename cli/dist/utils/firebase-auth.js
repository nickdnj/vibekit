"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFirebaseCLI = checkFirebaseCLI;
exports.installFirebaseCLI = installFirebaseCLI;
exports.checkFirebaseAuth = checkFirebaseAuth;
exports.loginToFirebase = loginToFirebase;
exports.logoutFromFirebase = logoutFromFirebase;
exports.getFirebaseCLIVersion = getFirebaseCLIVersion;
const child_process_1 = require("child_process");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Check if Firebase CLI is installed
 */
async function checkFirebaseCLI() {
    try {
        await execAsync('firebase --version');
        return true;
    }
    catch (error) {
        return false;
    }
}
/**
 * Install Firebase CLI globally
 */
async function installFirebaseCLI() {
    const spinner = (0, ora_1.default)('Installing Firebase CLI...').start();
    try {
        await execAsync('npm install -g firebase-tools');
        spinner.succeed('Firebase CLI installed successfully!');
    }
    catch (error) {
        spinner.fail('Failed to install Firebase CLI');
        throw new Error(`Installation failed: ${error}`);
    }
}
/**
 * Check if user is logged into Firebase
 */
async function checkFirebaseAuth() {
    try {
        // Check if user is logged in by trying to list projects
        const { stdout } = await execAsync('firebase projects:list --json');
        const response = JSON.parse(stdout);
        const projects = response.result || response;
        // If we can list projects, we're authenticated
        if (Array.isArray(projects)) {
            // Get current user info from Firebase CLI
            try {
                const { stdout: whoAmI } = await execAsync('firebase auth:whoami 2>/dev/null || firebase login:ci --status');
                const email = whoAmI.trim();
                return {
                    email: email || 'authenticated-user@firebase.com',
                    uid: 'firebase-user',
                    displayName: email || 'Firebase User'
                };
            }
            catch {
                // Fallback if whoami doesn't work
                return {
                    email: 'authenticated-user@firebase.com',
                    uid: 'firebase-user',
                    displayName: 'Firebase User'
                };
            }
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
/**
 * Login to Firebase using the CLI
 */
async function loginToFirebase() {
    console.log(chalk_1.default.cyan('\n🔐 Firebase Authentication Required\n'));
    console.log(chalk_1.default.white('Opening browser for Firebase login...'));
    console.log(chalk_1.default.gray('Please sign in with your Google account that has Firebase access.\n'));
    const spinner = (0, ora_1.default)('Waiting for Firebase authentication...').start();
    try {
        // Use standard login (will open browser automatically)
        await execAsync('firebase login --reauth');
        spinner.succeed('Successfully authenticated with Firebase!');
        // Get user info after login
        const user = await checkFirebaseAuth();
        if (!user) {
            throw new Error('Failed to retrieve user information after login');
        }
        console.log(chalk_1.default.green(`\n✅ Logged in as: ${user.email}`));
        return user;
    }
    catch (error) {
        spinner.fail('Firebase authentication failed');
        throw new Error(`Login failed: ${error}`);
    }
}
/**
 * Logout from Firebase
 */
async function logoutFromFirebase() {
    try {
        await execAsync('firebase logout');
        console.log(chalk_1.default.yellow('Logged out from Firebase'));
    }
    catch (error) {
        throw new Error(`Logout failed: ${error}`);
    }
}
/**
 * Get Firebase CLI version
 */
async function getFirebaseCLIVersion() {
    try {
        const { stdout } = await execAsync('firebase --version');
        return stdout.trim();
    }
    catch (error) {
        throw new Error('Failed to get Firebase CLI version');
    }
}
//# sourceMappingURL=firebase-auth.js.map