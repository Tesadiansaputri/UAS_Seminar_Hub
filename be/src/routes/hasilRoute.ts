import { Router } from "express";

import {
  getAllHasil,
  getHasilById,
  createHasil,
  updateHasilById,
  deleteHasilById,
  calculateHasil,
} from "../controllers/hasilController.js";

const router = Router();

// ==============================
// CRUD HASIL
// ==============================

router.get("/", getAllHasil);

router.get("/:id", getHasilById);

router.post("/", createHasil);

router.put("/:id", updateHasilById);

router.delete("/:id", deleteHasilById);

// ==============================
// HITUNG SAW
// ==============================

router.get("/hitung/:userId", calculateHasil);

export default router;