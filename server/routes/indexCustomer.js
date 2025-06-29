import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import multer from 'multer'
import path from 'path'
import indexCustomer from '../models/indexCustomerModel.js'
import { addIndexCustomer ,getIndexCustomers, getIndexCustomer, editIndexCustomer,deleteIndexCustomer, getIndexCustomersByBranchAdmin ,getIndexCustomersByBranch} from '../controllers/IndexCustomerController.js'

const router =express.Router()
// Set up Multer Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "public/indexCustomers");
    } else if (file.fieldname === "passportPdf") {
      cb(null, "public/passports");
    } else if (file.fieldname === "cvPdf") {
      cb(null, "public/indexCustomerCV");
    } else {
      cb(null, "public/others"); // fallback
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const fileFilter = (req, file, cb) => {
  if (
    (file.fieldname === "profileImage" && file.mimetype.startsWith("image/")) ||
    (file.fieldname === "passportPdf" && file.mimetype === "application/pdf") ||
    (file.fieldname === "cvPdf" && file.mimetype === "application/pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only valid image (for profile) or PDF files (for passport/cv) are allowed"), false);
  }
};

const upload = multer({ storage ,fileFilter});

router.post('/add-indexCustomer',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportPdf', maxCount: 1 },
    { name: 'cvPdf', maxCount: 1 }
  ]), addIndexCustomer)
router.get('/', authMiddleware, getIndexCustomers);
router.get('/:id', authMiddleware, getIndexCustomer);
router.put('/edit/:id',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportPdf', maxCount: 1 },
    { name: 'cvPdf', maxCount: 1 }
  ]), editIndexCustomer)
router.delete("/:id", authMiddleware, deleteIndexCustomer);
router.get('/byBranchAdmin/:branchAdminId', authMiddleware, getIndexCustomersByBranchAdmin);
router.get('/byBranch/:branchId', authMiddleware, getIndexCustomersByBranch);


export default router