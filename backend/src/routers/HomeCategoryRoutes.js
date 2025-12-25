const express = require('express');
const router = express.Router();
const HomeCategoryController = require('../controllers/HomeCategoryController');

router.post('/', HomeCategoryController.createHomeCategories);

router.get('/', HomeCategoryController.getAllHomeCategories);

router.put('/:id', HomeCategoryController.updateHomeCategory);

module.exports = router;