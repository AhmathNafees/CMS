import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getSummary,getCustomerCareSummary, getBranchAdminSummary,getSupplierSummary } from '../controllers/admin-dashboardController.js'


const router =express.Router()
router.get('/summary',authMiddleware,getSummary)
router.get('/customerCareSummary',authMiddleware,getCustomerCareSummary)
router.get('/branchAdminSummary',authMiddleware,getBranchAdminSummary)
router.get('/supplierSummary',authMiddleware,getSupplierSummary)


export default router