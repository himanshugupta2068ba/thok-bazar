const express = require('express');
const router=express.Router();
const DealController = require('../controllers/DealController');

router.get('/',DealController.getDeals);

router.post('/',DealController.createDeal);

router.put('/:id',DealController.updateDeal);

router.delete('/:id',DealController.deleteDeal);

module.exports=router;