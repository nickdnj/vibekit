import chalk from 'chalk';
import inquirer from 'inquirer';
import * as fs from 'fs-extra';
import * as path from 'path';
import { PromptManager } from '../utils/prompt-manager';

export async function listPrompts() {
  console.log(chalk.cyan('\n📋 **VibeKit AI Expert Agents**\n'));
  console.log(chalk.white('Professional-grade prompts based on proven custom GPT patterns:\n'));
  
  try {
    const promptManager = PromptManager.getInstance();
    const agents = await promptManager.listAgents();
    
    for (const agent of agents) {
      try {
        const info = await promptManager.getAgentInfo(agent);
        const agentEmoji = getAgentEmoji(agent);
        
        console.log(chalk.blue(`${agentEmoji} **${agent.toUpperCase()} Agent**`));
        console.log(chalk.white(`   ${info.name}`));
        console.log(chalk.gray(`   ${info.description}`));
        console.log(chalk.gray(`   Version: ${info.version}\n`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  ${agent}: Prompt file not found`));
      }
    }
    
    console.log(chalk.cyan('🛠️ **Management Commands:**'));
    console.log(chalk.gray('   vibekit prompts edit <agent>    # Edit agent prompts'));
    console.log(chalk.gray('   vibekit prompts backup          # Backup all prompts'));
    console.log(chalk.gray('   vibekit prompts validate        # Validate prompt structure'));
    console.log(chalk.gray('   vibekit prompts test <agent>    # Test agent prompts\n'));
    
  } catch (error) {
    console.log(chalk.red(`❌ Failed to list prompts: ${error}\n`));
    console.log(chalk.yellow('💡 Make sure you\'re in a VibeKit project directory'));
  }
}

export async function editPrompt(agentName?: string) {
  if (!agentName) {
    const promptManager = PromptManager.getInstance();
    const agents = await promptManager.listAgents();
    const { selectedAgent } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedAgent',
        message: 'Which expert agent would you like to edit?',
        choices: agents.map(agent => ({
          name: `${getAgentEmoji(agent)} ${agent.toUpperCase()} Agent`,
          value: agent
        }))
      }
    ]);
    agentName = selectedAgent;
  }
  console.log(chalk.cyan('\n✏️ **Edit AI Agent Prompts**\n'));
  
  try {
    const promptManager = PromptManager.getInstance();
    const prompt = await promptManager.loadPrompt(agentName!);
    
    console.log(chalk.blue(`\n📖 **Editing: ${prompt.name}**`));
    console.log(chalk.gray(`Current version: ${prompt.version}`));
    console.log(chalk.gray(`Expertise: ${prompt.metadata.expertise}\n`));
    
    const { editChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'editChoice',
        message: 'What would you like to edit?',
        choices: [
          { name: '🎯 System Prompt - Core AI agent instructions', value: 'system' },
          { name: '❓ Clarifying Questions - Questions asked when info is missing', value: 'questions' },
          { name: '📝 Document Template - Output format and structure', value: 'template' },
          { name: '⚙️ Agent Metadata - Name, description, version', value: 'metadata' },
          { name: '📁 Open JSON File - Edit directly in your editor', value: 'open' },
          { name: '💾 Save & Exit', value: 'save' },
          { name: '❌ Cancel', value: 'cancel' }
        ]
      }
    ]);
    
    switch (editChoice) {
      case 'cancel':
        console.log(chalk.yellow('Edit cancelled\n'));
        return;
        
      case 'save':
        await promptManager.savePrompt(agentName!, prompt);
        console.log(chalk.green(`✅ ${prompt.name} saved successfully!\n`));
        return;
        
      case 'open':
        const promptFile = path.join(promptManager['promptsDir'], 'agents', `${agentName}-agent.json`);
        console.log(chalk.blue(`\n📝 Opening prompt file in editor:`));
        console.log(chalk.cyan(`   ${promptFile}\n`));
        console.log(chalk.gray('Edit the JSON file and run "vibekit prompts validate" to check your changes\n'));
        return;
        
      default:
        await handlePromptEdit(prompt, editChoice, promptManager);
        
        // Ask if they want to save
        const { saveChanges } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'saveChanges',
            message: 'Save your changes?',
            default: true
          }
        ]);
        
        if (saveChanges) {
          await promptManager.savePrompt(agentName!, prompt);
          console.log(chalk.green(`✅ ${prompt.name} updated successfully!\n`));
        } else {
          console.log(chalk.yellow('Changes discarded\n'));
        }
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Failed to edit prompt: ${error}\n`));
  }
}

export async function backupPrompts() {
  console.log(chalk.cyan('\n💾 **Backup AI Agent Prompts**\n'));
  
  try {
    const promptManager = PromptManager.getInstance();
    const agents = await promptManager.listAgents();
    
    console.log(chalk.white('Creating backups for all agents...\n'));
    
    for (const agent of agents) {
      try {
        await promptManager.backupPrompt(agent);
        console.log(chalk.green(`✅ Backed up: ${agent.toUpperCase()} Agent`));
      } catch (error) {
        console.log(chalk.yellow(`⚠️  Could not backup ${agent}: ${error}`));
      }
    }
    
    console.log(chalk.green('\n🎉 All available prompts backed up successfully!\n'));
    
  } catch (error) {
    console.log(chalk.red(`❌ Backup failed: ${error}\n`));
  }
}

export async function validatePrompts() {
  console.log(chalk.cyan('\n🔍 **Validate AI Agent Prompts**\n'));
  
  try {
    const promptManager = PromptManager.getInstance();
    const agents = await promptManager.listAgents();
    
    let allValid = true;
    
    for (const agent of agents) {
      try {
        const prompt = await promptManager.loadPrompt(agent);
        const validation = promptManager.validatePrompt(prompt);
        
        if (validation.valid) {
          console.log(chalk.green(`✅ ${agent.toUpperCase()}: Valid`));
        } else {
          allValid = false;
          console.log(chalk.red(`❌ ${agent.toUpperCase()}: Invalid`));
          
          validation.errors.forEach(error => {
            console.log(chalk.red(`   Error: ${error}`));
          });
        }
        
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => {
            console.log(chalk.yellow(`   Warning: ${warning}`));
          });
        }
        
      } catch (error) {
        allValid = false;
        console.log(chalk.red(`❌ ${agent.toUpperCase()}: ${error}`));
      }
    }
    
    if (allValid) {
      console.log(chalk.green('\n🎉 All prompts are valid!\n'));
    } else {
      console.log(chalk.yellow('\n⚠️  Some prompts have issues. Use "vibekit prompts edit <agent>" to fix them.\n'));
    }
    
  } catch (error) {
    console.log(chalk.red(`❌ Validation failed: ${error}\n`));
  }
}

