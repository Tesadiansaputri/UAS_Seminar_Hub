import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL KRITERIA
// ==============================
export const getAllKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const kriteria = await prisma.kriteria.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.json(kriteria);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data kriteria",
    });
  }
};

// ==============================
// GET KRITERIA BY ID
// ==============================
export const getKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const kriteria = await prisma.kriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!kriteria) {
      return res.status(404).json({
        error: "Kriteria tidak ditemukan",
      });
    }

    res.json(kriteria);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data kriteria",
    });
  }
};

// ==============================
// CREATE KRITERIA
// ==============================
export const createKriteria = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      kode,
      nama,
      jenis,
      sumber,
    } = req.body;

    if (
      !kode ||
      !nama ||
      !jenis ||
      !sumber
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const checkKode = await prisma.kriteria.findFirst({
      where: {
        kode,
      },
    });

    if (checkKode) {
      return res.status(400).json({
        error: "Kode kriteria sudah digunakan",
      });
    }

    const kriteria = await prisma.kriteria.create({
      data: {
        kode,
        nama,
        jenis,
        sumber,
      },
    });

    res.status(201).json(kriteria);

  } catch (error) {

    res.status(500).json({
      error: "Gagal menambahkan kriteria",
    });

  }
};

// ==============================
// UPDATE KRITERIA
// ==============================
export const updateKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      kode,
      nama,
      jenis,
      sumber,
    } = req.body;

    const check = await prisma.kriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Kriteria tidak ditemukan",
      });
    }

    if (kode && kode !== check.kode) {
      const checkKode = await prisma.kriteria.findFirst({
        where: {
          kode,
        },
      });

      if (checkKode) {
        return res.status(400).json({
          error: "Kode kriteria sudah digunakan",
        });
      }
    }

    const kriteria = await prisma.kriteria.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(kode && { kode }),
        ...(nama && { nama }),
        ...(jenis && { jenis }),
        ...(sumber && { sumber }),
      },
    });

    res.json(kriteria);

  } catch (error) {

    res.status(500).json({
      error: "Gagal mengupdate kriteria",
    });

  }
};

// ==============================
// DELETE KRITERIA
// ==============================
export const deleteKriteriaById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.kriteria.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Kriteria tidak ditemukan",
      });
    }

    await prisma.kriteria.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Kriteria berhasil dihapus",
    });

  } catch (error) {

    res.status(500).json({
      error: "Gagal menghapus kriteria",
    });

  }
};