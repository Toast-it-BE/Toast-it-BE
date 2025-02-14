const MemoService = require('../services/MemoService');
const ValidationError = require('../errors/ValidationError');

exports.createMemo = async (req, res, next) => {
  try {
    const { title, content, categoryId } = req.body;
    const response = await MemoService.createMemo(
      req.user.id,
      title,
      content,
      categoryId,
    );
    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
};

exports.getMemoById = async (req, res, next) => {
  try {
    const { memoId } = req.params;
    const userId = req.user.id;

    const memo = await MemoService.getMemoById(memoId, userId);

    return res.status(200).json(memo);
  } catch (error) {
    return next(error);
  }
};

exports.updateMemo = async (req, res, next) => {
  try {
    const { memoId } = req.params;
    const { title, content } = req.body;
    const response = await MemoService.updateMemo(
      req.user.id,
      memoId,
      title,
      content,
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMemo = async (req, res, next) => {
  try {
    const { memoId } = req.params;
    const response = await MemoService.deleteMemo(req.user.id, memoId);
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

exports.getMemosByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const response = await MemoService.getMemosByCategory(
      req.user.id,
      categoryId,
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

exports.updateMemoCategory = async (req, res, next) => {
  try {
    const { memoId } = req.params;
    const { categoryId } = req.body;
    const userId = req.user.id;

    if (!categoryId || categoryId.trim() === '') {
      throw new ValidationError('categoryId는 필수 입력 값입니다.', 400);
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
    return next(error);
  }
};
