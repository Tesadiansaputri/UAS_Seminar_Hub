import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

// ==============================
// GET ALL
// ==============================
export const getAllKelengkapanFasilitas = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await prisma.kelengkapanFasilitas.findMany({
      include: {
        seminar: true,
        fasilitas: true,
      },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data kelengkapan fasilitas",
    });
  }
};

// ==============================
// GET BY ID
// ==============================
export const getKelengkapanFasilitasById = async (
  req: Request,
  res: Response
) => {
  try {
    const { seminarId, fasilitasId } = req.params;

    const data = await prisma.kelengkapanFasilitas.findUnique({
      where: {
        seminarId_fasilitasId: {
          seminarId: Number(seminarId),
          fasilitasId: Number(fasilitasId),
        },
      },
      include: {
        seminar: true,
        fasilitas: true,
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
export const createKelengkapanFasilitas = async (
  req: Request,
  res: Response
) => {
  try {
    const { seminarId, fasilitasId } = req.body;

    if (!seminarId || !fasilitasId) {
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

    const fasilitas = await prisma.fasilitas.findUnique({
      where: {
        id: Number(fasilitasId),
      },
    });

    if (!fasilitas) {
      return res.status(404).json({
        error: "Fasilitas tidak ditemukan",
      });
    }

    const data = await prisma.kelengkapanFasilitas.create({
      data: {
        seminarId: Number(seminarId),
        fasilitasId: Number(fasilitasId),
      },
      include: {
        seminar: true,
        fasilitas: true,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal menambahkan data",
    });
  }
};

// ==============================
// UPDATE
// ==============================
// Karena PK gabungan, biasanya tidak perlu UPDATE.
// Jika ingin mengganti relasi, praktik yang umum adalah
// menghapus relasi lama lalu membuat relasi baru.
export const updateKelengkapanFasilitas = async (
  req: Request,
  res: Response
) => {
  return res.status(405).json({
    message:
      "Relasi menggunakan primary key gabungan. Hapus lalu buat ulang jika ingin mengubah data.",
  });
};

// ==============================
// DELETE
// ==============================
export const deleteKelengkapanFasilitas = async (
  req: Request,
  res: Response
) => {
  try {
    const { seminarId, fasilitasId } = req.params;

    await prisma.kelengkapanFasilitas.delete({
      where: {
        seminarId_fasilitasId: {
          seminarId: Number(seminarId),
          fasilitasId: Number(fasilitasId),
        },
      },
    });

    res.json({
      message: "Data berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus data",
    });
  }
};