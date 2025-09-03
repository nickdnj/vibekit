#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { welcome } from './commands/welcome';
import { configure } from './commands/configure';
import { firebaseSetup } from './commands/firebase-setup';
import { projectSelect } from './commands/project-select';
import { serviceConfig } from './commands/service-config';
import { generateConfig } from './commands/generate-config';
import { testLocal } from './commands/test-local';
import { ideate } from './commands/ideate';
import { listPrompts, editPrompt, backupPrompts, validatePrompts, testPrompt } from './commands/prompts';

const packageInfo = require('../package.json');

// ASCII Art for VibeKit
const LOGO = `
${chalk.blue('╭─────────────────────────────────────────╮')}
${chalk.blue('│')}         ${chalk.bold.magenta('🤖 VibeKit CLI')}              ${chalk.blue('│')}
${chalk.blue('│')}     ${chalk.gray('Clone. Configure. Vibe.')}         ${chalk.blue('│')}
${chalk.blue('╰─────────────────────────────────────────╯')}
`;

function showLogo() {
  console.log(LOGO);
}

// Configure CLI program
program
  .name('vibekit')
  .description('VibeKit CLI - Firebase-powered Flutter template configurator')
  .version(packageInfo.version)
  .hook('preAction', () => {
    showLogo();
  });

// Commands
program
  .command('welcome')
  .description('Show welcome message and basic information')
  .action(welcome);

program
  .command('configure')
  .description('Create new repository with GitHub integration')
  .action(configure);

program
  .command('test-local')
  .description('Test repository generation locally without GitHub')
  .action(testLocal);

program
  .command('ideate')
  .description('AI-powered app ideation and documentation generation')
  .action(ideate);

program
  .command('firebase-setup')
  .description('Setup Firebase CLI and authentication')
  .action(firebaseSetup);

program
  .command('project-select')
  .description('Select or create Firebase project for VibeKit')
  .action(projectSelect);

program
  .command('service-config')
  .description('Configure Firebase services (Auth, Firestore, Storage, etc.)')
  .action(serviceConfig);

program
  .command('generate-config')
  .description('Generate firebase_options.dart configuration file')
  .action(generateConfig);

// Prompt Management Commands
const promptsCommand = program
  .command('prompts')
  .description('Manage AI agent prompts');

promptsCommand
  .command('list')
  .description('List all available AI agents and their prompts')
  .action(listPrompts);

promptsCommand
  .command('edit [agent]')
  .description('Edit prompts for a specific AI agent')
  .action(editPrompt);

promptsCommand
  .command('backup')
  .description('Backup all AI agent prompts')
  .action(backupPrompts);

promptsCommand
  .command('validate')
  .description('Validate all AI agent prompt structures')
  .action(validatePrompts);

promptsCommand
  .command('test [agent]')
  .description('Test and preview AI agent prompts')
  .action(testPrompt);

// Default command (show help if no command provided)
if (process.argv.length <= 2) {
  showLogo();
  program.help();
}

program.parse(process.argv);

