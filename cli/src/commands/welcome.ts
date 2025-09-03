import chalk from 'chalk';
import { checkVibeKitProject } from '../utils/project-validator';

export async function welcome() {
  console.log(chalk.cyan('\n🎉 Welcome to VibeKit CLI!\n'));
  
  console.log(chalk.white('VibeKit is a Firebase-powered Flutter template that gets you'));
  console.log(chalk.white('from idea to app in minutes, not hours.\n'));
  
  console.log(chalk.yellow('✨ What VibeKit includes:'));
  console.log(chalk.gray('  • Firebase Auth (Email + Google + Apple)'));
  console.log(chalk.gray('  • Firestore Database with security rules'));
  console.log(chalk.gray('  • Cloud Storage with auto file management'));
  console.log(chalk.gray('  • Admin dashboard with role-based access'));
  console.log(chalk.gray('  • Clean architecture with Riverpod state management'));
  console.log(chalk.gray('  • Modern Material 3 UI with dark/light themes'));
  console.log(chalk.gray('  • CI/CD workflows for Web/iOS/Android deployment\n'));
  
  // Check if we're in a VibeKit project
  const isVibeKitProject = await checkVibeKitProject();
  
  if (isVibeKitProject) {
    console.log(chalk.green('✅ You are in a VibeKit project!'));
    console.log(chalk.white('\nNext steps:'));
    console.log(chalk.cyan('  vibekit configure    '), chalk.gray('Configure Firebase for this project'));
    console.log(chalk.cyan('  flutter run -d chrome'), chalk.gray('Run your app in web browser'));
    console.log(chalk.cyan('  flutter run          '), chalk.gray('Run your app on mobile device'));
  } else {
    console.log(chalk.yellow('⚠️  Not in a VibeKit project directory'));
    console.log(chalk.white('\nTo get started:'));
    console.log(chalk.cyan('  git clone https://github.com/nickdnj/vibekit.git'));
    console.log(chalk.cyan('  cd vibekit'));
    console.log(chalk.cyan('  vibekit configure'));
  }
  
  console.log(chalk.white('\n📚 Documentation: '), chalk.blue('https://github.com/nickdnj/vibekit'));
  console.log(chalk.white('🐛 Issues: '), chalk.blue('https://github.com/nickdnj/vibekit/issues'));
  console.log(chalk.white('💬 Discussions: '), chalk.blue('https://github.com/nickdnj/vibekit/discussions\n'));
}

