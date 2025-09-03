# **UX Design Document for VibeKit**

---

## **1\. User Personas**

* **Vibe Coder**: Wants to turn an idea into a running app fast, without touching Firebase console or build config.

* **App Developer**: Needs consistent Firebase \+ Flutter infra, but wants to focus on features.

* **Tech Lead/Product Owner**: Wants per-client deployments, trust in security/auth consistency.

---

## **2\. Journey Overview**

### **Entry Point**

* User finds **VibeKit Template Repo** (public, well-documented).

* README acts as **front door** → clear, friendly instructions: *"Clone → Configure → New Repo → Vibe."*

### **Setup Flow**

1. **Clone Template** → `git clone https://github.com/nickdnj/vibekit.git`

2. **Configure & Create** → `platform configure` (creates new repository)

3. **Switch to New Repo** → `cd ../my-new-app` (open in Cursor IDE)

4. **Run** → `flutter run`

5. **Ship** → CI/CD pipelines push to selected platforms

### **Daily Use**

* Open **generated repository** in **Cursor IDE**.

* Cursor guided by `.cursorrules` and `/docs` folder keeps dev "in vibe."

* Reference PRD, SAD, UXD, TEST docs for project context.

* Add features with natural prompts → consistent Firebase-backed scaffolds.

---

## **3\. GitHub README (Front-End UX)**

**Tone**: Friendly, empowering, lightweight → “You’re minutes away from vibe coding your next app.”

**Structure**:

1. **Logo \+ Tagline** → *VibeKit: Clone. Configure. Vibe.*

2. **Quickstart** (3 steps) with copy/paste shell commands.

3. **What You Get**: Firebase Auth, Firestore, Storage, Functions, Hosting, Messaging, CI/CD, Cursor rules, MCP integrations.

4. **Configure Flow (Preview)**: App name, bundle IDs, Firebase projects, admin user, branding.

5. **Run Locally**: Emulators, Flutter run.

6. **Deploy**: Web → Hosting, iOS → App Store Connect, Android → Play Console.

7. **Extend with MCP**: PDF, FFmpeg, Graphics, etc.

8. **Philosophy**: No infra headaches, no boilerplate — just vibe coding.

---

## **4\. Configure CLI (UX Flow)**

**Step 1 — GitHub Setup**: Authenticate with GitHub, choose repository name and visibility.  
**Step 2 — Platform Selection**: Choose target platforms (Web, iOS, Android) with tailored configurations.  
**Step 3 — App Identity**: App name, bundle IDs, display name. Auto-renames project files.  
**Step 4 — Firebase Setup**: Google login, project selection, service provisioning based on platforms.  
**Step 5 — Documentation**: Generate `/docs` folder with PRD, SAD, UXD, TEST templates.  
**Step 6 — Branding**: Colors, logo/icon → auto-generate platform-specific assets.  
**Step 7 — Services**: Enable Auth providers, Firestore, Admin Dashboard, platform-specific services.  
**Step 8 — Admin User**: Seed first admin email for immediate access.  
**Step 9 — CI/CD**: Configure GitHub Actions workflows for selected platforms.  
**Step 10 — Repository**: Initialize git, push complete project to new GitHub repository.

**Output**: New independent repository URL \+ next steps (clone and run `flutter run`).

---

## **5\. Interaction Patterns**

* **CLI**: Conversational, emoji-friendly, safe defaults.

* **README**: Clean sections, code blocks, diagrams.

* **Cursor Rules**: Ensure Firebase-first, Riverpod, clean layering.

* **Admin Dashboard**: Standardized role-gated UI in every app.

---

## **6\. Visual Design Elements**

* **Branding**: Bright, minimal, hacker-friendly vibe.

* **README**: Architecture diagram, CLI screenshot.

* **CLI**: Colored prompts (✔ green success, ? blue questions, ⚠ yellow warnings).

---

## **7\. Accessibility**

* **CLI**: Clear text prompts, don’t rely on color alone.

* **README**: Alt text, high-contrast diagrams.

* **Template App**: Default screens meet WCAG contrast and roles.

---

## **8\. Success Criteria**

* **\<10 minutes** clone template → configure → new repository with running app.

* **Repository Independence**: Generated repos are completely self-contained with their own identity.

* **Platform Flexibility**: CI/CD works out-of-the-box for user-selected platforms only.

* **Documentation Complete**: Every repo includes `/docs` folder with project context for Cursor.

* **Cursor Optimization**: `.cursorrules` and documentation enable consistent architectural development.

* **MCP integrations** available as optional enhancements for advanced workflows.

