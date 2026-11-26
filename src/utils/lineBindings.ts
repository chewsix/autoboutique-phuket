// src/utils/lineBindings.ts
// Shared helper to store, retrieve, and auto-resolve customer LINE User IDs
// Enables seamless two-way binding between LINE OA chat and Studio Bookings

import fs from 'fs';
import path from 'path';

export interface LineBindingEntry {
  bookingId?: string;
  phone?: string;
  customerName?: string;
  lineUserId: string;
  linkedAt: string;
  source: 'webhook' | 'admin' | 'booking_form';
}

export interface LineBindingsStore {
  byBookingId: Record<string, LineBindingEntry>;
  byPhone: Record<string, LineBindingEntry>;
  lastActiveUserId?: string;
  lastActiveTimestamp?: string;
}

// In-memory cache
const memoryStore: LineBindingsStore = {
  byBookingId: {},
  byPhone: {},
  lastActiveUserId: undefined,
  lastActiveTimestamp: undefined,
};

// Storage file path for persistence across server restarts
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'line-bindings.json');

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
    }
  } catch (err) {
    // Fail silently in read-only environments
  }
}

export function loadLineBindings(): LineBindingsStore {
  try {
    ensureDataFile();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        memoryStore.byBookingId = { ...memoryStore.byBookingId, ...(parsed.byBookingId || {}) };
        memoryStore.byPhone = { ...memoryStore.byPhone, ...(parsed.byPhone || {}) };
        if (parsed.lastActiveUserId) {
          memoryStore.lastActiveUserId = parsed.lastActiveUserId;
          memoryStore.lastActiveTimestamp = parsed.lastActiveTimestamp;
        }
      }
    }
  } catch (err) {
    // Return memory fallback
  }
  return memoryStore;
}

export function saveLineBindings(store: LineBindingsStore): void {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    // In-memory already updated
  }
}

export function recordLineInteraction(
  lineUserId: string,
  details?: {
    bookingId?: string;
    phone?: string;
    customerName?: string;
    source?: 'webhook' | 'admin' | 'booking_form';
  }
): LineBindingEntry {
  const store = loadLineBindings();
  const now = new Date().toISOString();

  store.lastActiveUserId = lineUserId;
  store.lastActiveTimestamp = now;

  const entry: LineBindingEntry = {
    lineUserId,
    bookingId: details?.bookingId ? details.bookingId.replace(/^#/, '').toUpperCase().trim() : undefined,
    phone: details?.phone ? details.phone.replace(/[^0-9]/g, '') : undefined,
    customerName: details?.customerName?.trim(),
    linkedAt: now,
    source: details?.source || 'webhook',
  };

  if (entry.bookingId) {
    store.byBookingId[entry.bookingId] = entry;
  }
  if (entry.phone && entry.phone.length >= 9) {
    store.byPhone[entry.phone] = entry;
  }

  saveLineBindings(store);
  return entry;
}

export function resolveCustomerLineUserId(
  bookingId?: string,
  phone?: string
): string | undefined {
  const store = loadLineBindings();

  if (bookingId) {
    const cleanId = bookingId.replace(/^#/, '').toUpperCase().trim();
    if (store.byBookingId[cleanId]?.lineUserId) {
      return store.byBookingId[cleanId].lineUserId;
    }
  }

  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 9 && store.byPhone[cleanPhone]?.lineUserId) {
      return store.byPhone[cleanPhone].lineUserId;
    }
  }

  return undefined;
}

export function getLastActiveLineUserId(): string | undefined {
  const store = loadLineBindings();
  return store.lastActiveUserId;
}
