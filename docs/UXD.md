# **UX Design Document for VibeKit**

---

## **1\. User Personas**

* **Vibe Coder**: Wants to turn an idea into a running app fast, without touching Firebase console or build config.

* **App Developer**: Needs consistent Firebase \+ Flutter infra, but wants to focus on features.

* **Tech Lead/Product Owner**: Wants per-client deployments, trust in security/auth consistency.

---

## **2\. Journey Overview**

### **Entry Point**

* User finds **GitHub Repo** (public, well-documented).

* README acts as **front door** → clear, friendly instructions: *“Clone, Configure, Vibe.”*

### **Setup Flow**

1. **Clone** → `git clone ...`

2. **Configure** → `platform configure`

3. **Run** → `flutter run`

4. **Ship** → CI/CD pipelines push to Hosting / TestFlight / Play Store

### **Daily Use**

* Open repo in **Cursor IDE**.

* Cursor guided by `.cursorrules` keeps dev “in vibe.”

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

**Step 1 — Identity**: App name, bundle IDs. Auto-renames project.  
 **Step 2 — Firebase Setup**: Google login, project selection, service provisioning, `firebase_options.dart`.  
 **Step 3 — Branding**: Colors, logo/icon → auto-generate splash \+ icons.  
 **Step 4 — Services**: Enable Auth providers, Firestore, Admin Dashboard, MCP modules.  
 **Step 5 — Admin User**: Seed first admin email.  
 **Step 6 — CI/CD**: Collect Apple/Google credentials → inject into GitHub Actions secrets.

**Output**: Confirmation summary \+ next steps (run `flutter run`).

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

* **\<10 minutes** clone → configure → running app.

* **CI/CD** works out-of-the-box for all platforms.

* **Cursor** enforces architectural consistency.

* **MCP integrations** available with one command.

