import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {addSupplier,upload,getSuppliers,getSupplier,updateSupplier} from '../controllers/supplierController.js'


const router =express.Router()
router.post('/add',authMiddleware,upload.single('profileImage'), addSupplier)
router.get('/',authMiddleware, getSuppliers)
router.get('/:id',authMiddleware, getSupplier)
router.put('/edit/:id', authMiddleware, upload.single('profileImage'), updateSupplier);  // Added upload.single on PUT route
// router.delete('/:id',authMiddleware, deleteBranchAdmin)
// router.get("/by-branch/:branchId", getBranchAdminsByBranch);
// router.get("/", authMiddleware, getCustomerCareAdmins);



export default router