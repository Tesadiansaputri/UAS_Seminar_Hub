import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// GET ALL SPEAKER
export const getAllSpeakers = async (req: Request, res: Response) => {
  try {
    const speakers = await prisma.speaker.findMany({
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

    res.json(speakers);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data pembicara",
    });
  }
};

// GET SPEAKER BY ID
export const getSpeakerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const speaker = await prisma.speaker.findUnique({
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

    if (!speaker) {
      return res.status(404).json({
        error: "Pembicara tidak ditemukan",
      });
    }

    res.json(speaker);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data pembicara",
    });
  }
};

// CREATE SPEAKER
export const createSpeaker = async (req: Request, res: Response) => {
  try {
    const {
      nama,
      email,
      bidang_keahlian,
      rating,
    } = req.body;

    if (
      !nama ||
      !email ||
      !bidang_keahlian ||
      rating === undefined
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }

    const checkEmail = await prisma.speaker.findUnique({
      where: {
        email,
      },
    });

    if (checkEmail) {
      return res.status(400).json({
        error: "Email sudah digunakan",
      });
    }

    const speaker = await prisma.speaker.create({
      data: {
        nama,
        email,
        bidang_keahlian,
        rating: Number(rating),
      },
    });

    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambah pembicara",
    });
  }
};

// UPDATE SPEAKER
export const updateSpeakerById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      nama,
      email,
      bidang_keahlian,
      rating,
    } = req.body;

    const checkSpeaker = await prisma.speaker.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkSpeaker) {
      return res.status(404).json({
        error: "Pembicara tidak ditemukan",
      });
    }

    const speaker = await prisma.speaker.update({
      where: {
        id: Number(id),
      },
      data: {
        nama,
        email,
        bidang_keahlian,
        rating: Number(rating),
      },
    });

    res.json(speaker);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate pembicara",
    });
  }
};

// DELETE SPEAKER
export const deleteSpeakerById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const checkSpeaker = await prisma.speaker.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!checkSpeaker) {
      return res.status(404).json({
        error: "Pembicara tidak ditemukan",
      });
    }

    await prisma.speaker.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Pembicara berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus pembicara",
    });
  }
};