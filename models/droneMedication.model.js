export default (sequelize, DataTypes) => {
  const droneMedication = sequelize.define(
    'droneMedication',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );

  return droneMedication;
};
