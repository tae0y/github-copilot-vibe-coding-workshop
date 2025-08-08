import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PostList from './PostList';
import ApiError from './ApiError';
import { fetchPosts } from '../api/posts';
import useApiStatus from '../hooks/useApiStatus';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { error, setError, loading, setLoading } = useApiStatus();

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPosts()
      .then(data => {
        // 검색 쿼리 파라미터가 openapi.yaml에 없으므로 프론트에서 필터
        setResults(
          query.trim()
            ? data.filter(post => post.content.includes(query) || post.username.includes(query))
            : data
        );
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [query, setError, setLoading]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, padding: 32, background: '#fff' }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>검색</h1>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{ width: '100%', borderRadius: 10, border: '1px solid #ccc', padding: 12, fontSize: 18, marginBottom: 24 }}
        />
        {loading && <div style={{ margin: '24px 0', textAlign: 'center' }}>로딩 중...</div>}
        {error && <ApiError message={error} />}
        {!loading && !error && (
          results.length > 0 ? (
            <PostList posts={results} />
          ) : (
            <div style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>검색 결과가 없습니다.</div>
          )
        )}
      </main>
    </div>
  );
};

export default Search;
