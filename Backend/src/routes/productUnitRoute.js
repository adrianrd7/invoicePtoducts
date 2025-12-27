import express from 'express';
import {
  getProductUnits,
  getProductUnitById,
  getProductUnitsByProduct,
  createProductUnit,
  updateProductUnit,
  deleteProductUnit,
  bulkCreateProductUnits
} from '../controllers/productUnitController.js';

const router = express.Router();


router.get('/', getProductUnits);
router.get('/:id', getProductUnitById);
router.get('/product/:productId', getProductUnitsByProduct);
router.post('/', createProductUnit);
router.post('/bulk', bulkCreateProductUnits);
router.put('/:id', updateProductUnit);
router.delete('/:id', deleteProductUnit);

export default router;
