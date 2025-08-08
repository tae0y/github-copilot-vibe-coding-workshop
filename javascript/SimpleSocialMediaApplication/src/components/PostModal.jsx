import React, { useState } from 'react';


const PostModal = ({ isOpen, onClose, onSubmit, initialValue }) => {
  const [content, setContent] = useState(initialValue?.content || '');
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 20, width: 480, minHeight: 320, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <form onSubmit={e => { e.preventDefault(); onSubmit(content); }} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ margin: '40px 0 0 0', padding: '0 40px' }}>
            <div style={{ color: '#606060', fontSize: 24, fontFamily: 'Inter', marginBottom: 12 }}>How do you feel today?</div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="" style={{ width: '100%', minHeight: 120, borderRadius: 10, border: 'none', background: '#D9D9D9', padding: 16, fontSize: 18, resize: 'none', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24, justifyContent: 'center', marginTop: 32, marginBottom: 32 }}>
            <button type="submit" style={{ background: '#00B7FF', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 80px', fontSize: 20, fontFamily: 'Inter', cursor: 'pointer' }}>Submit</button>
            <button type="button" onClick={onClose} style={{ background: '#CCF1FF', color: '#000', border: 'none', borderRadius: 10, padding: '12px 80px', fontSize: 20, fontFamily: 'Inter', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
