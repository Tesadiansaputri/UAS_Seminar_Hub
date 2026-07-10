import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ===========================
// GET ALL LEVEL
// ===========================
export const getAllLevels = async (req: Request, res: Response) => {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(levels);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data level",
    });
  }
};

// ===========================
// GET LEVEL BY ID
// ===========================
export const getLevelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const level = await prisma.level.findUnique({
      where: { id },
    });

    if (!level) {
      return res.status(404).json({
        message: "Level tidak ditemukan",
      });
    }

    res.json(level);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data level",
    });
  }
};

// ===========================
// CREATE LEVEL
// ===========================
export const createLevel = async (req: Request, res: Response) => {
  try {
    const { nama_level, nilai_level } = req.body;

if (!nama_level || nilai_level === undefined) {
  return res.status(400).json({
    message: "Semua field wajib diisi",
  });
}

const level = await prisma.level.create({
  data: {
    nama_level,
    nilai_level: Number(nilai_level),
  },
});

    res.status(201).json(level);
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambah level",
    });
  }
};

// ===========================
// UPDATE LEVEL
// ===========================
export const updateLevelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { nama_level, nilai_level } = req.body;

    const check = await prisma.level.findUnique({
      where: { id },
    });

    if (!check) {
      return res.status(404).json({
        message: "Level tidak ditemukan",
      });
    }

    const level = await prisma.level.update({
      where: { id },
      data: {
        nama_level: nama_level,
        nilai_level: Number(nilai_level),
      },
    });

    res.json(level);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengupdate level",
    });
  }
};

// ===========================
// DELETE LEVEL
// ===========================
export const deleteLevelById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const check = await prisma.level.findUnique({
      where: { id },
    });

    if (!check) {
      return res.status(404).json({
        message: "Level tidak ditemukan",
      });
    }

    await prisma.level.delete({
      where: { id },
    });

    res.json({
      message: "Level berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus level",
    });
  }
};