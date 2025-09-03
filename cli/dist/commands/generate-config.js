"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateConfig = generateConfig;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const firebase_auth_1 = require("../utils/firebase-auth");
const firebase_projects_1 = require("../utils/firebase-projects");
const firebase_config_generator_1 = require("../utils/firebase-config-generator");
const project_validator_1 = require("../utils/project-validator");
async function generateConfig() {
    console.log(chalk_1.default.cyan('\n🔧 Firebase Configuration Generator\n'));
    // Step 1: Verify we're in a VibeKit project
    const isVibeKitProject = await (0, project_validator_1.checkVibeKitProject)();
    if (!isVibeKitProject) {
        console.log(chalk_1.default.red('❌ Not in a VibeKit project directory'));
        console.log(chalk_1.default.gray('Please run this command from your VibeKit project root\n'));
        process.exit(1);
    }
    console.log(chalk_1.default.green('✅ VibeKit project detected\n'));
    // Step 2: Ensure user is authenticated
    const currentUser = await (0, firebase_auth_1.checkFirebaseAuth)();
    if (!currentUser) {
        console.log(chalk_1.default.red('❌ Not authenticated with Firebase'));
        console.log(chalk_1.default.gray('Please run: vibekit firebase-setup\n'));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`✅ Authenticated as: ${currentUser.email}\n`));
    try {
        // Step 3: Select Firebase project
        console.log(chalk_1.default.cyan('📋 Project Selection\n'));
        const selectedProject = await (0, firebase_projects_1.selectFirebaseProject)();
        // Step 4: Confirmation
        const { confirm } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: `Generate Firebase configuration for '${selectedProject.displayName}' (${selectedProject.projectId})?`,
                default: true
            }
        ]);
        if (!confirm) {
            console.log(chalk_1.default.yellow('Configuration generation cancelled\n'));
            process.exit(0);
        }
        console.log(chalk_1.default.green(`\n🚀 Generating configuration for: ${selectedProject.displayName}\n`));
        // Step 5: Generate Firebase configuration
        await (0, firebase_config_generator_1.generateCompleteFirebaseConfig)(selectedProject.projectId);
        // Step 6: Success summary
        console.log(chalk_1.default.green('🎉 Firebase Configuration Complete!\n'));
        console.log(chalk_1.default.white('📋 Configuration Summary:'));
        console.log(chalk_1.default.cyan('  • Project: '), chalk_1.default.white(selectedProject.displayName));
        console.log(chalk_1.default.cyan('  • Project ID: '), chalk_1.default.white(selectedProject.projectId));
        console.log(chalk_1.default.cyan('  • Config File: '), chalk_1.default.white('lib/firebase_options.dart'));
        console.log(chalk_1.default.white('\n🚀 Ready to Code!'));
        console.log(chalk_1.default.cyan('  flutter run -d chrome'), chalk_1.default.gray('  # Run on web'));
        console.log(chalk_1.default.cyan('  flutter run -d ios    '), chalk_1.default.gray('  # Run on iOS simulator'));
        console.log(chalk_1.default.cyan('  flutter run           '), chalk_1.default.gray('  # Run on connected device'));
        console.log(chalk_1.default.white('\n🔗 Useful Links:'));
        console.log(chalk_1.default.blue('  • Firebase Console: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
        console.log(chalk_1.default.blue('  • Authentication: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/authentication`));
        console.log(chalk_1.default.blue('  • Firestore: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/firestore`));
        console.log(chalk_1.default.blue('  • Storage: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}/storage`));
        console.log(chalk_1.default.green('\n✨ Your VibeKit app is fully configured and ready to VIBE! 🎉🚀\n'));
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Configuration generation failed: ${error}\n`));
        console.log(chalk_1.default.yellow('🔧 Manual Setup Options:'));
        console.log(chalk_1.default.cyan('  1. Use FlutterFire CLI: '), chalk_1.default.gray('dart pub global activate flutterfire_cli && flutterfire configure'));
        console.log(chalk_1.default.cyan('  2. Manual configuration: '), chalk_1.default.gray('Copy config from Firebase Console'));
        console.log(chalk_1.default.blue('  3. Documentation: '), chalk_1.default.gray('https://firebase.flutter.dev/docs/overview\n'));
        process.exit(1);
    }
}
//# sourceMappingURL=generate-config.js.map