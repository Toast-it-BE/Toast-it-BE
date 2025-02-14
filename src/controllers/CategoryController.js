const CategoryService = require('../services/CategoryService');

exports.updateCategoryName = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name } = req.body;
    const response = await CategoryService.updateCategoryName(
      req.user.id,
      categoryId,
      name,
    );
    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
};

exports.getUserCategories = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const categories = await CategoryService.getUserCategories(userId);

    return res.status(200).json({ userId, categories });
  } catch (error) {
    return next(error);
  }
};
