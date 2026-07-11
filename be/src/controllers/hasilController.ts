import { Request, Response } from "express";
import { prisma } from "../lib/db.js";

import { hitungSAW } from "../services/sawService.js";
import { hitungWP } from "../services/wpService.js";
import { hitungTOPSIS } from "../services/topsisService.js";


// ==============================
// GET ALL HASIL
// ==============================
export const getAllHasil = async (
  req: Request,
  res: Response
) => {
  try {

    const hasil = await prisma.hasil.findMany({
      include: {
        user: true,
        seminar: {
          include: {
            category: true,
            level: true,
          },
        },
      },
      orderBy: {
        ranking: "asc",
      },
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
export const getHasilById = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.params;

    const hasil = await prisma.hasil.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        seminar: {
          include: {
            category: true,
            level: true,
          },
        },
      },
    });

    if (!hasil) {
      return res.status(404).json({
        error: "Data hasil tidak ditemukan",
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
// CREATE HASIL (MANUAL)
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

    const hasil = await prisma.hasil.create({
      data: {
        userId: Number(userId),
        seminarId: Number(seminarId),
        metode,
        nilai: Number(nilai),
        ranking: Number(ranking),
      },
    });

    res.status(201).json(hasil);

  } catch (error) {

    res.status(500).json({
      error: "Gagal menambahkan hasil",
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

    const check = await prisma.hasil.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!check) {
      return res.status(404).json({
        error: "Data hasil tidak ditemukan",
      });
    }

    const {
      metode,
      nilai,
      ranking,
    } = req.body;

    const hasil = await prisma.hasil.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(metode && {
          metode,
        }),
        ...(nilai !== undefined && {
          nilai: Number(nilai),
        }),
        ...(ranking !== undefined && {
          ranking: Number(ranking),
        }),
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
        error: "Data hasil tidak ditemukan",
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
// ==============================
// HITUNG SPK (SAW / WP / TOPSIS)
// ==============================
export const calculateHasil = async (
  req: Request,
  res: Response
) => {
  try {

    const { userId } = req.params;
    const metode = (req.query.metode as string)?.toUpperCase();

    let hasil: any[] = [];

    switch (metode) {

      case "SAW":
        hasil = await hitungSAW(Number(userId));
        break;

      case "WP":
        hasil = await hitungWP(Number(userId));
        break;

      case "TOPSIS":
        hasil = await hitungTOPSIS(Number(userId));
        break;

      default:

      
        return res.status(400).json({
          error: "Metode harus SAW, WP, atau TOPSIS.",
        });

    }

    // ===========================
    // Hapus hasil lama
    // ===========================

    await prisma.hasil.deleteMany({
      where: {
        userId: Number(userId),
        metode,
      },
    });

    // ===========================
    // Simpan hasil baru
    // ===========================

    await prisma.hasil.createMany({
      data: hasil.map((item) => ({
        userId: Number(userId),
        seminarId: item.seminarId,
        metode,
        nilai: item.nilai,
        ranking: item.ranking,
      })),
    });

    // ===========================
    // Ambil hasil lengkap
    // ===========================

    const data = await prisma.hasil.findMany({
      where: {
        userId: Number(userId),
        metode,
      },
      include: {
        seminar: {
          include: {
            category: true,
            level: true,
          },
        },
      },
      orderBy: {
        ranking: "asc",
      },
    });

    res.json({
      message: `Perhitungan ${metode} berhasil`,
      data,
    });

  } catch (error: any) {

    res.status(500).json({
      error: error.message,
    });

  }
};