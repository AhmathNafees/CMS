import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranch } from '../controllers/branchController.js'

const router =express.Router()
router.post('/add',authMiddleware, addBranch)

export default router