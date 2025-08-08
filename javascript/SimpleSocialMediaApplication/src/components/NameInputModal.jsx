import React, { useState, useRef } from 'react';

const NameInputModal = ({ isOpen, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setUsername('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = username.trim().toLowerCase();
    if (!trimmed) {
      setError('사용자명을 입력하세요.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setError('');
    setUsername('');
    onSubmit(trimmed);
  };

  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: 538, minHeight: 261, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ margin: '45px 0 0 0', padding: '0 40px' }}>
            <div style={{ color: '#000', fontSize: 36, fontFamily: 'Inter', marginBottom: 24 }}>Enter your username</div>
            <div style={{ background: '#D9D9D9', borderRadius: 10, height: 56, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <input
                ref={inputRef}
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                placeholder="UserName"
                style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 24, color: '#878787', padding: '0 16px', width: '100%', fontFamily: 'Inter' }}
                autoFocus
              />
            </div>
            {error && <div style={{ color: 'red', fontSize: 16, marginBottom: 16 }}>{error}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'center', marginTop: 16, marginBottom: 32 }}>
            <button type="submit" style={{ background: '#00B7FF', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 80px', fontSize: 20, fontFamily: 'Inter', cursor: 'pointer' }}>OK</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NameInputModal;
