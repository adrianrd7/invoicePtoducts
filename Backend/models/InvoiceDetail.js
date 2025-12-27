import { DataTypes } from 'sequelize';
import sequelize from '../src/config/database.js';
import { v4 as uuidv4 } from 'uuid';

const InvoiceDetail = sequelize.define(
  'InvoiceDetail',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'invoices',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'units',
        key: 'id',
      },
      onDelete: 'SET NULL',
    },
    unit_name: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        min: 0.001,
      },
    },
    quantity_base_unit: {
      type: DataTypes.DECIMAL(15, 6),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: 'invoice_details',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

InvoiceDetail.associate = (models) => {
  InvoiceDetail.belongsTo(models.Invoice, {
    foreignKey: 'invoice_id',
    as: 'invoice',
  });

  InvoiceDetail.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product',
  });

  InvoiceDetail.belongsTo(models.Unit, {
    foreignKey: 'unit_id',
    as: 'unit',
  });
};

export default InvoiceDetail;