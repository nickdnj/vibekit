import chalk from 'chalk';
import { checkFirebaseAuth } from '../utils/firebase-auth';
import { selectFirebaseProject } from '../utils/firebase-projects';
import { configureAllServices } from '../utils/firebase-services';

export async function serviceConfig() {
  console.log(chalk.cyan('\n⚙️  Firebase Service Configuration\n'));
  
  // Step 1: Ensure user is authenticated
  const currentUser = await checkFirebaseAuth();
  if (!currentUser) {
    console.log(chalk.red('❌ Not authenticated with Firebase'));
    console.log(chalk.gray('Please run: vibekit firebase-setup\n'));
    process.exit(1);
  }
  
  console.log(chalk.green(`✅ Authenticated as: ${currentUser.email}\n`));
  
  try {
    // Step 2: Select Firebase project (or use current project)
    console.log(chalk.cyan('📋 Project Selection\n'));
    const selectedProject = await selectFirebaseProject();
    
    console.log(chalk.green(`\n🎯 Configuring services for: ${selectedProject.displayName}\n`));
    
    // Step 3: Configure Firebase services
    const serviceConfig = await configureAllServices(selectedProject.projectId);
    
    // Step 4: Success summary
    console.log(chalk.green('\n🎉 Firebase Configuration Complete!\n'));
    
    console.log(chalk.white('📋 Service Configuration Summary:'));
    console.log(chalk.cyan('  • Project: '), chalk.white(selectedProject.displayName));
    console.log(chalk.cyan('  • Project ID: '), chalk.white(selectedProject.projectId));
    
    console.log(chalk.white('\n🔥 Enabled Services:'));
    if (serviceConfig.auth.enabled) {
      console.log(chalk.green('  ✅ Authentication'), chalk.gray('- User sign-in/sign-up'));
    }
    if (serviceConfig.firestore.enabled) {
      console.log(chalk.green('  ✅ Cloud Firestore'), chalk.gray('- NoSQL database'));
    }
    if (serviceConfig.storage.enabled) {
      console.log(chalk.green('  ✅ Cloud Storage'), chalk.gray('- File storage'));
    }
    if (serviceConfig.hosting.enabled) {
      console.log(chalk.green('  ✅ Firebase Hosting'), chalk.gray('- Web app hosting'));
    }
    if (serviceConfig.functions.enabled) {
      console.log(chalk.green('  ✅ Cloud Functions'), chalk.gray('- Serverless backend'));
    }
    if (serviceConfig.analytics.enabled) {
      console.log(chalk.green('  ✅ Analytics'), chalk.gray('- Usage tracking'));
    }
    if (serviceConfig.messaging.enabled) {
      console.log(chalk.green('  ✅ Cloud Messaging'), chalk.gray('- Push notifications'));
    }
    
    console.log(chalk.white('\n🚀 Next Steps:'));
    console.log(chalk.cyan('  1. Generate firebase_options.dart'), chalk.gray('- Run: vibekit generate-config'));
    console.log(chalk.cyan('  2. Test your app'), chalk.gray('- Run: flutter run'));
    console.log(chalk.cyan('  3. Deploy to hosting'), chalk.gray('- Run: firebase deploy'));
    
    console.log(chalk.white('\n📚 Resources:'));
    console.log(chalk.blue('  • Firebase Console: '), chalk.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
    console.log(chalk.blue('  • VibeKit Docs: '), chalk.gray('https://github.com/nickdnj/vibekit'));
    
    console.log(chalk.green('\n✨ Your VibeKit app is ready to vibe! 🎉\n'));
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Service configuration failed: ${error}\n`));
    process.exit(1);
  }
}
