export interface ServiceConfig {
    auth: {
        enabled: boolean;
        providers: string[];
    };
    firestore: {
        enabled: boolean;
        location: string;
    };
    storage: {
        enabled: boolean;
        location: string;
    };
    hosting: {
        enabled: boolean;
    };
    functions: {
        enabled: boolean;
        location: string;
    };
    analytics: {
        enabled: boolean;
    };
    messaging: {
        enabled: boolean;
    };
}
/**
 * Enable Firebase Authentication
 */
export declare function enableAuthentication(projectId: string): Promise<void>;
/**
 * Enable and configure Firestore
 */
export declare function enableFirestore(projectId: string): Promise<void>;
/**
 * Enable Firebase Storage
 */
export declare function enableStorage(projectId: string): Promise<void>;
/**
 * Enable Firebase Hosting
 */
export declare function enableHosting(projectId: string): Promise<void>;
/**
 * Enable Firebase Functions
 */
export declare function enableFunctions(projectId: string): Promise<void>;
/**
 * Deploy security rules
 */
export declare function deploySecurityRules(projectId: string): Promise<void>;
/**
 * Create admin user
 */
export declare function createAdminUser(projectId: string): Promise<void>;
/**
 * Configure all Firebase services
 */
export declare function configureAllServices(projectId: string): Promise<ServiceConfig>;
//# sourceMappingURL=firebase-services.d.ts.map