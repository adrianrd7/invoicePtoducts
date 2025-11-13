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

const router = express.Router();

router.get('/stats', getCustomerStats);
router.get('/final-consumer', getFinalConsumer);
router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.get('/identification/:identification', getCustomerByIdentification);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.patch('/:id/toggle-status', toggleCustomerStatus);

export default router;