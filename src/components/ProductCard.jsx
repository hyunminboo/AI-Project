import React, { useState, useEffect } from 'react';
import { useGlobalCurrency, formatPrice } from '../utils/currency.js';

const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const BagCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
    <polyline points="9 15 11 17 15 13"></polyline>
  </svg>
);

export function ProductCard({ item }) {
  const currency = useGlobalCurrency();
  const [isSaved, setIsSaved] = useState(false);
  const activeUser = JSON.parse(localStorage.getItem('activeUser'));

  useEffect(() => {
    if (activeUser) {
      const wishlistKey = `wishlist_${activeUser.email}`;
      const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
      setIsSaved(wishlist.some(w => w.productId === item.productId));
    }
  }, [activeUser?.email, item.productId]);

  const handleToggleSave = (e) => {
    e.preventDefault(); // Prevents clicking the card link
    if (!activeUser) {
      alert('로그인이 필요합니다.');
      return;
    }

    const wishlistKey = `wishlist_${activeUser.email}`;
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');

    if (isSaved) {
      wishlist = wishlist.filter(w => w.productId !== item.productId);
      setIsSaved(false);
    } else {
      wishlist.push(item);
      setIsSaved(true);
      // 장바구니에 추가될 때만 왼쪽 사이드바 열기
      window.dispatchEvent(new Event('openCartSidebar'));
    }
    
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    // Trigger custom event so Wishlist page can live-update if open
    window.dispatchEvent(new Event('wishlistUpdated'));
  };

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer" className="product-card">
      <div className="product-image-container">
        <img src={item.image} alt={item.title.replace(/<[^>]*>?/gm, '')} className="product-image" loading="lazy" />
        <button 
          className={`wishlist-btn ${isSaved ? 'saved' : ''}`} 
          onClick={handleToggleSave}
          title={isSaved ? '장바구니 빼기' : '장바구니 담기'}
        >
          {isSaved ? <BagCheckIcon /> : <BagIcon />}
        </button>
      </div>
      <div className="product-info">
        <div className="product-mall">{item.mallName}</div>
        <h3 className="product-title" dangerouslySetInnerHTML={{ __html: item.title }} />
        <div className="product-price-row">
          <span className="product-price">{item.lprice ? formatPrice(item.lprice, currency) : '가격 정보 없음'}</span>
          <span className="product-category">{item.category1}</span>
        </div>
      </div>
    </a>
  );
}
