import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import * as yup from 'yup';

// Validation schema matching the frontend
const schema = yup.object({
  email: yup.string().min(6, 'Email must be at least 6 characters long').email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
  role: yup.string().oneOf(['learner', 'creator'], 'Role must be either learner or creator').required('Role is required'),
});

interface User {
  id: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

interface UsersData {
  [key: string]: User;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request data
    try {
      await schema.validate(body);
    } catch (validationError) {
      return NextResponse.json({ error: 'Validation failed', details: (validationError as yup.ValidationError).message }, { status: 400 });
    }

    const { email, password, role } = body;

    // Read existing users
    const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');
    let users: UsersData = {};

    try {
      const usersFileContent = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersFileContent) || {};
    } catch {
      // If file doesn't exist or is empty, start with empty object
      users = {};
    }

    // Check if user already exists
    const existingUser = Object.values(users).find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newUser: User = {
      id: userId,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
    };

    // Add user to the users object
    users[userId] = newUser;

    // Save back to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Return success response (without password)
    const userWithoutPassword = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
