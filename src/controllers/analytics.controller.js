const Booking = require('../models/booking.model');
const occupancyPipeline = require('../aggregations/hotelOccupancy.pipeline');
const Payment = require('../models/payment.model');
const revenuePipeline = require('../aggregations/revenue.pipeline');

exports.hotelOccupancy = async (req, res) => {
  const { hotelId, from, to } = req.query;

  const result = await Booking.aggregate(
    occupancyPipeline(hotelId, from, to)
  );

  res.json(result[0] || { occupiedRooms: 0 });
};


exports.revenue = async (req, res) => {
  const { hotelId, from, to } = req.query;

  const result = await Payment.aggregate(
    revenuePipeline(hotelId, from, to)
  );

  res.json(result[0] || { totalRevenue: 0 });
};
