export interface FirebaseUser {
    email: string;
    uid: string;
    displayName?: string;
}
/**
 * Check if Firebase CLI is installed
 */
export declare function checkFirebaseCLI(): Promise<boolean>;
/**
 * Install Firebase CLI globally
 */
export declare function installFirebaseCLI(): Promise<void>;
/**
 * Check if user is logged into Firebase
 */
export declare function checkFirebaseAuth(): Promise<FirebaseUser | null>;
/**
 * Login to Firebase using the CLI
 */
export declare function loginToFirebase(): Promise<FirebaseUser>;
/**
 * Logout from Firebase
 */
export declare function logoutFromFirebase(): Promise<void>;
/**
 * Get Firebase CLI version
 */
export declare function getFirebaseCLIVersion(): Promise<string>;
//# sourceMappingURL=firebase-auth.d.ts.map