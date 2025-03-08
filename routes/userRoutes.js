const express = require('express');
const { checkSchema } = require('express-validator');
const userCtrl = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middlewares/authMiddleware');
const { userRegisterSchema, userLoginSchema } = require('../validations/userValidation');

const router = express.Router();

router.post('/register', checkSchema(userRegisterSchema), userCtrl.register);
router.post('/login', checkSchema(userLoginSchema),  userCtrl.login);
router.get('/account', authenticateUser, userCtrl.account);

module.exports = router;