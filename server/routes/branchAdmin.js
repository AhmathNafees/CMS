import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addBranchAdmin,upload,getBranchAdmins, getBranchAdmin, updateBranchAdmin} from '../controllers/branchAdminController.js'

const router =express.Router()
router.post('/add',authMiddleware,upload.single('profileImage'), addBranchAdmin)
router.get('/',authMiddleware, getBranchAdmins)
router.get('/:id',authMiddleware, getBranchAdmin)
router.put('/:id', authMiddleware, upload.single('profileImage'), updateBranchAdmin);  // Added upload.single on PUT route
// router.delete('/:id',authMiddleware, deleteBranch)

export default router