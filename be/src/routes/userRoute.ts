import { Router } from 'express';
import {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById
} from '../controllers/userController.js';

const router = Router();

router.get('/', getAllUsers);        // GET /api/users
router.post('/', createUser);       // POST /api/users
router.get('/:id', getUserById);    // GET /api/users/1
router.put('/:id', updateUserById); // PUT /api/users/1
router.delete('/:id', deleteUserById); // DELETE /api/users/1

export default router;