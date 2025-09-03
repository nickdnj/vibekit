"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configure = configure;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const project_validator_1 = require("../utils/project-validator");
const firebase_auth_1 = require("../utils/firebase-auth");
const firebase_projects_1 = require("../utils/firebase-projects");
const firebase_services_1 = require("../utils/firebase-services");
const firebase_config_generator_1 = require("../utils/firebase-config-generator");
async function configure() {
    console.log(chalk_1.default.cyan('\n🚀 VibeKit Complete Configuration Wizard\n'));
    console.log(chalk_1.default.white('This wizard will guide you through the complete VibeKit setup:'));
    console.log(chalk_1.default.gray('  • Firebase authentication'));
    console.log(chalk_1.default.gray('  • Project selection/creation'));
    console.log(chalk_1.default.gray('  • Service configuration'));
    console.log(chalk_1.default.gray('  • Firebase options generation'));
    console.log(chalk_1.default.gray('  • Complete app setup\n'));
    const { proceed } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'proceed',
            message: 'Ready to configure your VibeKit project?',
            default: true
        }
    ]);
    if (!proceed) {
        console.log(chalk_1.default.yellow('Configuration cancelled\n'));
        process.exit(0);
    }
    try {
        // Step 1: Verify VibeKit project
        console.log(chalk_1.default.cyan('\n📋 Step 1: Project Validation\n'));
        const isVibeKitProject = await (0, project_validator_1.checkVibeKitProject)();
        if (!isVibeKitProject) {
            console.log(chalk_1.default.red('❌ Not in a VibeKit project directory'));
            console.log(chalk_1.default.gray('Please run this command from your VibeKit project root\n'));
            process.exit(1);
        }
        console.log(chalk_1.default.green('✅ VibeKit project detected'));
        // Step 2: Firebase Authentication
        console.log(chalk_1.default.cyan('\n🔐 Step 2: Firebase Authentication\n'));
        let currentUser = await (0, firebase_auth_1.checkFirebaseAuth)();
        if (!currentUser) {
            console.log(chalk_1.default.yellow('⚠️  Not authenticated with Firebase'));
            currentUser = await (0, firebase_auth_1.loginToFirebase)();
        }
        console.log(chalk_1.default.green(`✅ Authenticated as: ${currentUser.email}`));
        // Step 3: Project Selection
        console.log(chalk_1.default.cyan('\n🎯 Step 3: Firebase Project Selection\n'));
        const selectedProject = await (0, firebase_projects_1.selectFirebaseProject)();
        console.log(chalk_1.default.green(`✅ Selected: ${selectedProject.displayName}`));
        // Step 4: Service Configuration
        console.log(chalk_1.default.cyan('\n⚙️  Step 4: Firebase Services Configuration\n'));
        const serviceConfig = await (0, firebase_services_1.configureAllServices)(selectedProject.projectId);
        console.log(chalk_1.default.green('✅ Services configured'));
        // Step 5: Generate Firebase Configuration
        console.log(chalk_1.default.cyan('\n🔧 Step 5: Generate Firebase Configuration\n'));
        await (0, firebase_config_generator_1.generateCompleteFirebaseConfig)(selectedProject.projectId);
        console.log(chalk_1.default.green('✅ Configuration files generated'));
        // Step 6: Final Success
        console.log(chalk_1.default.green('\n🎉 VIBEKIT CONFIGURATION COMPLETE! 🎉\n'));
        console.log(chalk_1.default.white('📋 Configuration Summary:'));
        console.log(chalk_1.default.cyan('  • Project: '), chalk_1.default.white(selectedProject.displayName));
        console.log(chalk_1.default.cyan('  • Project ID: '), chalk_1.default.white(selectedProject.projectId));
        console.log(chalk_1.default.cyan('  • User: '), chalk_1.default.white(currentUser.email));
        console.log(chalk_1.default.white('\n🔥 Enabled Services:'));
        if (serviceConfig.auth.enabled)
            console.log(chalk_1.default.green('  ✅ Authentication'));
        if (serviceConfig.firestore.enabled)
            console.log(chalk_1.default.green('  ✅ Cloud Firestore'));
        if (serviceConfig.storage.enabled)
            console.log(chalk_1.default.green('  ✅ Cloud Storage'));
        if (serviceConfig.hosting.enabled)
            console.log(chalk_1.default.green('  ✅ Firebase Hosting'));
        if (serviceConfig.functions.enabled)
            console.log(chalk_1.default.green('  ✅ Cloud Functions'));
        if (serviceConfig.analytics.enabled)
            console.log(chalk_1.default.green('  ✅ Analytics'));
        if (serviceConfig.messaging.enabled)
            console.log(chalk_1.default.green('  ✅ Cloud Messaging'));
        console.log(chalk_1.default.white('\n🚀 Ready to Launch!'));
        console.log(chalk_1.default.cyan('  flutter run -d chrome'), chalk_1.default.gray('  # Run on web browser'));
        console.log(chalk_1.default.cyan('  flutter run -d ios    '), chalk_1.default.gray('  # Run on iOS simulator'));
        console.log(chalk_1.default.cyan('  flutter run           '), chalk_1.default.gray('  # Run on connected device'));
        console.log(chalk_1.default.white('\n🔗 Quick Links:'));
        console.log(chalk_1.default.blue('  • Firebase Console: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
        console.log(chalk_1.default.blue('  • VibeKit GitHub: '), chalk_1.default.gray('https://github.com/nickdnj/vibekit'));
        console.log(chalk_1.default.blue('  • Documentation: '), chalk_1.default.gray('https://firebase.flutter.dev/docs/overview'));
        console.log(chalk_1.default.green('\n✨ Your VibeKit app is ready to VIBE! Go build something AMAZING! 🚀🔥\n'));
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Configuration failed: ${error}\n`));
        console.log(chalk_1.default.yellow('🔧 You can run individual steps:'));
        console.log(chalk_1.default.cyan('  vibekit firebase-setup     '), chalk_1.default.gray('# Setup Firebase CLI & auth'));
        console.log(chalk_1.default.cyan('  vibekit project-select     '), chalk_1.default.gray('# Select Firebase project'));
        console.log(chalk_1.default.cyan('  vibekit service-config     '), chalk_1.default.gray('# Configure Firebase services'));
        console.log(chalk_1.default.cyan('  vibekit generate-config    '), chalk_1.default.gray('# Generate firebase_options.dart\n'));
        process.exit(1);
    }
}
//# sourceMappingURL=configure.js.map