
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { THEMES, DEFAULT_ADMIN_SETTINGS, STORES } from '../constants';
import { Calendar as CalendarIcon, Clock, Users, ArrowLeft, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { AdminSettings, Theme, ClosedSlot, BookingData, Store } from '../types';

const ThemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [closedSlots, setClosedSlots] = useState<ClosedSlot[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [stores, setStores] = useState<Store[]>(STORES);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);

  useEffect(() => {
    const savedSettings = localStorage.getItem('cs_admin_settings');
    const savedClosed = localStorage.getItem('cs_closed_slots');
    const savedBookings = localStorage.getItem('cs_bookings');
    const savedThemes = localStorage.getItem('cs_themes');
    const savedStores = localStorage.getItem('cs_stores');

    if (savedSettings) {
      const saved = JSON.parse(savedSettings);
      setSettings({
        ...DEFAULT_ADMIN_SETTINGS,
        ...saved,
        businessInfo: { ...DEFAULT_ADMIN_SETTINGS.businessInfo, ...saved.businessInfo },
        bankInfo: { ...DEFAULT_ADMIN_SETTINGS.bankInfo, ...saved.bankInfo },
        smsTemplates: { ...DEFAULT_ADMIN_SETTINGS.smsTemplates, ...saved.smsTemplates }
      });
    }
    if (savedClosed) setClosedSlots(JSON.parse(savedClosed));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedStores) setStores(JSON.parse(savedStores));

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
          className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
            isPast ? 'opacity-20 cursor-not-allowed' :
            isSelected ? 'bg-white border-white text-black font-bold shadow-xl scale-105' : 'hover:border-white/40 border-white/5 bg-white/5'
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
    const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
    const day = selectedDate.getDay();
    const isWeekend = day === 0 || day === 6;
    
    const baseSlots = theme.customSlots && theme.customSlots.length > 0 ? theme.customSlots : (isWeekend ? settings.weekendSlots : settings.weekdaySlots);
    
    return baseSlots.map(slot => {
      const slotBookings = bookings.filter(b => b.themeId === theme.id && b.date === dateStr && b.time === slot && b.status !== 'cancelled');
      const currentParticipants = slotBookings.reduce((sum, b) => sum + b.participantCount, 0);
      const isClosedByAdmin = closedSlots.some(cs => cs.themeId === theme.id && cs.date === dateStr && cs.time === slot);
      const isClosedByRequest = slotBookings.some(b => b.isCloseRequested);
      const isFull = currentParticipants >= theme.maxPlayers;
      
      const isAvailable = !isClosedByAdmin && !isClosedByRequest && !isFull;
      
      return { 
        time: slot, 
        isAvailable, 
        currentParticipants, 
        isClosedByAdmin, 
        isClosedByRequest,
        isFull
      };
    });
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 px-0 md:px-6 max-w-7xl mx-auto">
      <div className="px-6 md:px-0">
        <Link to="/reservation" className="inline-flex items-center text-[#b3b3b3] hover:text-white mb-8 gap-2 text-sm font-bold tracking-widest uppercase">
          <ArrowLeft size={16} /> Back to Episodes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-0 md:gap-16">
        <div className="px-6 md:px-0 mb-12 lg:mb-0">
          <div className="relative aspect-[3/4] md:aspect-[16/10] overflow-hidden rounded-none md:rounded-3xl shadow-2xl mb-12">
            <img src={theme.posterUrl} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent md:hidden" />
          </div>
          
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#dc2626] text-[10px] font-bold px-2 py-1 rounded tracking-widest">TOP RATED</span>
                <span className="text-white/40 text-xs font-mono uppercase flex items-center gap-1.5">
                  <MapPin size={12} /> {stores.find(s => s.id === theme.storeId)?.name || '강남점'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter">{theme.title}</h1>
              <p className="text-[#b3b3b3] text-lg md:text-xl leading-relaxed max-w-2xl">{theme.synopsis}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Difficulty</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-4 h-1 rounded-full ${i < theme.difficulty ? 'bg-white' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Fear Level</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-4 h-1 rounded-full ${i < theme.fearLevel ? 'bg-[#dc2626]' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Players</p>
                <p className="text-white font-bold">{theme.minPlayers}-{theme.maxPlayers}명</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase">Price</p>
                <p className="text-white font-bold">{theme.price.toLocaleString()}원 / 1인</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] md:bg-[#1a1a1a] p-6 md:p-10 rounded-none md:rounded-[40px] border-t md:border border-white/5">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight"><CalendarIcon size={20}/> 날짜 선택</h2>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <ChevronLeft size={20}/>
              </button>
              <span className="font-bold text-sm tracking-widest uppercase">{currentMonth.getFullYear()}. {currentMonth.getMonth() + 1}</span>
              <button 
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-white/20 mb-6 font-bold tracking-widest uppercase">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 mb-12">
            {renderCalendar()}
          </div>

          {selectedDate && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock size={18} /> 시간 선택
                </h3>
                <span className="text-xs font-mono text-white/40">{selectedDate.toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {getSlots().map(slotInfo => {
                  const dateStr = selectedDate.getFullYear() + '-' + String(selectedDate.getMonth() + 1).padStart(2, '0') + '-' + String(selectedDate.getDate()).padStart(2, '0');
                  return (
                    <button
                      key={slotInfo.time}
                      disabled={!slotInfo.isAvailable}
                      onClick={() => navigate(`/booking/${theme.id}/${dateStr}/${slotInfo.time}`)}
                      className={`w-full p-6 border rounded-2xl transition-all flex justify-between items-center group ${
                        slotInfo.isAvailable 
                        ? 'border-white/10 hover:border-white hover:bg-white/5 cursor-pointer' 
                        : 'border-white/5 opacity-20 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className={`text-2xl font-bold ${slotInfo.isAvailable ? 'group-hover:translate-x-2 transition-transform' : ''}`}>{slotInfo.time}</span>
                        {slotInfo.isAvailable && slotInfo.currentParticipants > 0 && (
                          <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                            {slotInfo.currentParticipants}/{theme.maxPlayers}명 예약됨
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold tracking-widest uppercase">
                          {slotInfo.isAvailable ? 'Available' : (slotInfo.isFull ? 'Full' : 'Closed')}
                        </span>
                        {slotInfo.isAvailable && <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeDetail;
