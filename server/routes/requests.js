
import express from "express";
import { createRequest,getRequests,updateRequestStatus,getMyRequests,getAllLogs} from "../controllers/requestController.js";
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router();

router.post("/", authMiddleware, createRequest);
router.get("/branch", authMiddleware, getRequests);// ⬅️ For branch admins
router.get("/my-requests", authMiddleware, getMyRequests);
router.put("/:id", authMiddleware, updateRequestStatus);
router.get("/logs", authMiddleware, getAllLogs);


export default router;
