import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { Course, createCourseSchema } from '@/types/course';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';

// GET - Get all courses
export async function GET() {
  try {
    const courses = readCoursesFile();
    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request data
    try {
      await createCourseSchema.validate(body);
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

    // Create new course with generated ID
    const newCourse: Course = {
      id: `course-${nanoid(8)}`,
      title: body.title,
      description: body.description,
      videoIntroUrl: body.videoIntroUrl,
      document: body.document,
      videos: body.videos || [],
    };

    // Add to courses array
    courses.push(newCourse);

    // Write back to file
    const writeSuccess = writeCoursesFile(courses);
    if (!writeSuccess) {
      return NextResponse.json({ success: false, error: 'Failed to save course' }, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Course created successfully',
        data: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
