import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  resetPassword,
  toggleUserStatus,
  getUsersByRole,
  getActiveUsers
} from '../controllers/userController.js';

const router = express.Router();

router.get('/', getUsers);                             
router.get('/active', getActiveUsers);                  
router.get('/role/:roleId', getUsersByRole);            
router.get('/:id', getUserById);                      
router.post('/', createUser);                           
router.put('/:id', updateUser);                        
router.delete('/:id', deleteUser);                      

router.put('/:id/change-password', changePassword);     
router.put('/:id/reset-password', resetPassword);       

router.patch('/:id/toggle-status', toggleUserStatus);   

export default router;