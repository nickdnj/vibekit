# **Software Architecture Document (SAD)**

**Product**: VibeKit – The Vibe Coding App Template Platform

---

## **1\. System Design**

* **Purpose**: Provide a GitHub-hosted Flutter \+ Firebase template that developers can clone, configure via CLI to create independent repositories, and use directly inside Cursor IDE for vibe coding.

* **Key Components**:

  * **Template Repo** (Flutter app, Firebase configs, CI/CD workflows, `.cursorrules`).

  * **CLI Tool** (`platform configure`) for GitHub authentication, repository creation, platform selection, and Firebase provisioning.

  * **Generated Repository** (Independent project with complete documentation, CI/CD, and platform-specific configurations).

  * **Cursor IDE Integration** for vibe coding flow with included `.cursorrules` and `/docs` folder.

  * **Firebase Backend** (Auth, Firestore, Storage, Functions, Hosting, Messaging).

  * **MCP Servers** (Firebase Admin, Google Cloud, PDF, FFmpeg, Graphics, App Store Connect, Google Play).

* **Deployment Model**: Per-app Firebase projects, independent GitHub repositories, platform-specific App Store/Play Store listings.

---

## **2\. Architecture Pattern**

* **Frontend**: Flutter (cross-platform for iOS, Android, Web).

* **Backend**: Firebase (BaaS, serverless functions).

* **Pattern**: Clean Architecture \+ Unidirectional Data Flow.

* **State Management**: Riverpod providers.

---

## **3\. State Management**

* **Library**: Riverpod.

* **Providers**:

  * `authStateProvider` (Auth state changes).

  * `firestoreProvider` (Firestore services).

  * `storageProvider` (Storage services).

  * `deviceProvider` (camera, mic, sensors).

* **Principles**: Immutable state, AsyncValue for async ops, clear separation of concerns.

---

## **4\. Data Flow**

```
[Flutter UI Widgets]
        │
        ▼
[Riverpod Providers]
        │
        ▼
[Repository Layer]
        │
        ▼
[Service Layer]
        │
        ▼
[Firebase SDKs → Firebase Services]
```

*   
  User events → Providers dispatch → Repositories → Firebase services.

* Streams from Firestore/Auth propagate upward → State rebuilds UI.

---

## **5\. Technical Stack**

* **Frontend**: Flutter \+ Dart.

* **Backend**: Firebase Auth, Firestore, Storage, Functions (2nd gen), Hosting, Messaging, Analytics, App Check.

* **State Management**: Riverpod.

* **CLI Tool**: Node.js/TypeScript.

* **CI/CD**: GitHub Actions \+ Fastlane (iOS) \+ Gradle Play Publisher (Android).

* **Cursor Integration**: `.cursorrules` file.

* **MCP Servers**: Firebase Admin, Google Cloud, PDF, FFmpeg, Graphics, App Store Connect, Google Play.

---

## **6\. Authentication Process**

* **Providers**: Email/Password, Google, Apple, Phone.

* **Roles**: `user` (default), `admin` (custom claims).

* **Security**:

  * Firestore/Storage Rules enforce owner access.

  * App Check for client validation.

  * Admin user seeded via CLI.

---

## **7\. Route Design**

* `/login` → Authentication.

* `/home` → Main app shell.

* `/tasks` → Example CRUD.

* `/admin` → Admin dashboard (role-gated).

* `/settings` → Preferences/Profile.

---

## **8\. API Design**

* **Functions Endpoints**:

  * `/api/v1/admin/setRole` → manage roles.

  * `/api/v1/util/pdf/generate` → PDF actions.

  * `/api/v1/util/media/convert` → FFmpeg actions.

* **MCP Server**:

  * JSON-RPC via HTTPS Functions.

  * Tools: `createUser`, `generateReport`, `transcodeAudio`, `deployToAppStore`.

* **Auth**: Bearer token (Firebase ID token).

---

## **9\. Database Design ERD**

**Firestore Collections**:

```
/users/{uid}
  - displayName: string
  - email: string
  - role: string (user|admin)
  - createdAt: timestamp

/tasks/{taskId}
  - ownerId: uid
  - title: string
  - description: string
  - status: string (todo|done)
  - createdAt: timestamp

/media/{mediaId}
  - ownerId: uid
  - type: string (image|audio|video|pdf)
  - url: string
  - metadata: map
  - createdAt: timestamp
```

**Relationships**:

* `users` ↔ `tasks` (1:N).

* `users` ↔ `media` (1:N).

* Roles control access and admin functions.

---

## **10\. CI/CD Flow**

* **Web**: Flutter build → Firebase Hosting.

* **iOS**: Flutter build → Fastlane → App Store Connect → TestFlight.

* **Android**: Flutter build → Gradle Play Publisher → Google Play Console.

* **Secrets**: Managed in GitHub Actions \+ Firebase Secret Manager.

---

## **11\. Repository Creation \+ Configuration Flow**

### **CLI Configuration Process**:

1. **GitHub Authentication**: CLI authenticates with GitHub API for repository creation.

2. **Platform Selection**: User chooses target platforms (Web, iOS, Android).

3. **App Identity**: Collects app name, bundle IDs, branding preferences.

4. **Repository Creation**: Creates new GitHub repository with chosen app name.

5. **Firebase Setup**: Authenticates with Firebase and provisions selected services.

6. **Code Generation**: Generates platform-specific configurations and `firebase_options.dart`.

7. **Documentation**: Creates `/docs` folder with PRD, SAD, UXD, TEST templates.

8. **CI/CD Setup**: Configures GitHub Actions workflows for selected platforms.

9. **Repository Push**: Initializes git and pushes complete project to new repository.

### **Cursor \+ MCP Workflow**:

* `.cursorrules` and `/docs` folder provide context for:

  * Firebase-first backend usage.

  * Riverpod for state management.

  * Consistent service/repository architecture.

  * Project-specific requirements and design decisions.

* MCP Servers extend development flow:

  * Firebase Admin MCP: user/data operations.

  * PDF MCP: document features.

  * FFmpeg MCP: audio/video processing.

  * Graphics MCP: charts/avatars generation.

  * App Store MCPs: deployment automation.

* Developer "vibes" ideas → Cursor scaffolds code using context → MCP servers handle external integrations.

---

## **12\. Success Criteria**

* \<10 minutes from clone → configure → new repository with running app.

* Generated repositories are completely independent with their own identity, docs, and CI/CD.

* Platform-specific CI/CD pipelines work out of the box for selected platforms.

* Cursor generates consistent, Firebase-compliant code using `.cursorrules` and `/docs` context.

* Every generated repository includes complete documentation for ongoing development.

* MCP integrations available as optional power-ups for enhanced development workflow.

