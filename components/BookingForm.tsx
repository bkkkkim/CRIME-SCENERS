
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { THEMES, DEFAULT_ADMIN_SETTINGS } from '../constants';
import { ChevronLeft, Info, CheckCircle2, CreditCard, Copy, Check, AlertCircle } from 'lucide-react';
import { Theme, AdminSettings, BookingData } from '../types';

const BookingForm = () => {
  const { themeId, date, time } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    participants: 2,
    paymentMethod: 'on-site' as 'on-site' | 'bank-transfer',
    isCloseRequested: false,
    notes: ''
  });

  useEffect(() => {
    const savedThemes = localStorage.getItem('cs_themes');
    const themeList = savedThemes ? JSON.parse(savedThemes) : THEMES;
    const found = themeList.find((t: Theme) => t.id === themeId);
    if (found) {
        setTheme(found);
        setFormData(prev => ({ ...prev, participants: found.minPlayers }));
    }

    const savedSettings = localStorage.getItem('cs_admin_settings');
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

    const savedBookings = localStorage.getItem('cs_bookings');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
  }, [themeId]);

  if (!theme) return null;

  // Calculate available participants
  const existingBookings = bookings.filter(b => b.themeId === themeId && b.date === date && b.time === time && b.status !== 'cancelled');
  const bookedCount = existingBookings.reduce((sum, b) => sum + b.participantCount, 0);
  const remainingCapacity = theme.maxPlayers - bookedCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
        alert('예약자 성함과 휴대폰 번호를 입력해 주세요.');
        return;
    }
    navigate('/success', { state: { theme, date, time, ...formData } });
  };

  const handleCopyBank = () => {
    navigator.clipboard.writeText(settings.bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showCloseOption = formData.participants >= theme.minPlayers;

  return (
    <div className="pt-24 md:pt-32 pb-24 px-0 md:px-6 max-w-3xl mx-auto">
      <div className="px-6 md:px-0">
        <Link to={`/theme/${themeId}`} className="inline-flex items-center text-[#b3b3b3] hover:text-white mb-8 gap-1 text-sm font-bold tracking-widest uppercase">
          <ChevronLeft size={16} /> Back to Episode
        </Link>
      </div>

      <div className="bg-[#1a1a1a] md:rounded-3xl border-y md:border border-white/5 overflow-hidden">
        <div className="p-8 md:p-12 border-b border-white/5 bg-white/5">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tighter">RESERVATION</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#b3b3b3] font-medium">
              <span className="text-white">{theme.title}</span>
              <span>{date}</span>
              <span>{time}</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 tracking-widest uppercase">예약자 성함</label>
              <input 
                type="text" 
                required
                placeholder="성함을 입력해주세요"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-white transition-colors text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/40 tracking-widest uppercase">휴대폰 번호</label>
              <input 
                type="tel" 
                required
                placeholder="010-0000-0000"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-white transition-colors text-white"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-white/40 tracking-widest uppercase">참여 인원 선택</label>
              <span className="text-[10px] text-white/20">잔여: {remainingCapacity}명 / 최대: {theme.maxPlayers}명</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: theme.maxPlayers }, (_, i) => i + 1).map(num => {
                const isPossible = num <= remainingCapacity;
                return (
                  <button
                    key={num}
                    type="button"
                    disabled={!isPossible}
                    onClick={() => setFormData({...formData, participants: num})}
                    className={`w-16 h-16 rounded-2xl border font-bold transition-all ${
                      formData.participants === num 
                          ? 'bg-white border-white text-black shadow-xl shadow-white/10 scale-110' 
                          : isPossible 
                            ? 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                            : 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            {!remainingCapacity && (
              <p className="text-xs text-red-500 font-bold">⚠️ 이 슬롯은 이미 예약이 가득 찼습니다.</p>
            )}
          </div>

          <div className="space-y-6">
            <label className="text-xs font-bold text-white/40 tracking-widest uppercase">결제 방식</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'on-site'})}
                className={`py-5 rounded-2xl border font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === 'on-site'
                    ? 'bg-white border-white text-black shadow-xl'
                    : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                }`}
              >
                현장 결제
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'bank-transfer'})}
                className={`py-5 rounded-2xl border font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === 'bank-transfer'
                    ? 'bg-white border-white text-black shadow-xl'
                    : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                }`}
              >
                계좌이체
              </button>
            </div>

            {formData.paymentMethod === 'bank-transfer' && (
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-2">Deposit Account</p>
                    <div className="text-xl font-bold tracking-tight">
                      {settings.bankInfo.bankName} {settings.bankInfo.accountNumber}
                    </div>
                    <p className="text-sm text-white/60">예금주: {settings.bankInfo.holderName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {showCloseOption && (
            <div className="p-8 bg-[#dc2626]/5 border border-[#dc2626]/20 rounded-[32px] flex items-start gap-6">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="closeBooking"
                  className="w-6 h-6 accent-[#dc2626]"
                  checked={formData.isCloseRequested}
                  onChange={(e) => setFormData({...formData, isCloseRequested: e.target.checked})}
                />
              </div>
              <label htmlFor="closeBooking" className="cursor-pointer">
                <p className="font-bold text-[#dc2626] text-lg mb-2">예약 마감 신청 (Private Play)</p>
                <p className="text-sm text-[#b3b3b3] leading-relaxed">
                  최소 인원 조건이 충족되었습니다. 모르는 사람과 함께 플레이하는 것을 원치 않으시면 체크해주세요. 체크 시 해당 시간대는 즉시 예약 마감 처리됩니다.
                </p>
              </label>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-bold text-white/40 tracking-widest uppercase">매장 전달 사항 (선택)</label>
            <textarea 
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-white transition-colors resize-none text-white"
              placeholder="함께 하실 분들이나 매장에 전달하실 사항을 남겨주세요."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-8">
            <button 
              type="submit"
              className="w-full py-6 bg-white text-black font-bold rounded-2xl text-xl hover:bg-neutral-200 transition-all shadow-2xl shadow-black/50 flex items-center justify-center gap-3"
            >
              <CheckCircle2 size={24} /> CONFIRM RESERVATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
