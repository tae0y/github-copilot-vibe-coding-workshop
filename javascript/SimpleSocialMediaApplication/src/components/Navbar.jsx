import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 110, height: 832, background: '#E5A000', padding: 10, gap: 147 }}>
      <button aria-label="Home" style={{ width: 58, height: 50 }}>
        {/* Home 아이콘 (SVG 대체) */}
        <span role="img" aria-label="home">🏠</span>
      </button>
      <button aria-label="Search" style={{ width: 58, height: 58 }}>
        {/* Search 아이콘 (SVG 대체) */}
        <span role="img" aria-label="search">🔍</span>
      </button>
      <button aria-label="Profile" style={{ width: 58, height: 58 }}>
        {/* Profile 아이콘 (SVG 대체) */}
        <span role="img" aria-label="profile">👤</span>
      </button>
      <button aria-label="Close" style={{ width: 58, height: 58 }}>
        {/* Close(X) 아이콘 (SVG 대체) */}
        <span role="img" aria-label="close">❌</span>
      </button>
    </nav>
  );
};

export default Navbar;
