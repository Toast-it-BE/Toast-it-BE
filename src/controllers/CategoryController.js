const Category = require('../models/Category');

exports.updateCategoryName = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  // 요청 데이터 검증
  if (!name || name.trim() === '') {
    return res
      .status(400)
      .json({ message: '카테고리 이름은 비어있을 수 없습니다.' });
  }

  try {
    // 카테고리 찾기 및 업데이트
    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user.id,
    });

    if (!category) {
      return res.status(404).json({ message: '카테고리를 찾을 수 없습니다.' });
    }

    category.name = name;
    await category.save();

    return res.status(200).json({
      message: '카테고리 이름이 성공적으로 변경되었습니다.',
      category: {
        id: category.id,
        name: category.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
