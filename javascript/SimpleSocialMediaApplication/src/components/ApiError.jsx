import React from 'react';

const ApiError = ({ message }) => (
  <div style={{ background: '#ffe5e5', color: '#b00020', border: '1px solid #b00020', borderRadius: 8, padding: 16, margin: '16px 0', textAlign: 'center' }}>
    <strong>API 연결 오류:</strong> {message}
  </div>
);

export default ApiError;
