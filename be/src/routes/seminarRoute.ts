import express from "express";
import { createSeminar, getAllSeminars, getSeminarById,updateSeminarById,deleteSeminarById} from "../controllers/seminarController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";


const router = express.Router();
//endepoint untuk event
//menampilkan data
router.get("/", getAllSeminars);

router.post("/", authMiddleware, createSeminar);

router.get("/:id", getSeminarById);

router.put("/:id", authMiddleware, updateSeminarById);

router.delete("/:id", authMiddleware, deleteSeminarById);


export default router;