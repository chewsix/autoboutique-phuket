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

  const isSameOrigin = secFetchSite === 'same-origin' || Boolean(origin && host && origin.includes(host));
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

    const channelAccessToken =
      process.env.LINE_CHANNEL_ACCESS_TOKEN ||
      process.env.LINE_ACCESS_TOKEN ||
      process.env.CHANNEL_ACCESS_TOKEN ||
      process.env.LINE_TOKEN ||
      'kLzwpa7qG7rOrBrcJ2oTRGkazCPrMJVD6NwkT7ikSb58fZ1TJt6O0xnQ9n4QOLPP7raHEMm9+NEcUoD8if14XQwsxkFj82cqyLASaBROTF2MQACsMLciWBLwTImvNy+VMqT/zbJjGhIwl+nYgFX1xwdB04t89/1O/w1cDnyilFU=';

    const adminUserId =
      process.env.LINE_ADMIN_USER_ID ||
      process.env.LINE_DEFAULT_USER_ID ||
      process.env.LINE_USER_ID ||
      process.env.LINE_TARGET_USER_ID ||
      'Uf56b174c54c8be354754f7dddc9d08dc';

    // Real customer LINE user ID (must start with 'U' and be at least 20 chars)
    const customerUserId =
      lineUserId && typeof lineUserId === 'string' && lineUserId.trim().startsWith('U') && lineUserId.trim().length >= 20
        ? lineUserId.trim()
        : undefined;

    const lineNotifyToken =
      process.env.LINE_NOTIFY_TOKEN ||
      process.env.LINE_NOTIFY_ACCESS_TOKEN;

    const isBookingConfirmed = type === 'booking_confirmed';
    const carDisplay = carInfo.includes(bookingId) ? carInfo : `${carInfo} (${bookingId})`;

    // Helper: Push message to LINE
    const sendPush = async (to: string, flexMsg: any, fallbackText: string) => {
      try {
        const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${channelAccessToken}`,
          },
          body: JSON.stringify({
            to,
            messages: [flexMsg],
          }),
        });

        if (!lineRes.ok) {
          const errText = await lineRes.text();
          console.warn(`LINE push to ${to.slice(0, 5)}... rejected, using text fallback:`, errText);
          const fallbackRes = await fetch('https://api.line.me/v2/bot/message/push', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${channelAccessToken}`,
            },
            body: JSON.stringify({
              to,
              messages: [{ type: 'text', text: fallbackText }],
            }),
          });
          return fallbackRes.ok;
        }
        return true;
      } catch (err) {
        console.warn('LINE push exception:', err);
        return false;
      }
    };

    // Build Customer Flex Message Payload (Bubble format - Clean executive card)
    const customerFlexMessage = {
      type: 'flex',
      altText: isBookingConfirmed
        ? `✅ ยืนยันการจองคิวล้างรถสำเร็จ: ${carDisplay} (${date} เวลา ${timeSlot} น.)`
        : `🚗 อัปเดตสถานะรถของคุณ: ${carDisplay} (${stageName})`,
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
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: carDisplay,
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
                      text: `รหัสจอง: ${bookingId} • ${date} (${timeSlot} น.)`,
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
                label: '🔍 ตรวจสอบสถานะรถสด',
                uri: 'https://autoboutique-phuket.vercel.app/',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'uri',
                label: '📞 ติดต่อสตูดิโอ 066 109 8306',
                uri: 'tel:0661098306',
              },
            },
          ],
        },
      },
    };

    // Build Studio Admin Dispatch Flex Message (Clear distinction for studio owner)
    const adminFlexMessage = {
      type: 'flex',
      altText: `🔔 [ผู้ดูแลสตูดิโอ] มีคิวจองใหม่: #${bookingId} (${carDisplay})`,
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
              text: 'AUTOBOUTIQUE • STUDIO ADMIN ALERT',
              weight: 'bold',
              color: '#F59E0B',
              size: 'xs',
            },
            {
              type: 'text',
              text: '🔔 มีคิวจองใหม่เข้ามา!',
              weight: 'bold',
              color: '#FFFFFF',
              size: 'md',
              margin: 'sm',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: carDisplay,
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
              contents: [
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
                    { type: 'text', text: `${customerName} (${phone})`, size: 'xs', color: '#0F172A', align: 'end', flex: 5 },
                  ],
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'sm',
                  contents: [
                    { type: 'text', text: 'ยอดชำระ:', size: 'xs', color: '#64748B', flex: 4 },
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
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'sm',
                  contents: [
                    { type: 'text', text: 'สถานะ LINE ลูกค้า:', size: 'xs', color: '#64748B', flex: 4 },
                    {
                      type: 'text',
                      text: customerUserId ? '🟢 ส่งเข้า LINE ลูกค้าแล้ว' : '⚪ ยังไม่ผูก LINE (แจ้งเฉพาะร้าน)',
                      size: 'xs',
                      color: customerUserId ? '#059669' : '#D97706',
                      weight: 'bold',
                      align: 'end',
                      flex: 5,
                    },
                  ],
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
              color: '#0F172A',
              height: 'sm',
              action: {
                type: 'uri',
                label: '📋 เปิดระบบบริหารสตูดิโอ',
                uri: 'https://autoboutique-phuket.vercel.app/',
              },
            },
          ],
        },
      },
    };

    // Build Studio Admin Stage Update Flex Message
    const adminStageFlexMessage = {
      type: 'flex',
      altText: `🚗 อัปเดตสถานะรถ: ${carDisplay} (${stageName})`,
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
              text: 'AUTOBOUTIQUE • สตูดิโออัปเดตสถานะงาน',
              weight: 'bold',
              color: '#38BDF8',
              size: 'xs',
            },
            {
              type: 'text',
              text: `🚗 ขั้นตอนที่ ${stageNumber}/5: ${stageName}`,
              weight: 'bold',
              color: '#FFFFFF',
              size: 'md',
              margin: 'sm',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: carDisplay,
              weight: 'bold',
              size: 'md',
              color: '#0F172A',
            },
            {
              type: 'text',
              text: `ลูกค้า: ${customerName} (${phone})`,
              size: 'xs',
              color: '#64748B',
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
              contents: [
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
                    { type: 'text', text: 'ขั้นตอนงาน:', size: 'xs', color: '#64748B', flex: 4 },
                    { type: 'text', text: `ขั้นที่ ${stageNumber}/5`, size: 'xs', color: '#0284C7', weight: 'bold', align: 'end', flex: 5 },
                  ],
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'sm',
                  contents: [
                    { type: 'text', text: 'ชื่อขั้นตอน:', size: 'xs', color: '#64748B', flex: 4 },
                    { type: 'text', text: stageName, size: 'xs', color: '#059669', weight: 'bold', align: 'end', flex: 5 },
                  ],
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'sm',
                  contents: [
                    { type: 'text', text: 'วันนัดหมาย:', size: 'xs', color: '#64748B', flex: 4 },
                    { type: 'text', text: `${date} (${timeSlot} น.)`, size: 'xs', color: '#0F172A', align: 'end', flex: 5 },
                  ],
                },
                {
                  type: 'box',
                  layout: 'horizontal',
                  margin: 'sm',
                  contents: [
                    { type: 'text', text: 'สถานะการส่ง:', size: 'xs', color: '#64748B', flex: 4 },
                    {
                      type: 'text',
                      text: customerUserId ? '🟢 ส่งเข้า LINE ลูกค้าแล้ว' : '📢 แจ้งเตือนสตูดิโอ (ลูกค้ายังไม่ผูก LINE)',
                      size: 'xs',
                      color: customerUserId ? '#059669' : '#D97706',
                      weight: 'bold',
                      align: 'end',
                      flex: 5,
                    },
                  ],
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
                label: '🔍 ตรวจสอบสถานะรถสด',
                uri: 'https://autoboutique-phuket.vercel.app/',
              },
            },
          ],
        },
      },
    };

    let customerSent = false;
    let adminSent = false;

    // Delivery Flow
    if (channelAccessToken) {
      if (isBookingConfirmed) {
        // 1. If customer provided LINE User ID, push directly to customer!
        if (customerUserId) {
          const custText = `✅ [Autoboutique Phuket] ยืนยันการจองคิวสำเร็จ!\n🚗 รถยนต์: ${carInfo}\n👤 ลูกค้า: ${customerName}\n📅 นัดหมาย: ${date} (${timeSlot} น.)\n💰 ยอดชำระ: ${paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : `฿${paidAmount.toLocaleString()}`}\n🔖 รหัสจอง: #${bookingId}`;
          customerSent = await sendPush(customerUserId, customerFlexMessage, custText);
        }

        // 2. Always notify studio admin of incoming bookings
        if (adminUserId) {
          const adminText = `🔔 [แจ้งเตือนสตูดิโอ] มีคิวจองใหม่ #${bookingId}\n🚗 รถยนต์: ${carInfo}\n👤 ลูกค้า: ${customerName} (${phone})\n📅 นัดหมาย: ${date} (${timeSlot} น.)\n💰 ชำระ: ${paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : `฿${paidAmount.toLocaleString()}`}\n📱 LINE ลูกค้า: ${customerUserId ? 'ส่งแจ้งเตือนลูกค้าแล้ว' : 'ยังไม่ผูก LINE'}`;
          adminSent = await sendPush(adminUserId, adminFlexMessage, adminText);
        }
      } else {
        // Stage update:
        // 1. If customer has a LINE User ID, push to customer
        if (customerUserId) {
          const stageText = `🚗 [Autoboutique Phuket] อัปเดตสถานะรถสด!\nทะเบียน/รถ: ${carInfo}\n📍 ขั้นตอนที่ ${stageNumber}/5: ${stageName}\n📅 วันนัดหมาย: ${date} (${timeSlot} น.)\n🔖 รหัสจอง: #${bookingId}`;
          customerSent = await sendPush(customerUserId, customerFlexMessage, stageText);
        }

        // 2. ALWAYS notify studio admin / developer of stage updates so operations & tests are immediately visible
        if (adminUserId) {
          const adminStageText = `🚗 [Autoboutique Phuket] อัปเดตสถานะรถสด!\nทะเบียน/รถ: ${carInfo} (#${bookingId})\n👤 ลูกค้า: ${customerName} (${phone})\n📍 ขั้นตอนที่ ${stageNumber}/5: ${stageName}\n📱 ลูกค้า: ${customerUserId ? 'ส่งแจ้งเตือนลูกค้าแล้ว' : 'ยังไม่ผูก LINE'}\n🌐 เช็กสถานะสด: https://autoboutique-phuket.vercel.app/`;
          adminSent = await sendPush(adminUserId, adminStageFlexMessage, adminStageText);
        }
      }
    }

    // LINE Notify fallback if configured
    if (lineNotifyToken) {
      try {
        const notifyMsg = isBookingConfirmed
          ? `\n✅ ยืนยันการจองคิวสำเร็จ!\nลูกค้า: ${customerName} (${phone})\nรถ: ${carInfo}\nบริการ: ${service}\nวันนัดหมาย: ${date} (${timeSlot} น.)\nยอดชำระ: ${paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : `฿${paidAmount.toLocaleString()}`}\nรหัสจอง: ${bookingId}`
          : `\n🚗 อัปเดตสถานะรถสด!\nรถ: ${carInfo} (#${bookingId})\nลูกค้า: ${customerName} (${phone})\nขั้นตอนที่ ${stageNumber}/5: ${stageName}\nวันนัดหมาย: ${date} (${timeSlot} น.)`;
        await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${lineNotifyToken}`,
          },
          body: new URLSearchParams({ message: notifyMsg }),
        });
      } catch (notifyErr) {
        console.warn('LINE Notify error:', notifyErr);
      }
    }

    return NextResponse.json({
      success: true,
      deliveredToCustomer: customerSent,
      deliveredToAdmin: adminSent,
      customerUserId: customerUserId ? `${customerUserId.slice(0, 4)}...${customerUserId.slice(-4)}` : null,
      adminUserId: adminUserId ? `${adminUserId.slice(0, 4)}...${adminUserId.slice(-4)}` : null,
      message: customerSent
        ? `ส่งแจ้งเตือนถึง LINE ลูกค้าและสตูดิโอเรียบร้อย`
        : adminSent
        ? `ส่งแจ้งเตือนเข้าผู้ดูแลสตูดิโอเรียบร้อย (ลูกค้ายังไม่ได้ผูก LINE)`
        : `บันทึกข้อมูลเรียบร้อย`,
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
