import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/user_model.dart';
import '../../../core/providers/firebase_providers.dart';
import '../../../core/providers/user_providers.dart';

class AdminScreen extends ConsumerStatefulWidget {
  const AdminScreen({super.key});

  @override
  ConsumerState<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends ConsumerState<AdminScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isAdmin = ref.watch(isAdminProvider);

    return isAdmin.when(
      data: (admin) {
        if (!admin) {
          return const Scaffold(
            body: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.security,
                    size: 64,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Access Denied',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'You need admin privileges to access this area.',
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: const Text('Admin Dashboard'),
            backgroundColor: Theme.of(context).colorScheme.inversePrimary,
            bottom: TabBar(
              controller: _tabController,
              tabs: const [
                Tab(icon: Icon(Icons.dashboard), text: 'Overview'),
                Tab(icon: Icon(Icons.people), text: 'Users'),
                Tab(icon: Icon(Icons.settings), text: 'Settings'),
              ],
            ),
          ),
          body: TabBarView(
            controller: _tabController,
            children: [
              _buildOverviewTab(),
              _buildUsersTab(),
              _buildSettingsTab(),
            ],
          ),
        );
      },
      loading: () => const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      ),
      error: (error, stack) => Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              Text('Error: $error'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'System Overview',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildStatCard(),
                _buildQuickActionsCard(),
                _buildRecentActivityCard(),
                _buildSystemHealthCard(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard() {
    final statsAsync = ref.watch(userStatisticsProvider);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.people,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                const Text(
                  'User Statistics',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: statsAsync.when(
                data: (stats) => Column(
                  children: [
                    _buildStatRow('Total Users', stats['total']?.toString() ?? '0'),
                    _buildStatRow('Admins', stats['admins']?.toString() ?? '0'),
                    _buildStatRow('Regular Users', stats['users']?.toString() ?? '0'),
                    _buildStatRow('Inactive', stats['inactive']?.toString() ?? '0'),
                  ],
                ),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (error, _) => Center(
                  child: Text('Error: $error'),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionsCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.flash_on,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Quick Actions',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () => _tabController.animateTo(1),
                      icon: const Icon(Icons.person_add),
                      label: const Text('Manage Users'),
                    ),
                  ),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // Refresh stats
                        ref.invalidate(userStatisticsProvider);
                      },
                      icon: const Icon(Icons.refresh),
                      label: const Text('Refresh Data'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentActivityCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.history,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                const Text(
                  'Recent Activity',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Expanded(
              child: Center(
                child: Text(
                  'Activity tracking\ncoming soon!',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.grey),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSystemHealthCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.health_and_safety,
                  color: Theme.of(context).colorScheme.primary,
                ),
                const SizedBox(width: 8),
                const Text(
                  'System Health',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Expanded(
              child: Column(
                children: [
                  _buildHealthIndicator('Firebase', true),
                  _buildHealthIndicator('Authentication', true),
                  _buildHealthIndicator('Firestore', true),
                  _buildHealthIndicator('Storage', true),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthIndicator(String service, bool isHealthy) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Icon(
            isHealthy ? Icons.check_circle : Icons.error,
            color: isHealthy ? Colors.green : Colors.red,
            size: 16,
          ),
          const SizedBox(width: 8),
          Text(service),
        ],
      ),
    );
  }

  Widget _buildUsersTab() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Search Bar
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search users by email or name...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      onPressed: () {
                        _searchController.clear();
                        ref.read(userSearchQueryProvider.notifier).state = '';
                      },
                      icon: const Icon(Icons.clear),
                    )
                  : null,
            ),
            onChanged: (value) {
              ref.read(userSearchQueryProvider.notifier).state = value;
            },
          ),
          const SizedBox(height: 16),
          
          // Users List
          Expanded(
            child: _buildUsersList(),
          ),
        ],
      ),
    );
  }

  Widget _buildUsersList() {
    final searchQuery = ref.watch(userSearchQueryProvider);
    
    if (searchQuery.isNotEmpty) {
      // Show search results
      final searchResults = ref.watch(searchUsersProvider(searchQuery));
      return searchResults.when(
        data: (users) => _buildUsersDataTable(users),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      );
    } else {
      // Show all users
      final allUsers = ref.watch(allUsersProvider);
      return allUsers.when(
        data: (users) => _buildUsersDataTable(users),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => Center(child: Text('Error: $error')),
      );
    }
  }

  Widget _buildUsersDataTable(List<UserModel> users) {
    return SingleChildScrollView(
      child: DataTable(
        columns: const [
          DataColumn(label: Text('User')),
          DataColumn(label: Text('Email')),
          DataColumn(label: Text('Role')),
          DataColumn(label: Text('Created')),
          DataColumn(label: Text('Actions')),
        ],
        rows: users.map((user) => DataRow(
          cells: [
            DataCell(
              Row(
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: Theme.of(context).colorScheme.primary,
                    child: Text(
                      user.displayName?.isNotEmpty == true 
                          ? user.displayName![0].toUpperCase()
                          : user.email[0].toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        user.displayName ?? 'No name',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        user.uid,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            DataCell(Text(user.email)),
            DataCell(
              Chip(
                label: Text(user.userRole.name.toUpperCase()),
                backgroundColor: _getRoleColor(user.userRole),
                labelStyle: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            DataCell(
              Text(
                '${user.createdAt.day}/${user.createdAt.month}/${user.createdAt.year}',
              ),
            ),
            DataCell(
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    onPressed: () => _showUserDetailsDialog(user),
                    icon: const Icon(Icons.visibility),
                    tooltip: 'View Details',
                  ),
                  IconButton(
                    onPressed: () => _showChangeRoleDialog(user),
                    icon: const Icon(Icons.edit),
                    tooltip: 'Change Role',
                  ),
                ],
              ),
            ),
          ],
        )).toList(),
      ),
    );
  }

  Color _getRoleColor(UserRole role) {
    switch (role) {
      case UserRole.admin:
        return Colors.red;
      case UserRole.user:
        return Colors.blue;
      case UserRole.inactive:
        return Colors.grey;
    }
  }

  void _showUserDetailsDialog(UserModel user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('User Details: ${user.displayName ?? 'No name'}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDetailRow('UID', user.uid),
            _buildDetailRow('Email', user.email),
            _buildDetailRow('Display Name', user.displayName ?? 'Not set'),
            _buildDetailRow('Role', user.userRole.name.toUpperCase()),
            _buildDetailRow(
              'Created',
              '${user.createdAt.day}/${user.createdAt.month}/${user.createdAt.year}',
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  void _showChangeRoleDialog(UserModel user) {
    showDialog(
      context: context,
      builder: (context) => _ChangeRoleDialog(user: user),
    );
  }

  Widget _buildSettingsTab() {
    return const Padding(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'System Settings',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16),
          Center(
            child: Text(
              'Advanced settings coming soon!',
              style: TextStyle(color: Colors.grey),
            ),
          ),
        ],
      ),
    );
  }
}

class _ChangeRoleDialog extends ConsumerStatefulWidget {
  final UserModel user;

  const _ChangeRoleDialog({required this.user});

  @override
  ConsumerState<_ChangeRoleDialog> createState() => _ChangeRoleDialogState();
}

class _ChangeRoleDialogState extends ConsumerState<_ChangeRoleDialog> {
  late UserRole _selectedRole;

  @override
  void initState() {
    super.initState();
    _selectedRole = widget.user.userRole;
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(adminActionLoadingProvider);

    return AlertDialog(
      title: Text('Change Role: ${widget.user.displayName ?? widget.user.email}'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('Select new role:'),
          const SizedBox(height: 16),
          ...UserRole.values.map((role) => RadioListTile<UserRole>(
                title: Text(role.name.toUpperCase()),
                value: role,
                groupValue: _selectedRole,
                onChanged: isLoading ? null : (value) {
                  setState(() {
                    _selectedRole = value!;
                  });
                },
              )),
        ],
      ),
      actions: [
        TextButton(
          onPressed: isLoading ? null : () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: isLoading || _selectedRole == widget.user.userRole
              ? null
              : _updateUserRole,
          child: isLoading
              ? const SizedBox(
                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Text('Update'),
        ),
      ],
    );
  }

  Future<void> _updateUserRole() async {
    ref.read(adminActionLoadingProvider.notifier).state = true;

    try {
      final repository = ref.read(userRepositoryProvider);
      await repository.updateUserRole(widget.user.uid, _selectedRole);

      if (mounted) {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Role updated to ${_selectedRole.name.toUpperCase()}',
            ),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update role: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      ref.read(adminActionLoadingProvider.notifier).state = false;
    }
  }
}