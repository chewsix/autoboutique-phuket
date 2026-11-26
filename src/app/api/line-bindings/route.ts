// src/app/api/line-bindings/route.ts
// API route to get and update LINE bindings for bookings

import { NextRequest, NextResponse } from 'next/server';
import {
  loadLineBindings,
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
      if (bookingId && store.byBookingId[bookingId.toUpperCase()]) {
        delete store.byBookingId[bookingId.toUpperCase()];
      }
      return NextResponse.json({ success: true, message: 'Binding removed' });
    }

    if (!lineUserId && !getLastActiveLineUserId()) {
      return NextResponse.json(
        { success: false, error: 'No LINE User ID provided and no active LINE user found' },
        { status: 400 }
      );
    }

    const targetUserId = lineUserId || getLastActiveLineUserId() || 'Uf56b174c54c8be354754f7dddc9d08dc';

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
