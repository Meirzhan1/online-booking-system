const router = require('express').Router();
const controller = require('../controllers/auth.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);

router.post('/register-admin', controller.registerAdmin);

module.exports = router;
