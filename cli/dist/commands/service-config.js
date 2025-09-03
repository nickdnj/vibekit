"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceConfig = serviceConfig;
const chalk_1 = __importDefault(require("chalk"));
const firebase_auth_1 = require("../utils/firebase-auth");
const firebase_projects_1 = require("../utils/firebase-projects");
const firebase_services_1 = require("../utils/firebase-services");
async function serviceConfig() {
    console.log(chalk_1.default.cyan('\n⚙️  Firebase Service Configuration\n'));
    // Step 1: Ensure user is authenticated
    const currentUser = await (0, firebase_auth_1.checkFirebaseAuth)();
    if (!currentUser) {
        console.log(chalk_1.default.red('❌ Not authenticated with Firebase'));
        console.log(chalk_1.default.gray('Please run: vibekit firebase-setup\n'));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`✅ Authenticated as: ${currentUser.email}\n`));
    try {
        // Step 2: Select Firebase project (or use current project)
        console.log(chalk_1.default.cyan('📋 Project Selection\n'));
        const selectedProject = await (0, firebase_projects_1.selectFirebaseProject)();
        console.log(chalk_1.default.green(`\n🎯 Configuring services for: ${selectedProject.displayName}\n`));
        // Step 3: Configure Firebase services
        const serviceConfig = await (0, firebase_services_1.configureAllServices)(selectedProject.projectId);
        // Step 4: Success summary
        console.log(chalk_1.default.green('\n🎉 Firebase Configuration Complete!\n'));
        console.log(chalk_1.default.white('📋 Service Configuration Summary:'));
        console.log(chalk_1.default.cyan('  • Project: '), chalk_1.default.white(selectedProject.displayName));
        console.log(chalk_1.default.cyan('  • Project ID: '), chalk_1.default.white(selectedProject.projectId));
        console.log(chalk_1.default.white('\n🔥 Enabled Services:'));
        if (serviceConfig.auth.enabled) {
            console.log(chalk_1.default.green('  ✅ Authentication'), chalk_1.default.gray('- User sign-in/sign-up'));
        }
        if (serviceConfig.firestore.enabled) {
            console.log(chalk_1.default.green('  ✅ Cloud Firestore'), chalk_1.default.gray('- NoSQL database'));
        }
        if (serviceConfig.storage.enabled) {
            console.log(chalk_1.default.green('  ✅ Cloud Storage'), chalk_1.default.gray('- File storage'));
        }
        if (serviceConfig.hosting.enabled) {
            console.log(chalk_1.default.green('  ✅ Firebase Hosting'), chalk_1.default.gray('- Web app hosting'));
        }
        if (serviceConfig.functions.enabled) {
            console.log(chalk_1.default.green('  ✅ Cloud Functions'), chalk_1.default.gray('- Serverless backend'));
        }
        if (serviceConfig.analytics.enabled) {
            console.log(chalk_1.default.green('  ✅ Analytics'), chalk_1.default.gray('- Usage tracking'));
        }
        if (serviceConfig.messaging.enabled) {
            console.log(chalk_1.default.green('  ✅ Cloud Messaging'), chalk_1.default.gray('- Push notifications'));
        }
        console.log(chalk_1.default.white('\n🚀 Next Steps:'));
        console.log(chalk_1.default.cyan('  1. Generate firebase_options.dart'), chalk_1.default.gray('- Run: vibekit generate-config'));
        console.log(chalk_1.default.cyan('  2. Test your app'), chalk_1.default.gray('- Run: flutter run'));
        console.log(chalk_1.default.cyan('  3. Deploy to hosting'), chalk_1.default.gray('- Run: firebase deploy'));
        console.log(chalk_1.default.white('\n📚 Resources:'));
        console.log(chalk_1.default.blue('  • Firebase Console: '), chalk_1.default.gray(`https://console.firebase.google.com/project/${selectedProject.projectId}`));
        console.log(chalk_1.default.blue('  • VibeKit Docs: '), chalk_1.default.gray('https://github.com/nickdnj/vibekit'));
        console.log(chalk_1.default.green('\n✨ Your VibeKit app is ready to vibe! 🎉\n'));
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Service configuration failed: ${error}\n`));
        process.exit(1);
    }
}
//# sourceMappingURL=service-config.js.map