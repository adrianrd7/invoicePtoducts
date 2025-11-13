import { DataTypes } from 'sequelize';
import sequelize from '../src/config/database.js';
import { v4 as uuidv4 } from 'uuid';
import Permission from './Permission.js';

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'roles',
    timestamps: true,
  }
);

Role.hasMany(Permission, { foreignKey: 'role_id', onDelete: 'CASCADE' });
Permission.belongsTo(Role, { foreignKey: 'role_id' });

export default Role;
