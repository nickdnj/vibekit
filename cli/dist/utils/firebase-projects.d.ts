export interface FirebaseProject {
    projectId: string;
    displayName: string;
    projectNumber: string;
    state: string;
    resources?: {
        hostingSite?: string;
        locationId?: string;
    };
}
/**
 * List all Firebase projects accessible to the current user
 */
export declare function listFirebaseProjects(): Promise<FirebaseProject[]>;
/**
 * Create a new Firebase project
 */
export declare function createFirebaseProject(projectId: string, displayName?: string): Promise<FirebaseProject>;
/**
 * Select a Firebase project interactively
 */
export declare function selectFirebaseProject(): Promise<FirebaseProject>;
/**
 * Validate project access and permissions
 */
export declare function validateProjectAccess(projectId: string): Promise<boolean>;
//# sourceMappingURL=firebase-projects.d.ts.map