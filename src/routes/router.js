const express = require('express');
const Controller = require('../controllers/controller');

const router = express.Router();

router.get('/empty', Controller.GetEmptySlots);
router.post('/search_customer', Controller.SearchCustomer);
router.post('/search_car', Controller.SearchCar);
router.post('/reserve_slot', Controller.ReserveSlot);
router.post('/finish_payment', Controller.FinishPayment);

module.exports = router;
