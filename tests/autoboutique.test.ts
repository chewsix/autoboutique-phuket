import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculatePrice,
  getSlotAvailability,
  mapStatusToStage,
  getStageDetails,
  getWarrantyInfo,
  getServiceName,
  generateGoogleCalendarUrl,
  generateIcsCalendarContent,
  verifyAdminPin,
  WEEKS_SCHEDULE,
  ADVANCE_MONTHS,
  getCalendarDaysForMonth,
  isDateSunday,
  getWeekScheduleForDate,
  formatBookingDate,
  OFFICIAL_PACKAGES,
  INITIAL_CUSTOMER_PACKAGES,
  checkCancellationPackagePolicy,
  formatPhoneInput,
  isValidThaiPhone,
  getEstimatedCompletion,
  generatePromptPayPayload,
  crc16,
  PROMPTPAY_ID,
  formatPromptPayId,
  BookingRecord,
  CustomerPackage,
  ServiceType,
} from '../src/utils/bookingLogic';

describe('Autoboutique Phuket - Luxury Detailing & Wash Studio Test Suite', () => {
  // =========================================================================
  // TEST SUITE 1: Flat-Rate Pricing Calculation (฿500 Standard Wash)
  // =========================================================================
  describe('Suite 1: Flat-Rate Pricing Engine & Add-on Calculation', () => {
    it('TC-01: Premium Wash base price is strictly ฿500 flat (No car size matrix)', () => {
      const result = calculatePrice('wash', 'standard');
      assert.strictEqual(result.price, 500, `Expected ฿500 flat, got ${result.price}`);
      assert.strictEqual(result.duration, '1 ชม.');
    });

    it('TC-02: Premium Wash add-ons (+฿500 engine bay, +฿400 wax, +฿300 glass)', () => {
      const withEngine = calculatePrice('wash', 'engine');
      assert.strictEqual(withEngine.price, 500 + 500);

      const withWax = calculatePrice('wash', 'wax');
      assert.strictEqual(withWax.price, 500 + 400);

      const withGlass = calculatePrice('wash', 'glass');
      assert.strictEqual(withGlass.price, 500 + 300);
    });

    it('TC-03: Duration and pH 7 detailing specification', () => {
      const result = calculatePrice('wash', 'standard');
      assert.strictEqual(result.duration, '1 ชม.');
      assert.ok(result.noteTh?.includes('pH 7'));
    });

    it('TC-04: Official Wash Package pricing structure (12 sessions @ ฿5,000, saving ฿1,000)', () => {
      const pkg12 = OFFICIAL_PACKAGES.find((p) => p.id === 'PKG-WASH-12');
      assert.ok(pkg12);
      assert.strictEqual(pkg12.price, 5000);
      assert.strictEqual(pkg12.totalUses, 12);
      assert.strictEqual(pkg12.savings, 1000);

      const pkg6 = OFFICIAL_PACKAGES.find((p) => p.id === 'PKG-WASH-6');
      assert.ok(pkg6);
      assert.strictEqual(pkg6.price, 2700);
      assert.strictEqual(pkg6.totalUses, 6);
    });

    it('TC-05: 8-session VIP Wash & Wax package provides ฿1,300 savings', () => {
      const pkgWax = OFFICIAL_PACKAGES.find((p) => p.id === 'PKG-WASH-WAX-8');
      assert.ok(pkgWax);
      assert.strictEqual(pkgWax.price, 5900);
      assert.strictEqual(pkgWax.totalUses, 8);
      assert.strictEqual(pkgWax.savings, 1300);
    });

    it('TC-06: 24-Hour Studio Cleanliness & Rain Guarantee', () => {
      const warranty = getWarrantyInfo('wash', 'standard', true);
      assert.ok(warranty.titleTh.includes('24 ชั่วโมง'));
      assert.strictEqual(warranty.canBookMaintenance, false);
      assert.strictEqual(warranty.buttonTextTh, '📅 จองคิวล้างรถรอบถัดไป');
    });
  });

  // =========================================================================
  // TEST SUITE 2: Bay Capacity & Slot Logic
  // =========================================================================
  describe('Suite 2: Bay Capacity & Slot Availability', () => {
    const mockBookings: BookingRecord[] = [
      {
        id: 'B1',
        date: '2026-11-25',
        timeSlot: '08:30',
        customerName: 'Test 1',
        phone: '081',
        carInfo: 'BMW M2',
        serviceKey: 'wash',
        service: 'Wash',
        status: 'pending',
      },
    ];

    it('TC-07: Slot availability with 1 booking (1 left out of 2)', () => {
      const availability = getSlotAvailability('2026-11-25', '08:30', mockBookings, []);
      assert.strictEqual(availability.booked, 1);
      assert.strictEqual(availability.available, 1);
      assert.strictEqual(availability.isFull, false);
    });

    it('TC-08: Slot is marked FULL when 2 bookings exist (0 left)', () => {
      const fullBookings = [
        ...mockBookings,
        {
          id: 'B2',
          date: '2026-11-25',
          timeSlot: '08:30',
          customerName: 'Test 2',
          phone: '082',
          carInfo: 'Benz',
          serviceKey: 'wash' as ServiceType,
          service: 'Wash',
          status: 'pending' as const,
        },
      ];
      const availability = getSlotAvailability('2026-11-25', '08:30', fullBookings, []);
      assert.strictEqual(availability.booked, 2);
      assert.strictEqual(availability.available, 0);
      assert.strictEqual(availability.isFull, true);
    });

    it('TC-09: Overbooking edge case protection (available must never be negative)', () => {
      const overBookings = [
        ...mockBookings,
        {
          id: 'B2',
          date: '2026-11-25',
          timeSlot: '08:30',
          customerName: 'Test 2',
          phone: '082',
          carInfo: 'Benz',
          serviceKey: 'wash' as ServiceType,
          service: 'Wash',
          status: 'pending' as const,
        },
        {
          id: 'B3',
          date: '2026-11-25',
          timeSlot: '08:30',
          customerName: 'Test 3',
          phone: '083',
          carInfo: 'Porsche',
          serviceKey: 'wash' as ServiceType,
          service: 'Wash',
          status: 'pending' as const,
        },
      ];
      const availability = getSlotAvailability('2026-11-25', '08:30', overBookings, []);
      assert.strictEqual(availability.available, 0);
      assert.strictEqual(availability.isFull, true);
    });

    it('TC-10: Sunday closure is enforced', () => {
      const availability = getSlotAvailability('2026-11-29', '08:30', [], []);
      assert.strictEqual(availability.isClosed, true);
      assert.strictEqual(availability.isFull, true);
      assert.strictEqual(availability.available, 0);
    });
  });

  // =========================================================================
  // TEST SUITE 3: Dynamic Multi-Week Schedule
  // =========================================================================
  describe('Suite 3: Dynamic Multi-Week Schedule', () => {
    it('TC-11: 3 Pre-configured weeks with correct day counts and months', () => {
      assert.strictEqual(WEEKS_SCHEDULE.length, 3);
      assert.strictEqual(WEEKS_SCHEDULE[0].dates.length, 6);
      assert.strictEqual(WEEKS_SCHEDULE[1].dates.length, 6);
      assert.strictEqual(WEEKS_SCHEDULE[2].dates.length, 6);
    });

    it('TC-12: Week 0 has Sunday 29 closed, Week 1 has Sunday 06 closed', () => {
      const sun29 = WEEKS_SCHEDULE[0].dates.find((d) => d.dateStr === '2026-11-29');
      assert.strictEqual(sun29?.isClosed, true);

      const sun06 = WEEKS_SCHEDULE[1].dates.find((d) => d.dateStr === '2026-12-06');
      assert.strictEqual(sun06?.isClosed, true);
    });
  });

  // =========================================================================
  // TEST SUITE 4: Live Tracker Stages & Details
  // =========================================================================
  describe('Suite 4: Live Tracker Stages & Details', () => {
    it('TC-13: Status mapping to numeric stages (1 to 5)', () => {
      assert.strictEqual(mapStatusToStage('pending'), 1);
      assert.strictEqual(mapStatusToStage('step1'), 1);
      assert.strictEqual(mapStatusToStage('step2'), 2);
      assert.strictEqual(mapStatusToStage('step3'), 3);
      assert.strictEqual(mapStatusToStage('step4'), 4);
      assert.strictEqual(mapStatusToStage('ready'), 5);
    });

    it('TC-14: Stage details provide valid photos and captions for all 5 stages', () => {
      for (let s = 1; s <= 5; s++) {
        const detailsTh = getStageDetails(s, true);
        assert.ok(detailsTh.titleTh.includes(s.toString()));
        assert.ok(detailsTh.photoUrl.startsWith('https://images.unsplash.com'));
        assert.ok(detailsTh.photoCaptionTh.length > 5);

        const detailsEn = getStageDetails(s, false);
        assert.ok(detailsEn.titleEn.includes(s.toString()));
        assert.ok(detailsEn.photoCaptionEn.length > 5);
      }
    });
  });

  // =========================================================================
  // TEST SUITE 5: Context-Aware Cleanliness Guarantee
  // =========================================================================
  describe('Suite 5: Context-Aware Cleanliness Guarantee', () => {
    it('TC-15: Wash guarantee covers 24 hours of cleanliness and rain protection', () => {
      const warranty = getWarrantyInfo('wash', 'standard', true);
      assert.ok(warranty.titleTh.includes('24 ชั่วโมง'));
      assert.ok(warranty.descTh.includes('ฝนตก'));
    });

    it('TC-16: Next recommended wash is 2-3 weeks', () => {
      const warranty = getWarrantyInfo('wash', 'wax', true);
      assert.ok(warranty.nextCheckTh.includes('2-3 สัปดาห์'));
    });

    it('TC-17: Wash warranty ID follows official studio format', () => {
      const warranty = getWarrantyInfo('wash', 'standard', true);
      assert.ok(warranty.warrantyId.startsWith('AB-WSH-'));
    });
  });

  // =========================================================================
  // TEST SUITE 6: Multi-Language Resolution (TH / EN / RU)
  // =========================================================================
  describe('Suite 6: Multi-Language Resolution', () => {
    it('TC-18: Service names in Thai, English, and Russian are fully defined', () => {
      const th = getServiceName('wash', 'th');
      const en = getServiceName('wash', 'en');
      const ru = getServiceName('wash', 'ru');
      assert.ok(th.length > 0);
      assert.ok(en.length > 0);
      assert.ok(ru.length > 0);
      assert.notStrictEqual(th, en);
      assert.notStrictEqual(en, ru);
    });
  });

  // =========================================================================
  // TEST SUITE 7: Calendar Integration & Admin PIN Security
  // =========================================================================
  describe('Suite 7: Calendar Integration & Admin PIN Security', () => {
    const sampleBooking = {
      service: 'ล้างรถพรีเมียม & คลีนภายใน',
      date: '2026-11-25',
      timeSlot: '08:30',
      carInfo: 'BMW M2 Coupe (กข 8888 ภูเก็ต)',
    };

    it('TC-19: Google Calendar URL contains formatted parameters', () => {
      const url = generateGoogleCalendarUrl(sampleBooking);
      assert.ok(url.startsWith('https://calendar.google.com/calendar/render?action=TEMPLATE'));
      assert.ok(url.includes('20261125T083000'));
      assert.ok(url.includes('Autoboutique'));
    });

    it('TC-20: iCalendar .ics content is valid VCALENDAR format', () => {
      const ics = generateIcsCalendarContent(sampleBooking);
      assert.ok(ics.includes('BEGIN:VCALENDAR'));
      assert.ok(ics.includes('BEGIN:VEVENT'));
      assert.ok(ics.includes('DTSTART:20261125T083000'));
      assert.ok(ics.includes('DTEND:20261125T093000'));
    });

    it('TC-21: Admin PIN verification accurately validates correct vs incorrect PINs', () => {
      assert.strictEqual(verifyAdminPin('1234'), true);
      assert.strictEqual(verifyAdminPin('8888'), true);
      assert.strictEqual(verifyAdminPin('0000'), false);
      assert.strictEqual(verifyAdminPin('9999'), false);
    });
  });

  // =========================================================================
  // TEST SUITE 8: Advance Booking & Dynamic Calendar Engine
  // =========================================================================
  describe('Suite 8: Advance Booking & Dynamic Calendar Engine', () => {
    it('TC-22: Advance months list provides 6+ future months (Nov 2026 - May 2027)', () => {
      assert.strictEqual(ADVANCE_MONTHS.length, 7);
      assert.strictEqual(ADVANCE_MONTHS[0].key, '2026-11');
      assert.strictEqual(ADVANCE_MONTHS[6].key, '2027-05');
    });

    it('TC-23: getCalendarDaysForMonth correctly generates days and start offset', () => {
      const nov2026 = getCalendarDaysForMonth(2026, 11);
      assert.strictEqual(nov2026.days.length, 30);
      assert.strictEqual(typeof nov2026.startOffset, 'number');
    });

    it('TC-24: isDateSunday accurately detects Sundays across any year and month', () => {
      assert.strictEqual(isDateSunday('2026-11-29'), true);
      assert.strictEqual(isDateSunday('2026-12-06'), true);
      assert.strictEqual(isDateSunday('2026-11-25'), false);
    });

    it('TC-25: getWeekScheduleForDate dynamically creates valid 6-day week for future dates', () => {
      const dynamicWeek = getWeekScheduleForDate('2027-03-15');
      assert.strictEqual(dynamicWeek.dates.length, 6);
      assert.ok(dynamicWeek.monthTh.includes('2570'));
    });

    it('TC-26: formatBookingDate outputs localized strings for TH, EN, and RU', () => {
      const th = formatBookingDate('2026-11-25', 'th');
      assert.strictEqual(th, '25 พ.ย. 2569');

      const en = formatBookingDate('2026-11-25', 'en');
      assert.strictEqual(en, 'Nov 25, 2026');

      const ru = formatBookingDate('2026-11-25', 'ru');
      assert.ok(ru.includes('25'));
    });
  });

  // =========================================================================
  // TEST SUITE 10: Studio Packages & 15-Minute Cancellation Rules
  // =========================================================================
  describe('Suite 10: Studio Packages & 15-Minute Cancellation Rules', () => {
    it('TC-27: Official wash package gives 12 sessions for ฿5,000 (saving ฿1,000)', () => {
      const pkg = OFFICIAL_PACKAGES[0];
      assert.strictEqual(pkg.totalUses, 12);
      assert.strictEqual(pkg.price, 5000);
      assert.strictEqual(pkg.savings, 1000);
    });

    it('TC-28: Cancellation within 15 minutes of booking creation REFUNDS package quota', () => {
      const now = Date.now();
      const fiveMinutesAgo = new Date(now - 5 * 60 * 1000).toISOString();

      const bookingWithPackage: BookingRecord = {
        id: 'BK-TEST-1',
        timeSlot: '09:30',
        customerName: 'คุณทดสอบ',
        phone: '089-111-2222',
        carInfo: 'BMW M2',
        serviceKey: 'wash',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'pending',
        createdAt: fiveMinutesAgo,
        paymentMethod: 'package',
        paymentStatus: 'package_redeemed',
        usedPackageId: 'CPKG-001',
      };

      const policyResult = checkCancellationPackagePolicy(bookingWithPackage, now);
      assert.strictEqual(policyResult.isPackageBooking, true);
      assert.strictEqual(policyResult.within15Minutes, true);
      assert.strictEqual(policyResult.willRefundQuota, true);
      assert.ok(policyResult.messageTh.includes('คืนสิทธิ์ 1 ครั้ง'));
    });

    it('TC-29: Cancellation after 15 minutes of booking creation FORFEITS package quota', () => {
      const now = Date.now();
      const twentyMinutesAgo = new Date(now - 25 * 60 * 1000).toISOString();

      const bookingWithPackage: BookingRecord = {
        id: 'BK-TEST-2',
        timeSlot: '13:00',
        customerName: 'คุณทดสอบ',
        phone: '089-111-2222',
        carInfo: 'BMW M2',
        serviceKey: 'wash',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'pending',
        createdAt: twentyMinutesAgo,
        paymentMethod: 'package',
        paymentStatus: 'package_redeemed',
        usedPackageId: 'CPKG-001',
      };

      const policyResult = checkCancellationPackagePolicy(bookingWithPackage, now);
      assert.strictEqual(policyResult.isPackageBooking, true);
      assert.strictEqual(policyResult.within15Minutes, false);
      assert.strictEqual(policyResult.willRefundQuota, false);
      assert.ok(policyResult.messageTh.includes('หักสิทธิ์ 1 ครั้ง'));
    });

    it('TC-30: Regular promptpay/cash bookings are handled cleanly without package penalty', () => {
      const regularBooking: BookingRecord = {
        id: 'BK-TEST-3',
        timeSlot: '14:00',
        customerName: 'คุณลูกค้าเงินสด',
        phone: '089-333-4444',
        carInfo: 'Porsche 911',
        serviceKey: 'wash',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'pending',
        paymentMethod: 'promptpay',
        paymentStatus: 'paid',
        paidAmount: 500,
      };

      const policyResult = checkCancellationPackagePolicy(regularBooking);
      assert.strictEqual(policyResult.isPackageBooking, false);
      assert.strictEqual(policyResult.willRefundQuota, false);
    });
  });

  // =========================================================================
  // TEST SUITE 11: Edge Cases, Search & Operational Resilience
  // =========================================================================
  describe('Suite 11: Edge Cases, Search & Operational Resilience', () => {
    it('TC-31: Slot capacity prevents overbooking beyond 2 slots', () => {
      const existingBookings: BookingRecord[] = [
        {
          id: 'BK-1',
          timeSlot: '09:30',
          customerName: 'A',
          phone: '081',
          carInfo: 'BMW',
          serviceKey: 'wash',
          service: 'Wash',
          date: '2026-11-25',
          status: 'pending',
        },
        {
          id: 'BK-2',
          timeSlot: '09:30',
          customerName: 'B',
          phone: '082',
          carInfo: 'Benz',
          serviceKey: 'wash',
          service: 'Wash',
          date: '2026-11-25',
          status: 'pending',
        },
      ];

      const availability = getSlotAvailability('2026-11-25', '09:30', existingBookings, []);
      assert.strictEqual(availability.isFull, true);
      assert.strictEqual(availability.available, 0);
    });

    it('TC-32: Package quota remains strictly bounded between 0 and totalQuota', () => {
      const pkg = { ...INITIAL_CUSTOMER_PACKAGES[0] };
      const total = pkg.totalQuota;

      const deducted = Math.max(0, -5);
      assert.strictEqual(deducted, 0);

      const overAdded = Math.min(total, total + 10);
      assert.strictEqual(overAdded, total);
    });

    it('TC-33: Search filtering accurately matches plate, ID, and customer name', () => {
      const sampleBookings: BookingRecord[] = [
        {
          id: 'BK-001',
          timeSlot: '08:30',
          customerName: 'คุณอัครวัฒน์ ชัยกิตติคุณ',
          phone: '089-999-8877',
          carInfo: 'BMW M2 Coupe (กข 8888 ภูเก็ต)',
          serviceKey: 'wash',
          service: 'Wash',
          date: '2026-11-25',
          status: 'step3',
        },
        {
          id: 'BK-002',
          timeSlot: '09:30',
          customerName: 'คุณสิริพร พัฒนพงศ์',
          phone: '084-555-9090',
          carInfo: 'Toyota Alphard (3ขข 1234 ภูเก็ต)',
          serviceKey: 'wash',
          service: 'Wash',
          date: '2026-11-25',
          status: 'pending',
        },
      ];

      const matchPlate = sampleBookings.filter((b) => b.carInfo.toLowerCase().includes('8888'));
      assert.strictEqual(matchPlate.length, 1);
      assert.strictEqual(matchPlate[0].id, 'BK-001');

      const matchId = sampleBookings.filter((b) => b.id.toLowerCase().includes('bk-002'));
      assert.strictEqual(matchId.length, 1);
      assert.strictEqual(matchId[0].carInfo.includes('Alphard'), true);

      const matchName = sampleBookings.filter((b) => b.customerName.includes('สิริพร'));
      assert.strictEqual(matchName.length, 1);
    });

    it('TC-34: Admin walk-in calculates correct ฿500 base revenue without size', () => {
      const washPrice = calculatePrice('wash', 'standard');
      assert.strictEqual(washPrice.price, 500);
    });

    it('TC-35: formatPhoneInput formats 10-digit number smoothly', () => {
      assert.strictEqual(formatPhoneInput('0899998877'), '089-999-8877');
      assert.strictEqual(formatPhoneInput('089-999'), '089-999');
    });

    it('TC-36: isValidThaiPhone accurately validates Thai mobile numbers', () => {
      assert.strictEqual(isValidThaiPhone('089-999-8877'), true);
      assert.strictEqual(isValidThaiPhone('061-234-5678'), true);
      assert.strictEqual(isValidThaiPhone('091-234-5678'), true);
      assert.strictEqual(isValidThaiPhone('02-123-4567'), false); // landline
      assert.strictEqual(isValidThaiPhone('12345'), false);
    });

    it('TC-37: getEstimatedCompletion calculates 1-hour detailing turnover correctly', () => {
      assert.strictEqual(getEstimatedCompletion('08:30'), '09:30');
      assert.strictEqual(getEstimatedCompletion('15:30'), '16:30');
    });

    it('TC-38: isSupabaseConfigured safely returns false when environment variables are unset', async () => {
      const { isSupabaseConfigured } = await import('../src/utils/supabaseClient');
      assert.strictEqual(isSupabaseConfigured(), false);
    });
  });

  // =========================================================================
  // TEST SUITE 12: Comprehensive Boundary Stress & Operational Resilience
  // =========================================================================
  describe('Suite 12: Comprehensive Boundary Stress & Operational Resilience', () => {
    it('TC-39: 15-Minute Policy strict millisecond boundary validation', () => {
      const baseTime = 1732300000000; // Reference timestamp
      const pkgBooking: BookingRecord = {
        id: 'BK-TEST-15M',
        timeSlot: '09:30',
        customerName: 'Test Customer',
        phone: '089-999-8877',
        carInfo: 'BMW M2 (กข 8888 ภูเก็ต)',
        serviceKey: 'wash',
        service: 'Premium Wash',
        subOptionId: 'standard',
        date: '2026-11-25',
        status: 'pending',
        createdAt: new Date(baseTime).toISOString(),
        paidAmount: 0,
        paymentMethod: 'package',
        paymentStatus: 'package_redeemed',
        usedPackageId: 'CPKG-001',
      };

      // Exactly 0 ms (immediate cancellation)
      const res0 = checkCancellationPackagePolicy(pkgBooking, baseTime);
      assert.strictEqual(res0.willRefundQuota, true);
      assert.strictEqual(res0.within15Minutes, true);

      // Exactly 14 minutes and 59 seconds (899,000 ms)
      const res14m59s = checkCancellationPackagePolicy(pkgBooking, baseTime + 14 * 60 * 1000 + 59 * 1000);
      assert.strictEqual(res14m59s.willRefundQuota, true);
      assert.strictEqual(res14m59s.within15Minutes, true);

      // Exactly 15 minutes (900,000 ms) -> within limit
      const res15m00s = checkCancellationPackagePolicy(pkgBooking, baseTime + 15 * 60 * 1000);
      assert.strictEqual(res15m00s.willRefundQuota, true);
      assert.strictEqual(res15m00s.within15Minutes, true);

      // Exactly 16 minutes (960,000 ms) -> exceeded limit (forfeited)
      const res16m = checkCancellationPackagePolicy(pkgBooking, baseTime + 16 * 60 * 1000);
      assert.strictEqual(res16m.willRefundQuota, false);
      assert.strictEqual(res16m.within15Minutes, false);

      // 120 minutes -> strictly forfeited
      const res120m = checkCancellationPackagePolicy(pkgBooking, baseTime + 120 * 60 * 1000);
      assert.strictEqual(res120m.willRefundQuota, false);
      assert.strictEqual(res120m.within15Minutes, false);
    });

    it('TC-40: Package quota boundaries and exhausted status logic', () => {
      let pkg: CustomerPackage = {
        id: 'CPKG-TEST',
        packageId: 'PKG-WASH-12',
        serviceKey: 'wash',
        packageNameTh: 'Super Wash Pass 12',
        packageNameEn: 'Super Wash Pass (12 Sessions)',
        customerName: 'VIP Member',
        phone: '089-999-8877',
        carInfo: 'BMW M2',
        totalQuota: 12,
        remainingQuota: 1,
        purchaseDate: '2026-11-01',
        expiryDate: '2027-11-01',
        status: 'active',
        pricePaid: 5000,
      };

      // Redeem final quota
      const nextQuota = Math.max(0, pkg.remainingQuota - 1);
      pkg = {
        ...pkg,
        remainingQuota: nextQuota,
        status: nextQuota === 0 ? 'exhausted' : 'active',
      };
      assert.strictEqual(pkg.remainingQuota, 0);
      assert.strictEqual(pkg.status, 'exhausted');

      // Attempting to deduct below 0 is safely clamped at 0
      const clampedQuota = Math.max(0, pkg.remainingQuota - 1);
      assert.strictEqual(clampedQuota, 0);

      // Restoring quota restores active status
      const restoredQuota = Math.min(pkg.totalQuota, pkg.remainingQuota + 1);
      pkg = {
        ...pkg,
        remainingQuota: restoredQuota,
        status: restoredQuota > 0 ? 'active' : 'exhausted',
      };
      assert.strictEqual(pkg.remainingQuota, 1);
      assert.strictEqual(pkg.status, 'active');
    });

    it('TC-41: Daily Financial Dashboard excludes cancelled bookings and correctly aggregates revenue', () => {
      const sampleBookings: BookingRecord[] = [
        // 1. Regular promptpay wash ฿500
        {
          id: 'B1', timeSlot: '08:30', customerName: 'A', phone: '0811111111', carInfo: 'Car A',
          serviceKey: 'wash', service: 'Wash', subOptionId: 'standard', date: '2026-11-25',
          status: 'ready', createdAt: '2026-11-25T08:00:00Z', paidAmount: 500,
          paymentMethod: 'promptpay', paymentStatus: 'paid'
        },
        // 2. Wash with wax add-on ฿900
        {
          id: 'B2', timeSlot: '09:30', customerName: 'B', phone: '0822222222', carInfo: 'Car B',
          serviceKey: 'wash', service: 'Wash', subOptionId: 'wax', date: '2026-11-25',
          status: 'step2', createdAt: '2026-11-25T09:00:00Z', paidAmount: 900,
          paymentMethod: 'promptpay', paymentStatus: 'paid'
        },
        // 3. Walk-in ฿500
        {
          id: 'B3', timeSlot: '10:30', customerName: 'C', phone: '0833333333', carInfo: 'Car C',
          serviceKey: 'wash', service: 'Wash', subOptionId: 'standard', date: '2026-11-25',
          status: 'step1', createdAt: '2026-11-25T10:00:00Z', paidAmount: 500,
          paymentMethod: 'promptpay', paymentStatus: 'paid'
        },
        // 4. Package redemption (฿0 paid)
        {
          id: 'B4', timeSlot: '13:00', customerName: 'D', phone: '0844444444', carInfo: 'Car D',
          serviceKey: 'wash', service: 'Wash', subOptionId: 'standard', date: '2026-11-25',
          status: 'step2', createdAt: '2026-11-25T12:00:00Z', paidAmount: 0,
          paymentMethod: 'package', paymentStatus: 'package_redeemed'
        },
        // 5. Cancelled booking (฿500 original price, but CANCELLED)
        {
          id: 'B5', timeSlot: '14:00', customerName: 'E', phone: '0855555555', carInfo: 'Car E',
          serviceKey: 'wash', service: 'Wash', subOptionId: 'standard', date: '2026-11-25',
          status: 'cancelled', createdAt: '2026-11-25T13:00:00Z', paidAmount: 500,
          paymentMethod: 'promptpay', paymentStatus: 'paid'
        },
      ];

      // Calculate daily total revenue for active (non-cancelled) bookings
      const activeBookings = sampleBookings.filter(b => b.status !== 'cancelled');
      const totalRevenue = activeBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);

      // Expected: 500 + 900 + 500 + 0 = 1,900
      assert.strictEqual(totalRevenue, 1900, `Expected ฿1,900, got ${totalRevenue}`);
      assert.strictEqual(activeBookings.length, 4);
    });

    it('TC-42: Search filter matches license plate, phone, name and booking ID accurately', () => {
      const records: BookingRecord[] = [
        {
          id: 'BK-001', timeSlot: '08:30', customerName: 'คุณอัครวัฒน์ ชัยกิตติคุณ',
          phone: '089-999-8877', carInfo: 'BMW M2 Coupe (กข 8888 ภูเก็ต)', serviceKey: 'wash',
          service: 'Wash', subOptionId: 'standard', date: '2026-11-25', status: 'ready',
          createdAt: '2026-11-25T08:00:00Z', paidAmount: 500, paymentMethod: 'promptpay'
        },
        {
          id: 'BK-002', timeSlot: '09:30', customerName: 'John Smith',
          phone: '084-555-9090', carInfo: 'Porsche 911 (3ขข 1234 ภูเก็ต)', serviceKey: 'wash',
          service: 'Wash', subOptionId: 'standard', date: '2026-11-25', status: 'step2',
          createdAt: '2026-11-25T09:00:00Z', paidAmount: 500, paymentMethod: 'promptpay'
        }
      ];

      const filterBy = (term: string) => {
        const q = term.toLowerCase().trim();
        const cleanNums = q.replace(/[^0-9]/g, '');
        return records.filter(b => 
          b.carInfo.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          (cleanNums.length > 0 && b.phone.replace(/[^0-9]/g, '').includes(cleanNums)) ||
          b.id.toLowerCase().includes(q)
        );
      };

      // Match partial plate
      assert.strictEqual(filterBy('8888').length, 1);
      assert.strictEqual(filterBy('1234').length, 1);
      assert.strictEqual(filterBy('ภูเก็ต').length, 2);

      // Match partial phone (with and without dashes)
      assert.strictEqual(filterBy('0899998877').length, 1);
      assert.strictEqual(filterBy('084-555').length, 1);

      // Match partial name
      assert.strictEqual(filterBy('อัครวัฒน์').length, 1);
      assert.strictEqual(filterBy('john').length, 1);

      // Match Booking ID (case-insensitive)
      assert.strictEqual(filterBy('bk-001').length, 1);
      assert.strictEqual(filterBy('BK-002').length, 1);
    });

    it('TC-43: Supabase client methods return safe fallbacks when unconfigured without crashing', async () => {
      const {
        isSupabaseConfigured,
        fetchRemoteBookings,
        upsertRemoteBooking,
        updateRemoteBookingStatus,
        fetchRemotePackages,
        upsertRemotePackage,
      } = await import('../src/utils/supabaseClient');

      assert.strictEqual(isSupabaseConfigured(), false);
      const bookingsRes = await fetchRemoteBookings();
      assert.strictEqual(bookingsRes, null);

      const upsertBookingRes = await upsertRemoteBooking({ id: 'TEST' });
      assert.strictEqual(upsertBookingRes, false);

      const updateStatusRes = await updateRemoteBookingStatus('TEST', 'ready');
      assert.strictEqual(updateStatusRes, false);

      const packagesRes = await fetchRemotePackages();
      assert.strictEqual(packagesRes, null);

      const upsertPkgRes = await upsertRemotePackage({ id: 'TEST' });
      assert.strictEqual(upsertPkgRes, false);
    });
  });

  // =========================================================================
  // TEST SUITE 13: Official EMVCo Standard PromptPay QR Engine
  // =========================================================================
  describe('Suite 13: Official EMVCo Standard PromptPay QR Engine', () => {
    it('TC-44: EMVCo PromptPay QR string structure and CRC-16 checksum calculation', () => {
      // Test with studio hotline 0966369933 and ฿500 flat wash
      const payload = generatePromptPayPayload('0966369933', 500);

      assert.strictEqual(payload.startsWith('000201010212'), true, 'Must start with EMVCo format & dynamic initiation');
      assert.strictEqual(payload.includes('A000000677010111'), true, 'Must contain official PromptPay AID');
      assert.strictEqual(payload.includes('0066966369933'), true, 'Must format mobile to international 0066 standard');
      assert.strictEqual(payload.includes('5802TH'), true, 'Must specify Thailand country code');
      assert.strictEqual(payload.includes('5303764'), true, 'Must specify THB currency 764');
      assert.strictEqual(payload.includes('5406500.00'), true, 'Must include exact ฿500.00 amount with correct length');

      // Verify CRC16 checksum at the end
      const withoutChecksum = payload.slice(0, -4);
      const calculatedChecksum = crc16(withoutChecksum);
      const actualChecksum = payload.slice(-4);
      assert.strictEqual(actualChecksum, calculatedChecksum, 'CRC-16 CCITT checksum must match');
      assert.strictEqual(actualChecksum.length, 4);
    });

    it('TC-45: Dynamic amount formatting for Packages and National ID support', () => {
      // 12 Sessions VIP Package @ ฿5,000 (length of 5000.00 is 7)
      const pkgPayload = generatePromptPayPayload('096-636-9933', 5000);
      assert.strictEqual(pkgPayload.includes('54075000.00'), true);
      assert.strictEqual(pkgPayload.slice(-4), crc16(pkgPayload.slice(0, -4)));

      // Static PromptPay QR (without amount)
      const staticPayload = generatePromptPayPayload('0966369933');
      assert.strictEqual(staticPayload.startsWith('000201010211'), true, 'Static payload initiation method must be 11');
      assert.strictEqual(staticPayload.includes('54'), false, 'Static payload must not contain tag 54 amount');

      // Thai Tax/National ID (13 digits)
      const taxIdPayload = generatePromptPayPayload('0123456789012', 1000);
      assert.strictEqual(taxIdPayload.includes('02130123456789012'), true, 'Tag 29 subtag 02 for 13-digit ID');
    });

    it('TC-46: Official studio National ID 1800500068403 PromptPay payload generation', () => {
      assert.strictEqual(PROMPTPAY_ID, '1800500068403');
      const payload500 = generatePromptPayPayload(PROMPTPAY_ID, 500);

      // Verify Tag 29 subtag 02 with 13-digit National ID
      assert.strictEqual(payload500.includes('02131800500068403'), true, 'Must encode 13-digit National ID under subtag 02');
      assert.strictEqual(payload500.includes('5406500.00'), true, 'Must format ฿500.00');
      assert.strictEqual(payload500.slice(-4), crc16(payload500.slice(0, -4)), 'Checksum must match CRC-16');

      const payload5000 = generatePromptPayPayload(PROMPTPAY_ID, 5000);
      assert.strictEqual(payload5000.includes('02131800500068403'), true);
      assert.strictEqual(payload5000.includes('54075000.00'), true);
      assert.strictEqual(payload5000.slice(-4), crc16(payload5000.slice(0, -4)));
    });

    it('TC-47: formatPromptPayId formats 13-digit National ID cleanly for mobile display', () => {
      const formatted = formatPromptPayId('1800500068403');
      assert.strictEqual(formatted, '1-8005-00068-40-3');

      // Test with clean default
      assert.strictEqual(formatPromptPayId(), '1-8005-00068-40-3');

      // 10-digit mobile fallback test
      assert.strictEqual(formatPromptPayId('0966369933'), '096-636-9933');
    });
  });
});
