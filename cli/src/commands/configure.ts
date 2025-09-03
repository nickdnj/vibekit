import chalk from 'chalk';
import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { checkVibeKitProject } from '../utils/project-validator';
import { checkFirebaseAuth, loginToFirebase } from '../utils/firebase-auth';
import { selectFirebaseProject } from '../utils/firebase-projects';
import { configureAllServices } from '../utils/firebase-services';
import { generateCompleteFirebaseConfig } from '../utils/firebase-config-generator';
import { authenticateWithGitHub } from '../utils/github-auth';
import { createGitHubRepository, sanitizeRepositoryName, generateRepositoryDescription } from '../utils/github-repository';
import { selectPlatforms, getPlatformList } from '../utils/platform-selector';
import { TemplateEngine, createTemplateDirectory, cleanupTemplateDirectory } from '../utils/template-engine';
import { GitOperations, getGitUserConfig } from '../utils/git-operations';
import { EnhancedVibeKitAIAgents, AppContext } from '../utils/enhanced-ai-agents';

export async function configure() {
  console.log(chalk.cyan('\n🚀 VibeKit Repository Generator\n'));
  console.log(chalk.white('This wizard will create a brand-new repository for your app:'));
  console.log(chalk.gray('  • GitHub authentication & repository creation'));
  console.log(chalk.gray('  • Platform selection (Web/iOS/Android)'));
  console.log(chalk.gray('  • Firebase setup & integration'));
  console.log(chalk.gray('  • Project documentation generation'));
  console.log(chalk.gray('  • CI/CD workflow configuration'));
  console.log(chalk.gray('  • Complete repository initialization & push\n'));
  
  const { proceed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ready to create your new app repository?',
      default: true
    }
  ]);
  
  if (!proceed) {
    console.log(chalk.yellow('Repository generation cancelled\n'));
    process.exit(0);
  }
  
  let tempDir: string | null = null;
  
  try {
    // Step 1: Verify VibeKit Template
    console.log(chalk.cyan('\n📋 Step 1: Template Validation\n'));
    const isVibeKitProject = await checkVibeKitProject();
    if (!isVibeKitProject) {
      console.log(chalk.red('❌ Not in a VibeKit template directory'));
      console.log(chalk.gray('Please run this command from your VibeKit template root\n'));
      process.exit(1);
    }
    console.log(chalk.green('✅ VibeKit template detected'));
    
    // Step 2: App Identity Collection
    console.log(chalk.cyan('\n🏷️  Step 2: App Identity\n'));
    const appIdentity = await inquirer.prompt([
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
        default: (answers: any) => `A Flutter app built with VibeKit`,
      },
    ]);
    
    // Step 3: Platform Selection
    console.log(chalk.cyan('\n📱 Step 3: Platform Selection\n'));
    const { platforms, details: platformDetails } = await selectPlatforms();
    const platformList = getPlatformList(platforms);
    
    // Step 4: GitHub Authentication & Repository Setup
    console.log(chalk.cyan('\n🐙 Step 4: GitHub Repository Creation\n'));
    const gitAuth = await authenticateWithGitHub();
    
    const repoName = sanitizeRepositoryName(appIdentity.appName);
    const repoDescription = generateRepositoryDescription(appIdentity.appName, platformList);
    
    const repoConfig = await inquirer.prompt([
      {
        type: 'input',
        name: 'repositoryName',
        message: 'Repository name:',
        default: repoName,
        validate: (input) => input.trim() ? true : 'Please enter a repository name',
      },
      {
        type: 'input',
        name: 'repositoryDescription',
        message: 'Repository description:',
        default: repoDescription,
      },
      {
        type: 'confirm',
        name: 'private',
        message: 'Make repository private?',
        default: false,
      },
    ]);
    
    const repository = await createGitHubRepository(gitAuth.octokit, {
      name: repoConfig.repositoryName,
      description: repoConfig.repositoryDescription,
      private: repoConfig.private,
      owner: gitAuth.user.login,
    });
    
    // Step 5: Firebase Setup
    console.log(chalk.cyan('\n🔥 Step 5: Firebase Integration\n'));
    let currentUser = await checkFirebaseAuth();
    if (!currentUser) {
      console.log(chalk.yellow('⚠️  Not authenticated with Firebase'));
      currentUser = await loginToFirebase();
    }
    console.log(chalk.green(`✅ Authenticated as: ${currentUser.email}`));
    
    const selectedProject = await selectFirebaseProject();
    console.log(chalk.green(`✅ Selected: ${selectedProject.displayName}`));
    
    const serviceConfig = await configureAllServices(selectedProject.projectId);
    console.log(chalk.green('✅ Services configured'));
    
    // Step 6: Repository Generation
    console.log(chalk.cyan('\n🏗️  Step 6: Generating Repository Files\n'));
    tempDir = await createTemplateDirectory();
    
    // For now, let's create a simple version without full template engine
    // Copy the current project structure as the base
    console.log(chalk.yellow('📁 Creating project structure...'));
    await copyProjectStructure(tempDir, {
      appName: appIdentity.appName,
      platforms,
      platformDetails,
      firebaseProjectId: selectedProject.projectId,
      repository,
      author: {
        name: gitAuth.user.name || gitAuth.user.login,
        email: gitAuth.user.email,
        github: gitAuth.user.login,
      },
    });
    
    // Step 7: Git Initialization & Push
    console.log(chalk.cyan('\n📤 Step 7: Repository Initialization\n'));
    
    const gitConfig = await getGitUserConfig() || {
      name: gitAuth.user.name || gitAuth.user.login,
      email: gitAuth.user.email || `${gitAuth.user.login}@users.noreply.github.com`,
    };
    
    const gitOps = new GitOperations(tempDir);
    await gitOps.createGitignore(platforms);
    await gitOps.initializeRepository(gitConfig);
    await gitOps.addRemoteOrigin(repository.cloneUrl);
    await gitOps.addAllFiles();
    await gitOps.commitFiles(`feat: Initial commit - ${appIdentity.appName}

Generated with VibeKit for platforms: ${platformList.join(', ')}

Features:
- Firebase integration (${selectedProject.projectId})
- Authentication and admin dashboard
- Platform-specific configurations
- CI/CD workflows ready for deployment

Ready to vibe! 🚀`);
    
    await gitOps.pushToRemote('main');
    
    // Cleanup temporary files
    if (tempDir) {
      await cleanupTemplateDirectory(tempDir);
    }
    
    // Step 8: Seamless Transition to AI Ideation Mode
    const appContext: AppContext = {
      appName: appIdentity.appName,
      appDescription: appIdentity.appDescription,
      platforms: platformList,
      firebaseProjectId: selectedProject.projectId,
      repositoryPath: repository.url,
    };
    
    const aiAgents = new EnhancedVibeKitAIAgents(appContext);
    await aiAgents.launchIdeationMode();
    
  } catch (error) {
    console.log(chalk.red(`\n❌ Repository generation failed: ${error}\n`));
    
    // Cleanup on error
    if (tempDir) {
      await cleanupTemplateDirectory(tempDir);
    }
    
    console.log(chalk.yellow('🔧 You can try again or run individual steps for debugging'));
    process.exit(1);
  }
}

