import Customer from '../../models/Customer.js';
import { Op } from 'sequelize';

export const getCustomers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      active, 
      search,
      identification_type 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    if (identification_type) {
      whereClause.identification_type = identification_type;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { identification: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Customer.findAndCountAll({ 
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']],
      distinct: true
    });

    const totalPages = Math.ceil(count / limit);
    const currentPage = parseInt(page);

    res.json({
      data: rows,
      pagination: {
        total: count,
        per_page: parseInt(limit),
        current_page: currentPage,
        total_pages: totalPages,
        from: offset + 1,
        to: offset + rows.length,
        has_next: currentPage < totalPages,
        has_prev: currentPage > 1
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching customers', 
      error: error.message 
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching customer', 
      error: error.message 
    });
  }
};

export const getCustomerByIdentification = async (req, res) => {
  try {
    const { identification } = req.params;
    const customer = await Customer.findOne({ 
      where: { identification } 
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching customer', 
      error: error.message 
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { 
      identification_type, 
      identification, 
      name, 
      email, 
      phone, 
      address 
    } = req.body;

    if (!identification || !name) {
      return res.status(400).json({ 
        message: 'Identification and name are required' 
      });
    }

    const validTypes = ['document_id', 'ruc', 'passport', 'final_consumer'];
    if (identification_type && !validTypes.includes(identification_type)) {
      return res.status(400).json({ 
        message: 'Invalid identification type' 
      });
    }

    const existingCustomer = await Customer.findOne({ 
      where: { identification } 
    });
    
    if (existingCustomer) {
      return res.status(400).json({ 
        message: 'Customer with this identification already exists' 
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }
    }

    const customer = await Customer.create({
      identification_type: identification_type || 'document_id',
      identification,
      name,
      email,
      phone,
      address
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating customer', 
      error: error.message 
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      identification_type, 
      identification, 
      name, 
      email, 
      phone, 
      address,
      active 
    } = req.body;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (identification && identification !== customer.identification) {
      const existingCustomer = await Customer.findOne({ 
        where: { identification } 
      });
      
      if (existingCustomer) {
        return res.status(400).json({ 
          message: 'Customer with this identification already exists' 
        });
      }
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }
    }

    if (identification_type) {
      const validTypes = ['document_id', 'ruc', 'passport', 'final_consumer'];
      if (!validTypes.includes(identification_type)) {
        return res.status(400).json({ 
          message: 'Invalid identification type' 
        });
      }
    }

    await customer.update({
      identification_type: identification_type || customer.identification_type,
      identification: identification || customer.identification,
      name: name || customer.name,
      email: email !== undefined ? email : customer.email,
      phone: phone !== undefined ? phone : customer.phone,
      address: address !== undefined ? address : customer.address,
      active: active !== undefined ? active : customer.active
    });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating customer', 
      error: error.message 
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.identification_type === 'final_consumer') {
      return res.status(400).json({ 
        message: 'Cannot delete final consumer' 
      });
    }

    await customer.destroy();

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting customer', 
      error: error.message 
    });
  }
};

export const getFinalConsumer = async (req, res) => {
  try {
    const finalConsumer = await Customer.findOne({
      where: { identification_type: 'final_consumer' }
    });

    if (!finalConsumer) {
      return res.status(404).json({ 
        message: 'Final consumer not found' 
      });
    }

    res.json(finalConsumer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching final consumer', 
      error: error.message 
    });
  }
};

export const toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (customer.identification_type === 'final_consumer' && customer.active) {
      return res.status(400).json({ 
        message: 'Cannot deactivate final consumer' 
      });
    }

    await customer.update({ active: !customer.active });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error toggling customer status', 
      error: error.message 
    });
  }
};

export const getCustomerStats = async (req, res) => {
  try {
    const total = await Customer.count();
    const active = await Customer.count({ where: { active: true } });
    const inactive = await Customer.count({ where: { active: false } });
    
    const byType = await Customer.findAll({
      attributes: [
        'identification_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['identification_type']
    });

    res.json({
      total,
      active,
      inactive,
      by_type: byType
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching customer statistics', 
      error: error.message 
    });
  }
};