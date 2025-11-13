import express from 'express';
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions
} from '../controllers/roleController.js';

const router = express.Router();


router.get('/', getRoles);                              
router.get('/:id', getRoleById);                       
router.post('/', createRole);                          
router.put('/:id', updateRole);                        
router.delete('/:id', deleteRole);                      

router.get('/:id/permissions', getRolePermissions);     
router.put('/:id/permissions', updateRolePermissions);  

export default router;