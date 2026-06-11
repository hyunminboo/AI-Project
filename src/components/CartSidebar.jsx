import React, { useState, useEffect } from 'react';
import { useGlobalCurrency, formatPrice } from '../utils/currency.js';
import { Link } from 'react-router-dom';

export function CartSidebar({ isOpen, onClose, user }) {
  const currency = useGlobalCurrency();
  const [cartItems, setCartItems] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  useEffect(() => {
    setIsCalculated(false);
  }, [cartItems, currency]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    
    const loadCart = () => {
      const key = `wishlist_${user.email}`;
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      setCartItems(items);
    };

    loadCart();
    window.addEventListener('wishlistUpdated', loadCart);
    return () => window.removeEventListener('wishlistUpdated', loadCart);
  }, [user]);

  if (!user) return null;

  const handleRemoveItem = (productId) => {
    const key = `wishlist_${user.email}`;
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem(key, JSON.stringify(updatedItems));
    setCartItems(updatedItems);
    window.dispatchEvent(new Event('wishlistUpdated')); // Tell Header and ProductCards to sync
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + (parseInt(item.lprice) || 0);
  }, 0);

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      ></div>
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>장바구니</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="sidebar-content">
          {cartItems.length === 0 ? (
            <p className="empty-msg">아직 장바구니에 담긴 상품이 없습니다.</p>
          ) : (
            <div className="sidebar-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="sidebar-item" style={{ position: 'relative' }}>
                  <img src={item.image} alt="product" />
                  <div className="item-info" style={{ paddingRight: '20px' }}>
                    <div className="item-meta">
                      <h4 dangerouslySetInnerHTML={{ __html: item.title }}></h4>
                      <span className="item-price">{formatPrice(item.lprice, currency)}</span>
                      <span className="item-mall">{item.mallName}</span>
                    </div>
                  </div>
                  <button 
                    className="remove-item-btn" 
                    onClick={() => handleRemoveItem(item.productId)}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="sidebar-footer">
          <div className="total-price-row">
            <span>총 결제금액</span>
            <span className="total-amount">
              {isCalculated ? formatPrice(totalPrice.toString(), currency) : '---'}
            </span>
          </div>
          <button 
            className="checkout-btn"
            onClick={() => {
              if (cartItems.length === 0) {
                alert('장바구니가 비어 있습니다.');
              } else {
                setIsCalculated(true);
              }
            }}
          >
            금액 계산하기
          </button>
        </div>
      </div>
    </>
  );
}
