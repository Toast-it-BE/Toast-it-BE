const MemoService = require('../services/MemoService');

exports.createMemo = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const response = await MemoService.createMemo(
      req.user.id,
      title,
      content,
      categoryId,
    );
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.getMemoById = async (req, res) => {
  try {
    const { memoId } = req.params;
    const userId = req.user.id;

    const memo = await MemoService.getMemoById(memoId, userId);

    if (!memo) {
      return res.status(404).json({ message: '메모를 찾을 수 없습니다.' });
    }

    return res.status(200).json(memo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: '서버 오류' });
  }
};

exports.updateMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { title, content } = req.body;
    const response = await MemoService.updateMemo(
      req.user.id,
      memoId,
      title,
      content,
    );
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.deleteMemo = async (req, res) => {
  try {
    const { memoId } = req.params;
    const response = await MemoService.deleteMemo(req.user.id, memoId);
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.getMemosByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const response = await MemoService.getMemosByCategory(
      req.user.id,
      categoryId,
    );
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.updateMemoCategory = async (req, res) => {
  try {
    const { memoId } = req.params;
    const { categoryId } = req.body;
    const userId = req.user.id; // JWT에서 가져온 사용자 ID

    if (!categoryId) {
      return res
        .status(400)
        .json({ error: 'categoryId는 필수 입력 값입니다.' });
    }

    const updatedMemo = await MemoService.updateMemoCategory(
      memoId,
      categoryId,
      userId,
    );

    return res.status(200).json({
      message: '메모의 카테고리가 변경되었습니다.',
      memo: updatedMemo,
    });
  } catch (error) {
    if (error.message === 'CATEGORY_NOT_FOUND') {
      return res
        .status(400)
        .json({ error: '유효한 categoryId를 입력해주세요.' });
    }
    if (error.message === 'MEMO_NOT_FOUND') {
      return res.status(404).json({ error: '해당 메모를 찾을 수 없습니다.' });
    }
    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({ error: '메모를 수정할 권한이 없습니다.' });
    }
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
