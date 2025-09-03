"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVibeKitProject = checkVibeKitProject;
exports.getProjectInfo = getProjectInfo;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Check if the current directory is a VibeKit project
 */
async function checkVibeKitProject() {
    try {
        const currentDir = process.cwd();
        // Check for key VibeKit files and directories
        const vibeKitIndicators = [
            'pubspec.yaml', // Flutter project
            'lib/firebase_options.dart', // VibeKit Firebase config
            'docs/cursorrules.md', // VibeKit documentation
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
    }
    catch (error) {
        return false;
    }
}
/**
 * Get project information from pubspec.yaml
 */
async function getProjectInfo() {
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
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=project-validator.js.map