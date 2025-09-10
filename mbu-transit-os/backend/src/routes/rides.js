import { Router } from 'express';
import { bookRide, getStudentRides, acceptRide, updateRideStatus } from '../controllers/ridesController.js';

const router = Router();

router.post('/book', bookRide);
router.get('/student/:studentId', getStudentRides);
router.post('/:rideId/accept', acceptRide);
router.put('/:rideId/status', updateRideStatus);

export default router;
