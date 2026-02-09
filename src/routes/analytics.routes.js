const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/analytics.controller');

router.get('/hotel-occupancy', auth, role('ADMIN'), controller.hotelOccupancy);
router.get('/revenue', auth, role('ADMIN'), controller.revenue);

module.exports = router;
