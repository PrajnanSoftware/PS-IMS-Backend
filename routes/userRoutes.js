const express = require('express')
const {checkSchema} = require('express-validator')
const userCtrl = require('../controllers/userController')
const {authenticateUser, authorizeUser} = require('../middlewares/authMiddleware')
const {userRegisterSchema, userLoginSchema} = require('../validations/userValidation')
const router = express.Router()

console.log('userCtrl.register:', userCtrl.register);
console.log('userCtrl.login:', userCtrl.login);
console.log('userCtrl.account:', userCtrl.account);
router.post('/register',checkSchema(userRegisterSchema), userCtrl.register)
router.post('/login', checkSchema(userLoginSchema), userCtrl.login)
router.get('/account',authenticateUser, userCtrl.account)
// router.post('/forgotPassword',userCtrl.forgotPassword)

module.exports = router
