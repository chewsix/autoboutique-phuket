import { NextRequest, NextResponse } from 'next/server';
import { recordLineInteraction } from '@/utils/lineBindings';
import { updateRemoteBookingStatus } from '@/utils/supabaseClient';

const CHANNEL_ACCESS_TOKEN =
  process.env.LINE_CHANNEL_ACCESS_TOKEN ||
  process.env.LINE_ACCESS_TOKEN ||
  'kLzwpa7qG7rOrBrcJ2oTRGkazCPrMJVD6NwkT7ikSb58fZ1TJt6O0xnQ9n4QOLPP7raHEMm9+NEcUoD8if14XQwsxkFj82cqyLASaBROTF2MQACsMLciWBLwTImvNy+VMqT/zbJjGhIwl+nYgFX1xwdB04t89/1O/w1cDnyilFU=';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Autoboutique Phuket LINE Official Account Webhook',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];

    for (const event of events) {
      if (event.type === 'message' && event.message?.type === 'text') {
        const text = (event.message.text || '').trim();
        const userId = event.source?.userId;
        const replyToken = event.replyToken;

        if (!replyToken || !CHANNEL_ACCESS_TOKEN || !userId) continue;

        // Parse booking code (e.g. BK-005, #BK-005, #BK-010)
        const bookingMatch = text.match(/#?(BK-\d{3,4})/i);
        const bookingId = bookingMatch ? bookingMatch[1].toUpperCase() : null;

        // Parse phone number (e.g. 091-036-2546 or 0910362546)
        const phoneMatch = text.match(/0[689]\d{1}[-]?\d{3}[-]?\d{4}/);
        const rawPhone = phoneMatch ? phoneMatch[0].replace(/[^0-9]/g, '') : null;

        // Record interaction in the shared bindings store
        recordLineInteraction(userId, {
          bookingId: bookingId || undefined,
          phone: rawPhone || undefined,
          source: 'webhook',
        });

        let replyMessage: any;

        if (bookingId) {
          replyMessage = {
            type: 'text',
            text: `🚗 [Autoboutique Phuket]\n✅ ผูกระบบติดตามสถานะรถสำเร็จสำหรับคิว #${bookingId}!\n\nระบบบันทึก LINE ID ของท่าน (${userId.slice(0, 6)}...) เรียบร้อยแล้ว\nเมื่อเจ้าหน้าที่สตูดิโออัปเดตขั้นตอนการล้างรถ ระบบจะส่งการแจ้งเตือนสดตรงเข้าห้องแชทนี้ทันทีครับ ✨\n\n🌐 ตรวจสอบสถานะรถสด: https://autoboutique-phuket.vercel.app/`,
          };

          // Try updating remote status if configured
          try {
            updateRemoteBookingStatus(bookingId, 'active_linked');
          } catch (e) {}
        } else if (rawPhone) {
          replyMessage = {
            type: 'text',
            text: `🚗 [Autoboutique Phuket]\n✅ เชื่อมต่อเบอร์โทร ${rawPhone.slice(0, 3)}-${rawPhone.slice(3, 6)}-${rawPhone.slice(6)} เข้ากับ LINE สำเร็จ!\n\nระบบจะส่งการแจ้งเตือนทุกคิวงานที่ตรงกับเบอร์นี้เข้าแชทนี้อัตโนมัติครับ ✨\n\n🌐 เว็บไซต์สตูดิโอ: https://autoboutique-phuket.vercel.app/`,
          };
        } else {
          // General welcome / instructions
          replyMessage = {
            type: 'text',
            text: `✨ ยินดีต้อนรับสู่ Autoboutique Phuket ✨\nสตูดิโอล้างรถและดีเทลลิ่งระดับพรีเมียม\n\n📌 วิธีเปิดการแจ้งเตือนสถานะงานล้างรถ:\n• พิมพ์รหัสคิว เช่น #BK-010 หรือ #BK-001\n• หรือพิมพ์เบอร์โทรศัพท์ที่ใช้จองคิว\n\nระบบจะผูกบัญชี LINE นี้เข้ากับคิวงานและแจ้งเตือนสดทุกขั้นตอนทันทีครับ 🚗💨\n\n🌐 จองคิว/เช็กสถานะ: https://autoboutique-phuket.vercel.app/\n📞 โทรสตูดิโอ: 066 109 8306`,
          };
        }

        // Send reply via LINE Messaging API reply endpoint
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken,
            messages: [replyMessage],
          }),
        });
      }
    }

    return NextResponse.json({ success: true, count: events.length });
  } catch (err: any) {
    console.error('LINE Webhook Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
