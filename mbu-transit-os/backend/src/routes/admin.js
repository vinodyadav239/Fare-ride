import { Router } from 'express';
import { getAllRides, getDriverRequests, approveDriver, rejectDriver, getSystemStats } from '../controllers/adminController.js';

const router = Router();

router.get('/rides', getAllRides);
router.get('/driver-requests', getDriverRequests);
router.post('/driver-requests/:requestId/approve', approveDriver);
router.post('/driver-requests/:requestId/reject', rejectDriver);
router.get('/stats', getSystemStats);

export default router;
