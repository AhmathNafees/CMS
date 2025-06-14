import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addCustomer, getCustomers } from '../controllers/customerController.js'
import multer from 'multer'
import path from 'path'

const router =express.Router()
// Set up Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/add',authMiddleware,upload.single('profileImage'), addCustomer)
router.get('/', authMiddleware, getCustomers);


export default router