import Unit from '../../models/Unit.js';
import ProductUnit from '../../models/ProductUnit.js';
import Product from '../../models/Product.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';


export const getUnits = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = '',
      type = '',
      active = '',
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { abbreviation: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (active !== '') {
      where.active = active === 'true';
    }

    const { count, rows } = await Unit.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['type', 'ASC'], ['name', 'ASC']],
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error al obtener unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener unidades',
      error: error.message,
    });
  }
};

// Obtener unidad por ID
export const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByPk(id, {
      include: [
        {
          model: ProductUnit,
          as: 'product_units',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'code'],
            },
          ],
        },
      ],
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }

    res.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error('Error al obtener unidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener unidad',
      error: error.message,
    });
  }
};

// Crear unidad
export const createUnit = async (req, res) => {
  try {
    const {
      name,
      abbreviation,
      type,
      base_unit,
      conversion_factor,
      active,
    } = req.body;

    // Verificar si ya existe
    const existing = await Unit.findOne({
      where: {
        [Op.or]: [
          { name: name },
          { abbreviation: abbreviation },
        ],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una unidad con ese nombre o abreviación',
      });
    }

    const unit = await Unit.create({
      name,
      abbreviation,
      type,
      base_unit,
      conversion_factor,
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: 'Unidad creada exitosamente',
      data: unit,
    });
  } catch (error) {
    console.error('Error al crear unidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear unidad',
      error: error.message,
    });
  }
};

// Actualizar unidad
export const updateUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      abbreviation,
      type,
      base_unit,
      conversion_factor,
      active,
    } = req.body;

    const unit = await Unit.findByPk(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }

    // Verificar duplicados si cambió nombre o abreviación
    if (name && name !== unit.name) {
      const existing = await Unit.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una unidad con ese nombre',
        });
      }
    }

    if (abbreviation && abbreviation !== unit.abbreviation) {
      const existing = await Unit.findOne({ where: { abbreviation } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una unidad con esa abreviación',
        });
      }
    }

    await unit.update({
      name: name || unit.name,
      abbreviation: abbreviation || unit.abbreviation,
      type: type || unit.type,
      base_unit: base_unit !== undefined ? base_unit : unit.base_unit,
      conversion_factor: conversion_factor !== undefined ? conversion_factor : unit.conversion_factor,
      active: active !== undefined ? active : unit.active,
    });

    res.json({
      success: true,
      message: 'Unidad actualizada exitosamente',
      data: unit,
    });
  } catch (error) {
    console.error('Error al actualizar unidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar unidad',
      error: error.message,
    });
  }
};

