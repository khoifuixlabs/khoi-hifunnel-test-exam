'use client';

import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import Loading from '@/components/Loading';

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useUser();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome</h1>
          {isAuthenticated && user ? (
            <div className="mb-8">
              <p className="text-lg text-gray-600">Hello, {user.email}!</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
            </div>
          ) : (
            <p className="text-lg text-gray-600 mb-8">Please choose an option to continue</p>
          )}
        </div>

        <div className="space-y-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/courses"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                Browse Courses
              </Link>

              {user?.role === 'creator' && (
                <Link
                  href="/admin"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="w-full flex justify-center py-3 px-4 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/courses"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
              >
                Browse Courses
              </Link>

              <Link
                href="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="w-full flex justify-center py-3 px-4 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
