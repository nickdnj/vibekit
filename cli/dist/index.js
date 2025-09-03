#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const welcome_1 = require("./commands/welcome");
const configure_1 = require("./commands/configure");
const firebase_setup_1 = require("./commands/firebase-setup");
const project_select_1 = require("./commands/project-select");
const service_config_1 = require("./commands/service-config");
const generate_config_1 = require("./commands/generate-config");
const packageInfo = require('../package.json');
// ASCII Art for VibeKit
const LOGO = `
${chalk_1.default.blue('╭─────────────────────────────────────────╮')}
${chalk_1.default.blue('│')}         ${chalk_1.default.bold.magenta('🤖 VibeKit CLI')}              ${chalk_1.default.blue('│')}
${chalk_1.default.blue('│')}     ${chalk_1.default.gray('Clone. Configure. Vibe.')}         ${chalk_1.default.blue('│')}
${chalk_1.default.blue('╰─────────────────────────────────────────╯')}
`;
function showLogo() {
    console.log(LOGO);
}
// Configure CLI program
commander_1.program
    .name('vibekit')
    .description('VibeKit CLI - Firebase-powered Flutter template configurator')
    .version(packageInfo.version)
    .hook('preAction', () => {
    showLogo();
});
// Commands
commander_1.program
    .command('welcome')
    .description('Show welcome message and basic information')
    .action(welcome_1.welcome);
commander_1.program
    .command('configure')
    .description('Configure VibeKit project with Firebase')
    .action(configure_1.configure);
commander_1.program
    .command('firebase-setup')
    .description('Setup Firebase CLI and authentication')
    .action(firebase_setup_1.firebaseSetup);
commander_1.program
    .command('project-select')
    .description('Select or create Firebase project for VibeKit')
    .action(project_select_1.projectSelect);
commander_1.program
    .command('service-config')
    .description('Configure Firebase services (Auth, Firestore, Storage, etc.)')
    .action(service_config_1.serviceConfig);
commander_1.program
    .command('generate-config')
    .description('Generate firebase_options.dart configuration file')
    .action(generate_config_1.generateConfig);
// Default command (show help if no command provided)
if (process.argv.length <= 2) {
    showLogo();
    commander_1.program.help();
}
commander_1.program.parse(process.argv);
//# sourceMappingURL=index.js.map