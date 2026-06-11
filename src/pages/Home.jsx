import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { searchShoppingItems } from '../api.js';

const DEFAULT_CATEGORIES = ['디지털/가전', '패션/의류', '식품', '뷰티/미용', '가구/인테리어'];

export function Home() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Custom Categories State
  const [categories, setCategories] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('customCategories') || '[]');
    return [...DEFAULT_CATEGORIES, ...custom];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  // Pagination & Sort states
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentStart, setCurrentStart] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [currentSort, setCurrentSort] = useState('sim'); // 'sim', 'asc', 'dsc'

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentQuery(query);
    setCurrentStart(1);
    
    // 사용자가 직접 검색창에 다른 단어를 치면 카테고리 활성화 해제
    if (!categories.includes(query)) {
      setActiveCategory(null);
    } else {
      setActiveCategory(query);
    }
    
    try {
      const response = await searchShoppingItems(query, 21, 1, currentSort);
      const newItems = response.items || [];
      setItems(newItems);
      setHasMore(newItems.length === 21); // If 21 items returned, there might be more
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('검색 중 알 수 없는 오류가 발생했습니다.');
      }
      setItems([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = async (sortType) => {
    setCurrentSort(sortType);
    if (!currentQuery) return; // 검색어가 없으면 아직 검색 안함
    
    setIsLoading(true);
    setCurrentStart(1);
    try {
      const response = await searchShoppingItems(currentQuery, 21, 1, sortType);
      const newItems = response.items || [];
      setItems(newItems);
      setHasMore(newItems.length === 21);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || !currentQuery) return;
    setIsLoadingMore(true);
    
    const nextStart = currentStart + 21;
    
    try {
      const response = await searchShoppingItems(currentQuery, 21, nextStart, currentSort);
      const newItems = response.items || [];
      
      // 기존 아이템 배열에 새 아이템들을 병합
      setItems(prevItems => [...prevItems, ...newItems]);
      setCurrentStart(nextStart);
      setHasMore(newItems.length === 21);
    } catch (err) {
      console.error("Failed to load more items", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // category 클릭시 현재 설정된 정렬(currentSort)을 유지한 채로 새 단어를 검색
    handleSearch(category);
  };

  const handleRemoveCategory = (e, categoryToRemove) => {
    e.stopPropagation(); // prevent category click
    const newCategories = categories.filter(c => c !== categoryToRemove);
    setCategories(newCategories);
    
    if (activeCategory === categoryToRemove) {
      setActiveCategory(null);
    }
    
    // Save only custom categories
    const custom = newCategories.filter(c => !DEFAULT_CATEGORIES.includes(c));
    localStorage.setItem('customCategories', JSON.stringify(custom));
  };

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCatName.trim()) {
      const trimmed = newCatName.trim();
      if (!categories.includes(trimmed)) {
        const newCategories = [...categories, trimmed];
        setCategories(newCategories);
        
        // Save only custom categories to localStorage
        const custom = newCategories.filter(c => !DEFAULT_CATEGORIES.includes(c));
        localStorage.setItem('customCategories', JSON.stringify(custom));
      }
      setIsAdding(false);
      setNewCatName('');
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCatName('');
    }
  };

  return (
    <main className="main-content">
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-text ${hasSearched ? 'hidden' : ''}`}>
            <h1>원하시는 상품을 쉽고 빠르게 검색해보세요</h1>
            <p>ShopNova에서 수많은 상품 데이터를 한눈에 확인하세요.</p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          <div className="category-row">
            {categories.map(category => (
              <div 
                key={category} 
                className={`category-chip ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                <span>{category}</span>
                <button 
                  className="category-delete-btn"
                  onClick={(e) => handleRemoveCategory(e, category)}
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            ))}
            
            {isAdding ? (
              <input 
                type="text" 
                className="category-input"
                placeholder="카테고리 입력 (Enter)"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={handleAddCategory}
                onBlur={() => { setIsAdding(false); setNewCatName(''); }}
                autoFocus
              />
            ) : (
              <button className="category-add-btn" onClick={() => setIsAdding(true)} title="새 카테고리 추가">
                +
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="results-section">
        {hasSearched && !error && (
          <div className="sort-filter-container">
            <button 
              className={`sort-btn ${currentSort === 'sim' ? 'active' : ''}`}
              onClick={() => handleSortChange('sim')}
            >
              정확도순
            </button>
            <button 
              className={`sort-btn ${currentSort === 'asc' ? 'active' : ''}`}
              onClick={() => handleSortChange('asc')}
            >
              최저가순
            </button>
            <button 
              className={`sort-btn ${currentSort === 'dsc' ? 'active' : ''}`}
              onClick={() => handleSortChange('dsc')}
            >
              최고가순
            </button>
          </div>
        )}

        {isLoading && items.length === 0 && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>상품을 검색하고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <h3>오류가 발생했습니다</h3>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && hasSearched && items.length === 0 && (
          <div className="empty-state">
            <p>검색 결과가 없습니다.</p>
          </div>
        )}

        {!error && items.length > 0 && (
          <>
            <div className="product-grid" style={{ opacity: isLoading ? 0.5 : 1 }}>
              {items.map((item, index) => (
                <ProductCard key={`${item.productId}-${index}`} item={item} />
              ))}
            </div>
            
            {hasMore && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn" 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? '불러오는 중...' : '+ 상품 더보기'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
