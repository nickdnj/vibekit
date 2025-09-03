# VibeKit

<div align="center">
  <img src="assets/images/vibekit-logo.png" alt="VibeKit Logo" width="300" />
</div>

<div align="center">

**Clone → Configure → New Repo → Vibe.**

*The Firebase-powered Flutter template that creates independent repositories and gets you from idea to app in minutes, not hours.*

[![Flutter](https://img.shields.io/badge/Flutter-3.35.2-blue.svg)](https://flutter.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Powered-orange.svg)](https://firebase.google.com/)
[![Riverpod](https://img.shields.io/badge/State-Riverpod-purple.svg)](https://riverpod.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

[🚀 Quick Start](#-quick-start) • [✨ Features](#-features) • [🏗️ Architecture](#️-architecture) • [📱 Demo](#-demo) • [🤝 Contributing](#-contributing)

</div>

---

## 🎯 What is VibeKit?

VibeKit is a **vibe coding platform** — a GitHub-hosted, Firebase-powered Flutter template designed to let developers go from idea to app **without touching infrastructure**. 

**The fundamental workflow: Clone the VibeKit template, run the configure CLI wizard to create a brand-new repository**, and immediately begin building your app inside **Cursor IDE** with all backend services (Auth, Firestore, Storage, Functions, Hosting, Messaging) pre-wired and ready to go.

**Every configuration creates a completely independent repository** with its own identity, documentation, CI/CD pipelines, and Firebase project — ready for immediate development and deployment.

### 🌟 The Origin Story

VibeKit was born from a moment of clarity inspired by Andrej Karpathy's insights on coding with AI. After 30 years managing infrastructure in the EDA industry at Mentor Graphics, I realized something profound during retirement: **the barrier between idea and app had finally disappeared**.

The perfect storm had arrived: AI-powered coding (Cursor), Firebase's mature backend-as-a-service, Flutter's cross-platform excellence, and Google Workspace integration. For the first time in computing history, you could go from "I have an idea" to "I have an app in the App Store" without thinking about servers, databases, authentication, or deployment pipelines.

VibeKit embodies this realization — **frictionless creativity** where infrastructure becomes invisible and ideas become apps instantly.

### 💰 The Cost Revolution

Here's the game-changer: **if you're already a Google Workspace customer, your app infrastructure is essentially free**.

Firebase services scale beautifully on the free tier for small to medium apps:
- **Authentication**: 50,000+ users/month free
- **Firestore**: 50,000 reads, 20,000 writes/day free  
- **Storage**: 5GB free with 1GB/day transfer
- **Functions**: 2M invocations/month free
- **Hosting**: 10GB storage, 360MB/day transfer free

Your total incremental costs to build and ship apps:
- **Apple Developer Program**: $99/year (for iOS/TestFlight)
- **Google Play Developer**: ~$25 one-time registration
- **Cursor Pro**: ~$20/month (AI-powered coding)

That's it. **Under $150/year** to experiment, build, and deploy production-grade apps with enterprise-level infrastructure. No servers to manage, no DevOps complexity, no infrastructure bills.

### 🚀 The Vision

VibeKit represents a fundamental shift in how we think about app development. This isn't just another template — it's a **creativity amplifier**.

**Clone → Configure → New Repo → Vibe.** 

Every configuration generates a **brand-new repository** that's completely independent of the VibeKit template. Anyone with an idea can get a fully-configured repository with an app into TestFlight or the Play Store in hours, not weeks. Whether you're a solo developer with a side project, a retiree who wants to solve problems you care about, or a small team building client apps, VibeKit eliminates the friction between inspiration and implementation.

We're lowering the barrier to entry for app creation to almost zero. Because the best ideas often come from unexpected places, and they shouldn't die waiting for infrastructure.

### 🎨 Perfect For

- **Solo devs & teams** building multiple productivity/utility apps
- **Startups** needing per-client deployments with consistent infrastructure  
- **Vibe coders** who want to prototype and ship ideas without boilerplate
- **Organizations** leveraging Google Workspace + Firebase who want turnkey app infrastructure

---

## 🚀 Quick Start

### 🎯 **The VibeKit Flow: Template → New Repository**

VibeKit's core workflow creates **independent repositories** for your apps:

1. **Clone the VibeKit template** (this repo)
2. **Run `configure`** to create your new app repository
3. **Switch to your new repo** and start building
4. **Your new repo is completely independent** — deploy, modify, share as you wish

### ⚡ **Easy Mode: Interactive Setup (Recommended)**

```bash
# Step 1: Clone the VibeKit template
git clone https://github.com/nickdnj/vibekit.git
cd vibekit

# Step 2: Run interactive configuration
./test-vibekit.sh
```

**The interactive script will:**
- ✅ Check all prerequisites (Flutter, Node.js, Firebase CLI)
- ✅ Build and install the VibeKit CLI automatically
- ✅ Walk you through creating your new repository
- ✅ Configure Firebase and platform-specific settings
- ✅ Generate a complete, independent project repository

### 🛠️ **Manual Setup**

Create your independent app repository in under 10 minutes:

### 1. Clone VibeKit Template & Setup CLI
```bash
# Clone the template (not your final app repo)
git clone https://github.com/nickdnj/vibekit.git
cd vibekit

# Build the CLI
cd cli && npm install && npm run build && cd ..
```

### 2. Configure & Create Your App Repository
```bash
# Run the configuration wizard (creates new repo)
node cli/dist/index.js configure
```

**This step will:**
- 🔐 Authenticate with GitHub
- 📱 Choose your target platforms (Web/iOS/Android)
- 🏗️ Create a brand-new repository with your app name
- 🔥 Configure Firebase services
- 📚 Generate complete documentation (`/docs` folder)
- ⚙️ Setup CI/CD pipelines for your chosen platforms
- 🚀 Push the complete project to your new repository

### 3. Switch to Your New Repository
```bash
# Navigate to your newly created app repository
cd ../my-awesome-app  # (or whatever you named it)

# Setup Flutter dependencies
flutter pub get
flutter packages pub run build_runner build

# Run your independent app
flutter run -d chrome --web-port 8080  # Web
flutter run                           # Mobile (iOS/Android)
```

### 4. Start Vibing in Your New Repo! 🎉
Open your **new repository** in **Cursor IDE** and let the included `.cursorrules` and `/docs` folder guide your development flow.

---

## ✨ Features

### 🔥 **Firebase-First Architecture**
- **Authentication**: Email/Password + Google Sign-In + Apple Sign-In
- **Database**: Firestore with optimized security rules and indexes
- **Storage**: Cloud Storage with automatic file management
- **Functions**: Serverless backend APIs ready for extension
- **Hosting**: Deploy to Firebase Hosting with one command
- **Analytics**: User behavior tracking out of the box
- **Messaging**: Push notifications ready to go

### 🎛️ **State Management & Architecture**
- **Riverpod**: Modern, type-safe state management
- **Clean Architecture**: Layered structure (UI → Providers → Repositories → Services)
- **Code Generation**: Freezed models with JSON serialization
- **Type Safety**: Fully typed with null safety

### 🔐 **Security & Admin**
- **Role-Based Access**: User/Admin roles with Firebase custom claims
- **Admin Dashboard**: Built-in user management interface
- **Security Rules**: Production-ready Firestore and Storage rules
- **App Check**: Client validation and abuse prevention

### 🎨 **Modern UI/UX**
- **Material 3**: Latest Material Design with custom theming
- **Responsive**: Works perfectly on Web, iOS, and Android
- **Dark Mode**: Automatic theme switching
- **Accessibility**: WCAG compliant components

### 🛠️ **Developer Experience**
- **Cursor Integration**: `.cursorrules` for AI-assisted development
- **Hot Reload**: Lightning-fast development cycles
- **Code Generation**: Automated boilerplate generation
- **Linting**: Consistent code style enforcement

### 🚀 **Deployment Ready**
- **CI/CD**: GitHub Actions for automated deployment
- **Multi-Platform**: Web → Firebase Hosting, iOS → App Store, Android → Play Store
- **Environment Management**: Dev/staging/production configurations

---

## 🏗️ Architecture

VibeKit follows Clean Architecture principles with unidirectional data flow:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │───▶│   Application   │───▶│  Infrastructure │
│                 │    │                 │    │                 │
│ • Widgets       │    │ • Providers     │    │ • Repositories  │
│ • Screens       │    │ • State Mgmt    │    │ • Services      │
│ • Components    │    │ • Business Logic│    │ • Firebase SDKs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📁 Project Structure
```
lib/
├── core/
│   ├── models/          # Data models (Freezed + JSON)
│   ├── providers/       # Riverpod providers
│   ├── repositories/    # Data access layer
│   └── services/        # Business logic layer
├── features/
│   ├── auth/           # Authentication flow
│   ├── admin/          # Admin dashboard
│   ├── tasks/          # Example CRUD feature
│   └── media/          # File upload/management
└── firebase_options.dart # Firebase configuration
```

---

## 📱 Demo

### Authentication Flow
- Beautiful sign-in/sign-up screens
- Google Sign-In integration
- Password reset functionality
- Role-based navigation

### Dashboard
- Welcome screen with user stats
- Quick actions and navigation
- Admin panel access (role-gated)
- Beautiful Material 3 design

### Admin Features
- User management interface
- Role assignment capabilities
- System administration tools

---

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication, Firestore, Storage, and Hosting
3. Download configuration files
4. Run the VibeKit CLI configure wizard (coming soon)

### Cursor IDE Integration
VibeKit includes `.cursorrules` that enable AI-assisted development:

```yaml
# Automatically enforces:
- Firebase-first backend usage
- Riverpod state management patterns  
- Clean architecture principles
- Consistent code scaffolding
```

---

## 🚧 Roadmap

### ✅ **Completed**
- [x] Firebase integration with all core services
- [x] Authentication system (Email + Google)
- [x] Riverpod state management setup
- [x] Clean architecture implementation
- [x] Admin dashboard foundation
- [x] Security rules and indexes

### 🔄 **In Progress**
- [ ] CLI configuration tool
- [ ] Tasks CRUD implementation
- [ ] Media upload functionality
- [ ] CI/CD workflows

### 🎯 **Coming Soon**
- [ ] MCP server integrations (PDF, FFmpeg, Graphics)
- [ ] App Store Connect deployment
- [ ] Google Play Console automation
- [ ] Template variants (task manager, notes, chat)
- [ ] Mason/Yeoman generators

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Community & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/nickdnj/vibekit/issues)
- **Discussions**: [Join the community](https://github.com/nickdnj/vibekit/discussions)
- **Documentation**: [Full docs](https://vibekit.dev) (coming soon)

---

## 🎯 **The Repository Creation Advantage**

**Why VibeKit creates new repositories instead of just configuring templates:**

✅ **Complete Independence**: Your app gets its own identity, history, and evolution  
✅ **Custom Documentation**: `/docs` folder with PRD, SAD, UXD, TEST tailored to your project  
✅ **Platform-Specific CI/CD**: Only the workflows you need for your chosen platforms  
✅ **Clean Git History**: Start fresh without VibeKit template commits  
✅ **Easy Sharing**: Share your repository without VibeKit baggage  
✅ **Multiple Projects**: Create unlimited apps from one VibeKit template  

**This means:** Every `configure` run creates a production-ready repository that you can immediately share, deploy, or develop — completely independent of VibeKit.

---

<div align="center">

**Built with ❤️ for the vibe coding community**

*VibeKit - Where ideas become independent repositories, and infrastructure becomes invisible.*

[⭐ Star the Template](https://github.com/nickdnj/vibekit) • [🚀 Create Your First App](https://github.com/nickdnj/vibekit#-quick-start) • [📚 Read the Docs](https://github.com/nickdnj/vibekit/tree/main/docs)

</div>