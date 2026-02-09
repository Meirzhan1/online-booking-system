const mongoose = require("mongoose");
const Booking = require('../models/booking.model');
const Room = require('../models/room.model');

function parseDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function diffNights(checkIn, checkOut) {
  const ms = checkOut - checkIn;
  const nights = Math.ceil(ms / (24 * 60 * 60 * 1000));
  return nights;
}

exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    let inDate = parseDate(checkIn);
    let outDate = parseDate(checkOut);

    if (!inDate || !outDate) {
      inDate = new Date();
      outDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }


    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const conflict = await Booking.findOne({
      roomId,
      status: { $in: ["PENDING", "CONFIRMED"] },
      checkIn: { $lt: outDate },
      checkOut: { $gt: inDate }
    });

    if (conflict) {
      return res.status(400).json({ error: "Room is not available for selected dates" });
    }

    const nights = diffNights(inDate, outDate);
    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid nights count" });
    }

    const booking = await Booking.create({
      userId,
      roomId,
      checkIn: inDate,
      checkOut: outDate,
      totalPrice: room.pricePerNight * nights,

      status: "PENDING",
      statusHistory: [{ status: "PENDING", changedAt: new Date() }],
      createdAt: new Date()
    });

    res.status(201).json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate({
        path: "roomId",
        populate: { path: "hotelId" }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
      .populate({
        path: "roomId",
        populate: { path: "hotelId" }
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMyBooking = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    let inDate = parseDate(checkIn);
    let outDate = parseDate(checkOut);

    if (!inDate || !outDate) {
      return res.status(400).json({ error: "checkIn and checkOut are required" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Only PENDING bookings can be updated" });
    }

    const room = await Room.findById(booking.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      roomId: booking.roomId,
      status: { $in: ["PENDING", "CONFIRMED"] },
      checkIn: { $lt: outDate },
      checkOut: { $gt: inDate }
    });

    if (conflict) {
      return res.status(400).json({ error: "Room is not available for selected dates" });
    }

    const nights = diffNights(inDate, outDate);
    if (nights <= 0) {
      return res.status(400).json({ error: "Invalid nights count" });
    }

    booking.checkIn = inDate;
    booking.checkOut = outDate;
    booking.totalPrice = room.pricePerNight * nights;
    await booking.save();

    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: { $ne: "CANCELED" }
      },
      {
        $set: { status: "CANCELED" },
        $push: {
          statusHistory: { status: "CANCELED", changedAt: new Date() }
        }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or already canceled" });
    }

    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        status: { $ne: "CANCELED" }
      },
      {
        $set: { status: "CANCELED" },
        $push: {
          statusHistory: { status: "CANCELED", changedAt: new Date() }
        }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or forbidden" });
    }

    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, status: "PENDING" },
      {
        $set: { status: "CONFIRMED" },
        $push: {
          statusHistory: { status: "CONFIRMED", changedAt: new Date() }
        }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(400).json({ message: "Invalid booking state" });
    }

    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.query;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "roomId, checkIn, checkOut required" });
    }

    const conflict = await Booking.findOne({
      roomId,
      status: { $ne: "CANCELED" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) }
    });

    res.json({ available: !conflict });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getHotelCalendar = async (req, res) => {
  try {
    const { hotelId } = req.query;

    if (!hotelId || !mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "Valid hotelId is required" });
    }

    const bookings = await Booking.find({
      status: { $in: ["PENDING", "CONFIRMED"] }
    })
      .populate("roomId")
      .lean();

    const filtered = bookings.filter(
      (b) => b.roomId && String(b.roomId.hotelId) === String(hotelId)
    );

    res.json(filtered);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};
