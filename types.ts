
export interface Theme {
  id: string;
  title: string;
  posterUrl: string; // Can be a URL or Base64 string
  synopsis: string;
  minPlayers: number;
  maxPlayers: number;
  duration: number;
  difficulty: number;
  fearLevel: number; // Added fear level
  price: number;
  customSlots?: string[];
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
  bankInfo: {
    bankName: string;
    accountNumber: string;
    holderName: string;
  };
  logoUrl: string;
  faviconUrl: string;
  thumbnailUrl: string;
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
  paymentMethod: 'on-site' | 'bank-transfer';
  status: 'confirmed' | 'cancelled' | 'paid';
  createdAt: string;
}

export interface ClosedSlot {
  date: string;
  themeId: string;
  time: string;
}
