import chalk from 'chalk';
import { checkFirebaseAuth } from '../utils/firebase-auth';
import { selectFirebaseProject, validateProjectAccess } from '../utils/firebase-projects';

export async function projectSelect() {
  console.log(chalk.cyan('\n🎯 Firebase Project Selection\n'));
  
  // Step 1: Ensure user is authenticated
  const currentUser = await checkFirebaseAuth();
  if (!currentUser) {
    console.log(chalk.red('❌ Not authenticated with Firebase'));
    console.log(chalk.gray('Please run: vibekit firebase-setup\n'));
    process.exit(1);
  }
  
  console.log(chalk.green(`✅ Authenticated as: ${currentUser.email}\n`));
  
  try {
    // Step 2: Select Firebase project
    const selectedProject = await selectFirebaseProject();
    
    // Step 3: Validate access to the selected project
    console.log(chalk.cyan('\n🔍 Validating project access...\n'));
    const hasAccess = await validateProjectAccess(selectedProject.projectId);
    
    if (!hasAccess) {
      console.log(chalk.red(`❌ Cannot access project '${selectedProject.projectId}'`));
      console.log(chalk.gray('Please check your permissions and try again.\n'));
      process.exit(1);
    }
    
    // Step 4: Success summary
    console.log(chalk.green('\n🎉 Project Selection Complete!\n'));
    console.log(chalk.white('Selected project details:'));
    console.log(chalk.cyan('  • Project ID: '), chalk.white(selectedProject.projectId));
    console.log(chalk.cyan('  • Display Name: '), chalk.white(selectedProject.displayName));
    console.log(chalk.cyan('  • Project Number: '), chalk.white(selectedProject.projectNumber));
    console.log(chalk.cyan('  • State: '), chalk.green(selectedProject.state));
    
    console.log(chalk.white('\nNext steps:'));
    console.log(chalk.cyan('  • Project is ready for VibeKit configuration'));
    console.log(chalk.cyan('  • Firebase services can now be enabled'));
    console.log(chalk.cyan('  • Ready to generate firebase_options.dart\n'));
    
    // Success - return void for CLI compatibility
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Project selection failed: ${error}\n`));
    process.exit(1);
  }
}
