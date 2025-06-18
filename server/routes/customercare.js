// routes/customerCare.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getCustomerCareAdmins } from '../controllers/branchAdminController.js';

const router = express.Router();

// This route now exclusively fetches customer care admins.
router.get('/', authMiddleware, getCustomerCareAdmins);

export default router;
