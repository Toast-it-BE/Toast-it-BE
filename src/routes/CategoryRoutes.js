const express = require('express');

const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const memoController = require('../controllers/MemoController');
const { authMiddleware } = require('../middlewares/tokenAuth');

// 카테고리 이름 변경
router.patch(
  '/:categoryId',
  authMiddleware,
  categoryController.updateCategoryName,
);

// 카테고리별 메모 조회
router.get(
  '/:categoryId/memos',
  authMiddleware,
  memoController.getMemosByCategory,
);

// 유저별 카테고리 조회
router.get('/:userId', authMiddleware, categoryController.getUserCategories);

module.exports = router;
