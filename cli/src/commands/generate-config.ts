import chalk from 'chalk';
import inquirer from 'inquirer';
import { checkFirebaseAuth } from '../utils/firebase-auth';
import { selectFirebaseProject } from '../utils/firebase-projects';
import { generateCompleteFirebaseConfig } from '../utils/firebase-config-generator';
import { checkVibeKitProject } from '../utils/project-validator';

export async function generateConfig() {
  console.log(chalk.cyan('\n🔧 Firebase Configuration Generator\n'));
  
  // Step 1: Verify we're in a VibeKit project
  const isVibeKitProject = await checkVibeKitProject();
  if (!isVibeKitProject) {
    console.log(chalk.red('❌ Not in a VibeKit project directory'));
    console.log(chalk.gray('Please run this command from your VibeKit project root\n'));
    process.exit(1);
  }
  
  console.log(chalk.green('✅ VibeKit project detected\n'));
  
  // Step 2: Ensure user is authenticated
  const currentUser = await checkFirebaseAuth();
  if (!currentUser) {
    console.log(chalk.red('❌ Not authenticated with Firebase'));
    console.log(chalk.gray('Please run: vibekit firebase-setup\n'));
    process.exit(1);
  }
  
  console.log(chalk.green(`✅ Authenticated as: ${currentUser.email}\n`));
  
  try {
    // Step 3: Select Firebase project
    console.log(chalk.cyan('📋 Project Selection\n'));
    const selectedProject = await selectFirebaseProject();
    
    // Step 4: Confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Generate Firebase configuration for '${selectedProject.displayName}' (${selectedProject.projectId})?`,
        default: true
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('Configuration generation cancelled\n'));
      process.exit(0);
    }
    
    console.log(chalk.green(`\n🚀 Generating configuration for: ${selectedProject.displayName}\n`));
    
    // Step 5: Generate Firebase configuration
    await generateCompleteFirebaseConfig(selectedProject.projectId);
    
    // Step 6: Success summary
    console.log(chalk.green('🎉 Firebase Configuration Complete!\n'));
    
    console.log(chalk.white('📋 Configuration Summary:'));
    console.log(chalk.cyan('  • Project: '), chalk.white(selectedProject.displayName));
    console.log(chalk.cyan('  • Project ID: '), chalk.white(selectedProject.projectId));
    console.log(chalk.cyan('  • Config File: '), chalk.white('lib/firebase_options.dart'));
    
    console.log(chalk.white('\n🚀 Ready to Code!'));
    console.log(chalk.cyan('  flutter run -d chrome'), chalk.gray('  # Run on web'));
    console.log(chalk.cyan('  flutter run -d ios    '), chalk.gray('  # Run on iOS simulator'));
    console.log(chalk.cyan('  flutter run           '), chalk.gray('  # Run on connected device'));
    
    console.log(chalk.white('\n🔗 Useful Links:'));
    console.log(chalk.blue('  • Firebase Console: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
    console.log(chalk.blue('  • Authentication: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/authentication`));
    console.log(chalk.blue('  • Firestore: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/firestore`));
    console.log(chalk.blue('  • Storage: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/storage`));
    
    console.log(chalk.green('\n✨ Your VibeKit app is fully configured and ready to VIBE! 🎉🚀\n'));
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Configuration generation failed: ${error}\n`));
    
    console.log(chalk.yellow('🔧 Manual Setup Options:'));
    console.log(chalk.cyan('  1. Use FlutterFire CLI: '), chalk.gray('dart pub global activate flutterfire_cli && flutterfire configure'));
    console.log(chalk.cyan('  2. Manual configuration: '), chalk.gray('Copy config from Firebase Console'));
    console.log(chalk.blue('  3. Documentation: '), chalk.gray('https://firebase.flutter.dev/docs/overview\n'));
    
    process.exit(1);
  }
}
