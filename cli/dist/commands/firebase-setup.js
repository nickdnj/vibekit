"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseSetup = firebaseSetup;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const firebase_auth_1 = require("../utils/firebase-auth");
async function firebaseSetup() {
    console.log(chalk_1.default.cyan('\n🔥 Firebase Setup\n'));
    // Step 1: Check Firebase CLI
    let spinner = (0, ora_1.default)('Checking Firebase CLI installation...').start();
    const hasFirebaseCLI = await (0, firebase_auth_1.checkFirebaseCLI)();
    if (!hasFirebaseCLI) {
        spinner.fail('Firebase CLI not found');
        console.log(chalk_1.default.yellow('\n⚠️  Firebase CLI is required for VibeKit configuration'));
        const { installCLI } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'installCLI',
                message: 'Would you like to install Firebase CLI now?',
                default: true
            }
        ]);
        if (installCLI) {
            await (0, firebase_auth_1.installFirebaseCLI)();
        }
        else {
            console.log(chalk_1.default.red('\n❌ Firebase CLI is required. Please install it manually:'));
            console.log(chalk_1.default.gray('   npm install -g firebase-tools\n'));
            process.exit(1);
        }
    }
    else {
        const version = await (0, firebase_auth_1.getFirebaseCLIVersion)();
        spinner.succeed(`Firebase CLI found: ${version}`);
    }
    // Step 2: Check Firebase Authentication
    spinner = (0, ora_1.default)('Checking Firebase authentication...').start();
    let currentUser = await (0, firebase_auth_1.checkFirebaseAuth)();
    if (!currentUser) {
        spinner.warn('Not authenticated with Firebase');
        const { shouldLogin } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'shouldLogin',
                message: 'Would you like to login to Firebase now?',
                default: true
            }
        ]);
        if (shouldLogin) {
            currentUser = await (0, firebase_auth_1.loginToFirebase)();
        }
        else {
            console.log(chalk_1.default.red('\n❌ Firebase authentication is required for VibeKit configuration'));
            console.log(chalk_1.default.gray('   Run: firebase login\n'));
            process.exit(1);
        }
    }
    else {
        spinner.succeed(`Authenticated as: ${currentUser.email}`);
    }
    // Step 3: Summary
    console.log(chalk_1.default.green('\n✅ Firebase Setup Complete!'));
    console.log(chalk_1.default.white('\nNext steps:'));
    console.log(chalk_1.default.cyan('  • Firebase CLI: '), chalk_1.default.green('Ready'));
    console.log(chalk_1.default.cyan('  • Authentication: '), chalk_1.default.green(`${currentUser.email}`));
    console.log(chalk_1.default.cyan('  • Ready for project configuration\n'));
    // Return void for CLI action compatibility
}
//# sourceMappingURL=firebase-setup.js.map