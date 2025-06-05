import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranchAdmin,upload} from '../controllers/branchAdminController.js'

const router =express.Router()
router.post('/add',authMiddleware,upload.single('profileImage'), addBranchAdmin)
// router.get('/',authMiddleware, getBranches)
// router.get('/:id',authMiddleware, getBranch)
// router.put('/:id',authMiddleware, updateBranch)
// router.delete('/:id',authMiddleware, deleteBranch)

export default router