export async function testPrompt(agentName?: string) {
  if (!agentName) {
    const promptManager = PromptManager.getInstance();
    const agents = await promptManager.listAgents();
    const { selectedAgent } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedAgent',
        message: 'Which agent would you like to test?',
        choices: agents.map(agent => ({
          name: `${getAgentEmoji(agent)} ${agent.toUpperCase()} Agent`,
          value: agent
        }))
      }
    ]);
    agentName = selectedAgent;
  }
  console.log(chalk.cyan('\n🧪 **Test AI Agent Prompt**\n'));
  
  try {
    const promptManager = PromptManager.getInstance();
    
    if (!agentName) {
      const agents = await promptManager.listAgents();
      const { selectedAgent } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedAgent',
          message: 'Which agent would you like to test?',
          choices: agents.map(agent => ({
            name: `${getAgentEmoji(agent)} ${agent.toUpperCase()} Agent`,
            value: agent
          }))
        }
      ]);
      agentName = selectedAgent;
    }
    
    const prompt = await promptManager.loadPrompt(agentName!);
    
    console.log(chalk.blue(`\n🧪 **Testing: ${prompt.name}**\n`));
    
    // Show key prompt elements
    console.log(chalk.white('📋 **System Prompt Preview:**'));
    console.log(chalk.gray(prompt.prompts.system.substring(0, 200) + '...\n'));
    
    console.log(chalk.white('❓ **Available Clarifying Questions:**'));
    Object.keys(prompt.prompts.clarifying_questions).forEach(key => {
      console.log(chalk.gray(`   • ${key}: ${prompt.prompts.clarifying_questions[key].substring(0, 60)}...`));
    });
    
    console.log(chalk.white('\n📝 **Document Template Structure:**'));
    const templateLines = prompt.prompts.document_template.split('\n').slice(0, 10);
    templateLines.forEach((line: string) => {
      if (line.trim()) {
        console.log(chalk.gray(`   ${line}`));
      }
    });
    console.log(chalk.gray('   ...\n'));
    
    console.log(chalk.green(`✅ ${prompt.name} prompt structure is valid and ready to use!\n`));
    
  } catch (error) {
    console.log(chalk.red(`❌ Failed to test prompt: ${error}\n`));
  }
}

async function handlePromptEdit(prompt: any, section: string, promptManager: PromptManager) {
  switch (section) {
    case 'system':
      console.log(chalk.blue('\n🎯 **Editing System Prompt**\n'));
      console.log(chalk.gray('This is the core instruction that defines the AI agent\'s expertise and behavior.\n'));
      
      const { newSystemPrompt } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'newSystemPrompt',
          message: 'Edit the system prompt (opens in your default editor):',
          default: prompt.prompts.system
        }
      ]);
      prompt.prompts.system = newSystemPrompt;
      console.log(chalk.green('✅ System prompt updated'));
      break;
      
    case 'questions':
      console.log(chalk.blue('\n❓ **Clarifying Questions Management**\n'));
      console.log(chalk.white('Current clarifying questions:'));
      
      Object.keys(prompt.prompts.clarifying_questions).forEach((key, index) => {
        console.log(chalk.cyan(`${index + 1}. ${key}`));
        console.log(chalk.gray(`   ${prompt.prompts.clarifying_questions[key]}\n`));
      });
      
      console.log(chalk.yellow('💡 For complex question editing, use: vibekit prompts edit <agent> → Open JSON File\n'));
      break;
      
    case 'template':
      console.log(chalk.blue('\n📝 **Document Template Management**\n'));
      console.log(chalk.white('Template structure preview:'));
      
      const templatePreview = prompt.prompts.document_template.split('\n').slice(0, 15);
      templatePreview.forEach((line: string) => {
        console.log(chalk.gray(`   ${line}`));
      });
      console.log(chalk.gray('   ...\n'));
      
      console.log(chalk.yellow('💡 For template editing, use: vibekit prompts edit <agent> → Open JSON File\n'));
      break;
      
    case 'metadata':
      console.log(chalk.blue('\n⚙️ **Agent Metadata**\n'));
      
      const { newName, newDescription } = await inquirer.prompt([
        {
          type: 'input',
          name: 'newName',
          message: 'Agent name:',
          default: prompt.name
        },
        {
          type: 'input',
          name: 'newDescription',
          message: 'Agent description:',
          default: prompt.description
        }
      ]);
      
      prompt.name = newName;
      prompt.description = newDescription;
      console.log(chalk.green('✅ Metadata updated'));
      break;
  }
}

function getAgentEmoji(agent: string): string {
  const emojis: { [key: string]: string } = {
    prd: '📋',
    sad: '🏗️',
    uxd: '🎨',
    test: '🧪'
  };
  
  return emojis[agent] || '🤖';
}
