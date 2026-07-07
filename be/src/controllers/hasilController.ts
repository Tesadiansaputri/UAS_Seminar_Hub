import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL HASIL
// ==============================
export const getAllHasil = async (req: Request, res: Response) => {
  try {
    const hasil = await prisma.hasil.findMany({
      include: {
        user: true,
        seminar: true,
      },
      orderBy: [
        { metode: "asc" },
        { ranking: "asc" },
      ],
    });

    res.json(hasil);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data hasil",
    });
  }
};

// ==============================
// GET HASIL BY ID
// ==============================
export const getHasilById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hasil = await prisma.hasil.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        seminar: true,
      },
    });

    if (!hasil) {
      return res.status(404).json({
        error: "Hasil tidak ditemukan",
      });
    }

    res.json(hasil);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data hasil",
    });
  }
};

// ==============================
// CREATE HASIL
// ==============================
export const createHasil = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      seminarId,
      metode,
      nilai,
      ranking,
    } = req.body;

    if (
      !userId ||
      !seminarId ||
      !metode ||
      nilai === undefined ||
      ranking === undefined
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User tidak ditemukan",
      });
    }

    const seminar = await prisma.seminar.findUnique({
      where: {
        id: Number(seminarId),
      },
    });

    if (!seminar) {
      return res.status(404).json({
        error: "Seminar tidak ditemukan",
      });
    }

    const hasil = await prisma.hasil.create({
      data: {
        userId: Number(userId),
        seminarId: Number(seminarId),
        metode,
        nilai: Number(nilai),
        ranking: Number(ranking),
      },
      include: {
        user: true,
        seminar: true,
      },
    });

    res.status(201).json(hasil);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menyimpan hasil",
    });
  }
};

// ==============================
// UPDATE HASIL
// ==============================
export const updateHasilById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      userId,
      seminarId,
      metode,
      nilai,
      ranking,
    } = req.body;

    const check = await prisma.hasil.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Hasil tidak ditemukan",
      });
    }

    const hasil = await prisma.hasil.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(userId !== undefined && {
          userId: Number(userId),
        }),
        ...(seminarId !== undefined && {
          seminarId: Number(seminarId),
        }),
        ...(metode !== undefined && {
          metode,
        }),
        ...(nilai !== undefined && {
          nilai: Number(nilai),
        }),
        ...(ranking !== undefined && {
          ranking: Number(ranking),
        }),
      },
      include: {
        user: true,
        seminar: true,
      },
    });

    res.json(hasil);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate hasil",
    });
  }
};

// ==============================
// DELETE HASIL
// ==============================
export const deleteHasilById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.hasil.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Hasil tidak ditemukan",
      });
    }

    await prisma.hasil.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Hasil berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus hasil",
    });
  }
};