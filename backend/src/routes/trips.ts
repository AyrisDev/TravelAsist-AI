import { Router } from 'express';
import { createTrip, getUserTrips, getTripById } from '../controllers/trip.controller';
import { authenticateUser } from '../middleware/auth';

const router = Router();

// All trip routes require authentication
router.use(authenticateUser);

// Create new trip request
router.post('/', createTrip);

// Get all trips for current user
router.get('/', getUserTrips);

// Get specific trip by ID
router.get('/:id', getTripById);

export default router;
