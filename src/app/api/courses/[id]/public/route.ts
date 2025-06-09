import { NextRequest, NextResponse } from 'next/server';
import { readCoursesFile } from '@/utils/courseFileUtils';

// GET - Get a single course by ID (public access)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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
