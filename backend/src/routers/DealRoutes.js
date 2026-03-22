const express = require('express');
const router=express.Router();
const DealController = require('../controllers/DealController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

router.get('/',DealController.getDeals);

router.post('/',adminAuthMiddleware,DealController.createDeal);

router.put('/:id',adminAuthMiddleware,DealController.updateDeal);

router.delete('/:id',adminAuthMiddleware,DealController.deleteDeal);

module.exports=router;
