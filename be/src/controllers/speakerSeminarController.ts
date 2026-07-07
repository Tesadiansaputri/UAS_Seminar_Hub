import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL PENGISI MATERI
// ==============================
export const getAllSpeakerSeminar = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.speakerSeminar.findMany({
      include: {
        seminar: true,
        speaker: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data pengisi materi",
    });
  }
};

// ==============================
// GET BY ID
// ==============================
export const getSpeakerSeminarById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const data = await prisma.speakerSeminar.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        seminar: true,
        speaker: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        error: "Data tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data",
    });
  }
};

// ==============================
// CREATE
// ==============================
export const createSpeakerSeminar = async (
  req: Request,
  res: Response
) => {
  try {
    const { seminarId, speakerId } = req.body;

    if (!seminarId || !speakerId) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
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

    const data = await prisma.speakerSeminar.create({
      data: {
        seminarId: Number(seminarId),
        speakerId: Number(speakerId),
      },
      include: {
        seminar: true,
        speaker: true,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan pengisi materi",
    });
  }
};

// ==============================
// UPDATE
// ==============================
export const updateSpeakerSeminarById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { seminarId, speakerId } = req.body;

    const check = await prisma.speakerSeminar.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Data tidak ditemukan",
      });
    }

    const data = await prisma.speakerSeminar.update({
      where: {
        id: Number(id),
      },
      data: {
        seminarId: Number(seminarId),
        speakerId: Number(speakerId),
      },
      include: {
        seminar: true,
        speaker: true,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengupdate data",
    });
  }
};

// ==============================
// DELETE
// ==============================
export const deleteSpeakerSeminarById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const check = await prisma.speakerSeminar.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Data tidak ditemukan",
      });
    }

    await prisma.speakerSeminar.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Pengisi materi berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus data",
    });
  }
};