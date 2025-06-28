import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import {addSupplier,upload,getSuppliers,getSupplier,updateSupplier,deleteSupplier,login,verify,refreshSupplierToken} from '../controllers/supplierController.js'


const router =express.Router()

router.post('/login', login);
// routes/supplier.js
router.post('/refresh', refreshSupplierToken)
router.get('/verify', authMiddleware, verify);
router.post('/add',authMiddleware,upload.single('profileImage'), addSupplier)
router.get('/',authMiddleware, getSuppliers)
router.get('/:id',authMiddleware, getSupplier)
router.put('/edit/:id', authMiddleware, upload.single('profileImage'), updateSupplier);  // Added upload.single on PUT route
router.delete('/:id',authMiddleware, deleteSupplier)
// router.get("/by-branch/:branchId", getBranchAdminsByBranch);
// router.get("/", authMiddleware, getCustomerCareAdmins);



export default router