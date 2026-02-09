const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const bookingRoutes = require("./routes/booking.routes");
const paymentRoutes = require("./routes/payment.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const hotelRoutes = require("./routes/hotel.routes");
const roomRoutes = require("./routes/room.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);

app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
