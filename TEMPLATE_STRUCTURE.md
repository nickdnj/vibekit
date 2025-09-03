# **VibeKit Template Structure Plan**

This document outlines the template directory structure needed to support repository generation with platform-specific configurations.

---

## **📁 Proposed Template Directory Structure**

```
templates/
├── app/                           # Core Flutter app templates
│   ├── lib/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   ├── user_model.dart.mustache
│   │   │   │   ├── task_model.dart.mustache
│   │   │   │   └── media_model.dart.mustache
│   │   │   ├── providers/
│   │   │   │   ├── firebase_providers.dart.mustache
│   │   │   │   ├── task_providers.dart.mustache
│   │   │   │   └── user_providers.dart.mustache
│   │   │   ├── repositories/
│   │   │   │   ├── task_repository.dart.mustache
│   │   │   │   ├── media_repository.dart.mustache
│   │   │   │   └── user_repository.dart.mustache
│   │   │   └── services/
│   │   │       ├── firebase_service.dart.mustache
│   │   │       └── auth_service.dart.mustache
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   └── presentation/
│   │   │   │       ├── auth_screen.dart.mustache
│   │   │   │       └── splash_screen.dart.mustache
│   │   │   ├── admin/
│   │   │   │   └── presentation/
│   │   │   │       └── admin_screen.dart.mustache
│   │   │   ├── home/
│   │   │   │   └── presentation/
│   │   │   │       └── home_screen.dart.mustache
│   │   │   └── tasks/
│   │   │       └── presentation/
│   │   │           └── tasks_screen.dart.mustache
│   │   ├── firebase_options.dart.mustache
│   │   └── main.dart.mustache
│   ├── firebase/
│   │   ├── firestore.rules.mustache
│   │   ├── firestore.indexes.json.mustache
│   │   └── storage.rules.mustache
│   ├── pubspec.yaml.mustache
│   ├── analysis_options.yaml
│   └── README.md.mustache
│
├── platform/                     # Platform-specific templates
│   ├── web/
│   │   ├── web/
│   │   │   ├── index.html.mustache
│   │   │   ├── manifest.json.mustache
│   │   │   └── favicon.png
│   │   └── .github/
│   │       └── workflows/
│   │           └── deploy-web.yml.mustache
│   ├── ios/
│   │   ├── ios/
│   │   │   ├── Runner/
│   │   │   │   ├── Info.plist.mustache
│   │   │   │   └── AppDelegate.swift.mustache
│   │   │   └── Runner.xcodeproj/
│   │   │       └── project.pbxproj.mustache
│   │   ├── .github/
│   │   │   └── workflows/
│   │   │       └── deploy-ios.yml.mustache
│   │   └── fastlane/
│   │       ├── Fastfile.mustache
│   │       └── Appfile.mustache
│   └── android/
│       ├── android/
│       │   ├── app/
│       │   │   ├── build.gradle.mustache
│       │   │   └── src/
│       │   │       └── main/
│       │   │           ├── AndroidManifest.xml.mustache
│       │   │           └── kotlin/
│       │   │               └── MainActivity.kt.mustache
│       │   └── build.gradle.mustache
│       └── .github/
│           └── workflows/
│               └── deploy-android.yml.mustache
│
├── docs/                         # Documentation templates
│   ├── PRD.md.mustache
│   ├── SAD.md.mustache
│   ├── UXD.md.mustache
│   └── TEST.md.mustache
│
├── config/                       # Configuration templates
│   ├── .cursorrules.mustache
│   ├── .gitignore
│   ├── LICENSE.mustache
│   └── CONTRIBUTING.md.mustache
│
└── assets/                       # Asset templates
    └── images/
        ├── app-icon-template.png
        └── splash-template.png
```

---

## **🔧 Template Variables**

### **App Identity Variables**
```json
{
  "appName": "My Awesome App",
  "appNameKebab": "my-awesome-app",
  "appNameCamel": "myAwesomeApp",
  "appNamePascal": "MyAwesomeApp",
  "appDescription": "A Flutter app built with VibeKit",
  "bundleId": "com.example.myawesomeapp",
  "appVersion": "1.0.0",
  "appBuildNumber": "1"
}
```

### **Platform Variables**
```json
{
  "platforms": {
    "web": true,
    "ios": false,
    "android": true
  },
  "webConfig": {
    "deployToHosting": true,
    "pwaEnabled": true
  },
  "iosConfig": {
    "teamId": "ABC123DEF4",
    "deployToAppStore": true
  },
  "androidConfig": {
    "packageName": "com.example.myawesomeapp",
    "deployToPlayStore": true
  }
}
```

