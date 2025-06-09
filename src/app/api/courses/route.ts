import { NextRequest, NextResponse } from 'next/server';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { Course, createCourseSchema } from '@/types/course';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';
import { verifyToken } from '@/lib/auth';

// GET - Get all courses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    const courses = readCoursesFile();

    // Filter courses by the authenticated user (creator can only see their own courses)
    const userCourses = courses.filter((course) => course.createdBy === tokenPayload.userId);

    return NextResponse.json({
      success: true,
      data: userCourses,
      total: userCourses.length,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST - Create a new course
export async function POST(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

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

    // Create new course with generated ID and createdBy field
    const newCourse: Course = {
      id: `course-${nanoid(8)}`,
      title: body.title,
      description: body.description,
      createdBy: tokenPayload.userId, // Set the creator
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
