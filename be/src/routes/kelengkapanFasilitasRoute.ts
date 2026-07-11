import express from "express";
import {
  getAllKelengkapanFasilitas,
  getKelengkapanFasilitasById,
  createKelengkapanFasilitas,
  updateKelengkapanFasilitas,
  deleteKelengkapanFasilitas,
} from "../controllers/kelengkapanFasilitasController.js";

import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllKelengkapanFasilitas);

router.get("/:seminarId/:fasilitasId", getKelengkapanFasilitasById);

router.post("/", authMiddleware, createKelengkapanFasilitas);

router.put(
  "/:seminarId/:fasilitasId",
  authMiddleware,
  updateKelengkapanFasilitas
);

router.delete(
  "/:seminarId/:fasilitasId",
  authMiddleware,
  deleteKelengkapanFasilitas
);

export default router;