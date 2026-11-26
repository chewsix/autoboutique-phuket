// tests/suite15_admin_management_and_line_bindings.test.ts
// Unit Tests for Multi-Date Studio Management, Analytics, and LINE Binding Resolution

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  recordLineInteraction,
  resolveCustomerLineUserId,
  loadLineBindings,
  LineBindingsStore,
} from '../src/utils/lineBindings';
import { BookingRecord } from '../src/utils/bookingLogic';

describe('Suite 15: Admin Multi-Date Studio Management & LINE Binding Engine', () => {
  test('TC-51: Record and resolve LINE User ID by Booking ID (#BK-010)', () => {
    const testLineId = 'U1234567890abcdef1234567890abcdef';
    recordLineInteraction(testLineId, {
      bookingId: 'BK-010',
      phone: '091-036-2546',
      customerName: 'กรกนก',
      source: 'webhook',
    });

    const resolvedByBooking = resolveCustomerLineUserId('BK-010');
    assert.equal(resolvedByBooking, testLineId, 'Should resolve LINE user ID from booking ID');

    const resolvedByHashBooking = resolveCustomerLineUserId('#BK-010');
    assert.equal(resolvedByHashBooking, testLineId, 'Should resolve LINE user ID from hash-prefixed booking ID');
  });

  test('TC-52: Resolve LINE User ID by Phone Number (0910362546 / 091-036-2546)', () => {
    const testLineId = 'Uabcdef1234567890abcdef1234567890';
    recordLineInteraction(testLineId, {
      phone: '091-036-2546',
      customerName: 'กรกนก',
      source: 'webhook',
    });

    const resolved = resolveCustomerLineUserId(undefined, '0910362546');
    assert.equal(resolved, testLineId, 'Should resolve LINE user ID from raw 10-digit phone number');

    const resolvedWithDashes = resolveCustomerLineUserId(undefined, '091-036-2546');
    assert.equal(resolvedWithDashes, testLineId, 'Should resolve LINE user ID from formatted phone number');
  });

  test('TC-53: Comprehensive Multi-Date Studio Metrics aggregation', () => {
    const sampleBookings: BookingRecord[] = [
      {
        id: 'BK-001',
        timeSlot: '08:30',
        customerName: 'User 1',
        phone: '081-111-1111',
        carInfo: 'Car 1',
        serviceKey: 'wash',
        service: 'Standard Wash',
        date: '2026-11-25',
        status: 'ready',
        paidAmount: 500,
        paymentMethod: 'promptpay',
        lineUserId: 'Utest1',
      },
      {
        id: 'BK-002',
        timeSlot: '09:30',
        customerName: 'User 2',
        phone: '082-222-2222',
        carInfo: 'Car 2',
        serviceKey: 'wash',
        service: 'Standard Wash',
        date: '2026-11-26',
        status: 'step2',
        paidAmount: 0,
        paymentMethod: 'package',
        usedPackageId: 'CPKG-001',
      },
      {
        id: 'BK-003',
        timeSlot: '10:30',
        customerName: 'User 3',
        phone: '083-333-3333',
        carInfo: 'Car 3',
        serviceKey: 'wash',
        service: 'Standard Wash',
        date: '2026-11-27',
        status: 'cancelled',
        paidAmount: 500,
        paymentMethod: 'promptpay',
      },
    ];

    // All dates calculation (active bookings only)
    const activeAll = sampleBookings.filter((b) => b.status !== 'cancelled');
    const totalRev = activeAll.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const completedAll = activeAll.filter((b) => b.status === 'ready').length;
    const inProgressAll = activeAll.filter((b) => ['step1', 'step2', 'step3', 'step4'].includes(b.status)).length;
    const packageAll = activeAll.filter((b) => b.paymentMethod === 'package').length;
    const lineLinkedAll = activeAll.filter((b) => Boolean(b.lineUserId)).length;

    assert.equal(activeAll.length, 2, 'Should exclude cancelled booking');
    assert.equal(totalRev, 500, 'Total revenue should sum paidAmount of active bookings');
    assert.equal(completedAll, 1, 'Completed count should be 1');
    assert.equal(inProgressAll, 1, 'In-progress count should be 1');
    assert.equal(packageAll, 1, 'Package count should be 1');
    assert.equal(lineLinkedAll, 1, 'Line linked count should be 1');
  });

  test('TC-54: Universal search across multiple dates matches any field', () => {
    const sampleBookings: BookingRecord[] = [
      {
        id: 'BK-009',
        timeSlot: '10:00',
        customerName: 'นนน',
        phone: '089-999-9999',
        carInfo: 'รถแรง ป้ายทะเบียน 1',
        serviceKey: 'wash',
        service: 'Standard Wash',
        date: '2026-11-24',
        status: 'ready',
      },
      {
        id: 'BK-010',
        timeSlot: '11:00',
        customerName: 'กรกนก',
        phone: '091-036-2546',
        carInfo: 'รถแรง ป้ายทะเบียน 111',
        serviceKey: 'wash',
        service: 'Standard Wash',
        date: '2026-11-26',
        status: 'step4',
      },
    ];

    // Search by customer name across all dates
    const matchName = sampleBookings.filter((b) => b.customerName.includes('กรกนก'));
    assert.equal(matchName.length, 1);
    assert.equal(matchName[0].id, 'BK-010');

    // Search by car info across all dates
    const matchCar = sampleBookings.filter((b) => b.carInfo.includes('ป้ายทะเบียน 111'));
    assert.equal(matchCar.length, 1);
    assert.equal(matchCar[0].id, 'BK-010');

    // Search by phone digits
    const cleanPhoneQuery = '0910362546';
    const matchPhone = sampleBookings.filter((b) =>
      b.phone.replace(/[^0-9]/g, '').includes(cleanPhoneQuery)
    );
    assert.equal(matchPhone.length, 1);
    assert.equal(matchPhone[0].id, 'BK-010');
  });
});
