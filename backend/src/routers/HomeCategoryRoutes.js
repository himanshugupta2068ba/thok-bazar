const express = require('express');
const router = express.Router();
const HomeCategoryController = require('../controllers/HomeCategoryController');
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');

router.post('/', adminAuthMiddleware, HomeCategoryController.createHomeCategories);

router.get('/', HomeCategoryController.getAllHomeCategories);

router.put('/:id', adminAuthMiddleware, HomeCategoryController.updateHomeCategory);
router.delete('/:id', adminAuthMiddleware, HomeCategoryController.deleteHomeCategory);

module.exports = router;
