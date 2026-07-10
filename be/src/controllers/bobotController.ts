import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL BOBOT
// ==============================
export const getAllBobot = async (req: Request, res: Response) => {
  try {
    const bobot = await prisma.bobot.findMany({
      include: {
        user: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(bobot);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data bobot",
    });
  }
};

// ==============================
// GET BOBOT BY ID
// ==============================
export const getBobotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const bobot = await prisma.bobot.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
      },
    });

    if (!bobot) {
      return res.status(404).json({
        error: "Bobot tidak ditemukan",
      });
    }

    res.json(bobot);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data bobot",
    });
  }
};

// ==============================
// CREATE BOBOT
// ==============================
export const createBobot = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      bobot_harga,
      bobot_kuota,
      bobot_rating,
      bobot_level,
      bobot_fasilitas,
    } = req.body;

    if (
      !userId ||
      bobot_harga === undefined ||
      bobot_kuota === undefined ||
      bobot_rating === undefined ||
      bobot_level === undefined ||
      bobot_fasilitas === undefined
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

    const bobot = await prisma.bobot.create({
      data: {
        userId: Number(userId),
        bobot_harga: Number(bobot_harga),
        bobot_kuota: Number(bobot_kuota),
        bobot_rating: Number(bobot_rating),
        bobot_level: Number(bobot_level),
        bobot_fasilitas: Number(bobot_fasilitas),
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(bobot);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan bobot",
    });
  }
};

// ==============================
// UPDATE BOBOT
// ==============================
export const updateBobotById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      bobot_harga,
      bobot_kuota,
      bobot_rating,
      bobot_level,
      bobot_fasilitas,
    } = req.body;

    const check = await prisma.bobot.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Bobot tidak ditemukan",
      });
    }

    const bobot = await prisma.bobot.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(bobot_harga !== undefined && {
          bobot_harga: Number(bobot_harga),
        }),
        ...(bobot_kuota !== undefined && {
          bobot_kuota: Number(bobot_kuota),
        }),
        ...(bobot_rating !== undefined && {
          bobot_rating: Number(bobot_rating),
        }),
        ...(bobot_level !== undefined && {
          bobot_level: Number(bobot_level),
        }),
        ...(bobot_fasilitas !== undefined && {
          bobot_fasilitas: Number(bobot_fasilitas),
        }),
      },
      include: {
        user: true,
      },
    });

    res.json(bobot);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate bobot",
    });
  }
};

// ==============================
// DELETE BOBOT
// ==============================
export const deleteBobotById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.bobot.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Bobot tidak ditemukan",
      });
    }

    await prisma.bobot.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Bobot berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus bobot",
    });
  }
};