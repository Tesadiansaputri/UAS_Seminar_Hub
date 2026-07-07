import express from "express";
import {
  getAllSpeakerSeminar,
  getSpeakerSeminarById,
  createSpeakerSeminar,
  updateSpeakerSeminarById,
  deleteSpeakerSeminarById,
} from "../controllers/speakerSeminarController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllSpeakerSeminar);

router.get("/:id", getSpeakerSeminarById);

router.post("/", authMiddleware, createSpeakerSeminar);

router.put("/:id", authMiddleware, updateSpeakerSeminarById);

router.delete("/:id", authMiddleware, deleteSpeakerSeminarById);

export default router;