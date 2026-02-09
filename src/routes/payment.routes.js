const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/payment.controller');

router.post('/', auth, role('USER'), controller.payBooking);
router.put('/:bookingId/refund', auth, role('USER'), controller.refundPayment);
router.get('/:bookingId/status', auth, controller.getPaymentStatus);

module.exports = router;
