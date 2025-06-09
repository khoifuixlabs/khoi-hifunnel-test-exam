'use client';

import { PencilIcon, TrashIcon, EyeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Course } from '@/types/course';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onView: (course: Course) => void;
  onManageUsers: (course: Course) => void;
}

export default function CourseList({ courses, onEdit, onDelete, onView, onManageUsers }: CourseListProps) {
  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    onDelete(courseId);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {courses.length === 0 ? (
          <li className="px-6 py-8 text-center text-gray-500">No courses found. Create your first course!</li>
        ) : (
          courses.map((course) => (
            <li key={course.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.description.length > 100 ? course.description.substring(0, 100) + '...' : course.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span>Videos: {course.videos?.length || 0}</span>
                    {course.document && <span className="ml-4">Document: {course.document.type}</span>}
                    <span className="ml-4">Users: {course.registeredUsers?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button onClick={() => onView(course)} className="p-2 text-gray-400 hover:text-gray-500" title="View Details">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => onManageUsers(course)} className="p-2 text-blue-600 hover:text-blue-700" title="Manage Users">
                    <UserGroupIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => onEdit(course)} className="p-2 text-indigo-600 hover:text-indigo-700" title="Edit Course">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="p-2 text-red-600 hover:text-red-700" title="Delete Course">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
