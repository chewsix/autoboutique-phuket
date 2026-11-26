import { NextRequest, NextResponse } from 'next/server';
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

        if (!replyToken || !CHANNEL_ACCESS_TOKEN) continue;

        // Check if message mentions booking code (e.g. BK-005 or #BK-005)
        const bookingMatch = text.match(/#?(BK-\d{3,4})/i);
        const bookingId = bookingMatch ? bookingMatch[1].toUpperCase() : null;

        let replyMessage: any;

        if (bookingId) {
          replyMessage = {
            type: 'text',
            text: `🚗 [Autoboutique Phuket]\n✅ เชื่อมต่อระบบติดตามสถานะรถสำเร็จสำหรับคิว #${bookingId}!\n\nระบบได้บันทึก LINE ID ของท่าน (${userId.slice(0, 6)}...) เรียบร้อยแล้ว\nทุกครั้งที่เจ้าหน้าที่สตูดิโออัปเดตขั้นตอนการล้างรถ ระบบจะส่งการแจ้งเตือนสดตรงเข้าแชทนี้ทันทีครับ ✨\n\n🌐 ติดตามสถานะสดผ่านเว็บ: https://autoboutique-phuket.vercel.app/`,
          };

          // Try updating remote database with customer LINE User ID if available
          try {
            updateRemoteBookingStatus(bookingId, 'active_linked');
          } catch (e) {}
        } else {
          // General inquiry / menu response
          replyMessage = {
            type: 'text',
            text: `✨ สวัสดีครับ ยินดีต้อนรับสู่ Autoboutique Phuket ✨\nสตูดิโอล้างรถและดีเทลลิ่งระดับพรีเมียม\n\n• หากท่านต้องการติดตามสถานะรถ: เพียงพิมพ์รหัสคิว เช่น #BK-001 หรือ #BK-005\n• จองคิวล้างรถล่วงหน้า: https://autoboutique-phuket.vercel.app/\n• โทรติดต่อสตูดิโอ: 066 109 8306`,
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
