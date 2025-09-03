"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSelect = projectSelect;
const chalk_1 = __importDefault(require("chalk"));
const firebase_auth_1 = require("../utils/firebase-auth");
const firebase_projects_1 = require("../utils/firebase-projects");
async function projectSelect() {
    console.log(chalk_1.default.cyan('\n🎯 Firebase Project Selection\n'));
    // Step 1: Ensure user is authenticated
    const currentUser = await (0, firebase_auth_1.checkFirebaseAuth)();
    if (!currentUser) {
        console.log(chalk_1.default.red('❌ Not authenticated with Firebase'));
        console.log(chalk_1.default.gray('Please run: vibekit firebase-setup\n'));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`✅ Authenticated as: ${currentUser.email}\n`));
    try {
        // Step 2: Select Firebase project
        const selectedProject = await (0, firebase_projects_1.selectFirebaseProject)();
        // Step 3: Validate access to the selected project
        console.log(chalk_1.default.cyan('\n🔍 Validating project access...\n'));
        const hasAccess = await (0, firebase_projects_1.validateProjectAccess)(selectedProject.projectId);
        if (!hasAccess) {
            console.log(chalk_1.default.red(`❌ Cannot access project '${selectedProject.projectId}'`));
            console.log(chalk_1.default.gray('Please check your permissions and try again.\n'));
            process.exit(1);
        }
        // Step 4: Success summary
        console.log(chalk_1.default.green('\n🎉 Project Selection Complete!\n'));
        console.log(chalk_1.default.white('Selected project details:'));
        console.log(chalk_1.default.cyan('  • Project ID: '), chalk_1.default.white(selectedProject.projectId));
        console.log(chalk_1.default.cyan('  • Display Name: '), chalk_1.default.white(selectedProject.displayName));
        console.log(chalk_1.default.cyan('  • Project Number: '), chalk_1.default.white(selectedProject.projectNumber));
        console.log(chalk_1.default.cyan('  • State: '), chalk_1.default.green(selectedProject.state));
        console.log(chalk_1.default.white('\nNext steps:'));
        console.log(chalk_1.default.cyan('  • Project is ready for VibeKit configuration'));
        console.log(chalk_1.default.cyan('  • Firebase services can now be enabled'));
        console.log(chalk_1.default.cyan('  • Ready to generate firebase_options.dart\n'));
        // Success - return void for CLI compatibility
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Project selection failed: ${error}\n`));
        process.exit(1);
    }
}
//# sourceMappingURL=project-select.js.map