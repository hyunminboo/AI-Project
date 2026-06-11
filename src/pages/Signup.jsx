import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
      setError('이미 가입된 이메일입니다.');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // 회원가입 즉시 자동 로그인
    const activeUser = { name, email };
    localStorage.setItem('activeUser', JSON.stringify(activeUser));
    setUser(activeUser);
    navigate('/');
  };

  return (
    <main className="main-content auth-page">
      <div className="auth-container glass">
        <h2>회원가입</h2>
        {error && <p className="auth-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이름</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="홍길동" />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="비밀번호를 입력하세요" />
          </div>
          <button type="submit" className="auth-button">가입하기</button>
        </form>
        <p className="auth-link">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </main>
  );
}
