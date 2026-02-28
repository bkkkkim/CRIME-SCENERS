
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { THEMES, INTRO_POINTS, STORE_INFO, DEFAULT_ADMIN_SETTINGS, STORES } from '../constants';
import { Clock, Phone, MapPin, ChevronRight } from 'lucide-react';
import { Theme, AdminSettings, Store } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const TypingTitle = () => {
  const text = "CRIME SCENERS?";
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (!isDeleting && index < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 150);
    } else if (isDeleting && index > 0) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setIndex(prev => prev - 1);
      }, 50);
    } else if (index === text.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (index === 0 && isDeleting) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting]);

  return (
    <h2 className="text-3xl md:text-4xl font-black mb-16 text-center tracking-tighter h-10">
      {displayText}
      <span className="animate-pulse">|</span>
    </h2>
  );
};

const HeroBanner = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, x: -20, y: -20 }}
          animate={{ 
            scale: [1.1, 1.2, 1.1],
            x: [-20, 20, -20],
            y: [-20, 0, -20]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#121212]/20 to-[#121212]" />
        <div className="absolute inset-0 bg-black/20" />
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
      <TypingTitle />
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-12 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
        {INTRO_POINTS.map((point, i) => (
          <div key={i} className="min-w-[80%] md:min-w-0 snap-center md:snap-start group flex-shrink-0">
            <div className="overflow-hidden rounded-lg mb-6 aspect-[4/3]">
              <img 
                src={images[i] || point.img} 
                alt={point.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">{point.title}</h3>
            <p className="text-[#b3b3b3] text-sm md:text-base leading-relaxed">
              {point.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PopularThemes = ({ themes, stores }: { themes: Theme[], stores: Store[] }) => {
  const displayThemes = themes.slice(0, 2);
  return (
    <section className="py-32 bg-black/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter">Featured Themes</h2>
            <p className="text-[#b3b3b3] text-lg">지금 가장 핫한 시나리오</p>
          </div>
          <Link to="/reservation" className="text-white font-bold flex items-center hover:opacity-70 transition-opacity border-b-2 border-white pb-1">
            VIEW ALL THEMES <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayThemes.map((theme) => {
            const store = stores.find(s => s.id === theme.storeId);
            const now = new Date();
            const startDate = theme.startDate ? new Date(theme.startDate) : null;
            const endDate = theme.endDate ? new Date(theme.endDate) : null;
            
            // Set hours to 0 to compare dates only
            now.setHours(0, 0, 0, 0);
            if (startDate) startDate.setHours(0, 0, 0, 0);
            if (endDate) endDate.setHours(0, 0, 0, 0);

            const isComingSoon = (startDate && now < startDate) || (endDate && now > endDate);

            return (
              <Link 
                key={theme.id} 
                to={isComingSoon ? '#' : `/theme/${theme.id}`}
                className={`group block ${isComingSoon ? 'cursor-default' : ''}`}
                onClick={(e) => isComingSoon && e.preventDefault()}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-8 shadow-2xl">
                  <img 
                    src={theme.posterUrl} 
                    alt={theme.title} 
                    className={`w-full h-full object-cover transition-transform duration-700 ${isComingSoon ? 'grayscale opacity-50' : 'group-hover:scale-110'}`}
                  />
                  {isComingSoon && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-xl border border-white/20">
                        <span className="text-2xl font-black tracking-[0.2em] text-white">COMING SOON</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-[#dc2626] text-[10px] font-bold px-2 py-1 rounded">BEST</span>
                      <span className="text-white/60 text-xs font-mono uppercase">{store?.name || '강남점'}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">{theme.title}</h3>
                    <div className="flex flex-wrap gap-6 text-sm text-white/80 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">DIFFICULTY</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-1 rounded-full ${i < theme.difficulty ? 'bg-white' : 'bg-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">FEAR</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-3 h-1 rounded-full ${i < theme.fearLevel ? 'bg-[#dc2626]' : 'bg-white/20'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">PLAYERS</span>
                        <span>{theme.minPlayers}-{theme.maxPlayers}명</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40">PRICE</span>
                        <span>{theme.price.toLocaleString()}원 / 1인</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const StoreSection = ({ settings }: { settings: AdminSettings }) => (
  <section className="py-32 px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
      <div className="rounded-3xl overflow-hidden aspect-square md:aspect-video shadow-2xl border border-white/5">
        <img 
          src={settings.findUsImageUrl || "https://picsum.photos/id/1031/800/600?grayscale"} 
          alt="Store Front" 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
      </div>
      <div>
        <h2 className="text-4xl font-bold mb-12 italic uppercase tracking-widest border-l-8 border-white pl-6">Find Us</h2>
        <div className="space-y-10">
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold mb-2 text-white text-lg">운영시간</p>
              <p className="text-[#b3b3b3] leading-relaxed">{STORE_INFO.hours}</p>
            </div>
          </div>
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <Phone className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold mb-2 text-white text-lg">연락처</p>
              <p className="text-[#b3b3b3] leading-relaxed">{STORE_INFO.phone}</p>
            </div>
          </div>
          <div className="flex items-start space-x-6">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
              <MapPin className="text-white" size={24} />
            </div>
            <div>
              <p className="font-bold mb-2 text-white text-lg">위치 정보</p>
              <p className="text-[#b3b3b3] leading-relaxed">{STORE_INFO.address}</p>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <a 
            href={`https://map.naver.com/v5/search/${encodeURIComponent(STORE_INFO.address)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-10 py-4 bg-white text-black font-bold rounded hover:bg-neutral-200 transition-all transform hover:scale-105"
          >
            네이버 지도로 보기
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Home = () => {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULT_ADMIN_SETTINGS);
  const [themes, setThemes] = useState<Theme[]>(THEMES);
  const [stores, setStores] = useState<Store[]>(STORES);

  useEffect(() => {
    const s = localStorage.getItem('cs_admin_settings');
    const t = localStorage.getItem('cs_themes');
    const st = localStorage.getItem('cs_stores');
    if (s) {
      const saved = JSON.parse(s);
      setSettings({ 
        ...DEFAULT_ADMIN_SETTINGS, 
        ...saved, 
        homeConfig: { ...DEFAULT_ADMIN_SETTINGS.homeConfig, ...saved.homeConfig },
        businessInfo: { ...DEFAULT_ADMIN_SETTINGS.businessInfo, ...saved.businessInfo },
        bankInfo: { ...DEFAULT_ADMIN_SETTINGS.bankInfo, ...saved.bankInfo },
        smsTemplates: { ...DEFAULT_ADMIN_SETTINGS.smsTemplates, ...saved.smsTemplates }
      });
    }
    if (t) setThemes(JSON.parse(t));
    if (st) setStores(JSON.parse(st));
  }, []);

  return (
    <div>
      <HeroBanner imageUrl={settings.homeConfig.heroImageUrl} />
      <IntroSection images={settings.homeConfig.introImages} />
      <PopularThemes themes={themes} stores={stores} />
      <StoreSection settings={settings} />
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Home;
