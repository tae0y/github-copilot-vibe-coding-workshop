import React from 'react';


const CommentItem = ({ comment }) => {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 10, padding: 12, background: '#f4f4f4' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{comment.username}</div>
      <div>{comment.content}</div>
    </div>
  );
};

export default CommentItem;
