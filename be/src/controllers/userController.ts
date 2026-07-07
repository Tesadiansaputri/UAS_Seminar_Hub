import { Request, Response } from 'express';
import { prisma } from '../lib/db.js';
import bcrypt from 'bcrypt';

//1. menampilkan semua data user
export const getAllUsers = async (req: Request, res: Response) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
};

//2. menyimpan data user
export const createUser = async (req: Request, res: Response) => {
    const { nama, email, password } = req.body;

    if (!nama) {
        return res.status(400).json({ error: "Nama HARUS diisi" });
    }
    if (!email) {
        return res.status(400).json({ error: "Email HARUS diisi" });
    }
    if (!password) {
        return res.status(400).json({ error: "Password HARUS diisi" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name : nama,
            email,
            password: hashedPassword // Pastikan untuk meng-hash password sebelum menyimpannya
        }
    });

    res.json(newUser);
};

//3. menampilkan data user berdasarkan id
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id: Number(id) }
    });

    if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json(user);
};

//4. mengupdate data user berdasarkan id
export const updateUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nama, email, password } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: {
            name: nama,
            email,
            password: await bcrypt.hash(password, 10)
        }
    });

    res.json(updatedUser);
};

//5. menghapus data user berdasarkan id
export const deleteUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user.delete({
        where: { id: Number(id) }
    });

    res.json({ message: "User berhasil dihapus" });
};