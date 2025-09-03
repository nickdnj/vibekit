import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { EnhancedVibeKitAIAgents, AppContext } from '../utils/enhanced-ai-agents';
import { checkVibeKitProject } from '../utils/project-validator';

export async function ideate() {
  console.log(chalk.cyan('\n🤖 VibeKit AI Ideation Mode\n'));
  console.log(chalk.white('Transform your app idea into comprehensive documentation using AI agents.\n'));

  try {
    // Check if we're in a VibeKit project
    const isVibeKitProject = await checkVibeKitProject();
    if (!isVibeKitProject) {
      console.log(chalk.red('❌ Not in a VibeKit project directory'));
      console.log(chalk.gray('Please run this command from your VibeKit project root\n'));
      console.log(chalk.blue('💡 To create a new project, run: vibekit configure\n'));
      process.exit(1);
    }

    // Try to detect project context
    const appContext = await detectProjectContext();
    
    if (!appContext) {
      console.log(chalk.yellow('⚠️  Could not detect project configuration'));
      console.log(chalk.gray('This command works best after running "vibekit configure"\n'));
      
      const { continueAnyway } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueAnyway',
          message: 'Continue with manual configuration?',
          default: false,
        },
      ]);
      
      if (!continueAnyway) {
        console.log(chalk.blue('💡 Run "vibekit configure" first to set up your project\n'));
        process.exit(0);
      }
      
      // Manual configuration
      const manualContext = await collectManualContext();
      const aiAgents = new EnhancedVibeKitAIAgents(manualContext);
      await aiAgents.runPRDAgent();
      return;
    }

    // Use detected context
    console.log(chalk.green('✅ Project context detected'));
    console.log(chalk.cyan(`   App: ${appContext.appName}`));
    console.log(chalk.cyan(`   Platforms: ${appContext.platforms.join(', ')}`));
    console.log(chalk.cyan(`   Firebase: ${appContext.firebaseProjectId}\n`));

    const aiAgents = new EnhancedVibeKitAIAgents(appContext);
    await aiAgents.runPRDAgent();

  } catch (error) {
    console.log(chalk.red(`\n❌ Ideation failed: ${error}\n`));
    process.exit(1);
  }
}

async function detectProjectContext(): Promise<AppContext | null> {
  try {
    const pubspecPath = path.join(process.cwd(), 'pubspec.yaml');
    const readmePath = path.join(process.cwd(), 'README.md');
    
    if (!await fs.pathExists(pubspecPath)) {
      return null;
    }

    // Read pubspec.yaml to get app name
    const pubspecContent = await fs.readFile(pubspecPath, 'utf-8');
    const nameMatch = pubspecContent.match(/^name:\s*(.+)$/m);
    const descriptionMatch = pubspecContent.match(/^description:\s*(.+)$/m);
    
    if (!nameMatch) {
      return null;
    }

    // Detect platforms based on directory structure
    const platforms: string[] = [];
    if (await fs.pathExists(path.join(process.cwd(), 'web'))) platforms.push('Web');
    if (await fs.pathExists(path.join(process.cwd(), 'ios'))) platforms.push('iOS');
    if (await fs.pathExists(path.join(process.cwd(), 'android'))) platforms.push('Android');

    // Try to detect Firebase project ID from firebase_options.dart
    let firebaseProjectId = 'unknown-project';
    const firebaseOptionsPath = path.join(process.cwd(), 'lib', 'firebase_options.dart');
    if (await fs.pathExists(firebaseOptionsPath)) {
      const firebaseContent = await fs.readFile(firebaseOptionsPath, 'utf-8');
      const projectIdMatch = firebaseContent.match(/projectId:\s*['"]([^'"]+)['"]/);
      if (projectIdMatch) {
        firebaseProjectId = projectIdMatch[1];
      }
    }

    // Get repository URL from git remote
    let repositoryPath = process.cwd();
    try {
      const { execSync } = require('child_process');
      const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
      repositoryPath = remoteUrl;
    } catch {
      // Fall back to current directory
    }

    return {
      appName: nameMatch[1].trim(),
      appDescription: descriptionMatch ? descriptionMatch[1].trim() : 'A Flutter app built with VibeKit',
      platforms,
      firebaseProjectId,
      repositoryPath,
    };

  } catch (error) {
    return null;
  }
}

async function collectManualContext(): Promise<AppContext> {
  console.log(chalk.blue('\n📝 Manual Project Configuration\n'));
  
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'appName',
      message: 'What is your app name?',
      validate: (input) => input.trim() ? true : 'Please enter an app name',
    },
    {
      type: 'input',
      name: 'appDescription',
      message: 'Brief description of your app:',
      default: (answers: any) => `${answers.appName} - A Flutter app built with VibeKit`,
    },
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Which platforms are you targeting?',
      choices: [
        { name: 'Web', value: 'Web' },
        { name: 'iOS', value: 'iOS' },
        { name: 'Android', value: 'Android' },
      ],
      default: ['Web'],
      validate: (answer) => answer.length > 0 ? true : 'Please select at least one platform',
    },
    {
      type: 'input',
      name: 'firebaseProjectId',
      message: 'Firebase project ID (optional):',
      default: 'my-firebase-project',
    },
  ]);

  return {
    appName: answers.appName,
    appDescription: answers.appDescription,
    platforms: answers.platforms,
    firebaseProjectId: answers.firebaseProjectId,
    repositoryPath: process.cwd(),
  };
}
