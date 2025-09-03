"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFirebaseProjects = listFirebaseProjects;
exports.createFirebaseProject = createFirebaseProject;
exports.selectFirebaseProject = selectFirebaseProject;
exports.validateProjectAccess = validateProjectAccess;
const child_process_1 = require("child_process");
const util_1 = require("util");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * List all Firebase projects accessible to the current user
 */
async function listFirebaseProjects() {
    const spinner = (0, ora_1.default)('Fetching Firebase projects...').start();
    try {
        const { stdout } = await execAsync('firebase projects:list --json');
        const response = JSON.parse(stdout);
        const projectsData = response.result || response;
        if (!projectsData || !Array.isArray(projectsData)) {
            spinner.fail('No projects found or invalid response');
            return [];
        }
        spinner.succeed(`Found ${projectsData.length} Firebase projects`);
        return projectsData.map((project) => ({
            projectId: project.projectId,
            displayName: project.displayName || project.projectId,
            projectNumber: project.projectNumber,
            state: project.lifecycleState || 'ACTIVE',
            resources: project.resources || {}
        }));
    }
    catch (error) {
        spinner.fail('Failed to fetch Firebase projects');
        throw new Error(`Failed to list projects: ${error}`);
    }
}
/**
 * Create a new Firebase project
 */
async function createFirebaseProject(projectId, displayName) {
    console.log(chalk_1.default.cyan(`\n📝 Creating Firebase project: ${projectId}\n`));
    const spinner = (0, ora_1.default)('Creating Firebase project...').start();
    try {
        // Create the project
        const createCommand = displayName
            ? `firebase projects:create ${projectId} --display-name "${displayName}"`
            : `firebase projects:create ${projectId}`;
        await execAsync(createCommand);
        spinner.text = 'Waiting for project to be ready...';
        // Wait a bit for the project to be fully created
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Get the project details
        const { stdout } = await execAsync(`firebase projects:list --json`);
        const response = JSON.parse(stdout);
        const projects = response.result || response;
        const newProject = projects.find((p) => p.projectId === projectId);
        if (!newProject) {
            throw new Error('Project created but not found in list');
        }
        spinner.succeed(`Firebase project '${projectId}' created successfully!`);
        return {
            projectId: newProject.projectId,
            displayName: newProject.displayName || newProject.projectId,
            projectNumber: newProject.projectNumber,
            state: newProject.lifecycleState || 'ACTIVE',
            resources: newProject.resources || {}
        };
    }
    catch (error) {
        spinner.fail(`Failed to create Firebase project '${projectId}'`);
        throw new Error(`Project creation failed: ${error}`);
    }
}
/**
 * Select a Firebase project interactively
 */
async function selectFirebaseProject() {
    console.log(chalk_1.default.cyan('\n🔥 Firebase Project Selection\n'));
    // Get list of existing projects
    const projects = await listFirebaseProjects();
    if (projects.length === 0) {
        console.log(chalk_1.default.yellow('⚠️  No existing Firebase projects found.'));
        return await createNewProjectInteractive();
    }
    // Show project options
    console.log(chalk_1.default.white('Available Firebase projects:\n'));
    projects.forEach((project, index) => {
        console.log(chalk_1.default.gray(`${index + 1}. `), chalk_1.default.white(project.displayName));
        console.log(chalk_1.default.gray(`   Project ID: ${project.projectId}`));
        console.log(chalk_1.default.gray(`   State: ${project.state}\n`));
    });
    const choices = [
        ...projects.map(project => ({
            name: `${project.displayName} (${project.projectId})`,
            value: project,
            short: project.displayName
        })),
        {
            name: chalk_1.default.green('+ Create new Firebase project'),
            value: 'create-new',
            short: 'Create new project'
        }
    ];
    const { selectedProject } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'selectedProject',
            message: 'Select a Firebase project for VibeKit:',
            choices,
            pageSize: 10
        }
    ]);
    if (selectedProject === 'create-new') {
        return await createNewProjectInteractive();
    }
    console.log(chalk_1.default.green(`\n✅ Selected project: ${selectedProject.displayName}`));
    return selectedProject;
}
/**
 * Interactive project creation
 */
async function createNewProjectInteractive() {
    console.log(chalk_1.default.cyan('\n📝 Create New Firebase Project\n'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'projectId',
            message: 'Enter project ID (lowercase, numbers, hyphens only):',
            validate: (input) => {
                if (!input || input.length < 6) {
                    return 'Project ID must be at least 6 characters long';
                }
                if (!/^[a-z0-9-]+$/.test(input)) {
                    return 'Project ID can only contain lowercase letters, numbers, and hyphens';
                }
                if (input.startsWith('-') || input.endsWith('-')) {
                    return 'Project ID cannot start or end with a hyphen';
                }
                return true;
            }
        },
        {
            type: 'input',
            name: 'displayName',
            message: 'Enter project display name (optional):',
            default: (answers) => answers.projectId
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: (answers) => `Create Firebase project '${answers.projectId}'?`,
            default: true
        }
    ]);
    if (!answers.confirm) {
        console.log(chalk_1.default.yellow('Project creation cancelled.'));
        process.exit(0);
    }
    return await createFirebaseProject(answers.projectId, answers.displayName);
}
/**
 * Validate project access and permissions
 */
async function validateProjectAccess(projectId) {
    const spinner = (0, ora_1.default)('Validating project access...').start();
    try {
        // Try to get project details
        await execAsync(`firebase use --add ${projectId}`);
        // Check if we can access basic Firebase services
        const { stdout } = await execAsync(`firebase projects:list --json`);
        const response = JSON.parse(stdout);
        const projects = response.result || response;
        const project = projects.find((p) => p.projectId === projectId);
        if (!project) {
            spinner.fail('Project not accessible');
            return false;
        }
        spinner.succeed('Project access validated');
        return true;
    }
    catch (error) {
        spinner.fail('Failed to validate project access');
        return false;
    }
}
//# sourceMappingURL=firebase-projects.js.map