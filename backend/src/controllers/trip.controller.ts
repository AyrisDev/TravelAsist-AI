import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import plannerService from '../services/planner.service';

interface CreateTripBody {
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  requested_cities: string[];
  accommodation_preference: 'hostel' | 'hotel' | 'apartment' | 'any';
  travel_style: 'fast' | 'slow' | 'adventure';
}

export const createTrip = async (req: AuthRequest, res: Response) => {
  try {
    const {
      origin,
      destination,
      start_date,
      end_date,
      budget,
      requested_cities,
      accommodation_preference,
      travel_style,
    }: CreateTripBody = req.body;

    // Validation
    if (!origin || !destination || !start_date || !end_date || !budget) {
      return sendError(res, 'Missing required fields', 400);
    }

    if (!Array.isArray(requested_cities) || requested_cities.length === 0) {
      return sendError(res, 'At least one city must be selected', 400);
    }

    if (requested_cities.length > 5) {
      return sendError(res, 'Maximum 5 cities allowed', 400);
    }

    if (budget <= 0) {
      return sendError(res, 'Budget must be greater than 0', 400);
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return sendError(res, 'Invalid date format', 400);
    }

    if (startDate >= endDate) {
      return sendError(res, 'End date must be after start date', 400);
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 1) {
      return sendError(res, 'Trip must be at least 1 day long', 400);
    }

    if (daysDiff > 30) {
      return sendError(res, 'Maximum trip duration is 30 days', 400);
    }

    // Create trip request in database
    const { data, error } = await supabase
      .from('trip_requests')
      .insert([
        {
          user_id: req.user!.id,
          origin,
          destination,
          start_date,
          end_date,
          budget,
          requested_cities,
          accommodation_preference,
          travel_style,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return sendError(res, error.message, 500);
    }

    // Trigger AI planning service asynchronously (non-blocking)
    plannerService.generateTravelPlan(data as any)
      .then(() => {
        console.log(`Travel plan generated successfully for trip ${data.id}`);
      })
      .catch((err) => {
        console.error(`Failed to generate plan for trip ${data.id}:`, err.message);
      });

    return sendSuccess(
      res,
      {
        trip_request: data,
        message: 'Your trip is being planned. You will be notified when it\'s ready.',
      },
      'Trip request created successfully',
      201
    );
  } catch (error: any) {
    console.error('Create trip error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const getUserTrips = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('trip_requests')
      .select(`
        *,
        generated_plans (*)
      `)
      .eq('user_id', req.user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return sendError(res, error.message, 500);
    }

    return sendSuccess(res, { trips: data });
  } catch (error: any) {
    console.error('Get trips error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};

export const getTripById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return sendError(res, 'Trip ID is required', 400);
    }

    const { data, error } = await supabase
      .from('trip_requests')
      .select(`
        *,
        generated_plans (*)
      `)
      .eq('id', id)
      .eq('user_id', req.user!.id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return sendError(res, 'Trip not found', 404);
    }

    return sendSuccess(res, { trip: data });
  } catch (error: any) {
    console.error('Get trip error:', error);
    return sendError(res, 'Internal server error', 500);
  }
};
