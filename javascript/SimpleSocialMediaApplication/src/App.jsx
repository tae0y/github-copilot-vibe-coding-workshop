

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import PostList from './components/PostList';
import PostModal from './components/PostModal';
import NameInputModal from './components/NameInputModal';
import PostDetails from './components/PostDetails';
import Search from './components/Search';
import { fetchPosts, createPost } from './api/posts';
import ApiError from './components/ApiError';
import useApiStatus from './hooks/useApiStatus';

const Home = ({ onNewPost }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const { error, setError, loading, setLoading } = useApiStatus();
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPosts()
      .then(setPosts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [setError, setLoading]);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 32, background: '#fff' }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>게시물 목록</h1>
        {loading && <div style={{ margin: '24px 0', textAlign: 'center' }}>로딩 중...</div>}
        {error && <ApiError message={error} />}
        {!loading && !error && <PostList posts={posts} onSelect={id => navigate(`/posts/${id}`)} />}
        <button style={{ marginTop: 24, padding: '12px 24px', fontSize: 18, background: '#00B7FF', color: '#fff', border: 'none', borderRadius: 8 }} onClick={onNewPost}>+ 새 게시물</button>
      </main>
    </div>
  );
};


function SearchWithNav() {
  const navigate = useNavigate();
  return <Search onSelect={id => navigate(`/posts/${id}`)} />;
}

function PostDetailsLoader() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  React.useEffect(() => {
    fetchPosts()
      .then(posts => setPost(posts.find(p => p.id === postId)))
      .catch(e => setError(e.message));
  }, [postId]);
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!post) return <div style={{ textAlign: 'center' }}>로딩 중...</div>;
  return <PostDetails post={post} />;
}




const App = () => {

  const [showPostModal, setShowPostModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [homeRefresh, setHomeRefresh] = useState(0);

  // 게시물 작성 버튼 클릭 시 사용자명 없으면 입력 모달, 있으면 바로 작성
  const handleNewPost = () => {
    const username = localStorage.getItem('username');
    if (!username) {
      setShowNameModal(true);
    } else {
      setShowPostModal(true);
    }
  };

  // NameInputModal에서 사용자명 저장
  const handleNameSubmit = (username) => {
    localStorage.setItem('username', username);
    setShowNameModal(false);
    setShowPostModal(true);
  };

  // Home에서 새 게시물 작성 후 목록 갱신을 위해 key를 전달
  const handlePostSubmit = async (content) => {
    const username = localStorage.getItem('username') || 'anonymous';
    try {
      await createPost({ username, content });
      setShowPostModal(false);
      setHomeRefresh(r => r + 1);
    } catch (e) {
      alert('게시물 작성 실패: ' + e.message);
    }
  };

  return (
    <Router>
      <Routes>
  <Route path="/" element={<Home onNewPost={handleNewPost} key={homeRefresh} />} />
        <Route path="/search" element={<SearchWithNav />} />
        <Route path="/posts/:postId" element={<PostDetailsLoader />} />
      </Routes>
      <PostModal isOpen={showPostModal} onClose={() => setShowPostModal(false)} onSubmit={handlePostSubmit} />
  <NameInputModal isOpen={showNameModal} onSubmit={handleNameSubmit} />
    </Router>
  );
};

export default App;
