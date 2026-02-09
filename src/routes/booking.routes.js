const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const bookingController = require('../controllers/booking.controller');

router.post('/', auth, role('USER'), bookingController.createBooking);

router.put('/:id/cancel', auth, role('USER'), bookingController.cancelBooking);

router.put('/:id/confirm', auth, role('ADMIN'), bookingController.confirmBooking);

router.get('/availability', bookingController.checkAvailability);

router.get('/calendar', bookingController.getHotelCalendar);

router.get('/my', auth, role('USER'), bookingController.getMyBookings);
router.get('/my/:id', auth, role('USER'), bookingController.getMyBookingById);
router.put('/my/:id', auth, role('USER'), bookingController.updateMyBooking);
router.delete('/my/:id', auth, role('USER'), bookingController.deleteMyBooking);


module.exports = router;
