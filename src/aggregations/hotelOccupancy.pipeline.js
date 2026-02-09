const mongoose = require('mongoose');

module.exports = (hotelId, from, to) => ([
  {
    $match: {
      status: { $ne: 'CANCELED' },
      checkIn: { $lt: new Date(to) },
      checkOut: { $gt: new Date(from) }
    }
  },
  {
    $lookup: {
      from: 'rooms',
      localField: 'roomId',
      foreignField: '_id',
      as: 'room'
    }
  },
  { $unwind: '$room' },
  {
    $match: {
      'room.hotelId': new mongoose.Types.ObjectId(hotelId)
    }
  },
  {
    $group: {
      _id: '$room.hotelId',
      occupiedRooms: { $sum: 1 }
    }
  }
]);
