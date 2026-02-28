
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { THEMES, INTRO_POINTS, STORE_INFO, DEFAULT_ADMIN_SETTINGS } from '../constants';
import { Clock, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Theme, AdminSettings } from '../types';

const HeroBanner = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat scale-110 animate-[pulse_10s_ease-in-out_infinite]"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#121212]/30 to-[#121212]" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight uppercase">
          Crime <span className="text-white">Sceners</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#b3b3b3] font-light max-w-2xl mx-auto">
          사건 현장에 있는 우리 모두 <span className="text-white font-medium">SCENERS</span> 입니다.
        </p>
        <div className="mt-12">
            <Link 
              to="/reservation" 
              className="inline-block px-10 py-4 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-all transform hover:scale-105"
            >
              지금 예약하기
            </Link>
        </div>
      </div>
    </div>
  );
};

const IntroSection = ({ images }: { images: string[] }) => (
  <section className="py-24 px-6 bg-[#121212]">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-16 text-center">왜 크라임씨너스인가?</h2>
      <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-12 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x hide-scrollbar">
        {INTRO_POINTS.map((point, i) => (
          <div key={i} className="min-w-[40%] md:min-w-0 snap-start group flex-shrink-0">
            <div className="overflow-hidden rounded-lg mb-6 aspect-[4/3]">
              <img 
                src={images[i] || point.img} 
                alt={point.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">{point.title}</h3>
            <p className="text-[#b3b3b3] text-sm md:text-base leading-relaxed line-clamp-3 md:line-clamp-none">
              {point.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PopularThemes = ({ themes }: { themes: Theme[] }) => {
  const displayThemes = themes.slice(0, 5);
  return (
    <section className="py-24 bg-black/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 uppercase">Popular Themes</h2>
            <p className="text-[#b3b3b3]">현재 가장 예약률이 높은 테마들을 만나보세요.</p>
          </div>
          <Link to="/reservation" className="text-white font-medium flex items-center hover:opacity-70 transition-opacity">
            전체 보기 <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:flex md:overflow-x-auto gap-4 md:gap-8 pb-6 hide-scrollbar">
          {displayThemes.map((theme) => (
            <Link 
              key={theme.id} 
              to={`/theme/${theme.id}`}
              className="w-full md:min-w-[400px] block group flex-shrink-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl mb-4">
                <img 
                  src={theme.posterUrl} 
                  alt={theme.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <span className="bg-[#dc2626] text-[10px] md:text-xs font-bold px-2 py-1 rounded mb-2 inline-block">BEST</span>
                  <h3 className="text-base md:text-2xl font-bold line-clamp-1">{theme.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const StoreSection = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl">
        <img 
          src="https://picsum.photos/id/1031/800/600?grayscale" 
          alt="Store Front" 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-8 italic uppercase tracking-widest">Find Us</h2>
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <Clock className="text-white mt-1 shrink-0" size={24} />
            <div>
              <p className="font-bold mb-1 text-white">운영시간</p>
              <p className="text-[#b3b3b3] text-sm md:text-base">{STORE_INFO.hours}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="text-white mt-1 shrink-0" size={24} />
            <div>
              <p className="font-bold mb-1 text-white">연락처</p>
              <p className="text-[#b3b3b3] text-sm md:text-base">{STORE_INFO.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <MapPin className="text-white mt-1 shrink-0" size={24} />
            <div>
              <p className="font-bold mb-1 text-white">위치 정보</p>
              <p className="text-[#b3b3b3] text-sm md:text-base">{STORE_INFO.address}</p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button className="w-full md:w-auto px-8 py-3 border border-white/20 rounded hover:bg-white hover:text-black transition-all font-medium">
            네이버 지도로 보기
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [themes, setThemes] = useState<Theme[]>(THEMES);

  useEffect(() => {
    const s = localStorage.getItem('cs_admin_settings');
    const t = localStorage.getItem('cs_themes');
    if (s) setSettings(JSON.parse(s));
    if (t) setThemes(JSON.parse(t));
  }, []);

  return (
    <div>
      <HeroBanner imageUrl={settings.homeConfig.heroImageUrl} />
      <IntroSection images={settings.homeConfig.introImages} />
      <PopularThemes themes={themes} />
      <StoreSection />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
