
import { Theme, AdminSettings, Notice } from './types';

export const THEMES: Theme[] = [
  {
    id: 'theme-1',
    title: '박수무당 살인사건',
    posterUrl: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80',
    synopsis: '신비로운 무당의 집에서 벌어진 참혹한 살인사건. 당신은 이 미스터리를 풀고 범인을 잡을 수 있을 것인가?',
    minPlayers: 4,
    maxPlayers: 5,
    duration: 100,
    difficulty: 4,
    fearLevel: 3,
    price: 28000
  },
  {
    id: 'theme-2',
    title: '미대생 살인사건',
    posterUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80',
    synopsis: '화려한 예술의 이면에 숨겨진 어두운 진실. 미대 작업실에서 발견된 사체와 얽히고설킨 인물들.',
    minPlayers: 5,
    maxPlayers: 6,
    duration: 120,
    difficulty: 5,
    fearLevel: 2,
    price: 32000
  }
];

export const INTRO_POINTS = [
  {
    title: '압도적 몰입감',
    desc: '전문 시나리오 작가와 공간 디자이너가 완성한 고퀄리티 현장 분위기를 경험하세요.',
    img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80'
  },
  {
    title: '탄탄한 시나리오',
    desc: '치밀하게 얽힌 인물 관계와 반전의 드라마. 당신의 추리력이 진실을 밝힐 열쇠입니다.',
    img: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80'
  },
  {
    title: '다양한 캐릭터',
    desc: '각기 다른 사연과 비밀을 가진 캐릭터들. 역할에 완벽히 몰입하여 범인을 찾거나 속이세요.',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  managerPhone: '010-1234-5678',
  managerEmail: 'admin@crimesceners.com',
  weekdaySlots: ['19:30'],
  weekendSlots: ['11:00', '13:30', '16:00', '18:30', '21:00'],
  bankInfo: {
    bankName: '신한',
    accountNumber: '110520466113',
    holderName: '김보경'
  },
  logoUrl: 'https://i.imgur.com/G5ZkX1n.png',
  faviconUrl: '',
  thumbnailUrl: '',
  smsTemplates: {
    onBooking: {
      content: '[CRIME SCENERS] {name}님, {theme} 테마 예약이 완료되었습니다. {date} {time}에 뵙겠습니다.',
      enabled: true
    },
    dayBefore: {
      content: '[CRIME SCENERS] 내일은 {theme} 예약일입니다. 10분 전까지 도착 부탁드립니다.',
      time: '14:00',
      enabled: true
    }
  },
  homeConfig: {
    heroImageUrl: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80',
    introImages: [
      'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80'
    ]
  }
};

export const INITIAL_NOTICES: Notice[] = [
  {
    id: '1',
    title: '[필독] 크라임씨너스 이용 가이드 및 주의사항',
    content: '현장에 도착하시면 먼저 의상 교체와 캐릭터 시트를 수령하게 됩니다...',
    date: '2024-05-01',
    isImportant: true
  }
];

export const STORE_INFO = {
  address: '서울특별시 강남구 테헤란로 123, B1',
  phone: '02-123-4567',
  hours: '평일 17:00-24:00 / 주말 10:00-24:00',
  businessInfo: '사업자등록번호: 123-45-67890 | 대표: 김범인',
  sns: [
    { name: 'Instagram', url: '#' },
    { name: 'YouTube', url: '#' }
  ]
};