async function copyProjectStructure(
  outputDir: string,
  config: {
    appName: string;
    platforms: any;
    platformDetails: any;
    firebaseProjectId: string;
    repository: any;
    author: any;
  }
): Promise<void> {
  // Copy the current VibeKit project structure to the temp directory
  const sourceDir = process.cwd();
  
  // Files and directories to copy
  const itemsToCopy = [
    'lib/',
    'assets/',
    'firebase/',
    'test/',
    'pubspec.yaml',
    'analysis_options.yaml',
    'README.md',
  ];
  
  // Platform-specific directories
  if (config.platforms.web) {
    itemsToCopy.push('web/');
  }
  if (config.platforms.ios) {
    itemsToCopy.push('ios/');
  }
  if (config.platforms.android) {
    itemsToCopy.push('android/');
  }
  
  // Copy files
  for (const item of itemsToCopy) {
    const sourcePath = path.join(sourceDir, item);
    const destPath = path.join(outputDir, item);
    
    if (await fs.pathExists(sourcePath)) {
      await fs.copy(sourcePath, destPath);
    }
  }
  
  // Create basic documentation
  await createBasicDocs(outputDir, config);
  
  // Update pubspec.yaml with new app name
  await updatePubspecYaml(outputDir, config.appName);
  
  // Update README for the new app
  await createAppReadme(outputDir, config);
}

