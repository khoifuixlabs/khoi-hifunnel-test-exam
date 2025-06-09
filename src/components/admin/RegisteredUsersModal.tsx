'use client';

import { useForm } from 'react-hook-form';
import { XMarkIcon, MagnifyingGlassIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { Course } from '@/types/course';
import FormInput from '@/components/FormInput';

interface RegisteredUsersModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleUserStatus: (courseId: string, userId: string) => Promise<void>;
}

export default function RegisteredUsersModal({ course, isOpen, onClose, onToggleUserStatus }: RegisteredUsersModalProps) {
  const { register, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });
  const searchTerm = watch('search');

  if (!isOpen || !course) return null;

  const filteredUsers =
    course.registeredUsers?.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.status.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    if (!course) return;

    const action = currentStatus === 'active' ? 'block' : 'unblock';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await onToggleUserStatus(course.id, userId);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Registered Users - {course.title}</h3>
            <button type="button" className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <FormInput
                id="search"
                type="text"
                placeholder="Search users by email, role, or status..."
                register={register('search')}
                className="pl-10"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">
                {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''} Found
              </h4>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {course.registeredUsers?.length === 0 ? 'No users registered for this course yet.' : 'No users match your search criteria.'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                user.status === 'active' ? 'bg-indigo-500' : 'bg-gray-400'
                              }`}
                            >
                              <span className="text-sm font-medium text-white">{user.email.charAt(0).toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                {user.role}
                              </span>
                              <span
                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {user.status}
                              </span>
                              <span className="ml-2">Registered: {formatDate(user.registeredAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`p-2 ${user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                          title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                        >
                          {user.status === 'active' ? <LockClosedIcon className="h-4 w-4" /> : <LockOpenIcon className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
