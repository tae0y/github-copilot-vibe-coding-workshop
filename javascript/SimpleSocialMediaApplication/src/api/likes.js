// 좋아요 관련 API
const BASE_URL = 'http://localhost:8000/api';

export async function likePost(postId, data) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API 연결 실패');
  return res.json();
}

export async function unlikePost(postId, data) {
  const res = await fetch(`${BASE_URL}/posts/${postId}/likes`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('API 연결 실패');
}
