
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { THEMES, DEFAULT_ADMIN_SETTINGS } from '../constants';
import { ChevronLeft, Info, CheckCircle2, CreditCard, Copy, Check, AlertCircle } from 'lucide-react';
import { Theme, AdminSettings } from '../types';

const BookingForm = () => {
  const { themeId, date, time } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
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
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, [themeId]);

  if (!theme) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
        alert('예약자 성함과 휴대폰 번호를 입력해 주세요.');
        return;
    }
    navigate('/success', { state: { theme, date, time, ...formData } });
  };

  const handleCopyBank = () => {
    const text = `${settings.bankInfo.bankName} ${settings.bankInfo.accountNumber} ${settings.bankInfo.holderName}`;
    navigator.clipboard.writeText(settings.bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showCloseOption = formData.participants >= theme.minPlayers;

  return (
    <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
      <Link to={`/theme/${themeId}`} className="inline-flex items-center text-[#b3b3b3] hover:text-white mb-8 gap-1">
        <ChevronLeft size={20} /> 테마 상세로 돌아가기
      </Link>

      <div className="bg-[#1a1a1a] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-white/5 bg-white/5">
            <h1 className="text-3xl font-bold mb-2">예약 정보 입력</h1>
            <p className="text-[#b3b3b3]">{theme.title} | {date} | {time}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#b3b3b3]">예약자 성함</label>
              <input 
                type="text" 
                required
                placeholder="성함을 입력해주세요"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-white transition-colors text-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#b3b3b3]">휴대폰 번호</label>
              <input 
                type="tel" 
                required
                placeholder="010-0000-0000"
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-white transition-colors text-white"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <div className="flex items-start gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-[#b3b3b3] leading-relaxed">
                  예약 완료 시 확인 문자가 자동으로 발송됩니다. 문자를 받지 못한 경우 번호 입력이 잘못되었을 수도 있으니 해당 매장으로 꼭 연락해주세요. 매장에서 예약 1~2일 전에 선입금 및 방문 확인을 위한 연락을 드립니다. 수차례 연락을 받지 않는 경우 예약이 취소될 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[#b3b3b3]">참여 인원 ({theme.minPlayers}~{theme.maxPlayers}인)</label>
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: theme.maxPlayers - theme.minPlayers + 1 }, (_, i) => theme.minPlayers + i).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({...formData, participants: num})}
                  className={`w-14 h-14 rounded-xl border font-bold transition-all ${
                    formData.participants === num 
                        ? 'bg-white border-white text-black shadow-lg shadow-white/10' 
                        : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[#b3b3b3]">결제 방식 선택</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'on-site'})}
                className={`py-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === 'on-site'
                    ? 'bg-white border-white text-black'
                    : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                }`}
              >
                현장 결제
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, paymentMethod: 'bank-transfer'})}
                className={`py-4 rounded-xl border font-bold transition-all flex items-center justify-center gap-2 ${
                  formData.paymentMethod === 'bank-transfer'
                    ? 'bg-white border-white text-black'
                    : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                }`}
              >
                계좌이체 (선입금)
              </button>
            </div>

            {formData.paymentMethod === 'bank-transfer' && (
              <div className="p-6 bg-white/5 rounded-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-xs text-[#b3b3b3] mb-3">입금 계좌 정보</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="text-lg font-bold tracking-wider">
                    {settings.bankInfo.bankName} {settings.bankInfo.accountNumber} <span className="text-sm font-normal text-white/60">({settings.bankInfo.holderName})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {copied ? '복사됨' : '복사하기'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {showCloseOption && (
            <div className="p-6 bg-red-950/10 border border-[#dc2626]/20 rounded-2xl flex items-start gap-4">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  id="closeBooking"
                  className="w-5 h-5 accent-[#dc2626]"
                  checked={formData.isCloseRequested}
                  onChange={(e) => setFormData({...formData, isCloseRequested: e.target.checked})}
                />
              </div>
              <label htmlFor="closeBooking" className="cursor-pointer">
                <p className="font-bold text-[#dc2626] mb-1">예약 마감 신청</p>
                <p className="text-xs text-[#b3b3b3] leading-relaxed">
                  최소 인원 조건이 충족되었습니다. 모르는 사람과 함께 플레이하는 것을 원치 않으시면 체크해주세요. 체크 시 해당 시간대는 즉시 예약 마감 처리됩니다.
                </p>
              </label>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#b3b3b3]">매장에 전달하실 사항 (선택)</label>
            <textarea 
              rows={3}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-white transition-colors resize-none text-white"
              placeholder="함께 하실 분들이나 매장에 전달하실 사항을 남겨주세요."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-5 bg-white text-black font-bold rounded-xl text-lg hover:bg-neutral-200 transition-all shadow-xl shadow-black/30 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={24} /> 예약 완료하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
