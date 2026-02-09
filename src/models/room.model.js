const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true
    },
    roomNumber: { type: String, required: true },
    type: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: [mongoose.Schema.Types.Mixed], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { versionKey: false }
);

roomSchema.index({ hotelId: 1, pricePerNight: 1 });

module.exports = mongoose.model("Room", roomSchema);
