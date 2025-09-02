# **Product Requirements Document (PRD)**

**Product**: VibeKit – The Vibe Coding App Template Platform

---

## **1\. Elevator Pitch**

VibeKit is a **vibe coding platform** — a GitHub-hosted, Firebase-powered Flutter template designed to let developers go from idea to app **without touching infrastructure**. Developers clone the repo, run a **configure CLI wizard**, and immediately begin building apps inside **Cursor IDE** with all backend services (Auth, Firestore, Storage, Functions, Hosting, Messaging) prewired.

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

* Collects: app name, bundle IDs, target platforms, branding options.

* Connects to Firebase via `firebase login`.

* Provisions Firebase services: Auth, Firestore, Storage, Functions, Hosting, Messaging, Analytics.

* Runs **FlutterFire CLI** to generate `firebase_options.dart`.

* Deploys baseline Firestore/Storage rules.

* Seeds an admin account.

* Sets up CI/CD secrets (App Store, Play Store, Firebase).

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

* **As a developer**, I can clone the repo, run `configure`, and have a ready-to-code Firebase app.

* **As a developer**, I can build new features in Cursor by describing them, with consistent Firebase-backed scaffolds.

* **As an admin user**, I can log in to any app and use a built-in admin console for user/data management.

* **As a vibe coder**, I can extend the template by calling MCP servers (e.g., generate PDFs, process audio) without leaving Cursor.

* **As a CI engineer**, I can rely on prebuilt workflows to deploy apps to Firebase Hosting, App Store Connect, and Play Console.

* **As a product owner**, I know every app has consistent auth, security, and backend setup.

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