// Eliminar unidad
export const deleteUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const unit = await Unit.findByPk(id);

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada',
      });
    }

    // Verificar si está en uso
    const inUse = await ProductUnit.count({ where: { unit_id: id } });

    if (inUse > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar. La unidad está siendo usada por ${inUse} producto(s)`,
      });
    }

    await unit.destroy();

    res.json({
      success: true,
      message: 'Unidad eliminada exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar unidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar unidad',
      error: error.message,
    });
  }
};

// ====================================
// GESTIÓN DE UNIDADES POR PRODUCTO
// ====================================

// Obtener unidades de un producto
export const getProductUnits = async (req, res) => {
  try {
    const { product_id } = req.params;

    const productUnits = await ProductUnit.findAll({
      where: { product_id },
      include: [
        {
          model: Unit,
          as: 'unit',
        },
      ],
      order: [['is_base_unit', 'DESC']],
    });

    res.json({
      success: true,
      data: productUnits,
    });
  } catch (error) {
    console.error('Error al obtener unidades del producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener unidades del producto',
      error: error.message,
    });
  }
};

// Configurar unidades para un producto
export const configureProductUnits = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { product_id } = req.params;
    const { units } = req.body; // Array de configuraciones de unidades

    // Verificar que el producto existe
    const product = await Product.findByPk(product_id);
    if (!product) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    // Validar que solo haya una unidad base
    const baseUnits = units.filter(u => u.is_base_unit);
    if (baseUnits.length !== 1) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Debe haber exactamente una unidad base',
      });
    }

    // Eliminar configuraciones anteriores
    await ProductUnit.destroy({
      where: { product_id },
      transaction,
    });

    // Crear nuevas configuraciones
    const productUnits = await ProductUnit.bulkCreate(
      units.map(u => ({
        product_id,
        unit_id: u.unit_id,
        quantity: u.quantity || 1,
        is_base_unit: u.is_base_unit || false,
        is_sales_unit: u.is_sales_unit || false,
        is_purchase_unit: u.is_purchase_unit || false,
        price_modifier: u.price_modifier || null,
      })),
      { transaction }
    );

    await transaction.commit();

    // Obtener configuraciones con información de unidades
    const result = await ProductUnit.findAll({
      where: { product_id },
      include: [
        {
          model: Unit,
          as: 'unit',
        },
      ],
    });

    res.json({
      success: true,
      message: 'Unidades configuradas exitosamente',
      data: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al configurar unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al configurar unidades del producto',
      error: error.message,
    });
  }
};

// ====================================
// CONVERSIÓN DE UNIDADES
// ====================================

// Convertir cantidad entre unidades de un producto
export const convertProductUnits = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity, from_unit_id, to_unit_id } = req.body;

    if (!quantity || !from_unit_id || !to_unit_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros: quantity, from_unit_id, to_unit_id',
      });
    }

    const converted = await ProductUnit.convertBetweenUnits(
      product_id,
      parseFloat(quantity),
      from_unit_id,
      to_unit_id
    );

    // Obtener información de las unidades
    const [fromUnit, toUnit] = await Promise.all([
      ProductUnit.findOne({
        where: { product_id, unit_id: from_unit_id },
        include: [{ model: Unit, as: 'unit' }],
      }),
      ProductUnit.findOne({
        where: { product_id, unit_id: to_unit_id },
        include: [{ model: Unit, as: 'unit' }],
      }),
    ]);

    res.json({
      success: true,
      data: {
        original: {
          quantity: parseFloat(quantity),
          unit: fromUnit.unit.name,
          abbreviation: fromUnit.unit.abbreviation,
        },
        converted: {
          quantity: converted,
          unit: toUnit.unit.name,
          abbreviation: toUnit.unit.abbreviation,
        },
      },
    });
  } catch (error) {
    console.error('Error al convertir unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al convertir unidades',
      error: error.message,
    });
  }
};

// Convertir entre unidades globales (sin producto específico)
export const convertGlobalUnits = async (req, res) => {
  try {
    const { quantity, from_unit_id, to_unit_id } = req.body;

    if (!quantity || !from_unit_id || !to_unit_id) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros: quantity, from_unit_id, to_unit_id',
      });
    }

    const converted = await Unit.convert(
      parseFloat(quantity),
      from_unit_id,
      to_unit_id
    );

    // Obtener información de las unidades
    const [fromUnit, toUnit] = await Promise.all([
      Unit.findByPk(from_unit_id),
      Unit.findByPk(to_unit_id),
    ]);

    res.json({
      success: true,
      data: {
        original: {
          quantity: parseFloat(quantity),
          unit: fromUnit.name,
          abbreviation: fromUnit.abbreviation,
        },
        converted: {
          quantity: converted,
          unit: toUnit.name,
          abbreviation: toUnit.abbreviation,
        },
      },
    });
  } catch (error) {
    console.error('Error al convertir unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al convertir unidades',
      error: error.message,
    });
  }
};

// Obtener tabla de conversiones de un producto
export const getProductConversionTable = async (req, res) => {
  try {
    const { product_id } = req.params;

    const productUnits = await ProductUnit.findAll({
      where: { product_id },
      include: [
        {
          model: Unit,
          as: 'unit',
        },
      ],
    });

    if (productUnits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hay unidades configuradas para este producto',
      });
    }

    // Crear tabla de conversiones
    const conversionTable = [];

    for (const fromUnit of productUnits) {
      for (const toUnit of productUnits) {
        if (fromUnit.id !== toUnit.id) {
          const converted = await ProductUnit.convertBetweenUnits(
            product_id,
            1,
            fromUnit.unit_id,
            toUnit.unit_id
          );

          conversionTable.push({
            from: {
              unit_id: fromUnit.unit_id,
              name: fromUnit.unit.name,
              abbreviation: fromUnit.unit.abbreviation,
            },
            to: {
              unit_id: toUnit.unit_id,
              name: toUnit.unit.name,
              abbreviation: toUnit.unit.abbreviation,
            },
            conversion: `1 ${fromUnit.unit.abbreviation} = ${converted} ${toUnit.unit.abbreviation}`,
            factor: converted,
          });
        }
      }
    }

    res.json({
      success: true,
      data: conversionTable,
    });
  } catch (error) {
    console.error('Error al obtener tabla de conversiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tabla de conversiones',
      error: error.message,
    });
  }
};