import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const ProductUnit = sequelize.define(
  'ProductUnit',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'units',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: { args: [0], msg: 'La cantidad debe ser positiva' },
      },
      comment: 'Cantidad de unidades base que contiene (ej: 1 funda = 8 bizcochos)',
    },
    is_base_unit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica si es la unidad base del producto (para stock)',
    },
    is_sales_unit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica si se puede vender en esta unidad',
    },
    is_purchase_unit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Indica si se puede comprar en esta unidad',
    },
    price_modifier: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Precio específico para esta presentación. Si no se define, se calcula: precio_base × quantity',
    },
  },
  {
    tableName: 'product_units',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['product_id', 'unit_id'],
        name: 'unique_product_unit',
      },
      {
        fields: ['product_id', 'is_base_unit'],
        name: 'idx_product_base_unit',
      },
    ],
  }
);

ProductUnit.prototype.toBaseUnit = function(quantity) {
  return quantity * parseFloat(this.quantity);
};

ProductUnit.prototype.fromBaseUnit = function(baseQuantity) {
  return baseQuantity / parseFloat(this.quantity);
};

ProductUnit.convertBetweenUnits = async function(
  productId,
  quantity,
  fromUnitId,
  toUnitId
) {
  if (fromUnitId === toUnitId) {
    return quantity;
  }

  const fromProductUnit = await ProductUnit.findOne({
    where: {
      product_id: productId,
      unit_id: fromUnitId,
    },
  });

  const toProductUnit = await ProductUnit.findOne({
    where: {
      product_id: productId,
      unit_id: toUnitId,
    },
  });

  if (!fromProductUnit || !toProductUnit) {
    throw new Error('Configuración de unidad no encontrada para este producto');
  }

  const baseQuantity = fromProductUnit.toBaseUnit(quantity);

  return toProductUnit.fromBaseUnit(baseQuantity);
};

ProductUnit.getBaseUnit = async function(productId) {
  return await ProductUnit.findOne({
    where: {
      product_id: productId,
      is_base_unit: true,
    },
    include: ['unit'],
  });
};

ProductUnit.associate = (models) => {
  ProductUnit.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
  
  ProductUnit.belongsTo(models.Unit, {
    foreignKey: 'unit_id',
    as: 'unit'
  });
};


export default ProductUnit;