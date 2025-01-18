const express = require('express');
const { createMemo, updateMemo, deleteMemo, getMemosByCategory } = require('../controllers/memoController');
const router = express.Router();

router.post('/memos', createMemo);
router.patch('/memos/:memoId', updateMemo);
router.delete('/memos/:memoId', deleteMemo);
router.get('/categories/:categoryId/memos', getMemosByCategory);

module.exports = router;