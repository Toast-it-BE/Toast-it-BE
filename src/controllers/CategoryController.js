const CategoryService = require('../services/CategoryService');

exports.updateCategoryName = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const response = await CategoryService.updateCategoryName(
      req.user.id,
      categoryId,
      name,
    );
    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

exports.getUserCategories = async (req, res) => {
  try {
    const { userId } = req.params;

    const categories = await CategoryService.getUserCategories(userId);

    if (!categories) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ userId, categories });
  } catch (error) {
    console.error('사용자 카테고리 조회 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
