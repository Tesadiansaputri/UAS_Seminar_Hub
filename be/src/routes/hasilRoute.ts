import { Router } from "express";
import {
  getAllHasil,  
  getHasilById,
  createHasil,
  updateHasilById,
  deleteHasilById,
  calculateHasil,
  getHasilByUser
} from "../controllers/hasilController.js";

const router = Router();

// ROUTE SPK HARUS PALING ATAS
router.get("/hitung/:userId", calculateHasil);



// CRUD
router.get("/", getAllHasil);

router.get("/:id", getHasilById);

router.post("/", createHasil);

router.put("/:id", updateHasilById);

router.delete("/:id", deleteHasilById);
router.get("/user/:userId", getHasilByUser);

export default router;