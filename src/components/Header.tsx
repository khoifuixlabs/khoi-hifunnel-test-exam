'use client';

import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';

export default function Header() {
  const { user, isLoading, isAuthenticated, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Learning Platform
            </Link>
          </div>
          <nav className="flex space-x-4 items-center">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="text-gray-600 text-sm">Loading...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">Welcome, {user.email}</span>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
