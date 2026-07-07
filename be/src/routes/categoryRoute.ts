import express from "express";
import { createCategory, deleteCategoryById, getCategoryById, updateCategoryById, getAllCategories } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", getAllCategories);

router.post("/", authMiddleware, createCategory);

router.get("/:id", getCategoryById);

router.put("/:id", authMiddleware, updateCategoryById);

router.delete("/:id", authMiddleware, deleteCategoryById);


export default router;