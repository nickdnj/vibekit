\# .cursorrules  
\# Cursor coding rules for VibeKit – The Vibe Coding Platform

version: 1  
name: VibeKit Rules

guidelines:  
  \- Always assume Firebase is the backend (Auth, Firestore, Storage, Functions, Hosting).  
  \- Never suggest building custom auth, DB, or server unless explicitly asked.  
  \- Use Flutter \+ Dart for all client code (iOS, Android, Web).  
  \- Use Riverpod for state management (no Provider, no BLoC unless specified).  
  \- Maintain clean architecture:  
    \- UI → State Providers → Repository → Service → Firebase SDK.  
  \- For admin features:  
    \- Use Firebase custom claims (\`admin: true\`) to gate access.  
    \- Place admin UI under \`/admin\` route.  
  \- For device features (camera, mic, location):  
    \- Use Flutter plugins and wrap them in a \`DeviceService\`.  
  \- For API/MCP integrations:  
    \- Expose new functionality via Firebase Functions HTTPS endpoints.  
    \- Default format: \`/api/v1/\<module\>/\<action\>\`.  
  \- CI/CD:  
    \- iOS → Fastlane \+ App Store Connect.  
    \- Android → Gradle Play Publisher \+ Play Console.  
    \- Web → Firebase Hosting.

file\_conventions:  
  \- All services in \`lib/core/services/\`.  
  \- All repositories in \`lib/core/repositories/\`.  
  \- All Riverpod providers in \`lib/core/providers/\`.  
  \- Features in \`lib/features/\<feature\_name\>/\`.  
  \- Firebase config in \`lib/firebase\_options.dart\`.  
  \- Security rules in \`firebase/firestore.rules\` and \`firebase/storage.rules\`.

code\_style:  
  \- Follow Dart/Flutter effective style guide.  
  \- Use \`AsyncValue\` for async state in Riverpod.  
  \- Always prefer immutable data models.  
  \- Use \`freezed\` and \`json\_serializable\` for data classes.

scaffolds:  
  \- “Add CRUD feature” → generate:  
    \- Firestore collection schema.  
    \- Repository \+ Service.  
    \- Riverpod provider.  
    \- UI: list \+ detail \+ edit screens.  
  \- “Add Auth” → generate sign-in/sign-up screen using Firebase Auth.  
  \- “Add Admin” → generate admin dashboard gated by \`admin\` claim.

restricted:  
  \- Do not suggest non-Firebase backends.  
  \- Do not implement state management other than Riverpod unless user overrides.  
  \- Do not bypass Firebase security rules.

