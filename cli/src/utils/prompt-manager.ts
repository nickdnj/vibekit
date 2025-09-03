import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export interface AgentPrompt {
  version: string;
  agent: string;
  name: string;
  description: string;
  metadata: {
    created: string;
    author: string;
    tags: string[];
    source: string;
    expertise: string;
  };
  config: {
    temperature: number;
    structured_output: boolean;
    markdown_format: boolean;
    max_tokens: number;
  };
  prompts: {
    system: string;
    document_analysis?: string;
    initial_prompt?: string;
    sample_headings?: string[];
    clarifying_questions: Record<string, string>;
    document_template: string;
    [key: string]: any;
  };
}

export interface PromptConfig {
  version: string;
  name: string;
  description: string;
  agents: Record<string, string>;
  settings: {
    auto_backup: boolean;
    prompt_validation: boolean;
    template_interpolation: boolean;
    structured_output: boolean;
  };
  metadata: {
    created: string;
    last_updated: string;
    backup_count: number;
    source: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class PromptManager {
  private static instance: PromptManager;
  private promptsDir: string;
  private config: PromptConfig | null = null;
  private promptCache: Map<string, AgentPrompt> = new Map();

  constructor() {
    this.promptsDir = path.join(__dirname, '../../prompts');
  }

  static getInstance(): PromptManager {
    if (!PromptManager.instance) {
      PromptManager.instance = new PromptManager();
    }
    return PromptManager.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadConfig();
      console.log(chalk.green('✅ Prompt management system initialized'));
    } catch (error) {
      console.log(chalk.yellow('⚠️  Prompt system not found, using fallback prompts'));
    }
  }

  async loadConfig(): Promise<PromptConfig> {
    if (this.config) return this.config;

    const configPath = path.join(this.promptsDir, 'config.json');
    
    if (!await fs.pathExists(configPath)) {
      throw new Error(`Prompt configuration not found at ${configPath}`);
    }

    this.config = await fs.readJson(configPath);
    return this.config!;
  }

  async loadPrompt(agentName: string): Promise<AgentPrompt> {
    // Check cache first
    if (this.promptCache.has(agentName)) {
      return this.promptCache.get(agentName)!;
    }

    const config = await this.loadConfig();
    const promptFile = config.agents[agentName];
    
    if (!promptFile) {
      throw new Error(`Agent '${agentName}' not found in configuration`);
    }

    const promptPath = path.join(this.promptsDir, promptFile);
    
    if (!await fs.pathExists(promptPath)) {
      throw new Error(`Prompt file not found: ${promptPath}`);
    }

    const prompt: AgentPrompt = await fs.readJson(promptPath);
    
    // Validate prompt structure
    const validation = this.validatePrompt(prompt);
    if (!validation.valid) {
      console.log(chalk.yellow(`⚠️  Prompt validation warnings for ${agentName}:`));
      validation.warnings.forEach(warning => console.log(chalk.gray(`   ${warning}`)));
      
      if (validation.errors.length > 0) {
        console.log(chalk.red(`❌ Prompt validation errors for ${agentName}:`));
        validation.errors.forEach(error => console.log(chalk.red(`   ${error}`)));
        throw new Error(`Invalid prompt structure for ${agentName}`);
      }
    }
    
    // Cache the prompt
    this.promptCache.set(agentName, prompt);
    
    return prompt;
  }

  async savePrompt(agentName: string, prompt: AgentPrompt): Promise<void> {
    const config = await this.loadConfig();
    const promptFile = config.agents[agentName];
    
    if (!promptFile) {
      throw new Error(`Agent '${agentName}' not found in configuration`);
    }

    // Backup existing prompt if auto_backup is enabled
    if (config.settings.auto_backup) {
      await this.backupPrompt(agentName);
    }

    // Update metadata
    prompt.metadata.created = prompt.metadata.created || new Date().toISOString();
    
    const promptPath = path.join(this.promptsDir, promptFile);
    await fs.ensureDir(path.dirname(promptPath));
    await fs.writeJson(promptPath, prompt, { spaces: 2 });
    
    // Update config last_updated
    config.metadata.last_updated = new Date().toISOString();
    await this.saveConfig(config);
    
    // Clear cache to force reload
    this.promptCache.delete(agentName);
    
    console.log(chalk.green(`✅ Prompt saved: ${agentName} v${prompt.version}`));
  }

  async backupPrompt(agentName: string): Promise<void> {
    const config = await this.loadConfig();
    const promptFile = config.agents[agentName];
    const promptPath = path.join(this.promptsDir, promptFile);
    
    if (!await fs.pathExists(promptPath)) {
      return; // No existing prompt to backup
    }

    const backupDir = path.join(this.promptsDir, 'backups');
    await fs.ensureDir(backupDir);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupFile = `${agentName}-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFile);
    
    await fs.copy(promptPath, backupPath);
    
    // Clean up old backups
    await this.cleanupBackups(agentName, config.metadata.backup_count);
  }

  async listAgents(): Promise<string[]> {
    try {
      const config = await this.loadConfig();
      return Object.keys(config.agents);
    } catch {
      // Fallback to default agents if config not available
      return ['prd', 'sad', 'uxd', 'test'];
    }
  }

  async getAgentInfo(agentName: string): Promise<{ name: string; description: string; version: string }> {
    try {
      const prompt = await this.loadPrompt(agentName);
      return {
        name: prompt.name,
        description: prompt.description,
        version: prompt.version
      };
    } catch {
      // Fallback info if prompt not available
      return {
        name: `${agentName.toUpperCase()} Agent`,
        description: `${agentName.toUpperCase()} document generator`,
        version: '1.0.0'
      };
    }
  }

  interpolateTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  }

  validatePrompt(prompt: AgentPrompt): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    const required = ['version', 'agent', 'name', 'prompts'];
    for (const field of required) {
      if (!prompt[field as keyof AgentPrompt]) {
        errors.push(`Required field '${field}' is missing`);
      }
    }

    // Prompts validation
    if (prompt.prompts) {
      if (!prompt.prompts.system) {
        errors.push('System prompt is required');
      }
      
      if (!prompt.prompts.document_template) {
        errors.push('Document template is required');
      }
      
      if (!prompt.prompts.clarifying_questions) {
        warnings.push('No clarifying questions defined');
      }
    }

    // Version validation
    if (prompt.version && !/^\d+\.\d+\.\d+$/.test(prompt.version)) {
      warnings.push('Version should follow semantic versioning (x.y.z)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async saveConfig(config: PromptConfig): Promise<void> {
    const configPath = path.join(this.promptsDir, 'config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });
  }

  private async cleanupBackups(agentName: string, keepCount: number): Promise<void> {
    const backupDir = path.join(this.promptsDir, 'backups');
    
    if (!await fs.pathExists(backupDir)) {
      return;
    }

    const files = await fs.readdir(backupDir);
    const agentBackups = files
      .filter(file => file.startsWith(`${agentName}-`) && file.endsWith('.json'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        stats: fs.statSync(path.join(backupDir, file))
      }))
      .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()); // Most recent first

    if (agentBackups.length > keepCount) {
      const toDelete = agentBackups.slice(keepCount);
      
      for (const backup of toDelete) {
        await fs.remove(backup.path);
      }
      
      console.log(chalk.gray(`🧹 Cleaned up ${toDelete.length} old backups for ${agentName}`));
    }
  }
}