### **Firebase Variables**
```json
{
  "firebase": {
    "projectId": "my-awesome-app-12345",
    "apiKey": "AIza...",
    "authDomain": "my-awesome-app-12345.firebaseapp.com",
    "storageBucket": "my-awesome-app-12345.appspot.com",
    "messagingSenderId": "123456789012",
    "appId": "1:123456789012:web:abc123def456",
    "measurementId": "G-ABCDEF1234"
  },
  "services": {
    "auth": true,
    "firestore": true,
    "storage": true,
    "functions": false,
    "hosting": true,
    "analytics": true,
    "messaging": false
  }
}
```

### **Repository Variables**
```json
{
  "repository": {
    "name": "my-awesome-app",
    "description": "A Flutter app built with VibeKit",
    "owner": "username",
    "private": false,
    "url": "https://github.com/username/my-awesome-app"
  },
  "author": {
    "name": "John Doe", 
    "email": "john@example.com",
    "github": "johndoe"
  }
}
```

---

## **📋 Implementation Checklist**

### **Phase 1: Template Structure Setup**
- [ ] Create `templates/` directory structure
- [ ] Move existing files to `templates/app/` with `.mustache` extensions
- [ ] Add Mustache variable placeholders to all template files
- [ ] Create platform-specific template variations
- [ ] Add documentation templates with variable injection

### **Phase 2: Template Engine Integration**
- [ ] Install and configure Mustache templating engine
- [ ] Create template processing utilities
- [ ] Add variable validation and sanitization
- [ ] Implement conditional template rendering (platform-specific)
- [ ] Add template testing and validation

### **Phase 3: Platform-Specific Templates**
- [ ] **Web Templates**
  - Update `index.html` with app-specific metadata
  - Configure PWA settings in `manifest.json`
  - Create Firebase Hosting deployment workflow
  
- [ ] **iOS Templates** 
  - Update `Info.plist` with app identity
  - Configure Xcode project settings
  - Create App Store Connect deployment workflow
  
- [ ] **Android Templates**
  - Update `AndroidManifest.xml` with app identity
  - Configure Gradle build settings
  - Create Play Console deployment workflow

### **Phase 4: Documentation Templates**
- [ ] Convert PRD to template with app-specific context
- [ ] Update SAD to reflect selected platform architectures
- [ ] Customize UXD for chosen platform experiences
- [ ] Tailor TEST strategy to selected platforms

### **Phase 5: Configuration Templates**
- [ ] Template-ize `.cursorrules` with app context
- [ ] Create app-specific `pubspec.yaml` with conditional dependencies
- [ ] Generate `firebase_options.dart` with real Firebase config
- [ ] Add platform-conditional build configurations

---

## **🔄 Template Processing Flow**

1. **User Input Collection**
   - App name, description, bundle ID
   - Platform selection (Web, iOS, Android)
   - Firebase project configuration
   - Repository details (name, visibility, description)

2. **Variable Generation**
   - Generate all name variations (kebab, camel, pascal)
   - Create platform-specific configuration objects
   - Collect Firebase service configurations
   - Prepare repository and author metadata

3. **Template Processing**
   - Process base app templates with variables
   - Add platform-specific templates for selected platforms only
   - Generate documentation with app-specific context
   - Create CI/CD workflows for active platforms only

4. **File Generation**
   - Create temporary directory with processed templates
   - Validate generated files for syntax and completeness
   - Initialize git repository with generated content
   - Push to newly created GitHub repository

---

## **🎯 Expected Benefits**

### **Platform Efficiency**
- Generated repos contain only files needed for selected platforms
- CI/CD workflows are tailored to chosen deployment targets
- Dependencies are optimized for active platforms only

### **Documentation Accuracy**
- Project docs reflect actual app requirements and architecture
- Cursor AI has accurate context for code generation
- Developer onboarding is streamlined with precise documentation

### **Repository Independence**
- Each generated repo is completely self-contained
- No VibeKit template baggage or irrelevant configurations
- Clean git history starting from first commit of actual app

### **Developer Experience**
- Immediate productivity with platform-specific setup
- Accurate documentation for Cursor AI assistance
- Ready-to-deploy CI/CD pipelines from day one
