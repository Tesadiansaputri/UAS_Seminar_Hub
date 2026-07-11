import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// GET ALL
export const getAllSubKriteria = async (req: Request, res: Response) => {
  try {
    const data = await prisma.subKriteria.findMany({
      orderBy: {
        jenis: "asc",
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data sub kriteria",
    });
  }
};

// GET BY ID
export const getSubKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const data = await prisma.subKriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!data) {
      return res.status(404).json({
        error: "Sub kriteria tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data",
    });
  }
};

// CREATE
export const createSubKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const { jenis, nama, nilai } = req.body;

    if (!jenis || !nama || nilai === undefined) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const data = await prisma.subKriteria.create({
      data: {
        jenis,
        nama,
        nilai: Number(nilai),
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan sub kriteria",
    });
  }
};

// UPDATE
export const updateSubKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { jenis, nama, nilai } = req.body;

    const check = await prisma.subKriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Sub kriteria tidak ditemukan",
      });
    }

    const data = await prisma.subKriteria.update({
      where: {
        id: Number(id),
      },
      data: {
        jenis,
        nama,
        nilai: Number(nilai),
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate sub kriteria",
    });
  }
};

// DELETE
export const deleteSubKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.subKriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Sub kriteria tidak ditemukan",
      });
    }

    await prisma.subKriteria.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Sub kriteria berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus sub kriteria",
    });
  }
};