const express = require('express');
const { checkSchema } = require('express-validator');
const userCtrl = require('../controllers/userController');
<<<<<<< HEAD
const { authenticateUser, authorizeUser } = require('../middlewares/authMiddleware');
const { userRegisterSchema, userLoginSchema } = require('../validations/userValidation');

const router = express.Router();

router.post('/register', checkSchema(userRegisterSchema), userCtrl.register);
router.post('/login', checkSchema(userLoginSchema),  userCtrl.login);
router.get('/account', authenticateUser, userCtrl.account);

module.exports = router;
=======
const { authenticateUser } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload'); // New Upload Middleware

const router = express.Router();

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/account', authenticateUser, userCtrl.account);
router.put('/updateUser', authenticateUser, upload.single('profilePic'), userCtrl.updateUser); // Updated to accept image upload
router.get('/getAlluser', userCtrl.fetchAllUsers);

module.exports = router;
>>>>>>> c940ee0e (final updated code)
