import { NextRequest, NextResponse } from 'next/server';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';
import { verifyToken } from '@/lib/auth';
import { RegisteredUser } from '@/types/course';

// POST - Register user to a course
export async function POST(request: NextRequest) {
  try {
    // Extract the course ID from the URL pathname
    // Example: /api/courses/123/register
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    // Find the index of 'courses' and get the next part as the ID
    const coursesIndex = pathParts.findIndex((part) => part === 'courses');
    const courseId = coursesIndex !== -1 && pathParts.length > coursesIndex + 1 ? pathParts[coursesIndex + 1] : undefined;

    if (!courseId) {
      return NextResponse.json({ success: false, error: 'Missing course ID in URL' }, { status: 400 });
    }

    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    const body = await request.json();
    const { checkoutInfo } = body;

    // Validate checkout info
    if (!checkoutInfo || !checkoutInfo.name || !checkoutInfo.phone || !checkoutInfo.address || !checkoutInfo.checkoutMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid checkout information. Name, phone, address, and checkout method are required.',
        },
        { status: 400 }
      );
    }

    // Read existing courses
    const courses = readCoursesFile();

    // Find the course
    const courseIndex = courses.findIndex((c) => c.id === courseId);

    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const course = courses[courseIndex];

    // Check if user is already registered
    const existingRegistration = course.registeredUsers?.find((u) => u.id === tokenPayload.userId);
    if (existingRegistration) {
      return NextResponse.json(
        {
          success: false,
          error: 'You are already registered for this course',
        },
        { status: 400 }
      );
    }

    // Create new registered user object
    const newRegisteredUser: RegisteredUser = {
      id: tokenPayload.userId,
      email: tokenPayload.email || 'unknown@example.com',
      role: tokenPayload.role || 'student',
      registeredAt: new Date().toISOString(),
      status: 'active',
    };

    // Add user to course's registered users
    if (!course.registeredUsers) {
      course.registeredUsers = [];
    }
    course.registeredUsers.push(newRegisteredUser);

    // Update the course in the array
    courses[courseIndex] = course;

    // Write back to file
    const writeSuccess = writeCoursesFile(courses);
    if (!writeSuccess) {
      return NextResponse.json({ success: false, error: 'Failed to register user to course' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully registered for the course',
      data: {
        courseId: course.id,
        courseTitle: course.title,
        registeredUser: newRegisteredUser,
        checkoutInfo: checkoutInfo,
      },
    });
  } catch (error) {
    console.error('Error registering user to course:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
