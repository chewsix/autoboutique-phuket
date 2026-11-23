import { NextRequest, NextResponse } from 'next/server';

// Internal secret to protect against external bot abuse
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

// Simple sliding window in-memory rate limiter (max 10 requests / 60 seconds per IP)
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

interface LineNotifyRequest {
  type?: 'booking_confirmed' | 'stage_update';
  bookingId: string;
  customerName: string;
  phone: string;
  carInfo: string;
  service: string;
  timeSlot: string;
  date: string;
  paidAmount?: number;
  paymentMethod?: string;
  stageName?: string;
  stageNumber?: number;
  stagePhotoUrl?: string;
  lineUserId?: string;
}

export async function POST(req: NextRequest) {
  // 1. Origin & Secret Verification
  const authHeader = req.headers.get('x-internal-secret');
  const secFetchSite = req.headers.get('sec-fetch-site');
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  const isSameOrigin = secFetchSite === 'same-origin' || (Boolean(origin && host && origin.includes(host)));
  const hasValidSecret = Boolean(INTERNAL_API_SECRET && authHeader === INTERNAL_API_SECRET);

  if (INTERNAL_API_SECRET && !hasValidSecret && !isSameOrigin) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Access forbidden' }, { status: 401 });
  }

  // 2. IP Rate Limiting Guard
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'default-client';
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait before requesting another notification.' },
      { status: 429 }
    );
  }

  try {
    const body: LineNotifyRequest = await req.json();
    const {
      type = 'booking_confirmed',
      bookingId,
      customerName,
      phone,
      carInfo,
      service,
      timeSlot,
      date,
      paidAmount = 0,
      paymentMethod = 'promptpay',
      stageName = 'รับรถ & ตรวจสภาพก่อนล้าง',
      stageNumber = 1,
      stagePhotoUrl,
      lineUserId,
    } = body;

    // 3. Strict Payload Sanitization & Validation
    if (!bookingId || typeof bookingId !== 'string' || bookingId.length > 64) {
      return NextResponse.json({ success: false, error: 'Invalid booking ID parameter' }, { status: 400 });
    }
    if (!customerName || typeof customerName !== 'string' || customerName.length > 100) {
      return NextResponse.json({ success: false, error: 'Invalid customer name parameter' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.length > 30) {
      return NextResponse.json({ success: false, error: 'Invalid phone number parameter' }, { status: 400 });
    }

    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const targetUserId =
      lineUserId ||
      process.env.LINE_DEFAULT_USER_ID ||
      process.env.LINE_ADMIN_USER_ID ||
      process.env.LINE_USER_ID;

    const isBookingConfirmed = type === 'booking_confirmed';

    // Build standard LINE Flex Message Payload (Bubble format)
    const flexMessage = {
      type: 'flex',
      altText: isBookingConfirmed
        ? `✅ ยืนยันการจองคิวล้างรถสำเร็จ: ${carInfo} (${date} เวลา ${timeSlot} น.)`
        : `🚗 อัปเดตสถานะรถของคุณ: ${carInfo} (${stageName})`,
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#0F172A',
          paddingAll: '16px',
          contents: [
            {
              type: 'text',
              text: 'AUTOBOUTIQUE PHUKET',
              weight: 'bold',
              color: '#38BDF8',
              size: 'xs',
              letterSpacing: '1px',
            },
            {
              type: 'text',
              text: isBookingConfirmed
                ? '✅ ยืนยันการจองคิวล้างรถสำเร็จ!'
                : '🚗 อัปเดตสถานะการล้างรถของคุณ',
              weight: 'bold',
              color: '#FFFFFF',
              size: 'md',
              margin: 'sm',
            },
          ],
        },
        hero: stagePhotoUrl
          ? {
              type: 'image',
              url: stagePhotoUrl,
              size: 'full',
              aspectRatio: '16:9',
              aspectMode: 'cover',
            }
          : undefined,
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: carInfo,
              weight: 'bold',
              size: 'md',
              color: '#0F172A',
            },
            {
              type: 'text',
              text: `บริการ: ${service}`,
              size: 'xs',
              color: '#1D4ED8',
              weight: 'bold',
              margin: 'xs',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'md',
              backgroundColor: '#F8FAFC',
              cornerRadius: '8px',
              paddingAll: '12px',
              borderColor: '#E2E8F0',
              borderWidth: '1px',
              contents: isBookingConfirmed
                ? [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: 'รหัสการจอง:', size: 'xs', color: '#64748B', flex: 4 },
                        { type: 'text', text: bookingId, size: 'xs', color: '#0F172A', weight: 'bold', align: 'end', flex: 5 },
                      ],
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      margin: 'sm',
                      contents: [
                        { type: 'text', text: 'วันนัดหมาย:', size: 'xs', color: '#64748B', flex: 4 },
                        { type: 'text', text: `${date} (${timeSlot} น.)`, size: 'xs', color: '#0284C7', weight: 'bold', align: 'end', flex: 5 },
                      ],
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      margin: 'sm',
                      contents: [
                        { type: 'text', text: 'ลูกค้า:', size: 'xs', color: '#64748B', flex: 4 },
                        { type: 'text', text: customerName, size: 'xs', color: '#0F172A', align: 'end', flex: 5 },
                      ],
                    },
                    {
                      type: 'box',
                      layout: 'horizontal',
                      margin: 'sm',
                      contents: [
                        { type: 'text', text: 'สถานะชำระเงิน:', size: 'xs', color: '#64748B', flex: 4 },
                        {
                          type: 'text',
                          text: paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : `ชำระแล้ว ฿${paidAmount.toLocaleString()}`,
                          size: 'xs',
                          color: '#059669',
                          weight: 'bold',
                          align: 'end',
                          flex: 5,
                        },
                      ],
                    },
                  ]
                : [
                    {
                      type: 'box',
                      layout: 'horizontal',
                      contents: [
                        { type: 'text', text: 'ขั้นตอนปัจจุบัน:', size: 'xs', color: '#64748B', flex: 4 },
                        { type: 'text', text: `ขั้นที่ ${stageNumber}/5`, size: 'xs', color: '#0284C7', weight: 'bold', align: 'end', flex: 3 },
                      ],
                    },
                    {
                      type: 'text',
                      text: stageName,
                      weight: 'bold',
                      size: 'sm',
                      color: '#0F172A',
                      margin: 'xs',
                    },
                    {
                      type: 'text',
                      text: `รหัสการจอง: ${bookingId} • ${date} (${timeSlot} น.)`,
                      size: 'xxs',
                      color: '#94A3B8',
                      margin: 'xs',
                    },
                  ],
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#1D4ED8',
              height: 'sm',
              action: {
                type: 'uri',
                label: '🔍 ตรวจสอบสถานะรถสด (Live Tracker)',
                uri: 'https://autoboutique-phuket.vercel.app/',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'uri',
                label: '📞 ติดต่อสตูดิโอ (096 636 9933)',
                uri: 'tel:0966369933',
              },
            },
          ],
        },
      },
    };

    let apiStatus = channelAccessToken && targetUserId ? 'live_api_sent' : 'simulated_sandbox';
    let apiWarning: string | undefined;

    // If real LINE Messaging API credentials are set, execute real push message
    if (channelAccessToken && targetUserId) {
      const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${channelAccessToken}`,
        },
        body: JSON.stringify({
          to: targetUserId,
          messages: [flexMessage],
        }),
      });

      if (!lineRes.ok) {
        apiWarning = await lineRes.text();
        apiStatus = 'live_api_failed';
        console.warn('LINE API warning (falling back to simulated delivery):', apiWarning);
      }
    }

    return NextResponse.json({
      success: true,
      mode: apiStatus,
      warning: apiWarning,
      targetUserId: targetUserId ? `${targetUserId.slice(0, 4)}...${targetUserId.slice(-4)}` : undefined,
      message: `ส่งข้อความ LINE สำเร็จแล้ว: ${isBookingConfirmed ? 'ยืนยันการจอง' : stageName} (${customerName})`,
      payload: flexMessage,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error sending LINE message:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
