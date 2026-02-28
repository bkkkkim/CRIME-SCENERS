
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { THEMES } from '../constants';
import { ChevronRight } from 'lucide-react';
import { Theme } from '../types';

const ThemeReservation = () => {
  const [themes, setThemes] = useState<Theme[]>(THEMES);

  useEffect(() => {
    const saved = localStorage.getItem('cs_themes');
    if (saved) setThemes(JSON.parse(saved));
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <h1 className="text-4xl font-bold mb-4">테마 예약</h1>
        <p className="text-[#b3b3b3]">원하시는 테마를 선택하여 예약해 주세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {themes.map((theme) => (
          <div key={theme.id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col group border border-white/5 hover:border-white/20 transition-all">
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={theme.posterUrl} 
                alt={theme.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-bold text-white">
                난이도: {'★'.repeat(theme.difficulty)}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col">
              <h3 className="text-2xl font-bold mb-4">{theme.title}</h3>
              <p className="text-[#b3b3b3] text-sm mb-6 line-clamp-3 leading-relaxed">
                {theme.synopsis}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-white block font-medium">참여 인원</span>
                  <span className="text-[#b3b3b3]">{theme.minPlayers}인 ~ {theme.maxPlayers}인</span>
                </div>
                <Link 
                  to={`/theme/${theme.id}`}
                  className="px-5 py-2.5 bg-white text-black rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-neutral-200 transition-colors"
                >
                  상세보기 <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeReservation;
