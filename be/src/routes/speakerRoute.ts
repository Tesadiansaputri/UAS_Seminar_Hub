import express from "express";
import { createSpeaker, getAllSpeakers, getSpeakerById, updateSpeakerById, deleteSpeakerById } from "../controllers/speakerController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

//endepoint untuk speaker
//menampilkan data
router.get("/", getAllSpeakers);

router.post("/", authMiddleware, createSpeaker);

router.get("/:id", getSpeakerById);

router.put("/:id", authMiddleware, updateSpeakerById);

router.delete("/:id", authMiddleware, deleteSpeakerById);



export default router;

