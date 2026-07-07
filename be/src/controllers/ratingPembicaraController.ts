import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL RATING
// ==============================
export const getAllRatingPembicara = async (
  req: Request,
  res: Response
) => {
  try {
    const ratings = await prisma.ratingPembicara.findMany({
      include: {
        user: true,
        speaker: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(ratings);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data rating pembicara",
    });
  }
};

// ==============================
// GET BY ID
// ==============================
export const getRatingPembicaraById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const rating = await prisma.ratingPembicara.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        speaker: true,
      },
    });

    if (!rating) {
      return res.status(404).json({
        error: "Rating tidak ditemukan",
      });
    }

    res.json(rating);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data rating",
    });
  }
};

// ==============================
// CREATE
// ==============================
export const createRatingPembicara = async (
  req: Request,
  res: Response
) => {
  try {
    const { rating, userId, speakerId } = req.body;

    if (
      rating === undefined ||
      !userId ||
      !speakerId
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

    const speaker = await prisma.speaker.findUnique({
      where: {
        id: Number(speakerId),
      },
    });

    if (!speaker) {
      return res.status(404).json({
        error: "Pembicara tidak ditemukan",
      });
    }

    const newRating = await prisma.ratingPembicara.create({
      data: {
        rating: Number(rating),
        userId: Number(userId),
        speakerId: Number(speakerId),
      },
      include: {
        user: true,
        speaker: true,
      },
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan rating",
    });
  }
};

// ==============================
// UPDATE
// ==============================
export const updateRatingPembicaraById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const check = await prisma.ratingPembicara.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Rating tidak ditemukan",
      });
    }

    const updated = await prisma.ratingPembicara.update({
      where: {
        id: Number(id),
      },
      data: {
        rating: Number(rating),
      },
      include: {
        user: true,
        speaker: true,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate rating",
    });
  }
};

// ==============================
// DELETE
// ==============================
export const deleteRatingPembicaraById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.ratingPembicara.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Rating tidak ditemukan",
      });
    }

    await prisma.ratingPembicara.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Rating berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus rating",
    });
  }
};