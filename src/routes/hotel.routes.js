const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleOnly = require("../middlewares/role.middleware");

const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotelPut,
  updateHotelPatch,
  deleteHotel
} = require("../controllers/hotel.controller");

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/", auth, roleOnly("ADMIN"), createHotel);
router.put("/:id", auth, roleOnly("ADMIN"), updateHotelPut);
router.patch("/:id", auth, roleOnly("ADMIN"), updateHotelPatch);
router.delete("/:id", auth, roleOnly("ADMIN"), deleteHotel);

module.exports = router;