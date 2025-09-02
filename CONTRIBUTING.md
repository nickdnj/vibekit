# Contributing to VibeKit

We love your input! We want to make contributing to VibeKit as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Development Setup

1. **Prerequisites**
   - Flutter 3.35.2 or later
   - Dart 3.9.0 or later
   - Node.js 18+ (for CLI tool)
   - Firebase CLI

2. **Setup**
   ```bash
   git clone https://github.com/nickdnj/vibekit.git
   cd vibekit
   flutter pub get
   dart run build_runner build
   ```

3. **Running the app**
   ```bash
   flutter run -d chrome  # Web
   flutter run             # Mobile
   ```

### Code Style

- Follow the [Dart Style Guide](https://dart.dev/guides/language/effective-dart/style)
- Use the provided `.cursorrules` for consistency
- Run `flutter analyze` before submitting
- Use meaningful commit messages

### Architecture Guidelines

VibeKit follows Clean Architecture principles:

- **Presentation Layer**: Widgets, screens, and UI components
- **Application Layer**: Riverpod providers and business logic
- **Data Layer**: Repositories and services
- **Infrastructure**: Firebase SDKs and external APIs

### Coding Conventions

1. **State Management**: Use Riverpod for all state management
2. **Data Models**: Use Freezed for immutable data classes
3. **Backend**: Firebase-first approach, no custom backends
4. **File Organization**: Follow the established folder structure
5. **Naming**: Use descriptive names and follow Dart conventions

### Firebase Integration

- All backend functionality must use Firebase services
- Security rules must be production-ready
- Use Firebase best practices for performance
- Document any new Firebase service integrations

## Bug Reports

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/nickdnj/vibekit/issues/new).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

Feature requests are welcome! Please:

1. Check if the feature has already been requested
2. Clearly describe the feature and its use case
3. Consider if it fits with VibeKit's goals
4. Be willing to help implement if possible

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Community

- Join our [GitHub Discussions](https://github.com/nickdnj/vibekit/discussions)
- Follow us on [Twitter](https://twitter.com/vibekit)
- Check out our [documentation](https://vibekit.dev) (coming soon)

## Recognition

Contributors will be recognized in our README and release notes. Thank you for making VibeKit better! 🚀
