
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { THEMES, DEFAULT_ADMIN_SETTINGS } from '../constants';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminSettings, Theme, ClosedSlot, BookingData } from '../types';

const ThemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [closedSlots, setClosedSlots] = useState<ClosedSlot[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('cs_admin_settings');
    const savedClosed = localStorage.getItem('cs_closed_slots');
    const savedBookings = localStorage.getItem('cs_bookings');
    const savedThemes = localStorage.getItem('cs_themes');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedClosed) setClosedSlots(JSON.parse(savedClosed));
    if (savedBookings) setBookings(JSON.parse(savedBookings));

    const themeList = savedThemes ? JSON.parse(savedThemes) : THEMES;
    const found = themeList.find((t: Theme) => t.id === id);
    if (found) setTheme(found);
  }, [id]);

  if (!theme) return <div className="pt-32 text-center">테마를 찾을 수 없습니다.</div>;

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="p-4" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date(new Date().setHours(0,0,0,0));
      
      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => setSelectedDate(date)}
          className={`p-4 rounded-lg border transition-all flex flex-col items-center ${
            isPast ? 'opacity-20 cursor-not-allowed' :
            isSelected ? 'bg-white border-white text-black font-bold' : 'hover:border-white border-white/10'
          }`}
        >
          <span className="text-lg">{d}</span>
        </button>
      );
    }
    return days;
  };

  const getSlots = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const day = selectedDate.getDay();
    const isWeekend = day === 0 || day === 6;
    
    // 우선순위: 테마 개별 슬롯 -> 주말/평일 기본 슬롯
    const baseSlots = theme.customSlots || (isWeekend ? settings.weekendSlots : settings.weekdaySlots);
    
    return baseSlots.map(slot => {
      // 이미 예약된 슬롯인지 확인
      const isBooked = bookings.some(b => b.themeId === theme.id && b.date === dateStr && b.time === slot && b.status !== 'cancelled');
      // 수동 마감된 슬롯인지 확인
      const isClosed = closedSlots.some(cs => cs.themeId === theme.id && cs.date === dateStr && cs.time === slot);
      
      return { time: slot, isAvailable: !isBooked && !isClosed };
    });
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <Link to="/reservation" className="inline-flex items-center text-[#b3b3b3] hover:text-white mb-8 gap-2">
        <ArrowLeft size={20} /> 테마 리스트
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <img src={theme.posterUrl} className="w-full max-w-[450px] aspect-[3/4] object-cover rounded-2xl shadow-2xl mb-8" />
          <h1 className="text-4xl font-bold mb-4">{theme.title}</h1>
          <p className="text-[#b3b3b3] text-lg leading-relaxed mb-8">{theme.synopsis}</p>
          <div className="flex gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><Clock size={16} /> {theme.duration}분</span>
            <span className="flex items-center gap-2"><Users size={16} /> {theme.minPlayers}-{theme.maxPlayers}인</span>
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2"><CalendarIcon /> 날짜 선택</h2>
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}><ChevronLeft /></button>
              <span className="font-bold">{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}><ChevronRight /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs text-white/40 mb-4 font-bold">
            {['일','월','화','수','목','금','토'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 mb-10">
            {renderCalendar()}
          </div>

          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={18} /> 시간 선택 ({selectedDate.toLocaleDateString()})
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {getSlots().map(slotInfo => (
                  <button
                    key={slotInfo.time}
                    disabled={!slotInfo.isAvailable}
                    onClick={() => navigate(`/booking/${theme.id}/${selectedDate.toISOString().split('T')[0]}/${slotInfo.time}`)}
                    className={`w-full p-4 border rounded-xl transition-all flex justify-between items-center group ${
                      slotInfo.isAvailable 
                      ? 'border-white/10 hover:border-white hover:bg-white/10 cursor-pointer' 
                      : 'border-white/5 opacity-30 cursor-not-allowed'
                    }`}
                  >
                    <span className={`text-xl font-bold ${slotInfo.isAvailable ? 'group-hover:scale-105 transition-transform' : ''}`}>{slotInfo.time}</span>
                    <span className="text-sm font-medium">{slotInfo.isAvailable ? '예약 가능' : '마감'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeDetail;
