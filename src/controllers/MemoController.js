const Memo = require('../models/Memo');
const Category = require('../models/Category');

exports.createMemo = async (req, res) => {
  const { title, content, categoryId } = req.body;

  if (!content || content.trim() === '') {
    return res.status(200).json({
      message: '본문 내용이 없어 저장되지 않았습니다.',
    });
  }

  try {
    let targetCategoryId = categoryId;

    if (!categoryId) {
      const defaultCategory = await Category.findOne({
        name: '카테고리5',
        userId: req.user.id,
      });

      if (!defaultCategory) {
        return res
          .status(404)
          .json({ message: '기본 카테고리를 찾을 수 없습니다.' });
      }

      targetCategoryId = defaultCategory.id;
    }

    const category = await Category.findOne({
      _id: targetCategoryId,
      userId: req.user.id,
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: '요청한 카테고리를 찾을 수 없습니다.' });
    }

    const memoTitle =
      title && title.trim() !== '' ? title : new Date().toISOString();

    const memo = new Memo({
      userId: req.user.id,
      categoryId: category.id,
      title: memoTitle,
      content,
    });

    await memo.save();

    return res.status(201).json({
      message: '메모가 성공적으로 작성되었습니다.',
      memo: {
        id: memo.id,
        categoryId: memo.categoryId,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.updateMemo = async (req, res) => {
  const { memoId } = req.params;
  const { title, content } = req.body;

  try {
    const memo = await Memo.findOne({ _id: memoId, userId: req.user.id });

    if (!memo) {
      return res.status(404).json({ message: '해당 메모를 찾을 수 없습니다.' });
    }

    if (!content || content.trim() === '') {
      await Memo.deleteOne({ _id: memoId });
      return res
        .status(200)
        .json({ message: '본문 내용이 없어 저장되지 않았습니다.' });
    }

    memo.title = title && title.trim() !== '' ? title : memo.title;
    memo.content = content;
    memo.updatedAt = new Date();

    await memo.save();

    return res.status(200).json({
      message: '메모가 성공적으로 수정되었습니다.',
      memo: {
        id: memo.id,
        category_id: memo.categoryId,
        title: memo.title,
        content: memo.content,
        updated_at: memo.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.deleteMemo = async (req, res) => {
  const { memoId } = req.params;

  try {
    const memo = await Memo.findOne({ _id: memoId, userId: req.user.id });

    if (!memo) {
      return res
        .status(404)
        .json({ message: '요청한 메모를 찾을 수 없습니다.' });
    }

    await Memo.deleteOne({ _id: memoId });

    return res
      .status(200)
      .json({ message: '메모가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.getMemosByCategory = async (req, res) => {
  const { categoryId } = req.params;
  const userId = req.user.id;

  try {
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return res
        .status(404)
        .json({ message: '해당 카테고리를 찾을 수 없습니다.' });
    }

    const memos = await Memo.find({ categoryId, userId })
      .sort({ createdAt: -1 })
      .select('_id title content createdAt updatedAt');

    return res.status(200).json({
      category: {
        id: category.id,
        name: category.name,
      },
      notes: memos.map(memo => ({
        id: memo.id,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt,
      })),
    });
  } catch (error) {
    console.error('메모 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
