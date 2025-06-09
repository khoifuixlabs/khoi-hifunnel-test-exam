import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify JWT token
    const tokenPayload = verifyToken(request);

    if (!tokenPayload) {
      return NextResponse.json({ error: 'Unauthorized - Invalid or missing token' }, { status: 401 });
    }

    // Token is valid, return user profile information
    return NextResponse.json(
      {
        message: 'Profile retrieved successfully',
        user: {
          id: tokenPayload.userId,
          email: tokenPayload.email,
          role: tokenPayload.role,
        },
        tokenInfo: {
          issuedAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000) : null,
          expiresAt: tokenPayload.exp ? new Date(tokenPayload.exp * 1000) : null,
          issuer: tokenPayload.iss,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
