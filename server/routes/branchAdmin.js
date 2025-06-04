import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranchAdmin} from '../controllers/branchAdminController.js'

const router =express.Router()
router.post('/add',authMiddleware, addBranchAdmin)
// router.get('/',authMiddleware, getBranches)
// router.get('/:id',authMiddleware, getBranch)
// router.put('/:id',authMiddleware, updateBranch)
// router.delete('/:id',authMiddleware, deleteBranch)

export default router