import chalk from 'chalk';
import inquirer from 'inquirer';
import { checkVibeKitProject } from '../utils/project-validator';
import { checkFirebaseAuth, loginToFirebase } from '../utils/firebase-auth';
import { selectFirebaseProject } from '../utils/firebase-projects';
import { configureAllServices } from '../utils/firebase-services';
import { generateCompleteFirebaseConfig } from '../utils/firebase-config-generator';

export async function configure() {
  console.log(chalk.cyan('\n🚀 VibeKit Complete Configuration Wizard\n'));
  console.log(chalk.white('This wizard will guide you through the complete VibeKit setup:'));
  console.log(chalk.gray('  • Firebase authentication'));
  console.log(chalk.gray('  • Project selection/creation'));
  console.log(chalk.gray('  • Service configuration'));
  console.log(chalk.gray('  • Firebase options generation'));
  console.log(chalk.gray('  • Complete app setup\n'));
  
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ready to configure your VibeKit project?',
      default: true
    }
  ]);
  
  if (!proceed) {
    console.log(chalk.yellow('Configuration cancelled\n'));
    process.exit(0);
  }
  
  try {
    // Step 1: Verify VibeKit project
    console.log(chalk.cyan('\n📋 Step 1: Project Validation\n'));
    const isVibeKitProject = await checkVibeKitProject();
    if (!isVibeKitProject) {
      console.log(chalk.red('❌ Not in a VibeKit project directory'));
      console.log(chalk.gray('Please run this command from your VibeKit project root\n'));
      process.exit(1);
    }
    console.log(chalk.green('✅ VibeKit project detected'));
    
    // Step 2: Firebase Authentication
    console.log(chalk.cyan('\n🔐 Step 2: Firebase Authentication\n'));
    let currentUser = await checkFirebaseAuth();
    if (!currentUser) {
      console.log(chalk.yellow('⚠️  Not authenticated with Firebase'));
      currentUser = await loginToFirebase();
    }
    console.log(chalk.green(`✅ Authenticated as: ${currentUser.email}`));
    
    // Step 3: Project Selection
    console.log(chalk.cyan('\n🎯 Step 3: Firebase Project Selection\n'));
    const selectedProject = await selectFirebaseProject();
    console.log(chalk.green(`✅ Selected: ${selectedProject.displayName}`));
    
    // Step 4: Service Configuration
    console.log(chalk.cyan('\n⚙️  Step 4: Firebase Services Configuration\n'));
    const serviceConfig = await configureAllServices(selectedProject.projectId);
    console.log(chalk.green('✅ Services configured'));
    
    // Step 5: Generate Firebase Configuration
    console.log(chalk.cyan('\n🔧 Step 5: Generate Firebase Configuration\n'));
    await generateCompleteFirebaseConfig(selectedProject.projectId);
    console.log(chalk.green('✅ Configuration files generated'));
    
    // Step 6: Final Success
    console.log(chalk.green('\n🎉 VIBEKIT CONFIGURATION COMPLETE! 🎉\n'));
    
    console.log(chalk.white('📋 Configuration Summary:'));
    console.log(chalk.cyan('  • Project: '), chalk.white(selectedProject.displayName));
    console.log(chalk.cyan('  • Project ID: '), chalk.white(selectedProject.projectId));
    console.log(chalk.cyan('  • User: '), chalk.white(currentUser.email));
    
    console.log(chalk.white('\n🔥 Enabled Services:'));
    if (serviceConfig.auth.enabled) console.log(chalk.green('  ✅ Authentication'));
    if (serviceConfig.firestore.enabled) console.log(chalk.green('  ✅ Cloud Firestore'));
    if (serviceConfig.storage.enabled) console.log(chalk.green('  ✅ Cloud Storage'));
    if (serviceConfig.hosting.enabled) console.log(chalk.green('  ✅ Firebase Hosting'));
    if (serviceConfig.functions.enabled) console.log(chalk.green('  ✅ Cloud Functions'));
    if (serviceConfig.analytics.enabled) console.log(chalk.green('  ✅ Analytics'));
    if (serviceConfig.messaging.enabled) console.log(chalk.green('  ✅ Cloud Messaging'));
    
    console.log(chalk.white('\n🚀 Ready to Launch!'));
    console.log(chalk.cyan('  flutter run -d chrome'), chalk.gray('  # Run on web browser'));
    console.log(chalk.cyan('  flutter run -d ios    '), chalk.gray('  # Run on iOS simulator'));
    console.log(chalk.cyan('  flutter run           '), chalk.gray('  # Run on connected device'));
    
    console.log(chalk.white('\n🔗 Quick Links:'));
    console.log(chalk.blue('  • Firebase Console: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
    console.log(chalk.blue('  • VibeKit GitHub: '), chalk.gray('https://github.com/nickdnj/vibekit'));
    console.log(chalk.blue('  • Documentation: '), chalk.gray('https://firebase.flutter.dev/docs/overview'));
    
    console.log(chalk.green('\n✨ Your VibeKit app is ready to VIBE! Go build something AMAZING! 🚀🔥\n'));
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Configuration failed: ${error}\n`));
    
    console.log(chalk.yellow('🔧 You can run individual steps:'));
    console.log(chalk.cyan('  vibekit firebase-setup     '), chalk.gray('# Setup Firebase CLI & auth'));
    console.log(chalk.cyan('  vibekit project-select     '), chalk.gray('# Select Firebase project'));
    console.log(chalk.cyan('  vibekit service-config     '), chalk.gray('# Configure Firebase services'));
    console.log(chalk.cyan('  vibekit generate-config    '), chalk.gray('# Generate firebase_options.dart\n'));
    
    process.exit(1);
  }
}

