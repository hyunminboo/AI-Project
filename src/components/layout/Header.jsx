import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalCurrency } from '../../utils/currency.js';

const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

export function Header({ user, onLogout }) {
  const [cartCount, setCartCount] = useState(0);
  const currency = useGlobalCurrency();

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    
    const loadCount = () => {
      const key = `wishlist_${user.email}`;
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      setCartCount(items.length);
    };

    loadCount();
    window.addEventListener('wishlistUpdated', loadCount);
    return () => window.removeEventListener('wishlistUpdated', loadCount);
  }, [user]);

  return (
    <header className="global-header glass">
      <div className="header-content">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          ShopNova
        </Link>
        <nav className="header-nav" style={{ gap: '1rem' }}>
          <Link 
            to="/exchange" 
            className="wishlist-link" 
            title="환율 및 통화 설정" 
            style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', position: 'relative', textDecoration: 'none' }}
          >
            <div className="currency-badge-icon">
              {currency.code}
            </div>
          </Link>
          {user ? (
            <div className="user-menu">
              <a 
                href="#"
                className="wishlist-link" 
                title="장바구니" 
                style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', position: 'relative', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event('openCartSidebar'));
                }}
              >
                <BagIcon />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </a>
              <div className="user-avatar" title={user.name}>{user.name.charAt(0)}</div>
              <button className="login-btn logout" onClick={onLogout}>로그아웃</button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
