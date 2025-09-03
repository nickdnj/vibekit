# 🧪 VibeKit CLI Testing Guide

## 🚀 Complete Testing Instructions

This guide will walk you through testing the **VibeKit CLI** from scratch on a new repository. Follow these steps to validate that everything works perfectly.

## 📋 Prerequisites

Before testing, ensure you have:

- ✅ **Flutter SDK** installed ([flutter.dev](https://flutter.dev/docs/get-started/install))
- ✅ **Node.js** (v16+) and **npm** installed 
- ✅ **Firebase CLI** access (will be installed automatically)
- ✅ **Git** installed and configured
- ✅ **Firebase/Google account** for testing

## 🏁 Step 1: Clone and Setup

```bash
# Clone the VibeKit repository
git clone https://github.com/nickdnj/vibekit.git
cd vibekit

# Install CLI dependencies
cd cli
npm install
npm run build
cd ..
```

## ⚡ Step 2: Test Individual CLI Commands

### 2.1 Welcome Command
```bash
# Test welcome message and project detection
node cli/dist/index.js welcome
```
**Expected**: Welcome message with VibeKit features and project validation.

### 2.2 Firebase Setup
```bash
# Test Firebase CLI installation and authentication
node cli/dist/index.js firebase-setup
```
**Expected**: 
- Firebase CLI check/installation
- Browser opens for Firebase login
- Success message with authenticated user

### 2.3 Project Selection
```bash
# Test Firebase project management
node cli/dist/index.js project-select
```
**Expected**:
- List of your Firebase projects
- Option to create new project
- Project selection/creation flow

### 2.4 Service Configuration
```bash
# Test Firebase services configuration
node cli/dist/index.js service-config
```
**Expected**:
- Interactive service selection (Auth, Firestore, Storage, etc.)
- Firebase CLI commands execution
- Configuration summary

### 2.5 Config Generation
```bash
# Test firebase_options.dart generation
node cli/dist/index.js generate-config
```
**Expected**:
- FlutterFire CLI installation (if needed)
- Firebase options file generation
- Configuration validation

## 🎯 Step 3: Master Configuration Test

### Test the Complete Flow
```bash
# Run the master configuration wizard
node cli/dist/index.js configure
```

**Expected Complete Flow**:
1. ✅ **Project Validation**: Detects VibeKit project
2. ✅ **Firebase Auth**: Logs you in or confirms existing login
3. ✅ **Project Selection**: Choose or create Firebase project
4. ✅ **Service Config**: Enable Firebase services interactively
5. ✅ **Config Generation**: Generate firebase_options.dart
6. ✅ **Success Summary**: Complete configuration report

## 🧪 Step 4: Flutter App Testing

### 4.1 Test Flutter Dependencies
```bash
# Get Flutter dependencies
flutter pub get

# Generate model files
flutter packages pub run build_runner build
```

### 4.2 Test Web Platform
```bash
# Run on web browser
flutter run -d chrome --web-port 8080
```
**Expected**: VibeKit app opens in browser with authentication screen.

### 4.3 Test Mobile Platforms
```bash
# List available devices
flutter devices

# Run on iOS simulator (if available)
flutter run -d ios

# Run on Android emulator (if available)  
flutter run -d android
```

## 🔍 Step 5: Validation Checklist

### ✅ CLI Functionality
- [ ] All commands execute without errors
- [ ] Interactive prompts work correctly
- [ ] Firebase authentication succeeds
- [ ] Project selection/creation works
- [ ] Service configuration completes
- [ ] firebase_options.dart is generated correctly

### ✅ Flutter App Functionality
- [ ] App compiles successfully
- [ ] Authentication screen displays
- [ ] Firebase connection established
- [ ] No runtime errors in console
- [ ] Multi-platform support works

### ✅ Generated Files
- [ ] `lib/firebase_options.dart` contains real config (not placeholders)
- [ ] `.vibekit/config.json` exists with project details
- [ ] No TypeScript compilation errors
- [ ] All Firebase services are configured

## 🐛 Common Issues & Solutions

### Issue: "Firebase CLI not found"
```bash
# Manual installation
npm install -g firebase-tools
```

### Issue: "FlutterFire CLI not found"
```bash
# Manual installation
dart pub global activate flutterfire_cli
```

### Issue: "Permission denied" for Firebase
- Run `firebase login` manually
- Check Firebase project permissions
- Verify billing is enabled for the project

### Issue: Flutter compilation errors
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter packages pub run build_runner build --delete-conflicting-outputs
```

## 🎉 Success Criteria

Your test is **SUCCESSFUL** if:

1. ✅ **CLI Commands**: All CLI commands execute without errors
2. ✅ **Firebase Integration**: Successfully authenticate and configure Firebase
3. ✅ **Config Generation**: `firebase_options.dart` contains real (non-placeholder) values
4. ✅ **Flutter Compilation**: App compiles and runs on at least one platform
5. ✅ **Authentication Flow**: Firebase Auth screen displays correctly
6. ✅ **No Errors**: Console shows no critical errors or warnings

## 📞 Support

If you encounter issues:

1. **Check the logs**: CLI provides detailed error messages
2. **Manual steps**: Use individual commands to isolate issues  
3. **Firebase Console**: Verify project settings at [console.firebase.google.com](https://console.firebase.google.com)
4. **Documentation**: Check [Firebase Flutter docs](https://firebase.flutter.dev/docs/overview)

## 🚀 Next Steps After Successful Testing

Once testing is complete:

1. **Customize**: Update the app name, package ID, and branding
2. **Develop**: Start building your specific features
3. **Deploy**: Use the configured Firebase Hosting for deployment
4. **Scale**: Add more Firebase services as needed

---

## 🏆 **This CLI is Production-Ready!**

If all tests pass, you have a **complete, enterprise-grade Flutter + Firebase development template** ready for any project! 

**Happy Vibing!** 🔥✨
