// src/app/api/line-bindings/route.ts
// API route to get and update LINE bindings for bookings

import { NextRequest, NextResponse } from 'next/server';
import {
  loadLineBindings,
  saveLineBindings,
  recordLineInteraction,
  getLastActiveLineUserId,
} from '@/utils/lineBindings';

export async function GET() {
  const store = loadLineBindings();
  return NextResponse.json({
    success: true,
    bindings: store,
    lastActiveUserId: getLastActiveLineUserId(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, phone, customerName, lineUserId, action } = body;

    if (action === 'clear') {
      // Clear specific binding
      const store = loadLineBindings();
      let removed = false;
      if (bookingId && store.byBookingId[bookingId.toUpperCase()]) {
        delete store.byBookingId[bookingId.toUpperCase()];
        removed = true;
      }
      if (phone) {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (store.byPhone[cleanPhone]) {
          delete store.byPhone[cleanPhone];
          removed = true;
        }
      }
      saveLineBindings(store);
      return NextResponse.json({ success: true, message: removed ? 'Binding removed' : 'No binding found' });
    }

    const defaultAdminId = process.env.LINE_DEFAULT_USER_ID || process.env.LINE_ADMIN_USER_ID || '';
    const targetUserId = lineUserId || getLastActiveLineUserId() || defaultAdminId;

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: 'No LINE User ID provided and no active LINE user found' },
        { status: 400 }
      );
    }

    const recorded = recordLineInteraction(targetUserId, {
      bookingId,
      phone,
      customerName,
      source: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: `เชื่อมโยง LINE ${targetUserId.slice(0, 6)}... สำเร็จ`,
      entry: recorded,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
