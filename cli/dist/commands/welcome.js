"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = welcome;
const chalk_1 = __importDefault(require("chalk"));
const project_validator_1 = require("../utils/project-validator");
async function welcome() {
    console.log(chalk_1.default.cyan('\n🎉 Welcome to VibeKit CLI!\n'));
    console.log(chalk_1.default.white('VibeKit is a Firebase-powered Flutter template that gets you'));
    console.log(chalk_1.default.white('from idea to app in minutes, not hours.\n'));
    console.log(chalk_1.default.yellow('✨ What VibeKit includes:'));
    console.log(chalk_1.default.gray('  • Firebase Auth (Email + Google + Apple)'));
    console.log(chalk_1.default.gray('  • Firestore Database with security rules'));
    console.log(chalk_1.default.gray('  • Cloud Storage with auto file management'));
    console.log(chalk_1.default.gray('  • Admin dashboard with role-based access'));
    console.log(chalk_1.default.gray('  • Clean architecture with Riverpod state management'));
    console.log(chalk_1.default.gray('  • Modern Material 3 UI with dark/light themes'));
    console.log(chalk_1.default.gray('  • CI/CD workflows for Web/iOS/Android deployment\n'));
    // Check if we're in a VibeKit project
    const isVibeKitProject = await (0, project_validator_1.checkVibeKitProject)();
    if (isVibeKitProject) {
        console.log(chalk_1.default.green('✅ You are in a VibeKit project!'));
        console.log(chalk_1.default.white('\nNext steps:'));
        console.log(chalk_1.default.cyan('  vibekit configure    '), chalk_1.default.gray('Configure Firebase for this project'));
        console.log(chalk_1.default.cyan('  flutter run -d chrome'), chalk_1.default.gray('Run your app in web browser'));
        console.log(chalk_1.default.cyan('  flutter run          '), chalk_1.default.gray('Run your app on mobile device'));
    }
    else {
        console.log(chalk_1.default.yellow('⚠️  Not in a VibeKit project directory'));
        console.log(chalk_1.default.white('\nTo get started:'));
        console.log(chalk_1.default.cyan('  git clone https://github.com/nickdnj/vibekit.git'));
        console.log(chalk_1.default.cyan('  cd vibekit'));
        console.log(chalk_1.default.cyan('  vibekit configure'));
    }
    console.log(chalk_1.default.white('\n📚 Documentation: '), chalk_1.default.blue('https://github.com/nickdnj/vibekit'));
    console.log(chalk_1.default.white('🐛 Issues: '), chalk_1.default.blue('https://github.com/nickdnj/vibekit/issues'));
    console.log(chalk_1.default.white('💬 Discussions: '), chalk_1.default.blue('https://github.com/nickdnj/vibekit/discussions\n'));
}
//# sourceMappingURL=welcome.js.map