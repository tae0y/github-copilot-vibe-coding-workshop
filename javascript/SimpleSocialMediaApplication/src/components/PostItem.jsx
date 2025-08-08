import React from 'react';



const PostItem = ({ post, onClick }) => {
  return (
    <div onClick={onClick} style={{ border: '1px solid #eee', borderRadius: 10, padding: 20, background: '#f9f9f9', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{post.username}</div>
      <div style={{ fontSize: 18 }}>{post.content}</div>
    </div>
  );
};

export default PostItem;
