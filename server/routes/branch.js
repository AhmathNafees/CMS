import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranch, getBranches} from '../controllers/branchController.js'

const router =express.Router()
router.post('/add',authMiddleware, addBranch)
router.get('/',authMiddleware, getBranches)

export default router