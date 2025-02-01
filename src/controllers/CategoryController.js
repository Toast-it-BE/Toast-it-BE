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
