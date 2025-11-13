import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './docs/swagger.json' assert { type: 'json' };
import sequelize from './config/database.js';

import '../models/Role.js';
import '../models/Permission.js';
import '../models/User.js';
import '../models/Customer.js';


import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
//import customerRoutes from './routes/customerRoutes.js';
import customerRoutes from './routes/customerRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize
  .sync({ alter: true })
  .then(() => console.log('🟢 Database synced'))
  .catch((err) => console.error('❌ Database connection error:', err));

app.get('/', (req, res) => res.send('Bizcocho API ready 🧁'));

export default app;