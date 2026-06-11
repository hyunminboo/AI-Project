import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const activeUser = { name: user.name, email: user.email };
      localStorage.setItem('activeUser', JSON.stringify(activeUser));
      setUser(activeUser);
      navigate('/');
    } else {
      setError('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <main className="main-content auth-page">
      <div className="auth-container glass">
        <h2>로그인</h2>
        {error && <p className="auth-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="비밀번호를 입력하세요" />
          </div>
          <button type="submit" className="auth-button">로그인</button>
        </form>
        <p className="auth-link">계정이 없으신가요? <Link to="/signup">회원가입</Link></p>
      </div>
    </main>
  );
}
