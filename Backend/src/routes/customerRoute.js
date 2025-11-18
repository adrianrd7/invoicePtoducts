import express from 'express';
import {
  getCustomers,
  getCustomerById,
  getCustomerByIdentification,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getFinalConsumer,
  toggleCustomerStatus,
  getCustomerStats
} from '../controllers/customerController.js';
import { authenticate, checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.get('/stats', 
  authenticate, 
  checkPermission('customers', 'view'),
  getCustomerStats
);

router.get('/final-consumer', 
  authenticate, 
  checkPermission('customers', 'view'),
  getFinalConsumer
);

router.get('/', 
  authenticate, 
  checkPermission('customers', 'view'),
  getCustomers
);

router.get('/:id', 
  authenticate, 
  checkPermission('customers', 'view'),
  getCustomerById
);

router.get('/identification/:identification', 
  authenticate, 
  checkPermission('customers', 'view'),
  getCustomerByIdentification
);

router.post('/', 
  authenticate, 
  checkPermission('customers', 'create'),
  createCustomer
);

router.put('/:id', 
  authenticate, 
  checkPermission('customers', 'edit'),
  updateCustomer
);

router.delete('/:id', 
  authenticate, 
  checkPermission('customers', 'delete'),
  deleteCustomer
);

router.patch('/:id/toggle-status', 
  authenticate, 
  checkPermission('customers', 'edit'),
  toggleCustomerStatus
);

export default router;