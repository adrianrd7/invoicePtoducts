import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getInvoicesByCustomer,
  getInvoiceStats
} from '../controllers/invoiceController.js';
import { authenticate, checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.get('/stats', 
  authenticate, 
  checkPermission('invoices', 'view'),
  getInvoiceStats
);

router.get('/customer/:customer_id', 
  authenticate, 
  checkPermission('invoices', 'view'),
  getInvoicesByCustomer
);

router.get('/', 
  authenticate, 
  checkPermission('invoices', 'view'),
  getInvoices
);

router.get('/:id', 
  authenticate, 
  checkPermission('invoices', 'view'),
  getInvoiceById
);

router.post('/', 
  authenticate, 
  checkPermission('invoices', 'create'),
  createInvoice
);

// Actualizar factura - requiere permiso de edición
router.put('/:id', 
  authenticate, 
  checkPermission('invoices', 'edit'),
  updateInvoice
);

router.delete('/:id', 
  authenticate, 
  checkPermission('invoices', 'delete'),
  deleteInvoice
);

router.patch('/:id/status', 
  authenticate, 
  checkPermission('invoices', 'edit'),
  updateInvoiceStatus
);

export default router;