export default (sequelize, DataTypes) => {
  const batteryLog = sequelize.define(
    'batteryLog',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      batteryLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return batteryLog;
};
