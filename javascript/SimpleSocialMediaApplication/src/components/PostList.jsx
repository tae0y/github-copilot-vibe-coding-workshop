
const PostList = ({ posts, onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {posts.map(post => (
        <PostItem key={post.id} post={post} onClick={() => onSelect && onSelect(post.id)} />
      ))}
    </div>
  );
};

export default PostList;
