import Customer from '../models/Customer.js';
import sequelize from '../config/database.js';

const createFinalConsumer = async () => {
  try {
    await sequelize.sync();

    const existingConsumer = await Customer.findOne({
      where: { identification_type: 'final_consumer' }
    });

    if (existingConsumer) {
      console.log('✅ Final consumer already exists');
      return;
    }

    await Customer.create({
      identification_type: 'final_consumer',
      identification: '9999999999999',
      name: 'Final Consumer',
      active: true
    });

    console.log('✅ Final consumer created successfully');
  } catch (error) {
    console.error('❌ Error creating final consumer:', error);
  } finally {
    await sequelize.close();
  }
};

createFinalConsumer();