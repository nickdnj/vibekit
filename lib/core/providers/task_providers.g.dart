// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task_providers.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

String _$taskRepositoryHash() => r'ebb05d0c7068b79e4d615c5e5ce6aa58b1edd9d9';

/// Task repository provider
///
/// Copied from [taskRepository].
@ProviderFor(taskRepository)
final taskRepositoryProvider = AutoDisposeProvider<TaskRepository>.internal(
  taskRepository,
  name: r'taskRepositoryProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$taskRepositoryHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef TaskRepositoryRef = AutoDisposeProviderRef<TaskRepository>;
String _$userTasksHash() => r'b8b2fb8944225949ff5aa58401ef0b9b93c1d174';

/// User tasks provider - streams all tasks for current user
///
/// Copied from [userTasks].
@ProviderFor(userTasks)
final userTasksProvider = AutoDisposeStreamProvider<List<TaskModel>>.internal(
  userTasks,
  name: r'userTasksProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$userTasksHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef UserTasksRef = AutoDisposeStreamProviderRef<List<TaskModel>>;
String _$userTasksByStatusHash() => r'da3e7e7b33a15510870354d7087ed89b6274c19b';

/// Copied from Dart SDK
class _SystemHash {
  _SystemHash._();

  static int combine(int hash, int value) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + value);
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x0007ffff & hash) << 10));
    return hash ^ (hash >> 6);
  }

  static int finish(int hash) {
    // ignore: parameter_assignments
    hash = 0x1fffffff & (hash + ((0x03ffffff & hash) << 3));
    // ignore: parameter_assignments
    hash = hash ^ (hash >> 11);
    return 0x1fffffff & (hash + ((0x00003fff & hash) << 15));
  }
}

/// User tasks by status provider
///
/// Copied from [userTasksByStatus].
@ProviderFor(userTasksByStatus)
const userTasksByStatusProvider = UserTasksByStatusFamily();

/// User tasks by status provider
///
/// Copied from [userTasksByStatus].
class UserTasksByStatusFamily extends Family<AsyncValue<List<TaskModel>>> {
  /// User tasks by status provider
  ///
  /// Copied from [userTasksByStatus].
  const UserTasksByStatusFamily();

  /// User tasks by status provider
  ///
  /// Copied from [userTasksByStatus].
  UserTasksByStatusProvider call(String status) {
    return UserTasksByStatusProvider(status);
  }

