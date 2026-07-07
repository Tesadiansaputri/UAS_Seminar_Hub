import express from "express";
import {
  getAllBobot,
  getBobotById,
  createBobot,
  updateBobotById,
  deleteBobotById,
} from "../controllers/bobotController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllBobot);

router.get("/:id", getBobotById);

router.post("/", authMiddleware, createBobot);

router.put("/:id", authMiddleware, updateBobotById);

router.delete("/:id", authMiddleware, deleteBobotById);

export default router;