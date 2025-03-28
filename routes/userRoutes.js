const express = require('express');
const { checkSchema } = require('express-validator');
const userCtrl = require('../controllers/userController');
const { authenticateUser, authorizeUser } = require('../middlewares/authMiddleware');
const { userRegisterSchema, userLoginSchema } = require('../validations/userValidation');
const upload = require('../middlewares/upload'); // New Upload Middleware

const router = express.Router();





router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/account', authenticateUser, userCtrl.account);
router.put('/updateUser', authenticateUser, upload.single('profilePic'), userCtrl.updateUser); // Updated to accept image upload
router.get('/getAlluser', userCtrl.fetchAllUsers);

module.exports = router;