  @override
  UserTasksByStatusProvider getProviderOverride(
    covariant UserTasksByStatusProvider provider,
  ) {
    return call(provider.status);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'userTasksByStatusProvider';
}

/// User tasks by status provider
///
/// Copied from [userTasksByStatus].
class UserTasksByStatusProvider
    extends AutoDisposeStreamProvider<List<TaskModel>> {
  /// User tasks by status provider
  ///
  /// Copied from [userTasksByStatus].
  UserTasksByStatusProvider(String status)
    : this._internal(
        (ref) => userTasksByStatus(ref as UserTasksByStatusRef, status),
        from: userTasksByStatusProvider,
        name: r'userTasksByStatusProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$userTasksByStatusHash,
        dependencies: UserTasksByStatusFamily._dependencies,
        allTransitiveDependencies:
            UserTasksByStatusFamily._allTransitiveDependencies,
        status: status,
      );

  UserTasksByStatusProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.status,
  }) : super.internal();

  final String status;

  @override
  Override overrideWith(
    Stream<List<TaskModel>> Function(UserTasksByStatusRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: UserTasksByStatusProvider._internal(
        (ref) => create(ref as UserTasksByStatusRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        status: status,
      ),
    );
  }

  @override
  AutoDisposeStreamProviderElement<List<TaskModel>> createElement() {
    return _UserTasksByStatusProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is UserTasksByStatusProvider && other.status == status;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, status.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin UserTasksByStatusRef on AutoDisposeStreamProviderRef<List<TaskModel>> {
  /// The parameter `status` of this provider.
  String get status;
}

class _UserTasksByStatusProviderElement
    extends AutoDisposeStreamProviderElement<List<TaskModel>>
    with UserTasksByStatusRef {
  _UserTasksByStatusProviderElement(super.provider);

  @override
  String get status => (origin as UserTasksByStatusProvider).status;
}

String _$taskHash() => r'fff080ac2eff3b6a98028761fc9e6a7c42a15f67';

/// Single task provider
///
/// Copied from [task].
@ProviderFor(task)
const taskProvider = TaskFamily();

/// Single task provider
///
/// Copied from [task].
class TaskFamily extends Family<AsyncValue<TaskModel?>> {
  /// Single task provider
  ///
  /// Copied from [task].
  const TaskFamily();

  /// Single task provider
  ///
  /// Copied from [task].
  TaskProvider call(String taskId) {
    return TaskProvider(taskId);
  }

  @override
  TaskProvider getProviderOverride(covariant TaskProvider provider) {
    return call(provider.taskId);
  }

  static const Iterable<ProviderOrFamily>? _dependencies = null;

  @override
  Iterable<ProviderOrFamily>? get dependencies => _dependencies;

  static const Iterable<ProviderOrFamily>? _allTransitiveDependencies = null;

  @override
  Iterable<ProviderOrFamily>? get allTransitiveDependencies =>
      _allTransitiveDependencies;

  @override
  String? get name => r'taskProvider';
}

/// Single task provider
///
/// Copied from [task].
class TaskProvider extends AutoDisposeFutureProvider<TaskModel?> {
  /// Single task provider
  ///
  /// Copied from [task].
  TaskProvider(String taskId)
    : this._internal(
        (ref) => task(ref as TaskRef, taskId),
        from: taskProvider,
        name: r'taskProvider',
        debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
            ? null
            : _$taskHash,
        dependencies: TaskFamily._dependencies,
        allTransitiveDependencies: TaskFamily._allTransitiveDependencies,
        taskId: taskId,
      );

  TaskProvider._internal(
    super._createNotifier, {
    required super.name,
    required super.dependencies,
    required super.allTransitiveDependencies,
    required super.debugGetCreateSourceHash,
    required super.from,
    required this.taskId,
  }) : super.internal();

  final String taskId;

  @override
  Override overrideWith(
    FutureOr<TaskModel?> Function(TaskRef provider) create,
  ) {
    return ProviderOverride(
      origin: this,
      override: TaskProvider._internal(
        (ref) => create(ref as TaskRef),
        from: from,
        name: null,
        dependencies: null,
        allTransitiveDependencies: null,
        debugGetCreateSourceHash: null,
        taskId: taskId,
      ),
    );
  }

  @override
  AutoDisposeFutureProviderElement<TaskModel?> createElement() {
    return _TaskProviderElement(this);
  }

  @override
  bool operator ==(Object other) {
    return other is TaskProvider && other.taskId == taskId;
  }

  @override
  int get hashCode {
    var hash = _SystemHash.combine(0, runtimeType.hashCode);
    hash = _SystemHash.combine(hash, taskId.hashCode);

    return _SystemHash.finish(hash);
  }
}

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
mixin TaskRef on AutoDisposeFutureProviderRef<TaskModel?> {
  /// The parameter `taskId` of this provider.
  String get taskId;
}

class _TaskProviderElement extends AutoDisposeFutureProviderElement<TaskModel?>
    with TaskRef {
  _TaskProviderElement(super.provider);

  @override
  String get taskId => (origin as TaskProvider).taskId;
}

String _$allTasksHash() => r'7970ef936c603269310bd0deaca629c3675b6e48';

/// All tasks provider (admin only)
///
/// Copied from [allTasks].
@ProviderFor(allTasks)
final allTasksProvider = AutoDisposeStreamProvider<List<TaskModel>>.internal(
  allTasks,
  name: r'allTasksProvider',
  debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
      ? null
      : _$allTasksHash,
  dependencies: null,
  allTransitiveDependencies: null,
);

@Deprecated('Will be removed in 3.0. Use Ref instead')
// ignore: unused_element
typedef AllTasksRef = AutoDisposeStreamProviderRef<List<TaskModel>>;
String _$taskCreatorHash() => r'110f27c882e56f8d92edc3563bb9efb37c4728e6';

/// Task creation provider
///
/// Copied from [TaskCreator].
@ProviderFor(TaskCreator)
final taskCreatorProvider =
    AutoDisposeAsyncNotifierProvider<TaskCreator, TaskModel?>.internal(
      TaskCreator.new,
      name: r'taskCreatorProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$taskCreatorHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$TaskCreator = AutoDisposeAsyncNotifier<TaskModel?>;
String _$taskUpdaterHash() => r'c0ce09eeb3f782f061d1a69f252143484b45ff8c';

/// Task updater provider
///
/// Copied from [TaskUpdater].
@ProviderFor(TaskUpdater)
final taskUpdaterProvider =
    AutoDisposeAsyncNotifierProvider<TaskUpdater, TaskModel?>.internal(
      TaskUpdater.new,
      name: r'taskUpdaterProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$taskUpdaterHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$TaskUpdater = AutoDisposeAsyncNotifier<TaskModel?>;
String _$taskDeleterHash() => r'c222293499499ca8d92468d423ecab7c8d766495';

/// Task deleter provider
///
/// Copied from [TaskDeleter].
@ProviderFor(TaskDeleter)
final taskDeleterProvider =
    AutoDisposeAsyncNotifierProvider<TaskDeleter, bool>.internal(
      TaskDeleter.new,
      name: r'taskDeleterProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$taskDeleterHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$TaskDeleter = AutoDisposeAsyncNotifier<bool>;
String _$taskSearcherHash() => r'377bbf00036c347108300f64229c78e1d957625d';

/// Task search provider
///
/// Copied from [TaskSearcher].
@ProviderFor(TaskSearcher)
final taskSearcherProvider =
    AutoDisposeAsyncNotifierProvider<TaskSearcher, List<TaskModel>>.internal(
      TaskSearcher.new,
      name: r'taskSearcherProvider',
      debugGetCreateSourceHash: const bool.fromEnvironment('dart.vm.product')
          ? null
          : _$taskSearcherHash,
      dependencies: null,
      allTransitiveDependencies: null,
    );

typedef _$TaskSearcher = AutoDisposeAsyncNotifier<List<TaskModel>>;
// ignore_for_file: type=lint
// ignore_for_file: subtype_of_sealed_class, invalid_use_of_internal_member, invalid_use_of_visible_for_testing_member, deprecated_member_use_from_same_package
