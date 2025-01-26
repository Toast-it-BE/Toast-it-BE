let memos = [];

const createMemo = (req, res) => {
  const { title, content, categoryId } = req.body;

  // content가 비어 있으면 400 상태 코드와 함께 오류 메시지 반환
  if (!content) {
    return res.status(400).json({ message: "본문 내용이 없어 저장되지 않았습니다." });
  }

  const memo = {
    id: memos.length + 1,
    categoryId,
    title: title || new Date().toISOString(),
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memos.push(memo);
  res.status(201).json({
    message: "메모가 성공적으로 작성되었습니다.",
    note: memo,
  });
};

const updateMemo = (req, res) => {
  const { memoId } = req.params;
  const { title, content } = req.body;

  const memo = memos.find((m) => m.id == memoId);

  if (!memo) {
    return res.status(404).json({ message: "해당 메모를 찾을 수 없습니다." });
  }

  // content가 비어 있다면 수정하지 않고 오류 메시지 반환
  if (!content) {
    return res.status(400).json({ message: "본문 내용이 없어 저장되지 않았습니다." });
  }

  memo.title = title || memo.title;
  memo.content = content;
  memo.updatedAt = new Date().toISOString();

  res.status(200).json({
    message: "메모가 성공적으로 수정되었습니다.",
    note: memo,
  });
};

const deleteMemo = (req, res) => {
  const { memoId } = req.params;

  const memoIndex = memos.findIndex((m) => m.id == memoId);

  if (memoIndex === -1) {
    return res.status(404).json({ message: "요청한 메모를 찾을 수 없습니다." });
  }

  memos.splice(memoIndex, 1);
  res.status(200).json({ message: "메모가 성공적으로 삭제되었습니다." });
};

const getMemosByCategory = (req, res) => {
  const { categoryId } = req.params;

  const filteredMemos = memos.filter((m) => m.categoryId == categoryId);

  if (!filteredMemos.length) {
    return res.status(404).json({ message: "해당 카테고리를 찾을 수 없습니다." });
  }

  res.status(200).json({
    category: { id: categoryId, name: `Category ${categoryId}` },
    notes: filteredMemos,
  });
};

module.exports = { createMemo, updateMemo, deleteMemo, getMemosByCategory };