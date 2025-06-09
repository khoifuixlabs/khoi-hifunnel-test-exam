'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Course } from '@/types/course';
import CourseList from '@/components/admin/CourseList';
import CourseModal from '@/components/admin/CourseModal';
import CourseDetailsModal from '@/components/admin/CourseDetailsModal';
import RegisteredUsersModal from '@/components/admin/RegisteredUsersModal';

type CourseFormData = Omit<Course, 'id' | 'createdBy'>;

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null);
  const [managingUsersFor, setManagingUsersFor] = useState<Course | null>(null);

  // Helper function to get authorization headers
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    const tokenType = localStorage.getItem('tokenType') || 'Bearer';

    return {
      'Content-Type': 'application/json',
      Authorization: `${tokenType} ${accessToken}`,
    };
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses', {
        headers: getAuthHeaders(),
      });
      const result = await response.json();

      if (result.success) {
        setCourses(result.data);
      } else {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CourseFormData) => {
    try {
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
        setShowModal(false);
        setEditingCourse(null);
        alert(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
      } else {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          alert(`Error: ${result.error}${result.details ? ` - ${result.details}` : ''}`);
        }
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
        alert('Course deleted successfully!');
      } else {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  const handleView = (course: Course) => {
    setViewingCourse(course);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleCloseDetailsModal = () => {
    setViewingCourse(null);
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleManageUsers = (course: Course) => {
    setManagingUsersFor(course);
  };

  const handleCloseUsersModal = () => {
    setManagingUsersFor(null);
  };

  const handleToggleUserStatus = async (courseId: string, userId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/toggle-user-status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.success) {
        // Update the course with the new user status from API response
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  registeredUsers: (course.registeredUsers || []).map((user) =>
                    user.id === userId ? { ...user, status: result.data.newStatus } : user
                  ),
                }
              : course
          )
        );

        // Update the managingUsersFor state if it's the same course
        setManagingUsersFor((prevCourse) =>
          prevCourse && prevCourse.id === courseId
            ? {
                ...prevCourse,
                registeredUsers: (prevCourse.registeredUsers || []).map((user) =>
                  user.id === userId ? { ...user, status: result.data.newStatus } : user
                ),
              }
            : prevCourse
        );

        alert(result.message);
      } else {
        if (response.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/login';
        } else {
          alert(`Error: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Courses Management</h1>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Course
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <CourseList courses={courses} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} onManageUsers={handleManageUsers} />
        </div>
      </div>

      <CourseModal isOpen={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} editingCourse={editingCourse} />

      <CourseDetailsModal course={viewingCourse} isOpen={!!viewingCourse} onClose={handleCloseDetailsModal} />

      <RegisteredUsersModal
        course={managingUsersFor}
        isOpen={!!managingUsersFor}
        onClose={handleCloseUsersModal}
        onToggleUserStatus={handleToggleUserStatus}
      />
    </div>
  );
}
