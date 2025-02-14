const Category = require('../models/Category');
const User = require('../models/User');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

class CategoryService {
  // 카테고리 이름 변경
  static async updateCategoryName(userId, categoryId, name) {
    if (!name || name.trim() === '') {
      throw new ValidationError('카테고리 이름은 비어있을 수 없습니다.', 400);
    }

    const category = await Category.findOne({ _id: categoryId, userId });

    if (!category) {
      throw new NotFoundError('카테고리를 찾을 수 없습니다.', 404);
    }

    category.name = name;
    await category.save();

    return {
      message: '카테고리 이름이 성공적으로 변경되었습니다.',
      category: {
        id: category.id,
        name: category.name,
      },
    };
  }

  // 유저 카테고리 조회
  static async getUserCategories(userId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('사용자를 찾을 수 없습니다.', 404);

    const categories = await Category.find({ _id: { $in: user.categories } });

    if (categories.length === 0) {
      throw new NotFoundError('사용자의 카테고리를 찾을 수 없습니다.', 404);
    }

    return categories.map(category => ({
      id: category.id,
      name: category.name,
    }));
  }
}

module.exports = CategoryService;
