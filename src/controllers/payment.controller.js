const Payment = require('../models/payment.model');
const Booking = require('../models/booking.model');

exports.payBooking = async (req, res) => {
  const { bookingId, method } = req.body;
  const userId = req.user?.id || req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const booking = await Booking.findOne({
    _id: bookingId,
    userId,
    status: 'CONFIRMED'
  });

  if (!booking) {
    return res.status(400).json({ message: 'Booking not payable' });
  }

  const exists = await Payment.findOne({ bookingId });
  if (exists) {
    return res.status(409).json({ message: 'Already paid' });
  }

  const payment = await Payment.create({
    bookingId,
    amount: booking.totalPrice,
    method,
    status: 'PAID'
  });

  res.status(201).json(payment);
};

exports.refundPayment = async (req, res) => {
  const payment = await Payment.findOneAndUpdate(
    {
      bookingId: req.params.bookingId,
      status: 'PAID'
    },
    {
      $set: { status: 'REFUNDED' }
    },
    { new: true }
  );

  if (!payment) {
    return res.status(404).json({ message: 'No refundable payment found' });
  }

  res.json(payment);
};

exports.getPaymentStatus = async (req, res) => {
  const payment = await Payment.findOne({ bookingId: req.params.bookingId });

  if (!payment) {
    return res.json({ paid: false });
  }

  res.json({
    paid: payment.status === 'PAID',
    status: payment.status
  });
};

