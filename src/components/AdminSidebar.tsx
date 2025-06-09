'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ArrowRightOnRectangleIcon,
  BookOpenIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface AdminSidebarProps {
  children: React.ReactNode;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Manage Courses', href: '/admin/courses', icon: BookOpenIcon },
  { name: 'Manage Learner', href: '#', icon: UserGroupIcon },
  { name: 'Manage Pages', href: '#', icon: DocumentDuplicateIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in and has creator role
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!storedUser || !accessToken) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== 'creator') {
      // Redirect non-creators to a different page or show error
      alert('Access denied. Creator role required.');
      router.push('/login');
      return;
    }

    setUser(userData);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <div className={classNames(sidebarOpen ? 'block' : 'hidden', 'fixed inset-0 flex z-40 md:hidden')}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />

        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) =>
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      )}
                    />
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user.email.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user.email}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) =>
                  item.href.startsWith('#') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                      />
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                      )}
                    >
                      <item.icon
                        className={classNames(
                          pathname === item.href ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-6 w-6'
                        )}
                      />
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{user.email.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                  <p className="text-xs font-medium text-gray-500 capitalize">{user.role}</p>
                </div>
                <button onClick={handleLogout} className="ml-2 flex-shrink-0 p-1 text-gray-400 hover:text-gray-500" title="Logout">
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">{children}</main>
      </div>
    </div>
  );
}
