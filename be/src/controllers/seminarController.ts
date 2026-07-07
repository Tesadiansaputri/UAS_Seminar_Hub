import { Request, Response } from "express";
import { prisma } from "../lib/db.js";


// ==============================
// GET ALL SEMINAR
// ==============================
export const getAllSeminars = async (req: Request, res: Response) => {
  try {
    const seminars = await prisma.seminar.findMany({
      include: {
        category: true,
        level: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        fasilitas: {
          include: {
            fasilitas: true
          }
        },
        hasil: true
      },
      orderBy: {
        id: "desc"
      }
    });

    const data = seminars.map((seminar) => ({
      ...seminar,
      harga: seminar.harga.toString()
    }));

    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data seminar"
    });
  }
};


// ==============================
// GET SEMINAR BY ID
// ==============================
export const getSeminarById = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const seminar = await prisma.seminar.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        category: true,
        level: true,
        speakers: {
          include: {
            speaker: true
          }
        },
        fasilitas: {
          include: {
            fasilitas: true
          }
        },
        hasil: true
      }
    });

    if (!seminar) {
      return res.status(404).json({
        error: "Seminar tidak ditemukan"
      });
    }

    res.json({
      ...seminar,
      harga: seminar.harga.toString()
    });

  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data seminar"
    });
  }
};


// ==============================
// CREATE SEMINAR
// ==============================
export const createSeminar = async (req: Request, res: Response) => {

  try {

    const {
      seminar_name,
      tanggal,
      harga,
      kuota_tersedia,
      id_category,
      id_level
    } = req.body;

    if (
      !seminar_name ||
      !tanggal ||
      !harga ||
      !kuota_tersedia ||
      !id_category ||
      !id_level
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi"
      });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id_category)
      }
    });

    if (!category) {
      return res.status(404).json({
        error: "Kategori tidak ditemukan"
      });
    }

    const level = await prisma.level.findUnique({
      where: {
        id: Number(id_level)
      }
    });

    if (!level) {
      return res.status(404).json({
        error: "Level tidak ditemukan"
      });
    }

    const seminar = await prisma.seminar.create({
      data: {
        seminar_name,
        tanggal: new Date(tanggal),
        harga: BigInt(harga),
        kuota_tersedia: Number(kuota_tersedia),
        id_category: Number(id_category),
        id_level: Number(id_level)
      }
    });

    res.status(201).json({
      ...seminar,
      harga: seminar.harga.toString()
    });

  } catch (error) {

    res.status(500).json({
      error: "Gagal menambahkan seminar"
    });

  }

};


// ==============================
// UPDATE SEMINAR
// ==============================
export const updateSeminarById = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    const {
      seminar_name,
      tanggal,
      harga,
      kuota_tersedia,
      id_category,
      id_level
    } = req.body;

    const check = await prisma.seminar.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!check) {
      return res.status(404).json({
        error: "Seminar tidak ditemukan"
      });
    }

    const seminar = await prisma.seminar.update({
      where: {
        id: Number(id)
      },
      data: {
        seminar_name,
        ...(tanggal && { tanggal: new Date(tanggal) }),
        ...(harga && { harga: BigInt(harga) }),
        ...(kuota_tersedia && { kuota_tersedia: Number(kuota_tersedia) }),
        ...(id_category && { id_category: Number(id_category) }),
        ...(id_level && { id_level: Number(id_level) })
      }
    });

    res.json({
      ...seminar,
      harga: seminar.harga.toString()
    });

  } catch (error) {

    res.status(500).json({
      error: "Gagal mengupdate seminar"
    });

  }

};


// ==============================
// DELETE SEMINAR
// ==============================
export const deleteSeminarById = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    const seminar = await prisma.seminar.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!seminar) {
      return res.status(404).json({
        error: "Seminar tidak ditemukan"
      });
    }

    await prisma.seminar.delete({
      where: {
        id: Number(id)
      }
    });

    res.json({
      message: "Seminar berhasil dihapus"
    });

  } catch (error) {

    res.status(500).json({
      error: "Gagal menghapus seminar"
    });

  }

};