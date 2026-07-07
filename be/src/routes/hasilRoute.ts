import express from "express";
import {
  getAllHasil,
  getHasilById,
  createHasil,
  updateHasilById,
  deleteHasilById,
  calculateHasil,
} from "../controllers/hasilController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllHasil);

router.get("/:id", getHasilById);

router.post("/", authMiddleware, createHasil);

router.put("/:id", authMiddleware, updateHasilById);

router.delete("/:id", authMiddleware, deleteHasilById);

router.get("/calculate/:userId", authMiddleware, calculateHasil);

export default router;