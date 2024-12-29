const express = require('express');
const router = express.Router();
const customerCtrl = require('../controllers/customerController'); 

router.post('/customers', customerCtrl.create);
router.get('/customers/filter', customerCtrl.filter);
router.get('/customers/:id', customerCtrl.getById);
router.put('/customers/:id', customerCtrl.update);
router.delete('/customers/:id', customerCtrl.delete);
router.get('/customers', customerCtrl.getAll)

module.exports = router;
