// src/utils/lineBindings.ts
// Shared helper to store, retrieve, and auto-resolve customer LINE User IDs
// Enables seamless two-way binding between LINE OA chat and Studio Bookings

import fs from 'fs';
import path from 'path';
import os from 'os';

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

// Resilient file path: prefers .data in project root, falls back to os.tmpdir() for serverless/read-only
let resolvedDataFilePath: string | null = null;

function getDataFilePath(): string {
  if (resolvedDataFilePath) return resolvedDataFilePath;
  try {
    const cwdDataDir = path.join(process.cwd(), '.data');
    if (!fs.existsSync(cwdDataDir)) {
      fs.mkdirSync(cwdDataDir, { recursive: true });
    }
    const testFile = path.join(cwdDataDir, '.write-check');
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    resolvedDataFilePath = path.join(cwdDataDir, 'line-bindings.json');
  } catch {
    resolvedDataFilePath = path.join(os.tmpdir(), 'autoboutique-line-bindings.json');
  }
  return resolvedDataFilePath;
}

function ensureDataFile(): string {
  const filePath = getDataFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(memoryStore, null, 2), 'utf8');
    }
  } catch (err) {
    // Memory fallback
  }
  return filePath;
}

export function loadLineBindings(): LineBindingsStore {
  try {
    const filePath = ensureDataFile();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
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
    const filePath = ensureDataFile();
    fs.writeFileSync(filePath, JSON.stringify(store, null, 2), 'utf8');
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
