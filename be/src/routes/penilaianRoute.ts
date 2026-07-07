import express from "express";
import { 
  getAllPenilaian, 
  getPenilaianById, 
  createPenilaian, 
  updatePenilaianById, 
  deletePenilaianById,
  getPenilaianBySeminarId,
  getPenilaianByUserId
} from "../controllers/penilaianController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllPenilaian);                              // GET /api/penilaian

router.post("/", authMiddleware, createPenilaian);            // POST /api/penilaian

router.get("/:id", getPenilaianById);                         // GET /api/penilaian/:id

router.put("/:id", authMiddleware, updatePenilaianById);      // PUT /api/penilaian/:id

router.delete("/:id", authMiddleware, deletePenilaianById);   // DELETE /api/penilaian/:id

router.get("/seminar/:seminarId", getPenilaianBySeminarId);   // GET /api/penilaian/seminar/:seminarId

router.get("/user/:userId", getPenilaianByUserId);            // GET /api/penilaian/user/:userId


export default router;
