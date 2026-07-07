import express from "express";
import {
  getAllRatingPembicara,
  getRatingPembicaraById,
  createRatingPembicara,
  updateRatingPembicaraById,
  deleteRatingPembicaraById,
} from "../controllers/ratingPembicaraController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllRatingPembicara);

router.get("/:id", getRatingPembicaraById);

router.post("/", authMiddleware, createRatingPembicara);

router.put("/:id", authMiddleware, updateRatingPembicaraById);

router.delete("/:id", authMiddleware, deleteRatingPembicaraById);

export default router;