import { Router } from "express";
import {
  getAllKriteria,
  getKriteriaById,
  createKriteria,
  updateKriteriaById,
  deleteKriteriaById,
} from "../controllers/kriteriaController.js";

const router = Router();

router.get("/", getAllKriteria);
router.get("/:id", getKriteriaById);
router.post("/", createKriteria);
router.put("/:id", updateKriteriaById);
router.delete("/:id", deleteKriteriaById);

export default router;