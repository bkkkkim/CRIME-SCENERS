
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { THEMES } from '../constants';
import { ChevronLeft, Info, CheckCircle2 } from 'lucide-react';
import { Theme } from '../types';

const BookingForm = () => {
  const { themeId, date, time } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    participants: 4,
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

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#b3b3b3]">예약자 성함</label>
              <input 
                type="text" 
                required
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
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-[#b3b3b3]">참여 인원 ({theme.minPlayers}~{theme.maxPlayers}인)</label>
            <div className="flex gap-4">
              {Array.from({ length: theme.maxPlayers - theme.minPlayers + 1 }, (_, i) => theme.minPlayers + i).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({...formData, participants: num})}
                  className={`w-12 h-12 rounded-lg border font-bold transition-all ${
                    formData.participants === num 
                        ? 'bg-white border-white text-black' 
                        : 'bg-transparent border-white/10 text-[#b3b3b3] hover:border-white/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
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
                <p className="font-bold text-[#dc2626] mb-1">예약 마감 요청</p>
                <p className="text-xs text-[#b3b3b3] leading-relaxed">
                  최소 인원 조건이 충족되었습니다. 더 이상의 인원을 받지 않고 우리 팀끼리만 게임을 진행하길 원하시면 체크해주세요. (추가 예약 불가)
                </p>
              </label>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#b3b3b3]">요청 사항 (선택)</label>
            <textarea 
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 focus:outline-none focus:border-white transition-colors resize-none text-white"
              placeholder="특이사항이나 매장에 전하실 말씀을 적어주세요."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-4 bg-white text-black font-bold rounded-xl text-lg hover:bg-neutral-200 transition-all shadow-xl shadow-black/30"
            >
              예약 완료하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
