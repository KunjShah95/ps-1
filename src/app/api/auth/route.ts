import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authManager } from '@/lib/auth/manager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'me': {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.replace(/^Bearer\s+/i, '');
        const session = await authManager.verifyToken(token);
        if (!session) {
          return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
        }

        const user = await authManager.getUser(session.userId);
        return NextResponse.json({ success: true, user, role: session.role });
      }

      case 'users': {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.replace(/^Bearer\s+/i, '');
        const session = await authManager.verifyToken(token);
        if (!session || !authManager.hasPermission(session.role, ['admin', 'manager'])) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const users = await authManager.getAllUsers();
        return NextResponse.json({ success: true, users });
      }

      default:
        return NextResponse.json({
          success: true,
          message: 'SmartFlow Auth API',
          actions: ['login', 'register', 'me', 'users', 'logout', 'refresh', 'update-user'],
        });
    }
  } catch (error) {
    console.error('[/api/auth GET]', error);
    return NextResponse.json({ success: false, error: 'Auth request failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'login': {
        const result = await authManager.login(body.email, body.password);
        if (!result) {
          return NextResponse.json(
            { success: false, error: 'Invalid email or password' },
            { status: 401 },
          );
        }
        return NextResponse.json({
          success: true,
          token: result.token,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
        });
      }

      case 'register': {
        const result = await authManager.register(
          {
            email: body.email,
            name: body.name,
            role: body.role || 'staff',
            venueIds: body.venueIds || [],
            active: true,
          },
          body.password,
        );
        if (!result) {
          return NextResponse.json(
            { success: false, error: 'Registration failed — email may already exist' },
            { status: 400 },
          );
        }
        return NextResponse.json({
          success: true,
          token: result.token,
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
          },
        });
      }

      case 'logout': {
        const authHeader = request.headers.get('authorization');
        if (authHeader) {
          const token = authHeader.replace(/^Bearer\s+/i, '');
          await authManager.logout(token);
        }
        return NextResponse.json({ success: true });
      }

      case 'refresh': {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
        }
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const session = await authManager.refreshToken(token);
        if (!session) {
          return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }
        return NextResponse.json({ success: true, expiresAt: session.expiresAt });
      }

      case 'update-user': {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
        }
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const session = await authManager.verifyToken(token);
        if (!session || !authManager.hasPermission(session.role, ['admin'])) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        const updated = await authManager.updateUser(body.userId, body.updates);
        return NextResponse.json({ success: !!updated, user: updated });
      }

      case 'deactivate-user': {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          return NextResponse.json({ success: false, error: 'No token' }, { status: 401 });
        }
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const session = await authManager.verifyToken(token);
        if (!session || !authManager.hasPermission(session.role, ['admin'])) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }
        const ok = await authManager.deactivateUser(body.userId);
        return NextResponse.json({ success: ok });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[/api/auth POST]', error);
    return NextResponse.json({ success: false, error: 'Auth request failed' }, { status: 500 });
  }
}