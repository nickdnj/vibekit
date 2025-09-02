# **Software Architecture Document (SAD)**

**Product**: VibeKit – The Vibe Coding App Template Platform

---

## **1\. System Design**

* **Purpose**: Provide a GitHub-hosted Flutter \+ Firebase template that developers can clone, configure via CLI, and use directly inside Cursor IDE for vibe coding.

* **Key Components**:

  * **Template Repo** (Flutter app, Firebase configs, CI/CD workflows, `.cursorrules`).

  * **CLI Tool** (`platform configure`) for initial setup and Firebase provisioning.

  * **Cursor IDE Integration** for vibe coding flow.

  * **Firebase Backend** (Auth, Firestore, Storage, Functions, Hosting, Messaging).

  * **MCP Servers** (Firebase Admin, Google Cloud, PDF, FFmpeg, Graphics, App Store Connect, Google Play).

* **Deployment Model**: Per-client Firebase projects, App Store/Play Store listings.

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

## **11\. Cursor \+ MCP Workflow**

* `.cursorrules` enforce:

  * Firebase-first backend usage.

  * Riverpod for state.

  * Consistent service/repo architecture.

* MCP Servers extend dev flow:

  * Firebase Admin MCP: user/data ops.

  * PDF MCP: document features.

  * FFmpeg MCP: audio/video snippets.

  * Graphics MCP: charts/avatars.

  * App Store MCPs: deployments.

* Developer “vibes” ideas → Cursor scaffolds code → MCP servers handle external integrations.

---

## **12\. Success Criteria**

* \<10 minutes from clone → configure → running app.

* CI/CD pipelines work out of the box for Web/iOS/Android.

* Cursor generates consistent, Firebase-compliant code.

* MCP integrations available as optional power-ups.

