const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  'postgres://rfcowecjbimker:55ac24392a4e4548c6cbfd25190b0eacd40bab08b2f4bfb06fb1aec180354cc1@ec2-52-212-157-46.eu-west-1.compute.amazonaws.com:5432/d3nj1eqe01ncl0',
  {
    dialect: 'postgres',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
      },
    },
  }
);

const Customer = sequelize.define(
  'Customer',
  {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone_Num: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Car = sequelize.define(
  'Car',
  {
    Car_Plate_Numbers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Car_Plate_Letters: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

const Slot = sequelize.define(
  'Slot',
  {
    Number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Direction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Empty: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

const Payment = sequelize.define(
  'Payment',
  {
    Entering_Time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    Exit_Time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Duration_Time: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    Completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    Hourly_Rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
const initDatabase = async () => {
  Payment.belongsTo(Customer);
  Payment.belongsTo(Car);
  Payment.belongsTo(Slot);

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
    //  await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  Customer,
  Car,
  Slot,
  Payment,
  initDatabase,
  sequelize,
};
