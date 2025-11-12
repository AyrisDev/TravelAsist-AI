import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { RegisterBody, LoginBody } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username, fullName }: RegisterBody = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters', 400);
    }

    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      return sendError(res, error.message, 400);
    }

    if (!data.user) {
      return sendError(res, 'Registration failed', 500);
    }

    return sendSuccess(
      res,
      {
        user: {
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata.username,
        },
        session: data.session,
      },
      'Registration successful',
      201
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginBody = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 'Email and password are required', 400);
    }

    // Login with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return sendError(res, 'Invalid email or password', 401);
    }

    if (!data.user || !data.session) {
      return sendError(res, 'Login failed', 500);
    }

    return sendSuccess(res, {
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
      },
      session: data.session,
    }, 'Login successful');
  } catch (error: any) {
    console.error('Login error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No authorization token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const { error } = await supabase.auth.admin.signOut(token);

    if (error) {
      return sendError(res, error.message, 400);
    }

    return sendSuccess(res, null, 'Logout successful');
  } catch (error: any) {
    console.error('Logout error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No authorization token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return sendError(res, 'Invalid or expired token', 401);
    }

    return sendSuccess(res, {
      id: user.id,
      email: user.email,
      username: user.user_metadata.username,
      fullName: user.user_metadata.full_name,
      createdAt: user.created_at,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};
