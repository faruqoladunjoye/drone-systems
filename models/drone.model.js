export default (sequelize, DataTypes) => {
  const drone = sequelize.define(
    'drone',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      serialNumber: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 100],
        },
      },
      model: {
        type: DataTypes.ENUM('Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight'),
        allowNull: false,
      },
      weightLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          max: 500,
          min: 1,
        },
      },
      batteryCapacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      state: {
        type: DataTypes.ENUM('IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'),
        defaultValue: 'IDLE',
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return drone;
};
