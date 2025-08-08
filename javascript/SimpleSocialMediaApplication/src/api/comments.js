// 댓글 관련 API
const BASE_URL = 'http://localhost:8000/api';

export async function fetchComments(postId) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`);
  if (!res.ok) throw new Error('API 연결 실패');
  return res.json();
}

export async function createComment(postId, data) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API 연결 실패');
  return res.json();
}
// 기타 상세/수정/삭제 함수 추가 예정
