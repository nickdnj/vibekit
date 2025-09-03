/**
 * Check if the current directory is a VibeKit project
 */
export declare function checkVibeKitProject(): Promise<boolean>;
/**
 * Get project information from pubspec.yaml
 */
export declare function getProjectInfo(): Promise<{
    name: string;
    description: string;
} | null>;
//# sourceMappingURL=project-validator.d.ts.map