// tests/suite16_size_matrix_crm_reports.test.ts
// Unit Tests for Dynamic Car Size Matrix, Customer CRM Directory, and Multi-Scale Reports

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CarSize,
  CAR_SIZE_PRICING,
  calculatePrice,
  normalizeWorkStatus,
  getStatusLabel,
  extractCustomerProfiles,
  generateDailyReportSummary,
  generateMonthlyReportSummary,
  generateYearlyReportSummary,
  formatBookingsToCsv,
  formatBookingsToTsv,
  BookingRecord,
} from '../src/utils/bookingLogic';

describe('Suite 16: Dynamic Car Size Matrix, Customer CRM & Studio Reporting Engine', () => {
  test('TC-55: Dynamic Car Size Pricing Matrix (S, M, L, XL, XXL, สเปเชียล)', () => {
    // Official Size Pricing
    assert.equal(CAR_SIZE_PRICING['S'].price, 250, 'Size S base price must be ฿250');
    assert.equal(CAR_SIZE_PRICING['M'].price, 300, 'Size M base price must be ฿300');
    assert.equal(CAR_SIZE_PRICING['L'].price, 350, 'Size L base price must be ฿350');
    assert.equal(CAR_SIZE_PRICING['XL'].price, 450, 'Size XL base price must be ฿450');
    assert.equal(CAR_SIZE_PRICING['XXL'].price, 550, 'Size XXL base price must be ฿550');
    assert.equal(CAR_SIZE_PRICING['สเปเชียล'].price, 700, 'Size สเปเชียล base price must be ฿700');

    // Dynamic Calculation via calculatePrice
    const calcS = calculatePrice('wash', 'S', false);
    assert.equal(calcS.price, 250);
    assert.ok(calcS.noteTh && calcS.noteTh.includes('ขนาด S'));

    const calcXXL = calculatePrice('wash', 'XXL', false);
    assert.equal(calcXXL.price, 550);
    assert.ok(calcXXL.noteTh && calcXXL.noteTh.includes('ขนาด XXL'));

    const calcSpecial = calculatePrice('wash', 'สเปเชียล', false);
    assert.equal(calcSpecial.price, 700);
    assert.ok(calcSpecial.noteTh && calcSpecial.noteTh.includes('ขนาด สเปเชียล'));

    // Test mode override (฿1 flat rate)
    const testModeCalc = calculatePrice('wash', 'สเปเชียล', true);
    assert.equal(testModeCalc.price, 1, 'In test mode, price must be ฿1 flat rate');
  });

  test('TC-56: Simplified 2-Stage Work Status Normalization (กำลังดำเนินการ / รถเสร็จแล้ว)', () => {
    assert.equal(normalizeWorkStatus('in_progress'), 'in_progress');
    assert.equal(normalizeWorkStatus('step1'), 'in_progress');
    assert.equal(normalizeWorkStatus('step2'), 'in_progress');
    assert.equal(normalizeWorkStatus('step3'), 'in_progress');
    assert.equal(normalizeWorkStatus('step4'), 'in_progress');
    assert.equal(normalizeWorkStatus('ready'), 'completed');
    assert.equal(normalizeWorkStatus('completed'), 'completed');
    assert.equal(normalizeWorkStatus('cancelled'), 'cancelled');
    assert.equal(normalizeWorkStatus('pending'), 'pending');

    assert.equal(getStatusLabel('in_progress', true), 'กำลังดำเนินการ');
    assert.equal(getStatusLabel('step2', true), 'กำลังดำเนินการ');
    assert.equal(getStatusLabel('completed', true), 'รถเสร็จแล้ว');
    assert.equal(getStatusLabel('ready', true), 'รถเสร็จแล้ว');
  });

  test('TC-57: Customer CRM Directory Extraction & Lifetime Aggregation', () => {
    const mockBookings: BookingRecord[] = [
      {
        id: 'BK-101',
        timeSlot: '09:00',
        customerName: 'คุณกรกนก',
        phone: '091-036-2546',
        carModel: 'Porsche 911 GT3',
        carColor: 'เหลือง',
        licensePlate: '111 ภูเก็ต',
        carInfo: 'Porsche 911 (111 ภูเก็ต)',
        size: 'สเปเชียล',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-20',
        status: 'completed',
        paidAmount: 700,
        paymentMethod: 'promptpay',
        lineUserId: 'U1234567890',
      },
      {
        id: 'BK-102',
        timeSlot: '14:00',
        customerName: 'คุณกรกนก',
        phone: '091-036-2546',
        carModel: 'Porsche 911 GT3',
        carColor: 'เหลือง',
        licensePlate: '111 ภูเก็ต',
        carInfo: 'Porsche 911 (111 ภูเก็ต)',
        size: 'สเปเชียล',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-26',
        status: 'in_progress',
        paidAmount: 700,
        paymentMethod: 'promptpay',
        lineUserId: 'U1234567890',
      },
      {
        id: 'BK-103',
        timeSlot: '10:00',
        customerName: 'คุณสมศักดิ์',
        phone: '081-999-8888',
        carModel: 'Toyota Yaris',
        carColor: 'ขาว',
        licensePlate: 'กข 5555',
        carInfo: 'Toyota Yaris (กข 5555)',
        size: 'S',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'completed',
        paidAmount: 250,
        paymentMethod: 'promptpay',
      },
      {
        id: 'BK-104',
        timeSlot: '11:00',
        customerName: 'คุณยกเลิก',
        phone: '089-000-0000',
        carInfo: 'Car Cancelled',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'cancelled',
        paidAmount: 0,
        paymentMethod: 'promptpay',
      },
    ];

    const crmProfiles = extractCustomerProfiles(mockBookings);
    assert.equal(crmProfiles.length, 2, 'Should exclude cancelled booking and merge repeat customer');

    const kornkanok = crmProfiles.find((p) => p.phone === '091-036-2546');
    assert.ok(kornkanok, 'Customer กรกนก profile should exist');
    assert.equal(kornkanok.visitCount, 2, 'Visit count should be 2');
    assert.equal(kornkanok.totalSpent, 1400, 'Total spent should be 700 + 700 = 1400');
    assert.equal(kornkanok.defaultSize, 'สเปเชียล');
    assert.equal(kornkanok.lastVisitDate, '2026-11-26');
    assert.equal(kornkanok.lineUserId, 'U1234567890');
  });

  test('TC-58: Daily, Monthly & Yearly Studio Report Aggregations', () => {
    const mockBookings: BookingRecord[] = [
      {
        id: 'BK-001',
        timeSlot: '09:00',
        customerName: 'Customer S',
        phone: '081-111-1111',
        carInfo: 'Yaris',
        size: 'S',
        service: 'Wash',
        date: '2026-11-25',
        status: 'completed',
        paidAmount: 250,
        paymentMethod: 'promptpay',
      },
      {
        id: 'BK-002',
        timeSlot: '10:00',
        customerName: 'Customer M',
        phone: '082-222-2222',
        carInfo: 'Civic',
        size: 'M',
        service: 'Wash',
        date: '2026-11-25',
        status: 'in_progress',
        paidAmount: 300,
        paymentMethod: 'cash',
      },
      {
        id: 'BK-003',
        timeSlot: '11:00',
        customerName: 'Customer Special',
        phone: '083-333-3333',
        carInfo: 'Ferrari',
        size: 'สเปเชียล',
        service: 'Wash',
        date: '2026-11-25',
        status: 'completed',
        paidAmount: 700,
        paymentMethod: 'promptpay',
      },
      {
        id: 'BK-004',
        timeSlot: '13:00',
        customerName: 'Customer Pass',
        phone: '084-444-4444',
        carInfo: 'Alphard',
        size: 'XXL',
        service: 'Wash',
        date: '2026-11-25',
        status: 'completed',
        paidAmount: 0,
        paymentMethod: 'package',
      },
      {
        id: 'BK-005',
        timeSlot: '14:00',
        customerName: 'Customer Dec',
        phone: '085-555-5555',
        carInfo: 'CR-V',
        size: 'L',
        service: 'Wash',
        date: '2026-12-01',
        status: 'completed',
        paidAmount: 350,
        paymentMethod: 'promptpay',
      },
    ];

    // 1. Daily Report for 2026-11-25
    const daily = generateDailyReportSummary('2026-11-25', mockBookings);
    assert.equal(daily.totalCars, 4);
    assert.equal(daily.totalRevenue, 1250); // 250 + 300 + 700 + 0
    assert.equal(daily.completedCars, 3);
    assert.equal(daily.inProgressCars, 1);
    assert.equal(daily.sizeBreakdown['S'].count, 1);
    assert.equal(daily.sizeBreakdown['สเปเชียล'].count, 1);
    assert.equal(daily.paymentBreakdown.package.count, 1);

    // 2. Monthly Report for 2026-11
    const monthly = generateMonthlyReportSummary('2026-11', mockBookings);
    assert.equal(monthly.totalCars, 4);
    assert.equal(monthly.totalRevenue, 1250);
    assert.equal(monthly.dailyRows.length, 1);
    assert.equal(monthly.dailyRows[0].carCount, 4);

    // 3. Yearly Report for 2026
    const yearly = generateYearlyReportSummary('2026', mockBookings);
    assert.equal(yearly.totalCars, 5);
    assert.equal(yearly.totalRevenue, 1600); // 1250 + 350
    assert.equal(yearly.monthlyRows.length, 12);
  });

  test('TC-59: Excel CSV & Google Sheets TSV Export Data Integrity', () => {
    const mockBookings: BookingRecord[] = [
      {
        id: 'BK-777',
        timeSlot: '10:00',
        customerName: 'คุณทดสอบ ระบบ',
        phone: '081-234-5678',
        carInfo: 'Toyota Camry (ดำเงา) 9กก 9999 ภูเก็ต',
        carModel: 'Toyota Camry',
        carColor: 'ดำเงา',
        licensePlate: '9กก 9999 ภูเก็ต',
        size: 'L',
        service: 'ล้างรถพรีเมียม',
        date: '2026-11-25',
        status: 'completed',
        paidAmount: 350,
        paymentMethod: 'promptpay',
      },
    ];

    // CSV format check
    const csv = formatBookingsToCsv(mockBookings);
    assert.ok(csv.startsWith('\uFEFF'), 'CSV must start with UTF-8 BOM byte for Excel Thai font support');
    assert.ok(csv.includes('9กก 9999 ภูเก็ต'), 'CSV should contain license plate');
    assert.ok(csv.includes('350'), 'CSV should contain amount');
    assert.ok(csv.includes('รถเสร็จแล้ว'), 'CSV should reflect normalized Thai status');

    // TSV format check (for Google Sheets clipboard pasting)
    const tsv = formatBookingsToTsv(mockBookings);
    assert.ok(tsv.includes('\t'), 'TSV must use tab characters');
    const lines = tsv.split('\n');
    assert.equal(lines.length, 2, 'TSV should have 1 header line and 1 data line');
    assert.ok(lines[1].includes('Toyota Camry'));
    assert.ok(lines[1].includes('รถเสร็จแล้ว'));
  });
});
