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
import { authenticate, checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.get('/', 
  authenticate, 
  checkPermission('users', 'view'),
  getRoles
);

router.get('/:id/permissions', 
  authenticate, 
  checkPermission('users', 'view'),
  getRolePermissions
);

router.get('/:id', 
  authenticate, 
  checkPermission('users', 'view'),
  getRoleById
);

router.post('/', 
  authenticate, 
  checkPermission('users', 'create'),
  createRole
);

router.put('/:id', 
  authenticate, 
  checkPermission('users', 'edit'),
  updateRole
);

router.put('/:id/permissions', 
  authenticate, 
  checkPermission('users', 'edit'),
  updateRolePermissions
);

router.delete('/:id', 
  authenticate, 
  checkPermission('users', 'delete'),
  deleteRole
);

export default router;