async function createBasicDocs(outputDir: string, config: any): Promise<void> {
  const docsDir = path.join(outputDir, 'docs');
  await fs.ensureDir(docsDir);
  
  // Create basic PRD
  const prdContent = `# Product Requirements Document (PRD)

**Product**: ${config.appName}
**Platforms**: ${config.platforms.web ? 'Web' : ''} ${config.platforms.ios ? 'iOS' : ''} ${config.platforms.android ? 'Android' : ''}
**Firebase Project**: ${config.firebaseProjectId}

## Overview
${config.appName} is a Flutter application built with VibeKit, providing a solid foundation for rapid development.

## Features
- Firebase Authentication
- Admin Dashboard
- Cross-platform support
- Real-time data with Firestore

## User Stories
- As a user, I can sign in securely
- As an admin, I can manage users and data
- As a developer, I can extend features using Cursor AI

Generated with VibeKit on ${new Date().toLocaleDateString()}
`;
  
  await fs.writeFile(path.join(docsDir, 'PRD.md'), prdContent);
  
  // Create basic README for the docs folder
  const docsReadme = `# Project Documentation

This folder contains the core documentation for ${config.appName}:

- **PRD.md** - Product Requirements Document
- **SAD.md** - Software Architecture Document (coming soon)
- **UXD.md** - User Experience Design Document (coming soon)
- **TEST.md** - Testing Strategy Document (coming soon)

These documents are designed to provide context for Cursor AI and development teams.
`;
  
  await fs.writeFile(path.join(docsDir, 'README.md'), docsReadme);
}

async function updatePubspecYaml(outputDir: string, appName: string): Promise<void> {
  const pubspecPath = path.join(outputDir, 'pubspec.yaml');
  
  if (await fs.pathExists(pubspecPath)) {
    let content = await fs.readFile(pubspecPath, 'utf-8');
    
    // Update the name and description
    const nameKebab = appName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
    content = content.replace(/^name:.*$/m, `name: ${nameKebab}`);
    content = content.replace(/^description:.*$/m, `description: ${appName} - Built with VibeKit`);
    
    await fs.writeFile(pubspecPath, content);
  }
}

async function createAppReadme(outputDir: string, config: any): Promise<void> {
  const readmeContent = `# ${config.appName}

${config.appName} is a Flutter application built with VibeKit.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
flutter pub get

# Run code generation
flutter packages pub run build_runner build

# Run the app
flutter run -d chrome  # Web
flutter run            # Mobile
\`\`\`

## 🏗️ Architecture

This app follows VibeKit's clean architecture pattern:
- **UI Layer**: Flutter widgets and screens
- **State Management**: Riverpod providers
- **Repository Layer**: Data access abstraction
- **Service Layer**: Firebase integrations

## 📱 Platforms

${config.platforms.web ? '- ✅ Web (Firebase Hosting ready)' : ''}
${config.platforms.ios ? '- ✅ iOS (App Store Connect ready)' : ''}
${config.platforms.android ? '- ✅ Android (Google Play ready)' : ''}

## 🔥 Firebase Integration

- **Project**: ${config.firebaseProjectId}
- **Authentication**: Email/Password + Google Sign-In
- **Database**: Cloud Firestore
- **Storage**: Cloud Storage
- **Admin Dashboard**: Built-in user management

## 📚 Documentation

See the \`/docs\` folder for detailed project documentation:
- Product Requirements (PRD.md)
- Software Architecture (SAD.md)  
- User Experience Design (UXD.md)
- Testing Strategy (TEST.md)

## 🛠️ Development

This project uses Cursor AI with VibeKit rules for enhanced development:
- Clean architecture enforcement
- Firebase-first patterns
- Consistent code scaffolding

## 📄 License

This project was generated with VibeKit and follows the MIT License.

---

**Built with ❤️ using [VibeKit](${config.repository.url})**
`;
  
  await fs.writeFile(path.join(outputDir, 'README.md'), readmeContent);
}