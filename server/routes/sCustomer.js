import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import multer from 'multer'
import path from 'path'
import SCustomer from '../models/sCustomerModel.js'
import { addSCustomer, getSCustomers,getSCustomer,editSCustomer,deleteSCustomer } from '../controllers/sCustomerController.js'

const router =express.Router()
// Set up Multer Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "public/customers");
    } else if (file.fieldname === "passportPdf") {
      cb(null, "public/passports");
    } else if (file.fieldname === "cvPdf") {
      cb(null, "public/indexCustomerCV");
    } else {
      cb(null, "public/others"); // fallback
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
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

const upload = multer({ storage, fileFilter });

router.post('/add',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportPdf', maxCount: 1 },
    { name: 'cvPdf', maxCount: 1 }
  ]), addSCustomer)
router.get('/', authMiddleware, getSCustomers);
router.get('/:id', authMiddleware, getSCustomer);
router.put('/:id',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportPdf', maxCount: 1 },
    { name: 'cvPdf', maxCount: 1 }
  ]), editSCustomer)
router.delete("/:id", authMiddleware, deleteSCustomer);
// router.get('/byBranchAdmin/:branchAdminId', authMiddleware, getCustomersByBranchAdmin);
// router.get('/byBranch/:branchId', authMiddleware, getCustomersByBranch);

// for Status Update
// router.patch('/:id/status', authMiddleware, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const customer = await SCustomer.findByIdAndUpdate(
//       req.params.id,
//       { status, },
//       { new: true } // ✅ return updated document
//     );
//     if (!customer) return res.status(404).json({ success: false, error: 'SCustomer not found' });

//     res.json({ success: true, message: 'Status updated', customer });
//   } catch (error) {
//     res.status(500).json({ success: false, error: 'Server Error' });
//   }
// });


export default router