import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addCustomer, getCustomers,getCustomer, editCustomer,deleteCustomer } from '../controllers/customerController.js'
import multer from 'multer'
import path from 'path'

const router =express.Router()
// Set up Multer Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profileImage") {
      cb(null, "public/customers");
    } else if (file.fieldname === "passportImage") {
      cb(null, "public/passports");
    } else {
      cb(null, "public/others"); // fallback
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/add',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportImage', maxCount: 1 }
  ]), addCustomer)
router.get('/', authMiddleware, getCustomers);
router.get('/:id', authMiddleware, getCustomer);
router.put('/:id',authMiddleware,upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'passportImage', maxCount: 1 }
  ]), editCustomer)
router.delete("/:id", authMiddleware, deleteCustomer);


export default router