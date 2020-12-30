const { Slot, Customer, Car, Payment } = require('../models/models');

exports.GetEmptySlots = async (req, res) => {
  const count = await Slot.count({ where: { Empty: true } });
  res.status(200).json({ count });
};

exports.SearchCustomer = async (req, res) => {
  const { Phone_Num } = req.body;

  const customer = await Customer.findOne({
    where: { Phone_Num },
  });
  res.status(200).json({ customer });
};

exports.SearchCar = async (req, res) => {
  const { Car_Plate_Numbers, Car_Plate_Letters } = req.body;

  const car = await Car.findOne({
    where: { Car_Plate_Letters, Car_Plate_Numbers },
  });

  res.status(200).json({ car });
};

exports.ReserveSlot = async (req, res) => {
  const {
    Name,
    Phone_Num,
    Car_Plate_Numbers,
    Car_Plate_Letters,
    Color,
    Model,
    carId,
    customerId,
    rate,
  } = req.body;

  let newCustomer;
  if (!customerId) {
    newCustomer = await Customer.create({ Name, Phone_Num });
  }

  let newCar;
  if (!carId) {
    newCar = await Car.create({
      Car_Plate_Numbers,
      Car_Plate_Letters,
      Model,
      Color,
    });
  }

  const selectedSlot = await Slot.findAll({
    limit: 1,
    where: { Empty: true },
    order: [['id', 'ASC']],
  });

  selectedSlot[0].Empty = false;
  await selectedSlot[0].save();

  const newPayment = await Payment.create({
    CustomerId: customerId || newCustomer.id,
    CarId: carId || newCar.id,
    Entering_Time: new Date(),
    SlotId: selectedSlot[0].id,
    Hourly_Rate: rate,
  });

  res.status(200).json({ paymentId: newPayment.id, slot: selectedSlot[0] });
};

exports.FinishPayment = async (req, res) => {
  const { paymentId, Car_Plate_Numbers, Car_Plate_Letters } = req.body;

  let payment;

  if (paymentId) {
    payment = await Payment.findByPk(paymentId);
    if (!payment || payment.Completed === true) {
      res.status(400);
    }
  } else {
    const car = await Car.findOne({
      where: { Car_Plate_Numbers, Car_Plate_Letters },
    });
    if (!car) {
      res.status(400);
    }
    payment = await Payment.findOne({
      where: { CarId: car.id, Completed: false },
    });
  }

  if (payment.Completed === true) {
    res.status(200).json(payment);
    return;
  }

  const nowTime = new Date();
  const duration = nowTime - new Date(payment.Entering_Time);
  const cost = (duration / 3600000) * payment.Hourly_Rate;

  payment.Exit_Time = nowTime;
  payment.Duration_Time = duration / 3600000;
  payment.cost = cost;
  payment.Completed = true;

  await payment.save();

  const slot = await Slot.findOne({ where: { id: payment.SlotId } });

  slot.Empty = true;

  await slot.save();

  res.status(200).json(payment);
};
