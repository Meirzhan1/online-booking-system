const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');
const controller = require('../controllers/user.controller');

router.get('/me', auth, controller.getMe);
router.get('/', auth, role('ADMIN'), controller.getAll);

module.exports = router;
