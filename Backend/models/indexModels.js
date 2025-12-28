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
import RawMaterial from './RawMaterial.js';
import ProductRecipe from './ProductRecipe.js';
import Production from './Production.js';

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
  AuditLog,
  RawMaterial,
  ProductRecipe,
  Production
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

RawMaterial.hasMany(ProductRecipe, { foreignKey: 'raw_material_id', as: 'recipes' });
ProductRecipe.belongsTo(RawMaterial, { foreignKey: 'raw_material_id', as: 'rawMaterial' });

// Relaciones Product - Recipe
Product.hasMany(ProductRecipe, { foreignKey: 'product_id', as: 'recipes' });
ProductRecipe.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Relaciones Production
Product.hasMany(Production, { foreignKey: 'product_id', as: 'productions' });
Production.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Production, { foreignKey: 'user_id', as: 'productions' });
Production.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

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
  AuditLog ,
  RawMaterial,
  ProductRecipe,
  Production
};

export default models;