import Role from './Role.js';
import Permission from './Permission.js';
import User from './User.js';
import Customer from './Customer.js';
import Product from './Product.js';
import Invoice from './Invoice.js';
import InvoiceDetail from './InvoiceDetail.js';
import Unit from './Unit.js';
import ProductUnit from './ProductUnit.js';
import Promotion from './Promotion.js';
import AuditLog from './AuditLog.js';

const models = {
  Role,
  Permission,
  User,
  Customer,
  Product,
  Invoice,
  InvoiceDetail,
  Unit,
  ProductUnit,
  Promotion,
  AuditLog
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { 
  Role, 
  Permission, 
  User, 
  Customer, 
  Product, 
  Invoice, 
  InvoiceDetail,
  Unit,           
  ProductUnit,
  Promotion,
  AuditLog     
};

export default models;