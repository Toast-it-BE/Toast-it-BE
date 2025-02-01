const express = require('express');

const router = express.Router();
const memoController = require('../controllers/MemoController');
const authMiddleware = require('../middlewares/TokenAuth');

// 메모 작성
router.post('/', authMiddleware, memoController.createMemo);

// 메모 수정
router.patch('/:memoId', authMiddleware, memoController.updateMemo);

// 메모 삭제
router.delete('/:memoId', authMiddleware, memoController.deleteMemo);

module.exports = router;
