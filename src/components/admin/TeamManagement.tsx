'use client';

import { useState, useEffect } from 'react';
import { UsersList } from './UsersList';
import { CreateUserModal } from './CreateUserModal';
import { AssignmentManager } from './AssignmentManager';

type TabType = 'users' | 'assignments';

export function TeamManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserCreated = () => {
    setShowCreateModal(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Management</h1>
            <p className="text-sm text-gray-600">
              Manage users and painter assignments
            </p>
          </div>
          {activeTab === 'users' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition ${
                activeTab === 'assignments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Assignments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UsersList refreshKey={refreshKey} />}
          {activeTab === 'assignments' && <AssignmentManager />}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
}
