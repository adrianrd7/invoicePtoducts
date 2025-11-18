import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateStock,
  getLowStockProducts,
  getProductStats,
  bulkUpdateStock
} from '../controllers/productController.js';
import { authenticate, checkPermission } from '../middleware/permissions.js';

const router = express.Router();

router.get('/stats', 
  authenticate, 
  checkPermission('products', 'view'),
  getProductStats
);

router.get('/low-stock', 
  authenticate, 
  checkPermission('products', 'view'),
  getLowStockProducts
);

router.post('/bulk-stock', 
  authenticate, 
  checkPermission('products', 'edit'),
  bulkUpdateStock
);

router.get('/', 
  authenticate, 
  checkPermission('products', 'view'),
  getProducts
);

router.get('/:id', 
  authenticate, 
  checkPermission('products', 'view'),
  getProductById
);

router.post('/', 
  authenticate, 
  checkPermission('products', 'create'),
  createProduct
);

router.put('/:id', 
  authenticate, 
  checkPermission('products', 'edit'),
  updateProduct
);

router.delete('/:id', 
  authenticate, 
  checkPermission('products', 'delete'),
  deleteProduct
);

router.patch('/:id/toggle-status', 
  authenticate, 
  checkPermission('products', 'edit'),
  toggleProductStatus
);

router.patch('/:id/stock', 
  authenticate, 
  checkPermission('products', 'edit'),
  updateStock
);

export default router;