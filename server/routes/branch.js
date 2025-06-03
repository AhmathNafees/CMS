import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranch, getBranches, getBranch, updateBranch} from '../controllers/branchController.js'

const router =express.Router()
router.post('/add',authMiddleware, addBranch)
router.get('/',authMiddleware, getBranches)
router.get('/:id',authMiddleware, getBranch)
router.put('/:id',authMiddleware, updateBranch)

export default router