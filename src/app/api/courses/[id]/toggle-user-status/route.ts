import { NextRequest, NextResponse } from 'next/server';
import { readCoursesFile, writeCoursesFile } from '@/utils/courseFileUtils';
import { verifyToken } from '@/lib/auth';

// PATCH - Toggle user status (active <-> blocked)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    const { id: courseId } = params;
    const body = await request.json();
    const { userId } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId is required in request body' }, { status: 400 });
    }

    // Read existing courses
    const courses = readCoursesFile();

    // Find the course
    const courseIndex = courses.findIndex((course) => course.id === courseId);
    if (courseIndex === -1) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    const course = courses[courseIndex];

    // Check if the user owns this course
    if (course.createdBy !== tokenPayload.userId) {
      return NextResponse.json({ success: false, error: 'Access denied - You can only manage users for your own courses' }, { status: 403 });
    }

    // Find the user in the course's registered users
    if (!course.registeredUsers) {
      return NextResponse.json({ success: false, error: 'No registered users found for this course' }, { status: 404 });
    }

    const userIndex = course.registeredUsers.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found in this course' }, { status: 404 });
    }

    const user = course.registeredUsers[userIndex];

    // Toggle user status
    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    course.registeredUsers[userIndex] = {
      ...user,
      status: newStatus,
    };

    // Update the course in the courses array
    courses[courseIndex] = course;

    // Write back to file
    const writeSuccess = writeCoursesFile(courses);
    if (!writeSuccess) {
      return NextResponse.json({ success: false, error: 'Failed to update user status' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `User status changed from ${user.status} to ${newStatus}`,
      data: {
        userId: user.id,
        email: user.email,
        previousStatus: user.status,
        newStatus: newStatus,
      },
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
