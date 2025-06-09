import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
}

/**
 * Verify JWT token from Authorization header
 */
export function verifyToken(request: NextRequest): JWTPayload | null {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header without verification
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

/**
 * Check if user has required role
 */
export function hasRole(userPayload: JWTPayload, requiredRole: string): boolean {
  return userPayload.role === requiredRole;
}

/**
 * Generate new JWT token
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp' | 'iss' | 'sub'>): string {
  const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'hifunnel-app',
    subject: payload.userId,
  });
}
