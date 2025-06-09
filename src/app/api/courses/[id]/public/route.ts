import { NextResponse } from 'next/server';
import { readCoursesFile } from '@/utils/courseFileUtils';

// GET - Get a single course by ID (public access)
export async function GET(request: Request) {
  try {
    // Extract the course ID from the URL pathname
    // Example: /api/courses/123/public
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Find the index of 'courses' and get the next part as the ID
    const coursesIndex = pathParts.findIndex((part) => part === 'courses');
    const id = coursesIndex !== -1 && pathParts.length > coursesIndex + 1 ? pathParts[coursesIndex + 1] : undefined;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing course ID in URL' }, { status: 400 });
    }

    const courses = readCoursesFile();
    const course = courses.find((c) => c.id === id);

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Return course data without sensitive information
    // Remove registeredUsers data for privacy
    const publicCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      videoIntroUrl: course.videoIntroUrl,
      document: course.document,
      videos: course.videos,
      // Only return the count of registered users, not the actual data
      registeredUsersCount: course.registeredUsers?.length || 0,
    };

    return NextResponse.json({
      success: true,
      data: publicCourse,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}
