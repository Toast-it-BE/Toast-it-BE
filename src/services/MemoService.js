const Memo = require('../models/Memo');
const Category = require('../models/Category');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthError = require('../errors/AuthError');

class MemoService {
  // 메모 생성
  static async createMemo(userId, title, content, categoryId) {
    let targetCategoryId = categoryId;

    if (!categoryId) {
      const defaultCategory = await Category.findOne({
        name: '기본 카테고리',
        userId,
      });
      if (!defaultCategory) {
        throw new NotFoundError('기본 카테고리를 찾을 수 없습니다.', 404);
      }
      targetCategoryId = defaultCategory.id;
    }

    const category = await Category.findOne({ _id: targetCategoryId, userId });
    if (!category) {
      throw new NotFoundError('요청한 카테고리를 찾을 수 없습니다.', 404);
    }

    const memoTitle =
      title && title.trim() !== '' ? title : new Date().toISOString();

    const memo = new Memo({
      userId,
      categoryId: category.id,
      title: memoTitle,
      content,
      toastNumber: Math.floor(Math.random() * 5) + 1,
    });
    await memo.save();

    return {
      message: '메모가 성공적으로 작성되었습니다.',
      memo: {
        id: memo.id,
        categoryId: memo.categoryId,
        toastNumber: memo.toastNumber,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt,
      },
    };
  }

  // 메모 조회
  static async getMemoById(memoId, userId) {
    const memo = await Memo.findOne({ _id: memoId, userId });
    if (!memo) throw new NotFoundError('해당 메모를 찾을 수 없습니다.', 404);
    return memo;
  }

  // 메모 수정
  static async updateMemo(userId, memoId, title, content) {
    const memo = await Memo.findOne({ _id: memoId, userId });

    if (!memo) {
      throw new NotFoundError('해당 메모를 찾을 수 없습니다.', 404);
    }

    if (!content || content.trim() === '') {
      await Memo.deleteOne({ _id: memoId });
      throw new ValidationError('본문 내용이 없어 저장되지 않았습니다.', 400);
    }

    memo.title = title && title.trim() !== '' ? title : memo.title;
    memo.content = content;
    memo.updatedAt = new Date();
    await memo.save();

    return {
      message: '메모가 성공적으로 수정되었습니다.',
      memo: {
        id: memo.id,
        categoryId: memo.categoryId,
        toastNumber: memo.toastNumber,
        title: memo.title,
        content: memo.content,
        updatedAt: memo.updatedAt,
      },
    };
  }

  // 메모 삭제
  static async deleteMemo(userId, memoId) {
    const memo = await Memo.findOne({ _id: memoId, userId });

    if (!memo) {
      throw new NotFoundError('요청한 메모를 찾을 수 없습니다.', 404);
    }

    await Memo.deleteOne({ _id: memoId });

    return { message: '메모가 성공적으로 삭제되었습니다.' };
  }

  // 카테고리별 메모 목록 조회
  static async getMemosByCategory(userId, categoryId) {
    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.', 404);
    }

    const memos = await Memo.find({ categoryId, userId })
      .sort({ createdAt: -1 })
      .select('_id toastNumber title content createdAt updatedAt');

    return {
      category: {
        id: category.id,
        name: category.name,
      },
      notes: memos.map(memo => ({
        id: memo.id,
        toastNumber: memo.toastNumber,
        title: memo.title,
        content: memo.content,
        createdAt: memo.createdAt,
        updatedAt: memo.updatedAt,
      })),
    };
  }

  // 메모 카테고리 변경
  static async updateMemoCategory(memoId, categoryId, userId) {
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      throw new NotFoundError('해당 카테고리를 찾을 수 없습니다.', 404);
    }

    const memo = await Memo.findById(memoId);
    if (!memo) {
      throw new NotFoundError('해당 메모를 찾을 수 없습니다.', 404);
    }

    if (memo.userId.toString() !== userId) {
      throw new AuthError('권한이 없습니다.', 403);
    }

    memo.categoryId = categoryId;
    memo.updatedAt = new Date();
    await memo.save();

    return memo;
  }
}

module.exports = MemoService;
