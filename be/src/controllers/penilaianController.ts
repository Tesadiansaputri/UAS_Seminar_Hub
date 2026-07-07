import { Request, Response } from 'express';
import { prisma } from '../lib/db.js';

// 1. Menampilkan semua data penilaian
export const getAllPenilaian = async (req: Request, res: Response) => {
  try {
    const penilaian = await prisma.penilaian.findMany({
      include: {
        user: true,
        seminar: true
      },
      orderBy: { id: 'desc' }
    });

    res.json(penilaian);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data penilaian" });
  }
};

// 2. Menampilkan data penilaian berdasarkan id
export const getPenilaianById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const penilaian = await prisma.penilaian.findUnique({
      where: { id: Number(id) },
      include: {
        user: true,
        seminar: true
      }
    });

    if (!penilaian) {
      return res.status(404).json({ error: "Penilaian tidak ditemukan" });
    }

    res.json(penilaian);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data penilaian" });
  }
};

// 3. Menyimpan data penilaian
export const createPenilaian = async (req: Request, res: Response) => {
  try {
    const { id_seminar, id_user, relevansi_kategori, rating_pembicara } = req.body;

    if (!id_seminar || !id_user || relevansi_kategori === undefined) {
      return res.status(400).json({ error: "Field id_seminar, id_user, dan relevansi_kategori wajib diisi" });
    }

    // Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(id_user) }
    });

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Validate seminar exists
    const seminar = await prisma.seminar.findUnique({
      where: { id: Number(id_seminar) }
    });

    if (!seminar) {
      return res.status(404).json({ error: "Seminar tidak ditemukan" });
    }

    // Check if penilaian already exists for this seminar (unique constraint)
    const existingPenilaian = await prisma.penilaian.findUnique({
      where: { id_seminar: Number(id_seminar) }
    });

    if (existingPenilaian) {
      return res.status(409).json({ error: "Penilaian untuk seminar ini sudah ada" });
    }

    const newPenilaian = await prisma.penilaian.create({
      data: {
        id_seminar: Number(id_seminar),
        id_user: Number(id_user),
        relevansi_kategori: Number(relevansi_kategori),
        ...(rating_pembicara !== undefined && { rating_pembicara: Number(rating_pembicara) })
      },
      include: {
        user: true,
        seminar: true
      }
    });

    res.status(201).json({
      message: "Penilaian berhasil ditambahkan",
      data: newPenilaian
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal menyimpan penilaian" });
  }
};

// 4. Mengupdate data penilaian berdasarkan id
export const updatePenilaianById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id_seminar, id_user, relevansi_kategori, rating_pembicara } = req.body;

    const penilaian = await prisma.penilaian.findUnique({
      where: { id: Number(id) }
    });

    if (!penilaian) {
      return res.status(404).json({ error: "Penilaian tidak ditemukan" });
    }

    // Validate user exists if provided
    if (id_user) {
      const user = await prisma.user.findUnique({
        where: { id: Number(id_user) }
      });
      if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }
    }

    // Validate seminar exists if provided
    if (id_seminar && id_seminar !== penilaian.id_seminar) {
      const seminar = await prisma.seminar.findUnique({
        where: { id: Number(id_seminar) }
      });
      if (!seminar) {
        return res.status(404).json({ error: "Seminar tidak ditemukan" });
      }

      // Check unique constraint for new id_seminar
      const existingPenilaian = await prisma.penilaian.findUnique({
        where: { id_seminar: Number(id_seminar) }
      });
      if (existingPenilaian) {
        return res.status(409).json({ error: "Penilaian untuk seminar ini sudah ada" });
      }
    }

    const updatedPenilaian = await prisma.penilaian.update({
      where: { id: Number(id) },
      data: {
        ...(id_seminar && { id_seminar: Number(id_seminar) }),
        ...(id_user && { id_user: Number(id_user) }),
        ...(relevansi_kategori !== undefined && { relevansi_kategori: Number(relevansi_kategori) }),
        ...(rating_pembicara !== undefined && { rating_pembicara: rating_pembicara === null ? null : Number(rating_pembicara) })
      },
      include: {
        user: true,
        seminar: true
      }
    });

    res.json({
      message: "Penilaian berhasil diupdate",
      data: updatedPenilaian
    });
  } catch (err) {
    res.status(500).json({ error: "Gagal mengupdate penilaian" });
  }
};

// 5. Menghapus data penilaian berdasarkan id
export const deletePenilaianById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const penilaian = await prisma.penilaian.findUnique({
      where: { id: Number(id) }
    });

    if (!penilaian) {
      return res.status(404).json({ error: "Penilaian tidak ditemukan" });
    }

    await prisma.penilaian.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Penilaian berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal menghapus penilaian" });
  }
};

// 6. Get penilaian by seminar id
export const getPenilaianBySeminarId = async (req: Request, res: Response) => {
  try {
    const { seminarId } = req.params;

    const penilaian = await prisma.penilaian.findUnique({
      where: { id_seminar: Number(seminarId) },
      include: {
        user: true,
        seminar: true
      }
    });

    if (!penilaian) {
      return res.status(404).json({ error: "Penilaian untuk seminar ini tidak ditemukan" });
    }

    res.json(penilaian);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data penilaian" });
  }
};

// 7. Get penilaian by user id
export const getPenilaianByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const penilaian = await prisma.penilaian.findMany({
      where: { id_user: Number(userId) },
      include: {
        user: true,
        seminar: true
      },
      orderBy: { id: 'desc' }
    });

    if (penilaian.length === 0) {
      return res.status(404).json({ error: "Penilaian untuk user ini tidak ditemukan" });
    }

    res.json(penilaian);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data penilaian" });
  }
};