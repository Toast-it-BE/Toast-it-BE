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
