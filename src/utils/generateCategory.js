async function generateCategory(userId) {
  const categorySets = [
    ['영감님', '기타 링크', '블로그 재료', 'To Do'],
    ['design idea', 'poem', 'study', 'for emptying'],
    ['목표', '할일', '기록', '끄적끄적'],
    ['기억할것', '과제', '할일', '아이디어'],
    ['프론트엔드', '백엔드', '통계', '언어학'],
    ['아이디어', '할일', '자료', '일정'],
    ['개발', '취미', '일정', '기억'],
    ['장바구니', '비번 박스', 'To Do', '띠용'],
    ['To Do', '메모', '여행', '공부'],
    ['공부', '일', '인관관계', '기타'],
    ['중요', '투두', '아무거나', '기록'],
  ];

  const selectedCategories =
    categorySets[Math.floor(Math.random() * categorySets.length)];

  selectedCategories.push('기본 카테고리');

  return selectedCategories.map(name => ({ userId, name }));
}

module.exports = { generateCategory };
