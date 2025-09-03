# **Product Requirements Document (PRD)**

**Product**: VibeKit – The Vibe Coding App Template Platform

---

## **1\. Elevator Pitch**

VibeKit is a **vibe coding platform** — a GitHub-hosted, Firebase-powered Flutter template designed to let developers go from idea to app **without touching infrastructure**. Developers clone the VibeKit template, run a **configure CLI wizard** that creates a **brand-new repository** with complete project independence, and immediately begin building apps inside **Cursor IDE** with all backend services (Auth, Firestore, Storage, Functions, Hosting, Messaging) prewired.

By bundling **Cursor rules** for coding consistency and optional **MCP server integrations** (PDF, FFmpeg, Graphics, Firebase Admin, App Store Connect, Google Play), VibeKit transforms app development into a **creative flow**: developers describe features, and the environment scaffolds them instantly.

---

## **2\. Who is this for?**

* **Solo devs & teams** building multiple productivity/utility apps.

* **Startups** needing per-client deployments with consistent infra.

* **Vibe coders** who want to prototype and ship ideas without boilerplate.

* **Organizations** leveraging Google Workspace \+ Firebase who want turnkey app infra.

---

## **3\. Functional Requirements**

### **3.1 Template Repository (GitHub)**

* Flutter project with:

  * Firebase integration (Auth, Firestore, Storage, Functions, Hosting).

  * State management (Riverpod, layered architecture).

  * Shared UI components (auth screen, admin dashboard).

  * Example CRUD flows (list/detail).

* Firebase rules, indexes, Functions, seed scripts.

* CI/CD workflows (Web → Hosting, iOS → App Store Connect, Android → Play Console).

* `.cursorrules` file for Cursor integration.

* CLI tool (`platform configure`) for setup.

### **3.2 CLI Configure Wizard**

* **Repository Creation**: Authenticates with GitHub and creates a new repository for the target app.

* **Platform Selection**: Prompts user to choose target platforms (Web, iOS, Android) and configures accordingly.

* **Identity Setup**: Collects app name, bundle IDs, branding options, and renames project files.

* **Firebase Integration**: Connects via `firebase login` and provisions selected services.

* **Service Configuration**: Enables Auth, Firestore, Storage, Functions, Hosting, Messaging, Analytics based on platform choices.

* **Code Generation**: Runs **FlutterFire CLI** to generate `firebase_options.dart`.

* **Security Setup**: Deploys baseline Firestore/Storage rules and seeds an admin account.

* **Documentation**: Creates `/docs` folder with PRD, SAD, UXD, TEST templates.

* **CI/CD Pipeline**: Sets up GitHub Actions workflows for selected platforms.

* **Repository Push**: Initializes and pushes complete project to the new GitHub repository.

**Output**: A fully independent repository ready for immediate development in Cursor IDE.

### **3.3 Cursor IDE Integration**

* `.cursorrules` defines:

  * Coding conventions (Riverpod, services, no DIY auth).

  * Auto-wiring to Firebase SDKs.

  * Common scaffolds (sign-in screen, admin module, CRUD templates).

* Cursor becomes the **creative partner**:

  * “Add task manager feature” → generates Firestore model \+ UI.

  * “Enable voice notes” → adds mic service \+ storage \+ FFmpeg pipeline.

  * “Ship v1.0” → triggers CI/CD with App Store/Play MCP servers.

### **3.4 MCP Server Integrations (Optional Power-Ups)**

Recommended installs after configuration:

* **Firebase Admin MCP** → user/data management.

* **Google Cloud MCP** → secrets, logging, analytics.

* **PDF MCP** → export, merge, watermark, generate reports.

* **FFmpeg MCP** → audio/video snippets, thumbnails, waveforms.

* **Graphics MCP** → avatars, charts, custom images.

* **App Store Connect MCP** → TestFlight & App Store deployment.

* **Google Play MCP** → Play Console uploads & release tracks.

Together, these MCPs make vibe coding **“motherf**\*ing awesome”\*\* by removing friction from creative coding.

---

## **4\. User Stories**

* **As a developer**, I can clone VibeKit, run `configure`, and get a brand-new repository with a complete Firebase app ready for development.

* **As a developer**, I can specify my target platforms (Web/iOS/Android) during configuration and get tailored CI/CD workflows.

* **As a developer**, I receive a repository with complete documentation (`/docs` folder) that Cursor can reference for consistent development.

* **As a developer**, I can build new features in Cursor by describing them, with consistent Firebase-backed scaffolds guided by the included `.cursorrules`.

* **As an admin user**, I can log in to any VibeKit-generated app and use the built-in admin console for user/data management.

* **As a vibe coder**, I can extend my app by integrating MCP servers (e.g., generate PDFs, process audio) without leaving Cursor.

* **As a CI engineer**, I can rely on prebuilt GitHub Actions workflows that deploy to the platforms I selected during configuration.

* **As a product owner**, I know every VibeKit-generated app has consistent auth, security, backend setup, and documentation structure.

---

## **5\. User Interface**

* **App UI**:

  * Sign-in screen (Firebase Auth).

  * Main home page with example CRUD flow (Firestore).

  * Admin dashboard (role-gated, manage users/data).

* **CLI (configure)**:

  * Interactive prompts for app identity, Firebase login, service enablement, branding.

* **Cursor experience**:

  * AI-guided scaffolding and consistent code generation via `.cursorrules`.

* **CI/CD workflows**:

  * GitHub Actions for Web, iOS, Android.

---

## **6\. Out-of-Scope (for v1)**

* Heavy media processing (offloaded to Cloud Run if needed).

* Non-Firebase backends (only Firebase/Google Cloud supported).

* Full-blown no-code GUI (focus is on vibe coding in Cursor).

---

## **7\. Success Metrics**

* **\<10 minutes** from clone → configure → first run in emulator.

* **100%** apps share the same auth \+ security model.

* **\<1 hour** from feature idea → working feature scaffolded in Cursor.

* **CI/CD**: one command (or one commit) deploys to Hosting/TestFlight/Play Console.

---

## **8\. Future Considerations**

* Mason or Yeoman-style generator for advanced templating.

* Add Workspace integrations (Drive, Calendar, Gmail APIs).

* Extend MCP library (OCR, AI inference, translation).

* Template “variants” for common app archetypes (task manager, notes, chat).

