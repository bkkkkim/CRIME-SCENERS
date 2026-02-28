
import React, { useState, useEffect } from 'react';
import { DEFAULT_ADMIN_SETTINGS, INITIAL_NOTICES, THEMES } from '../constants';
import { AdminSettings, Notice, Theme, BookingData, ClosedSlot } from '../types';
import { 
  Save, Plus, Trash2, LayoutDashboard, Calendar, FileText, Settings, 
  User, Phone, Users, Clock, MessageSquare, XCircle, Home as HomeIcon, 
  CalendarX, CheckCircle, AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'themes' | 'notices' | 'settings' | 'home' | 'closure'>('bookings');
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [themes, setThemes] = useState<Theme[]>(THEMES);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [closedSlots, setClosedSlots] = useState<ClosedSlot[]>([]);

  useEffect(() => {
    const s = localStorage.getItem('cs_admin_settings');
    const n = localStorage.getItem('cs_notices');
    const t = localStorage.getItem('cs_themes');
    const b = localStorage.getItem('cs_bookings');
    const c = localStorage.getItem('cs_closed_slots');
    
    if (s) setSettings(JSON.parse(s));
    if (n) setNotices(JSON.parse(n));
    if (t) setThemes(JSON.parse(t));
    if (b) setBookings(JSON.parse(b));
    if (c) setClosedSlots(JSON.parse(c));
  }, []);

  const saveAll = (type: string, data: any) => {
    localStorage.setItem(type, JSON.stringify(data));
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('이 예약을 취소하시겠습니까? 취소 후 복구는 가능하지만 예약 내역에서는 비활성화됩니다.')) {
      const updated = bookings.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b);
      setBookings(updated);
      saveAll('cs_bookings', updated);
    }
  };

  const toggleClosure = (date: string, themeId: string, time: string) => {
    const exists = closedSlots.find(c => c.date === date && c.themeId === themeId && c.time === time);
    let updated;
    if (exists) {
      updated = closedSlots.filter(c => !(c.date === date && c.themeId === themeId && c.time === time));
    } else {
      updated = [...closedSlots, { date, themeId, time }];
    }
    setClosedSlots(updated);
    saveAll('cs_closed_slots', updated);
  };

  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 transition-all rounded-lg text-sm ${
        activeTab === id ? 'bg-white text-black font-bold shadow-lg' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Nav */}
        <div className="lg:w-64 space-y-2 shrink-0">
          <h1 className="text-xl font-bold mb-8 px-4">CONTROL CENTER</h1>
          <NavButton id="bookings" icon={Calendar} label="예약 현황" />
          <NavButton id="closure" icon={CalendarX} label="예약 마감 관리" />
          <NavButton id="themes" icon={LayoutDashboard} label="테마/슬롯 관리" />
          <NavButton id="home" icon={HomeIcon} label="홈 영역 관리" />
          <NavButton id="notices" icon={FileText} label="공지사항 관리" />
          <NavButton id="settings" icon={Settings} label="기타 및 SMS 설정" />
        </div>

        {/* Content Area */}
        <div className="flex-grow animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. 예약 현황 */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">실시간 예약 현황</h2>
                <div className="text-xs text-white/40">최신 예약순 정렬</div>
              </div>
              {bookings.length === 0 ? (
                <div className="p-20 text-center bg-white/5 rounded-3xl border border-white/5 text-white/40 italic">
                  접수된 예약 내역이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {[...bookings].reverse().map((booking) => (
                    <div key={booking.id} className={`bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between gap-6 transition-opacity ${booking.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
                      <div className="flex gap-6">
                        <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10">
                          <img src={booking.themePoster} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-sm font-bold text-white/60">{booking.date} {booking.time}</span>
                             {booking.status === 'cancelled' && <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded">취소됨</span>}
                             {booking.isCloseRequested && <span className="bg-[#dc2626] text-white text-[10px] font-bold px-2 py-0.5 rounded animate-pulse">마감 요청됨</span>}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{booking.themeTitle}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-white/40">
                             <span className="flex items-center gap-1"><User size={14}/> {booking.userName}</span>
                             <span className="flex items-center gap-1"><Phone size={14}/> {booking.userPhone}</span>
                             <span className="flex items-center gap-1"><Users size={14}/> {booking.participantCount}명</span>
                          </div>
                          {booking.notes && <p className="text-xs mt-3 text-white/30 italic">"{booking.notes}"</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.status !== 'cancelled' ? (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 bg-white/5 text-white/60 hover:bg-[#dc2626] hover:text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                          >
                            <XCircle size={16} /> 예약 취소
                          </button>
                        ) : (
                          <span className="text-xs text-white/20">취소 처리 완료</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. 예약 마감 관리 */}
          {activeTab === 'closure' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">특정 일자/시간 마감 설정</h2>
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5">
                <p className="text-sm text-white/40 mb-8 flex items-center gap-2"><AlertCircle size={16} /> 예약이 이미 찬 슬롯 외에, 매장 사정으로 닫아야 하는 슬롯을 클릭하여 마감하세요.</p>
                <div className="space-y-10">
                  {themes.map(t => (
                    <div key={t.id} className="space-y-4">
                      <h3 className="font-bold text-lg text-white/80">{t.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-8 gap-3">
                        {/* 간단한 데모를 위해 오늘부터 3일간만 표시 */}
                        {[0, 1, 2].map(dayOffset => {
                          const date = new Date();
                          date.setDate(date.getDate() + dayOffset);
                          const dateStr = date.toISOString().split('T')[0];
                          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                          const slots = t.customSlots || (isWeekend ? settings.weekendSlots : settings.weekdaySlots);
                          
                          return slots.map(time => {
                            const isClosed = closedSlots.some(cs => cs.date === dateStr && cs.themeId === t.id && cs.time === time);
                            return (
                              <button 
                                key={`${dateStr}-${time}`}
                                onClick={() => toggleClosure(dateStr, t.id, time)}
                                className={`text-[10px] p-2 rounded-lg border transition-all flex flex-col items-center ${
                                  isClosed 
                                  ? 'bg-[#dc2626] border-[#dc2626] text-white font-bold' 
                                  : 'border-white/10 hover:border-white/30 text-white/40'
                                }`}
                              >
                                <span>{dateStr.slice(5)}</span>
                                <span className="text-sm">{time}</span>
                                <span className="mt-1">{isClosed ? 'CLOSED' : 'OPEN'}</span>
                              </button>
                            );
                          });
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. 테마/슬롯 관리 */}
          {activeTab === 'themes' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">테마 및 상품 관리</h2>
                <button 
                  onClick={() => {
                    const newTheme: Theme = { ...THEMES[0], id: `theme-${Date.now()}`, title: '새 테마' };
                    const updated = [...themes, newTheme];
                    setThemes(updated);
                    saveAll('cs_themes', updated);
                  }}
                  className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus size={18} /> 새 테마 등록
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {themes.map((theme, idx) => (
                  <div key={theme.id} className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                    <div className="space-y-4">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10">
                        <img src={theme.posterUrl} className="w-full h-full object-cover" />
                      </div>
                      <input 
                        className="w-full bg-black/40 text-[10px] border border-white/10 p-2 rounded outline-none" 
                        value={theme.posterUrl} 
                        onChange={e => {
                          const updated = [...themes];
                          updated[idx].posterUrl = e.target.value;
                          setThemes(updated);
                          saveAll('cs_themes', updated);
                        }}
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">테마 명</label>
                          <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none focus:border-white" 
                            value={theme.title} onChange={e => {
                              const updated = [...themes];
                              updated[idx].title = e.target.value;
                              setThemes(updated);
                              saveAll('cs_themes', updated);
                            }} />
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-1 block">개별 운영 슬롯 (쉼표 구분 - 미입력시 기본설정 적용)</label>
                          <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none focus:border-white font-mono text-sm" 
                            placeholder="12:00, 14:00, 16:00..."
                            value={theme.customSlots?.join(', ') || ''} 
                            onChange={e => {
                              const updated = [...themes];
                              updated[idx].customSlots = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                              setThemes(updated);
                              saveAll('cs_themes', updated);
                            }} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-white/40 mb-1 block">소개글 (시놉시스)</label>
                        <textarea rows={3} className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none focus:border-white resize-none text-sm" 
                          value={theme.synopsis} onChange={e => {
                            const updated = [...themes];
                            updated[idx].synopsis = e.target.value;
                            setThemes(updated);
                            saveAll('cs_themes', updated);
                          }} />
                      </div>
                      <button onClick={() => {
                        const updated = themes.filter(t => t.id !== theme.id);
                        setThemes(updated);
                        saveAll('cs_themes', updated);
                      }} className="text-[#dc2626] text-xs font-bold flex items-center gap-1 hover:underline">
                        <Trash2 size={14} /> 이 테마 삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 홈 영역 관리 */}
          {activeTab === 'home' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold">메인 화면 및 인트로 이미지 관리</h2>
              <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 space-y-8">
                <div>
                  <label className="text-sm font-bold mb-4 block">메인 히어로 배경 이미지 URL</label>
                  <div className="flex gap-4">
                    <input className="flex-grow bg-black border border-white/10 p-3 rounded-lg outline-none" 
                      value={settings.homeConfig.heroImageUrl} 
                      onChange={e => setSettings({...settings, homeConfig: {...settings.homeConfig, heroImageUrl: e.target.value}})} />
                    <button onClick={() => saveAll('cs_admin_settings', settings)} className="px-6 py-3 bg-white text-black font-bold rounded-lg">적용</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {settings.homeConfig.introImages.map((url, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-xs text-white/40">인트로 포인트 {i+1} 이미지</label>
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 border border-white/10">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                      <input className="w-full bg-black text-xs border border-white/10 p-2 rounded outline-none" 
                        value={url} 
                        onChange={e => {
                          const updatedImages = [...settings.homeConfig.introImages];
                          updatedImages[i] = e.target.value;
                          setSettings({...settings, homeConfig: {...settings.homeConfig, introImages: updatedImages}});
                        }} />
                    </div>
                  ))}
                </div>
                <button onClick={() => saveAll('cs_admin_settings', settings)} className="w-full py-4 bg-white text-black font-bold rounded-xl text-lg">전체 홈 설정 저장</button>
              </div>
            </div>
          )}

          {/* 5. 공지사항 관리 */}
          {activeTab === 'notices' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">공지사항 관리</h2>
                <button 
                  onClick={() => {
                    const newNotice = { id: Date.now().toString(), title: '새 공지', content: '', date: new Date().toISOString().split('T')[0] };
                    const updated = [newNotice, ...notices];
                    setNotices(updated);
                    saveAll('cs_notices', updated);
                  }}
                  className="px-4 py-2 bg-white text-black font-bold rounded-lg text-sm"
                >새 공지 작성</button>
              </div>
              <div className="space-y-4">
                {notices.map((n, idx) => (
                  <div key={n.id} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 space-y-4">
                    <div className="flex gap-4 items-center">
                       <input className="flex-grow bg-transparent text-xl font-bold border-b border-white/10 py-1 outline-none focus:border-white" 
                        value={n.title} onChange={e => {
                          const updated = [...notices];
                          updated[idx].title = e.target.value;
                          setNotices(updated);
                          saveAll('cs_notices', updated);
                        }} />
                       <button onClick={() => {
                         const updated = notices.filter(item => item.id !== n.id);
                         setNotices(updated);
                         saveAll('cs_notices', updated);
                       }} className="text-white/20 hover:text-[#dc2626] transition-colors"><Trash2 size={20}/></button>
                    </div>
                    <textarea rows={4} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none text-[#b3b3b3] text-sm resize-none" 
                      value={n.content} onChange={e => {
                        const updated = [...notices];
                        updated[idx].content = e.target.value;
                        setNotices(updated);
                        saveAll('cs_notices', updated);
                      }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. 설정 및 SMS */}
          {activeTab === 'settings' && (
            <div className="space-y-10">
              <section className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 space-y-6">
                <h2 className="text-xl font-bold border-l-4 border-white pl-3 flex items-center gap-2"><MessageSquare size={20}/> SMS 자동 발송 설정</h2>
                <div className="space-y-8">
                  <div className="p-6 bg-black rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">예약 완료 즉시 발송</h3>
                      <input type="checkbox" checked={settings.smsTemplates.onBooking.enabled} 
                        onChange={e => setSettings({...settings, smsTemplates: {...settings.smsTemplates, onBooking: {...settings.smsTemplates.onBooking, enabled: e.target.checked}}})} className="accent-white w-5 h-5"/>
                    </div>
                    <p className="text-[10px] text-white/30 italic">변수: {'{name}, {theme}, {date}, {time}'}</p>
                    <textarea className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-sm outline-none" rows={3}
                      value={settings.smsTemplates.onBooking.content}
                      onChange={e => setSettings({...settings, smsTemplates: {...settings.smsTemplates, onBooking: {...settings.smsTemplates.onBooking, content: e.target.value}}})} />
                  </div>
                  <div className="p-6 bg-black rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">방문 1일 전 안내 발송</h3>
                      <div className="flex items-center gap-4">
                        <input type="time" className="bg-[#121212] border border-white/10 text-xs p-1 rounded" 
                          value={settings.smsTemplates.dayBefore.time}
                          onChange={e => setSettings({...settings, smsTemplates: {...settings.smsTemplates, dayBefore: {...settings.smsTemplates.dayBefore, time: e.target.value}}})} />
                        <input type="checkbox" checked={settings.smsTemplates.dayBefore.enabled} 
                          onChange={e => setSettings({...settings, smsTemplates: {...settings.smsTemplates, dayBefore: {...settings.smsTemplates.dayBefore, enabled: e.target.checked}}})} className="accent-white w-5 h-5"/>
                      </div>
                    </div>
                    <textarea className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-sm outline-none" rows={3}
                      value={settings.smsTemplates.dayBefore.content}
                      onChange={e => setSettings({...settings, smsTemplates: {...settings.smsTemplates, dayBefore: {...settings.smsTemplates.dayBefore, content: e.target.value}}})} />
                  </div>
                </div>
              </section>

              <section className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 space-y-6">
                <h2 className="text-xl font-bold border-l-4 border-white pl-3">기본 연락처 및 슬롯 설정</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">관리자 휴대폰 (문의 알림 수신)</label>
                    <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none" 
                      value={settings.managerPhone} onChange={e => setSettings({...settings, managerPhone: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">관리자 이메일 (문의 수신용)</label>
                    <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none" 
                      value={settings.managerEmail} onChange={e => setSettings({...settings, managerEmail: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">기본 평일 슬롯 (쉼표 구분)</label>
                    <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none font-mono text-sm" 
                      value={settings.weekdaySlots.join(', ')} onChange={e => setSettings({...settings, weekdaySlots: e.target.value.split(',').map(s => s.trim())})} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 mb-1 block">기본 주말 슬롯 (쉼표 구분)</label>
                    <input className="w-full bg-black border border-white/10 p-3 rounded-lg outline-none font-mono text-sm" 
                      value={settings.weekendSlots.join(', ')} onChange={e => setSettings({...settings, weekendSlots: e.target.value.split(',').map(s => s.trim())})} />
                  </div>
                </div>
                <button onClick={() => {
                  saveAll('cs_admin_settings', settings);
                  alert('모든 설정이 저장되었습니다.');
                }} className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2">
                  <Save size={20} /> 관리자 최종 설정 저장
                </button>
              </section>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
