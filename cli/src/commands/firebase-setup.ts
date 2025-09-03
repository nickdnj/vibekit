import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { 
  checkFirebaseCLI, 
  installFirebaseCLI, 
  checkFirebaseAuth, 
  loginToFirebase,
  getFirebaseCLIVersion 
} from '../utils/firebase-auth';

export async function firebaseSetup() {
  console.log(chalk.cyan('\n🔥 Firebase Setup\n'));
  
  // Step 1: Check Firebase CLI
  let spinner = ora('Checking Firebase CLI installation...').start();
  
  const hasFirebaseCLI = await checkFirebaseCLI();
  
  if (!hasFirebaseCLI) {
    spinner.fail('Firebase CLI not found');
    console.log(chalk.yellow('\n⚠️  Firebase CLI is required for VibeKit configuration'));
    
    const { installCLI } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installCLI',
        message: 'Would you like to install Firebase CLI now?',
        default: true
      }
    ]);
    
    if (installCLI) {
      await installFirebaseCLI();
    } else {
      console.log(chalk.red('\n❌ Firebase CLI is required. Please install it manually:'));
      console.log(chalk.gray('   npm install -g firebase-tools\n'));
      process.exit(1);
    }
  } else {
    const version = await getFirebaseCLIVersion();
    spinner.succeed(`Firebase CLI found: ${version}`);
  }
  
  // Step 2: Check Firebase Authentication
  spinner = ora('Checking Firebase authentication...').start();
  
  let currentUser = await checkFirebaseAuth();
  
  if (!currentUser) {
    spinner.warn('Not authenticated with Firebase');
    
    const { shouldLogin } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'shouldLogin',
        message: 'Would you like to login to Firebase now?',
        default: true
      }
    ]);
    
    if (shouldLogin) {
      currentUser = await loginToFirebase();
    } else {
      console.log(chalk.red('\n❌ Firebase authentication is required for VibeKit configuration'));
      console.log(chalk.gray('   Run: firebase login\n'));
      process.exit(1);
    }
  } else {
    spinner.succeed(`Authenticated as: ${currentUser.email}`);
  }
  
  // Step 3: Summary
  console.log(chalk.green('\n✅ Firebase Setup Complete!'));
  console.log(chalk.white('\nNext steps:'));
  console.log(chalk.cyan('  • Firebase CLI: '), chalk.green('Ready'));
  console.log(chalk.cyan('  • Authentication: '), chalk.green(`${currentUser.email}`));
  console.log(chalk.cyan('  • Ready for project configuration\n'));
  
  // Return void for CLI action compatibility
}
