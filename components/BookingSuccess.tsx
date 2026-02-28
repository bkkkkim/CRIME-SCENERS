
import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, Users, ArrowRight, MessageSquare } from 'lucide-react';

const BookingSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate('/');
      return;
    }

    // Save booking to local storage for admin view
    const savedBookings = JSON.parse(localStorage.getItem('cs_bookings') || '[]');
    const newBooking = {
      ...state,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('cs_bookings', JSON.stringify([...savedBookings, newBooking]));
  }, [state, navigate]);

  if (!state) return null;

  const { theme, date, time, name, participants } = state;

  return (
    <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-6">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4">예약이 완료되었습니다!</h1>
        <p className="text-[#b3b3b3] text-lg leading-relaxed">
          {name}님의 소중한 예약이 정상적으로 접수되었습니다.<br />
          입력하신 번호로 예약 확정 메시지가 발송되었습니다.
        </p>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden mb-10">
        <div className="p-8 border-b border-white/5 bg-white/5">
          <h2 className="text-xl font-bold">예약 내역</h2>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-[#b3b3b3]">테마명</span>
            <span className="font-bold text-white">{theme.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#b3b3b3]">
              <Calendar size={18} /> 일시
            </div>
            <span className="font-bold text-white">{date} {time}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[#b3b3b3]">
              <Users size={18} /> 인원
            </div>
            <span className="font-bold text-white">{participants}명</span>
          </div>
        </div>
        <div className="p-6 bg-black/40 text-center">
            <p className="text-xs text-[#b3b3b3] flex items-center justify-center gap-2">
                <MessageSquare size={14} className="text-green-500" /> 
                방문 1일 전 안내 메시지가 추가로 발송됩니다.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link 
            to="/" 
            className="flex items-center justify-center py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-white"
        >
            홈으로 이동
        </Link>
        <Link 
            to="/reservation" 
            className="flex items-center justify-center py-4 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-all gap-2"
        >
            추가 테마 예약 <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
