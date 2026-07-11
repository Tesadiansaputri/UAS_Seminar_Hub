import express from "express";
import {
  getAllSubKriteria,
  getSubKriteriaById,
  createSubKriteria,
  updateSubKriteriaById,
  deleteSubKriteriaById,
} from "../controllers/subKriteriaController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllSubKriteria);

router.get("/:id", getSubKriteriaById);

router.post("/", authMiddleware, createSubKriteria);

router.put("/:id", authMiddleware, updateSubKriteriaById);

router.delete("/:id", authMiddleware, deleteSubKriteriaById);

export default router;