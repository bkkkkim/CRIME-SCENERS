
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Settings } from 'lucide-react';
import { STORE_INFO } from './constants';
import Home from './components/Home';
import ThemeReservation from './components/ThemeReservation';
import ThemeDetail from './components/ThemeDetail';
import BookingForm from './components/BookingForm';
import BookingSuccess from './components/BookingSuccess';
import NoticeBoard from './components/NoticeBoard';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';

// PNG Logo URL (Assuming the user will replace this with the actual file path)
const LOGO_URL = "https://i.imgur.com/G5ZkX1n.png"; 

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';
  const headerBg = isHome 
    ? (isScrolled ? 'bg-[#121212]/95 border-b border-white/10' : 'bg-transparent')
    : 'bg-[#121212] border-b border-white/10';

  const navItems = [
    { name: '홈', path: '/' },
    { name: '이용안내', path: '/info' },
    { name: '테마예약', path: '/reservation' },
    { name: '공지사항', path: '/notice' },
    { name: '문의하기', path: '/contact' }
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="h-12 flex items-center">
          <img src={LOGO_URL} alt="CRIME SCENERS" className="h-full w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex space-x-10">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="text-sm font-medium hover:text-white transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>
        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-[#121212] z-40 p-6 flex flex-col space-y-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="text-xl font-bold border-b border-white/5 pb-4" onClick={() => setIsMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/5 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
      <div>
        <Link to="/" className="h-8 block mb-6">
          <img src={LOGO_URL} alt="CRIME SCENERS" className="h-full w-auto object-contain opacity-70" />
        </Link>
        <div className="text-sm text-[#b3b3b3] space-y-1">
          <p>{STORE_INFO.businessInfo}</p>
          <p>주소: {STORE_INFO.address}</p>
          <p>© 2024 CRIME SCENERS.</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        {/* 관리자 접근은 숨겨진 링크 형태로 하거나 별도 북마크 사용을 권장하지만, 버튼은 유지 (opacity 낮춤) */}
        <Link to="/admin" className="text-white/5 hover:text-white transition-colors">
          <Settings size={18} />
        </Link>
        <a href="#" className="hover:text-white"><Instagram size={24} /></a>
        <a href="#" className="hover:text-white"><Youtube size={24} /></a>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#121212]">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reservation" element={<ThemeReservation />} />
            <Route path="/theme/:id" element={<ThemeDetail />} />
            <Route path="/booking/:themeId/:date/:time" element={<BookingForm />} />
            <Route path="/success" element={<BookingSuccess />} />
            <Route path="/notice" element={<NoticeBoard />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/info" element={<div className="pt-32 text-center">준비 중입니다.</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
