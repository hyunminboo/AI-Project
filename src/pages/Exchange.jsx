import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllExchangeRates } from '../api.js';
import { CURRENCIES, setGlobalCurrency } from '../utils/currency.js';

export function Exchange() {
  const navigate = useNavigate();
  const [rates, setRates] = useState(null);
  const [amount, setAmount] = useState(100);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllExchangeRates().then(data => {
      setRates(data);
      setIsLoading(false);
    });
  }, []);

  const calculateKRW = () => {
    if (!rates || !amount) return 0;
    const foreignRate = rates[selectedCurrency];
    const krwRate = rates.KRW;
    const result = (amount / foreignRate) * krwRate;
    return Math.round(result);
  };

  const getCurrencyRate = (code) => {
    if (!rates) return 0;
    if (code === 'KRW') return 1;
    const foreignRate = rates[code];
    const krwRate = rates.KRW;
    return (1 / foreignRate) * krwRate;
  };

  const handleApplyCurrency = () => {
    const cInfo = CURRENCIES.find(c => c.code === selectedCurrency);
    const rateToKrw = getCurrencyRate(selectedCurrency);
    
    setGlobalCurrency({
      code: cInfo.code,
      symbol: cInfo.symbol,
      rate: rateToKrw
    });
    
    navigate('/');
  };

  return (
    <main className="main-content exchange-page">
      <section className="exchange-content" style={{ marginTop: '2rem' }}>
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>실시간 환율 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <div className="exchange-layout-row">
            {/* Left Card: Calculator */}
            <div className="calculator-card glass">
              <h3>실시간 환율 계산기</h3>
              <div className="calc-row">
                <div className="calc-group">
                  <label>해외 결제 금액</label>
                  <div className="input-wrapper">
                    <select 
                      value={selectedCurrency} 
                      onChange={e => setSelectedCurrency(e.target.value)}
                      className="currency-select"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={e => setAmount(Number(e.target.value))}
                      className="amount-input"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="calc-equals">
                <span>=</span>
              </div>

              <div className="calc-row result-row">
                <div className="calc-group">
                  <label>한국 원화 (KRW) 예상 금액</label>
                  <div className="krw-result">
                    <h2>{calculateKRW().toLocaleString()} <span>원</span></h2>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Card: Current Rates */}
            <div className="current-rates-card glass">
              <h3>오늘의 주요 환율</h3>
              <div className="rates-grid">
                {CURRENCIES.filter(c => c.code !== 'KRW').map(c => (
                  <div key={c.code} className="rate-item">
                    <span className="rate-code">{c.code}</span>
                    <span className="rate-val">{getCurrencyRate(c.code).toLocaleString(undefined, {maximumFractionDigits: 2})}원</span>
                  </div>
                ))}
              </div>
              
              <div className="apply-section" style={{ marginTop: '2.5rem', textAlign: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '2rem' }}>
                <button 
                  className="apply-btn" 
                  onClick={handleApplyCurrency}
                >
                  {selectedCurrency} 쇼핑몰 전체 적용하기
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
