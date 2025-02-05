const Category = require('../models/Category');
const User = require('../models/User');

class CategoryService {
  // 카테고리 이름 변경
  static async updateCategoryName(userId, categoryId, name) {
    if (!name || name.trim() === '') {
      return { status: 400, message: '카테고리 이름은 비어있을 수 없습니다.' };
    }

    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      return { status: 404, message: '카테고리를 찾을 수 없습니다.' };
    }

    category.name = name;
    await category.save();

    return {
      status: 200,
      message: '카테고리 이름이 성공적으로 변경되었습니다.',
      category: {
        id: category.id,
        name: category.name,
      },
    };
  }

  static async getUserCategories(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) return null;
      return user.categories.map(categoryId => ({ id: categoryId }));
    } catch (error) {
      console.error('사용자 카테고리 조회 오류:', error);
      throw error;
    }
  }
}

module.exports = CategoryService;
