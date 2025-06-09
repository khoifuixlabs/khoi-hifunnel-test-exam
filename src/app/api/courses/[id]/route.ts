import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import { Course, updateCourseSchema } from '@/types/course';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';
import { verifyToken } from '@/lib/auth';

// Helper to extract course ID from URL (for route handlers)
function getCourseIdFromRequest(request: Request): string | undefined {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const coursesIndex = pathParts.findIndex((part) => part === 'courses');
    return coursesIndex !== -1 && pathParts.length > coursesIndex + 1 ? pathParts[coursesIndex + 1] : undefined;
  } catch {
    return undefined;
  }
}

// GET - Get a single course by ID
export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    // Extract course ID from URL
    const id = getCourseIdFromRequest(request);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing course ID in URL' }, { status: 400 });
    }

    const courses = readCoursesFile();

    const course = courses.find((c) => c.id === id);

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check if the user owns this course
    if (course.createdBy !== tokenPayload.userId) {
      return NextResponse.json({ success: false, error: 'Access denied - You can only access your own courses' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 });
  }
}

// PUT - Update a course by ID
export async function PUT(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    // Extract course ID from URL
    const id = getCourseIdFromRequest(request);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing course ID in URL' }, { status: 400 });
    }

    const body = await request.json();

    // Validate the request data
    try {
      await updateCourseSchema.validate(body);
    } catch (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: (validationError as yup.ValidationError).message,
        },
        { status: 400 }
      );
    }

    // Read existing courses
    const courses = readCoursesFile();

    // Find the course index
    const courseIndex = courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check if the user owns this course
    if (courses[courseIndex].createdBy !== tokenPayload.userId) {
      return NextResponse.json({ success: false, error: 'Access denied - You can only modify your own courses' }, { status: 403 });
    }

    // Update the course (preserve createdBy field)
    const updatedCourse: Course = {
      ...courses[courseIndex],
      title: body.title,
      description: body.description,
      videoIntroUrl: body.videoIntroUrl,
      document: body.document,
      videos: body.videos || [],
    };

    courses[courseIndex] = updatedCourse;

    // Write back to file
    const writeSuccess = writeCoursesFile(courses);
    if (!writeSuccess) {
      return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a course by ID
export async function DELETE(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    // Extract course ID from URL
    const id = getCourseIdFromRequest(request);

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing course ID in URL' }, { status: 400 });
    }

    // Read existing courses
    const courses = readCoursesFile();

    // Find the course index
    const courseIndex = courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    // Check if the user owns this course
    if (courses[courseIndex].createdBy !== tokenPayload.userId) {
      return NextResponse.json({ success: false, error: 'Access denied - You can only delete your own courses' }, { status: 403 });
    }

    // Get the course before deletion for response
    const deletedCourse = courses[courseIndex];

    // Remove the course
    courses.splice(courseIndex, 1);

    // Write back to file
    const writeSuccess = writeCoursesFile(courses);
    if (!writeSuccess) {
      return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
      data: deletedCourse,
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
