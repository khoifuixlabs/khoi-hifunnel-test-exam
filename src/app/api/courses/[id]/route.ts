import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import { Course, updateCourseSchema } from '@/types/course';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';

// GET - Get a single course by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const courses = readCoursesFile();

    const course = courses.find((c) => c.id === id);

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
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

    // Update the course
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
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Read existing courses
    const courses = readCoursesFile();

    // Find the course index
    const courseIndex = courses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
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
