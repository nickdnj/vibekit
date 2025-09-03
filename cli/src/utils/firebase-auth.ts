import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';

const execAsync = promisify(exec);

export interface FirebaseUser {
  email: string;
  uid: string;
  displayName?: string;
}

/**
 * Check if Firebase CLI is installed
 */
export async function checkFirebaseCLI(): Promise<boolean> {
  try {
    await execAsync('firebase --version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Install Firebase CLI globally
 */
export async function installFirebaseCLI(): Promise<void> {
  const spinner = ora('Installing Firebase CLI...').start();
  
  try {
    await execAsync('npm install -g firebase-tools');
    spinner.succeed('Firebase CLI installed successfully!');
  } catch (error) {
    spinner.fail('Failed to install Firebase CLI');
    throw new Error(`Installation failed: ${error}`);
  }
}

/**
 * Check if user is logged into Firebase
 */
export async function checkFirebaseAuth(): Promise<FirebaseUser | null> {
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
      } catch {
        // Fallback if whoami doesn't work
        return {
          email: 'authenticated-user@firebase.com',
          uid: 'firebase-user',
          displayName: 'Firebase User'
        };
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Login to Firebase using the CLI
 */
export async function loginToFirebase(): Promise<FirebaseUser> {
  console.log(chalk.cyan('\n🔐 Firebase Authentication Required\n'));
  console.log(chalk.white('Opening browser for Firebase login...'));
  console.log(chalk.gray('Please sign in with your Google account that has Firebase access.\n'));
  
  const spinner = ora('Waiting for Firebase authentication...').start();
  
  try {
    // Use standard login (will open browser automatically)
    await execAsync('firebase login --reauth');
    spinner.succeed('Successfully authenticated with Firebase!');
    
    // Get user info after login
    const user = await checkFirebaseAuth();
    if (!user) {
      throw new Error('Failed to retrieve user information after login');
    }
    
    console.log(chalk.green(`\n✅ Logged in as: ${user.email}`));
    return user;
    
  } catch (error) {
    spinner.fail('Firebase authentication failed');
    throw new Error(`Login failed: ${error}`);
  }
}

/**
 * Logout from Firebase
 */
export async function logoutFromFirebase(): Promise<void> {
  try {
    await execAsync('firebase logout');
    console.log(chalk.yellow('Logged out from Firebase'));
  } catch (error) {
    throw new Error(`Logout failed: ${error}`);
  }
}

/**
 * Get Firebase CLI version
 */
export async function getFirebaseCLIVersion(): Promise<string> {
  try {
    const { stdout } = await execAsync('firebase --version');
    return stdout.trim();
  } catch (error) {
    throw new Error('Failed to get Firebase CLI version');
  }
}
