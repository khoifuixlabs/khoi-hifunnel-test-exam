import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import * as yup from 'yup';

// Validation schema matching the frontend
const schema = yup.object({
  email: yup.string().min(6, 'Email must be at least 6 characters long').email('Please enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters long').required('Password is required'),
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

    const { email, password } = body;

    // Read existing users
    const usersFilePath = path.join(process.cwd(), 'src', 'data', 'users.json');
    let users: UsersData = {};

    try {
      const usersFileContent = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersFileContent) || {};
    } catch {
      return NextResponse.json({ error: 'No users found. Please register first.' }, { status: 404 });
    }

    // Find user by email
    const user = Object.values(users).find((user) => user.email === email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: '24h', // Token expires in 24 hours
      issuer: 'hifunnel-app',
      subject: user.id,
    });

    // Return success response (without password)
    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        message: 'Login successful',
        user: userWithoutPassword,
        accessToken,
        tokenType: 'Bearer',
        expiresIn: 86400, // 24 hours in seconds
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
