const mongoose = require('mongoose');

module.exports = (hotelId, from, to) => ([
  {
    $match: { status: 'PAID' }
  },
  {
    $lookup: {
      from: 'bookings',
      localField: 'bookingId',
      foreignField: '_id',
      as: 'booking'
    }
  },
  { $unwind: '$booking' },
  {
    $lookup: {
      from: 'rooms',
      localField: 'booking.roomId',
      foreignField: '_id',
      as: 'room'
    }
  },
  { $unwind: '$room' },
  {
    $match: {
      'room.hotelId': new mongoose.Types.ObjectId(hotelId),
      'booking.checkIn': { $gte: new Date(from) },
      'booking.checkOut': { $lte: new Date(to) }
    }
  },
  {
    $group: {
      _id: '$room.hotelId',
      totalRevenue: { $sum: '$amount' }
    }
  }
]);
