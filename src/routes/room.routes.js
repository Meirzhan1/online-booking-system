const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const roleOnly = require("../middlewares/role.middleware");

const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoomPut,
  updateRoomPatch,
  deleteRoom
} = require("../controllers/room.controller");

router.get("/", getRooms);
router.get("/:id", getRoomById);

router.post("/", auth, roleOnly("ADMIN"), createRoom);
router.put("/:id", auth, roleOnly("ADMIN"), updateRoomPut);
router.patch("/:id", auth, roleOnly("ADMIN"), updateRoomPatch);
router.delete("/:id", auth, roleOnly("ADMIN"), deleteRoom);

module.exports = router;