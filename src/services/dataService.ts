
import { Theme, AdminSettings, BookingData, ClosedSlot, Notice } from '../../types';
import { THEMES, DEFAULT_ADMIN_SETTINGS, INITIAL_NOTICES } from '../../constants';

const KEYS = {
  SETTINGS: 'cs_admin_settings',
  THEMES: 'cs_themes',
  BOOKINGS: 'cs_bookings',
  CLOSED_SLOTS: 'cs_closed_slots',
  NOTICES: 'cs_notices',
};

export const dataService = {
  getSettings: (): AdminSettings => {
    const saved = localStorage.getItem(KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_SETTINGS;
  },
  saveSettings: (settings: AdminSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getThemes: (): Theme[] => {
    const saved = localStorage.getItem(KEYS.THEMES);
    return saved ? JSON.parse(saved) : THEMES;
  },
  saveThemes: (themes: Theme[]) => {
    localStorage.setItem(KEYS.THEMES, JSON.stringify(themes));
  },

  getBookings: (): BookingData[] => {
    const saved = localStorage.getItem(KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  },
  saveBookings: (bookings: BookingData[]) => {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  },
  addBooking: (booking: BookingData) => {
    const bookings = dataService.getBookings();
    bookings.push(booking);
    dataService.saveBookings(bookings);
  },
  updateBookingStatus: (id: string, status: BookingData['status']) => {
    const bookings = dataService.getBookings();
    const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
    dataService.saveBookings(updated);
  },

  getClosedSlots: (): ClosedSlot[] => {
    const saved = localStorage.getItem(KEYS.CLOSED_SLOTS);
    return saved ? JSON.parse(saved) : [];
  },
  saveClosedSlots: (slots: ClosedSlot[]) => {
    localStorage.setItem(KEYS.CLOSED_SLOTS, JSON.stringify(slots));
  },

  getNotices: (): Notice[] => {
    const saved = localStorage.getItem(KEYS.NOTICES);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  },
  saveNotices: (notices: Notice[]) => {
    localStorage.setItem(KEYS.NOTICES, JSON.stringify(notices));
  },

  // Helper to calculate remaining slots for a specific theme, date, and time
  getRemainingSlots: (themeId: string, date: string, time: string): number => {
    const themes = dataService.getThemes();
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return 0;

    const bookings = dataService.getBookings();
    const activeBookings = bookings.filter(b => 
      b.themeId === themeId && 
      b.date === date && 
      b.time === time && 
      b.status !== 'cancelled'
    );

    const bookedCount = activeBookings.reduce((sum, b) => sum + b.participantCount, 0);
    const isClosedByRequest = activeBookings.some(b => b.isCloseRequested);
    const isClosedByAdmin = dataService.getClosedSlots().some(cs => 
      cs.themeId === themeId && cs.date === date && cs.time === time
    );

    if (isClosedByRequest || isClosedByAdmin) return 0;

    return Math.max(0, theme.maxPlayers - bookedCount);
  }
};
