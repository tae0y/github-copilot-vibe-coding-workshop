
import React, { useState, useEffect } from 'react';
import CommentList from './CommentList';
import LikeButton from './LikeButton';
import ApiError from './ApiError';
import { fetchComments, createComment } from '../api/comments';
import { likePost, unlikePost } from '../api/likes';
import useApiStatus from '../hooks/useApiStatus';

const PostDetails = ({ post }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const { error, setError, loading, setLoading } = useApiStatus();
  const username = localStorage.getItem('username') || 'anonymous';

  useEffect(() => {
    if (!post) return;
    setLoading(true);
    setError(null);
    fetchComments(post.id)
      .then(setComments)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [post, setError, setLoading]);

  const handleLike = async () => {
    setError(null);
    try {
      if (!liked) {
        await likePost(post.id, { username });
        setLiked(true);
        setLikesCount(likesCount + 1);
      } else {
        await unlikePost(post.id, { username });
        setLiked(false);
        setLikesCount(likesCount - 1);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newComment = await createComment(post.id, { username, content: comment });
      setComments([...comments, newComment]);
      setComment('');
    } catch (e) {
      setError(e.message);
    }
  };

  if (!post) return null;
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, minWidth: 400 }}>
      <div style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 8 }}>{post.username}</div>
      <div style={{ fontSize: 20, marginBottom: 16 }}>{post.content}</div>
      <LikeButton liked={liked} onClick={handleLike} count={likesCount} />
      <h3 style={{ marginTop: 32, fontSize: 20 }}>댓글</h3>
      {loading && <div style={{ margin: '24px 0', textAlign: 'center' }}>로딩 중...</div>}
      {error && <ApiError message={error} />}
      {!loading && !error && <CommentList comments={comments} />}
      <form onSubmit={handleComment} style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment" style={{ flex: 1, borderRadius: 10, border: '1px solid #ccc', padding: 12, fontSize: 16 }} />
        <button type="submit" style={{ background: '#00B7FF', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 24px', fontSize: 16 }}>Comment</button>
      </form>
    </div>
  );
};

export default PostDetails;
