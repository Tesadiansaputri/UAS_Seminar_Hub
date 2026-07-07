import express from "express";
import {
  getAllFasilitas,
  getFasilitasById,
  createFasilitas,
  updateFasilitasById,
  deleteFasilitasById,
} from "../controllers/fasilitasController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllFasilitas);

router.get("/:id", getFasilitasById);

router.post("/", authMiddleware, createFasilitas);

router.put("/:id", authMiddleware, updateFasilitasById);

router.delete("/:id", authMiddleware, deleteFasilitasById);

export default router;