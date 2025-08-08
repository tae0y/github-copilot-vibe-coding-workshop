import React from 'react';


const LikeButton = ({ liked, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      aria-pressed={liked}
      style={{
        background: liked ? '#00B7FF' : '#eee',
        color: liked ? '#fff' : '#333',
        border: 'none',
        borderRadius: 10,
        padding: '8px 24px',
        fontSize: 16,
        marginTop: 8,
        cursor: 'pointer',
      }}
    >
      <span role="img" aria-label="like">👍</span> {count}
    </button>
  );
};

export default LikeButton;
