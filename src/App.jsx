import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { Exchange } from './pages/Exchange.jsx';
import { CartSidebar } from './components/CartSidebar.jsx';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('activeUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Listen for the custom event dispatched by Header
  useEffect(() => {
    const handleOpen = () => setIsCartOpen(true);
    window.addEventListener('openCartSidebar', handleOpen);
    return () => window.removeEventListener('openCartSidebar', handleOpen);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('activeUser');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header user={user} onLogout={handleLogout} />
        <CartSidebar 
          user={user} 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/exchange" element={<Exchange />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
