
export interface Theme {
  id: string;
  title: string;
  posterUrl: string;
  synopsis: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number;
  difficulty: number;
  price: number;
  customSlots?: string[]; // 테마별 개별 슬롯 설정
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant?: boolean;
}

export interface AdminSettings {
  managerPhone: string;
  managerEmail: string;
  weekdaySlots: string[];
  weekendSlots: string[];
  smsTemplates: {
    onBooking: { content: string; enabled: boolean };
    dayBefore: { content: string; time: string; enabled: boolean };
  };
  homeConfig: {
    heroImageUrl: string;
    introImages: string[];
  };
}

export interface BookingData {
  id: string;
  themeId: string;
  themeTitle: string;
  themePoster: string;
  date: string;
  time: string;
  userName: string;
  userPhone: string;
  participantCount: number;
  isCloseRequested: boolean;
  notes: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ClosedSlot {
  date: string;
  themeId: string;
  time: string;
}
