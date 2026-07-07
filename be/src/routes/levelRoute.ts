import express from "express";
import {
  getAllLevels,
  getLevelById,
  createLevel,
  updateLevelById,
  deleteLevelById,
} from "../controllers/levelController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllLevels);

router.get("/:id", getLevelById);

router.post("/", authMiddleware, createLevel);

router.put("/:id", authMiddleware, updateLevelById);

router.delete("/:id", authMiddleware, deleteLevelById);

export default router;
