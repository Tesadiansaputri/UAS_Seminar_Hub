import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL FASILITAS
// ==============================
export const getAllFasilitas = async (req: Request, res: Response) => {
  try {
    const fasilitas = await prisma.fasilitas.findMany({
      include: {
        seminar: {
          include: {
            seminar: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(fasilitas);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data fasilitas",
    });
  }
};

// ==============================
// GET FASILITAS BY ID
// ==============================
export const getFasilitasById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fasilitas = await prisma.fasilitas.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        seminar: {
          include: {
            seminar: true,
          },
        },
      },
    });

    if (!fasilitas) {
      return res.status(404).json({
        error: "Fasilitas tidak ditemukan",
      });
    }

    res.json(fasilitas);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data fasilitas",
    });
  }
};

// ==============================
// CREATE FASILITAS
// ==============================
export const createFasilitas = async (req: Request, res: Response) => {
  try {
    const { nama_fasilitas, nilai_fasilitas } = req.body;

    if (!nama_fasilitas || nilai_fasilitas === undefined) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const fasilitas = await prisma.fasilitas.create({
      data: {
        nama_fasilitas,
        nilai_fasilitas: Number(nilai_fasilitas),
      },
    });

    res.status(201).json(fasilitas);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan fasilitas",
    });
  }
};

// ==============================
// UPDATE FASILITAS
// ==============================
export const updateFasilitasById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { nama_fasilitas, nilai_fasilitas } = req.body;

    const check = await prisma.fasilitas.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Fasilitas tidak ditemukan",
      });
    }

    const fasilitas = await prisma.fasilitas.update({
      where: {
        id: Number(id),
      },
      data: {
        nama_fasilitas,
        nilai_fasilitas: Number(nilai_fasilitas),
      },
    });

    res.json(fasilitas);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate fasilitas",
    });
  }
};

// ==============================
// DELETE FASILITAS
// ==============================
export const deleteFasilitasById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.fasilitas.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Fasilitas tidak ditemukan",
      });
    }

    await prisma.fasilitas.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Fasilitas berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus fasilitas",
    });
  }
};