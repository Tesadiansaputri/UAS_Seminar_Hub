import { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. Menampilkan semua data category
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await prisma.category.findMany({
      include: {
        _count: { select: { seminars: true } }
      }
    });
    res.json(allCategories);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
};

// 2. Menyimpan data category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: "Nama kategori HARUS diisi" });
    }

    const newCategory = await prisma.category.create({
      data: { category_name }
    });

    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan kategori" });
  }
};

// 3. Menampilkan data category berdasarkan id
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
      include: {
        _count: { select: { seminars: true } }
      }
    });

    if (!category) {
      return res.status(404).json({ error: "Category tidak ditemukan" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data kategori" });
  }
};

// 4. Mengupdate data category berdasarkan id
export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ error: "Nama kategori HARUS diisi" });
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!category) {
      return res.status(404).json({ error: "Category tidak ditemukan" });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: Number(id) },
      data: { category_name }
    });

    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate kategori" });
  }
};

// 5. Menghapus data category berdasarkan id
export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) }
    });

    if (!category) {
      return res.status(404).json({ error: "Category tidak ditemukan" });
    }

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Category berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus kategori" });
  }
};