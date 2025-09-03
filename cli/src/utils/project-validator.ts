import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Check if the current directory is a VibeKit project
 */
export async function checkVibeKitProject(): Promise<boolean> {
  try {
    const currentDir = process.cwd();
    
    // Check for key VibeKit files and directories
    const vibeKitIndicators = [
      'pubspec.yaml',           // Flutter project
      'lib/firebase_options.dart', // VibeKit Firebase config
      'docs/cursorrules.md',    // VibeKit documentation
      'firebase/firestore.rules', // VibeKit Firebase rules
      'lib/core/services/firebase_service.dart' // VibeKit architecture
    ];
    
    // Check if all indicators exist
    for (const indicator of vibeKitIndicators) {
      const filePath = path.join(currentDir, indicator);
      if (!(await fs.pathExists(filePath))) {
        return false;
      }
    }
    
    // Additional check: verify pubspec.yaml contains VibeKit-specific dependencies
    const pubspecPath = path.join(currentDir, 'pubspec.yaml');
    if (await fs.pathExists(pubspecPath)) {
      const pubspecContent = await fs.readFile(pubspecPath, 'utf-8');
      
      // Check for key dependencies that indicate a VibeKit project
      const requiredDeps = [
        'flutter_riverpod',
        'firebase_core',
        'firebase_auth',
        'cloud_firestore'
      ];
      
      for (const dep of requiredDeps) {
        if (!pubspecContent.includes(dep)) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get project information from pubspec.yaml
 */
export async function getProjectInfo(): Promise<{name: string; description: string} | null> {
  try {
    const pubspecPath = path.join(process.cwd(), 'pubspec.yaml');
    if (!(await fs.pathExists(pubspecPath))) {
      return null;
    }
    
    const content = await fs.readFile(pubspecPath, 'utf-8');
    
    // Simple YAML parsing for name and description
    const nameMatch = content.match(/^name:\s*(.+)$/m);
    const descMatch = content.match(/^description:\s*"?([^"]+)"?$/m);
    
    return {
      name: nameMatch ? nameMatch[1].trim() : 'Unknown',
      description: descMatch ? descMatch[1].trim() : 'No description'
    };
  } catch (error) {
    return null;
  }
}

