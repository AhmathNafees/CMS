import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import multer from 'multer'
import path from 'path'
import indexCustomer from '../models/indexCustomerModel.js'
import { addIndexCustomer ,getIndexCustomers, getIndexCustomer, editIndexCustomer} from '../controllers/IndexCustomerController.js'

const router =express.Router()
// Set up Multer Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "public/indexCustomers");
    } else if (file.fieldname === "passportImage") {
      cb(null, "public/indexCustomerCV");
    } else {
      cb(null, "public/others"); // fallback
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/add-indexCustomer',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportImage', maxCount: 1 }
  ]), addIndexCustomer)
router.get('/', authMiddleware, getIndexCustomers);
router.get('/:id', authMiddleware, getIndexCustomer);
router.put('/edit/:id',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportImage', maxCount: 1 }
  ]), editIndexCustomer)
// router.delete("/:id", authMiddleware, deleteCustomer);
// router.get('/byBranchAdmin/:branchAdminId', authMiddleware, getCustomersByBranchAdmin);
// router.get('/byBranch/:branchId', authMiddleware, getCustomersByBranch);


export default router