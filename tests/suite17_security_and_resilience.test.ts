// tests/suite17_security_and_resilience.test.ts
// Unit Tests for Security Hardening, Defensive Null-Safety, and Runtime Resilience

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePackageRedemption,
  formatPhoneInput,
  isValidThaiPhone,
  formatPromptPayId,
  generatePromptPayPayload,
  extractCustomerProfiles,
  formatBookingsToCsv,
  formatBookingsToTsv,
  generateGoogleCalendarUrl,
  generateIcsCalendarContent,
  BookingRecord,
} from '../src/utils/bookingLogic';
import {
  loadLineBindings,
  saveLineBindings,
  recordLineInteraction,
  resolveCustomerLineUserId,
} from '../src/utils/lineBindings';
import {
  upsertRemoteBooking,
  upsertRemotePackage,
} from '../src/utils/supabaseClient';

describe('Suite 17: Security Hardening & Runtime Resilience', () => {
  test('TC-60: validatePackageRedemption gracefully rejects missing/empty/undefined phone without throwing', () => {
    // Empty phone string
    const resEmpty = validatePackageRedemption({
      customerName: 'สมศักดิ์',
      phone: '',
      carInfo: 'BMW M2',
      selectedPackage: {
        id: 'P1',
        packageId: 'pkg-1',
        serviceKey: 'wash',
        packageNameTh: 'Pass',
        packageNameEn: 'Pass',
        customerName: 'สมศักดิ์',
        phone: '0812345678',
        carInfo: 'BMW M2',
        totalQuota: 10,
        remainingQuota: 5,
        purchaseDate: '2026-11-20',
        expiryDate: '2027-11-20',
        status: 'active',
        pricePaid: 1000,
      },
    });
    assert.equal(resEmpty.isValid, false);
    assert.ok(resEmpty.errorTh?.includes('เบอร์โทรศัพท์'));

    // Undefined/null phone bypass attempt
    const resUndefined = validatePackageRedemption({
      customerName: 'สมศักดิ์',
      phone: undefined as any,
      carInfo: 'BMW M2',
    });
    assert.equal(resUndefined.isValid, false);
    assert.ok(resUndefined.errorTh?.includes('เบอร์โทรศัพท์'));
  });

  test('TC-61: formatPhoneInput and isValidThaiPhone defensively handle empty/undefined values', () => {
    assert.equal(formatPhoneInput(''), '');
    assert.equal(formatPhoneInput(undefined as any), '');
    assert.equal(isValidThaiPhone(''), false);
    assert.equal(isValidThaiPhone(undefined as any), false);
    assert.equal(isValidThaiPhone('0812345678'), true);
    assert.equal(isValidThaiPhone('091-036-2546'), true);
    assert.equal(isValidThaiPhone('021234567'), false);
  });

  test('TC-62: PromptPay generator defensively handles undefined/partial IDs without crash', () => {
    const payloadDefault = generatePromptPayPayload('1800500068403', 300);
    assert.ok(payloadDefault.startsWith('000201'));
    assert.ok(payloadDefault.includes('5406300.00'));

    const formattedId = formatPromptPayId(undefined as any);
    assert.equal(typeof formattedId, 'string');
  });

  test('TC-63: extractCustomerProfiles gracefully processes bookings with missing carInfo without TypeError', () => {
    const partialBookings: BookingRecord[] = [
      {
        id: 'BK-EMPTY-1',
        timeSlot: '09:00',
        customerName: 'คุณไร้ข้อมูลรถ',
        phone: '089-111-2233',
        carInfo: undefined as any,
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-27',
        status: 'completed',
        paidAmount: 300,
      },
      {
        id: 'BK-EMPTY-2',
        timeSlot: '10:00',
        customerName: 'คุณป้ายเปล่า',
        phone: '089-111-2233',
        carInfo: 'Honda Civic',
        carModel: 'Civic Turbo',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-27',
        status: 'completed',
        paidAmount: 300,
      },
    ];

    const profiles = extractCustomerProfiles(partialBookings);
    assert.equal(profiles.length, 1);
    assert.equal(profiles[0].customerName, 'คุณไร้ข้อมูลรถ');
    assert.equal(profiles[0].visitCount, 2);
    assert.equal(profiles[0].totalSpent, 600);
  });

  test('TC-64: formatBookingsToCsv and formatBookingsToTsv handle missing fields without throwing', () => {
    const partialBookings: BookingRecord[] = [
      {
        id: 'BK-DEF-1',
        timeSlot: '08:30',
        customerName: undefined as any,
        phone: undefined as any,
        carInfo: undefined as any,
        service: 'Standard',
        date: undefined as any,
        status: 'ready',
        paidAmount: 250,
      },
    ];

    const csv = formatBookingsToCsv(partialBookings);
    assert.ok(csv.startsWith('\uFEFFวันที่,เวลา,รหัสการจอง'));
    assert.ok(csv.includes('BK-DEF-1'));

    const tsv = formatBookingsToTsv(partialBookings);
    assert.ok(tsv.includes('BK-DEF-1'));
  });

  test('TC-65: Calendar generators generate valid output with missing date/timeSlot', () => {
    const fallbackBooking = {
      service: 'ล้างรถ',
      date: undefined as any,
      timeSlot: undefined as any,
      carInfo: undefined as any,
    };

    const gcal = generateGoogleCalendarUrl(fallbackBooking);
    assert.ok(gcal.startsWith('https://calendar.google.com'));

    const ics = generateIcsCalendarContent(fallbackBooking);
    assert.ok(ics.includes('BEGIN:VCALENDAR'));
  });

  test('TC-66: LINE Bindings store supports persistent cleanup and removal', () => {
    const testId = 'U9999888877776666';
    recordLineInteraction(testId, {
      bookingId: 'BK-TEST-DEL',
      phone: '099-888-7777',
      source: 'admin',
    });

    assert.equal(resolveCustomerLineUserId('BK-TEST-DEL'), testId);

    const store = loadLineBindings();
    delete store.byBookingId['BK-TEST-DEL'];
    saveLineBindings(store);

    assert.equal(resolveCustomerLineUserId('BK-TEST-DEL'), undefined);
  });

  test('TC-67: Supabase client methods gracefully handle null/empty inputs without crash', async () => {
    const bookingOk = await upsertRemoteBooking(null);
    assert.equal(bookingOk, false);

    const pkgOk = await upsertRemotePackage(null);
    assert.equal(pkgOk, false);
  });
});
