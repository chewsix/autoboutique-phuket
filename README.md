# 🚗 Autoboutique Phuket — Luxury Detailing & Wash Studio Web Application

ระบบเว็บแอปพลิเคชันจองคิวนัดหมายล้างรถระดับพรีเมียมและระบบบริหารจัดการแพ็คเกจเหมาจ่าย สำหรับ **Autoboutique Phuket** (ดำเนินงานโดย หจก. ซี-คิวบ์ ออโตโมทีฟ ก่อตั้งปี 2008)

---

## 💎 สรุปจุดเด่นของระบบ (Core Features)

1. **คุมโทนน้ำเงินหรูหราแบบมืออาชีพ (Luxury Royal Sapphire & Midnight Navy Studio):**
   * ดีไซน์ระดับสตูดิโอดูแลรถระดับ Supercar ใช้เฉดสี Deep Sapphire Blue (`#2563EB`, `#1D4ED8`), Electric Cobalt (`#3B82F6`) และ Midnight Obsidian (`#060913`, `#0F172A`)
   * ฟอนต์ทางการ: Google Font **'Prompt'** (รองรับภาษาไทย อังกฤษ และรัสเซีย)
   * เส้นไฮไลต์หัวข้อ Signature Blue Title Bar ถอดแบบมาจากเว็บไซต์ทางการ [autoboutiqueth.com](https://autoboutiqueth.com)
2. **ราคามาตรฐาน Flat-rate ฿500 (ไม่มีขนาดรถ):**
   * ราคาเดียวเท่ากันทุกรุ่น ทุกประเภทรถ
   * ออปชันเสริม: ล้างห้องเครื่องสลายคราบน้ำมัน (+฿500), เคลือบสีสูตร Hydrophobic (+฿400), ขัดเคลือบกระจกกันฝน (+฿300)
3. **ระบบสแกน QR Code พร้อมเพย์ และแนบสลิปจริง:**
   * ล็อกปุ่มยืนยันคิวไว้จนกว่าลูกค้าจะอัปโหลดสลิปโอนเงิน (ป้องกันการกดจองค้างโดยไม่จ่ายเงิน)
4. **แพ็คเกจเหมาจ่าย & กฎการยกเลิกคืนสิทธิ์ 15 นาที:**
   * **Super Wash Pass 12 ครั้ง:** ฿5,000 (ประหยัด ฿1,000)
   * **Mini Wash Pass 6 ครั้ง:** ฿2,700 (ประหยัด ฿300)
   * **VIP Wash & Wax 8 ครั้ง:** ฿5,900 (ประหยัด ฿1,300)
   * กฎ 15 นาที: ลูกค้ายกเลิกภายใน 15 นาทีหลังจากจอง คืนสิทธิ์เข้าแพ็คเกจ 1 ครั้งเต็มทันที / หากเกิน 15 นาที ถือเป็นการสละสิทธิ์
5. **ระบบแจ้งเตือนลูกค้าผ่าน LINE Messaging API:**
   * ส่ง Flex Message แจ้งยืนยันการจอง ยอดเงิน ทะเบียนรถ และอัปเดตสเต็ปงานล้าง 5 ขั้นตอน
6. **Executive Daily Dashboard (หลังบ้านแอดมิน):**
   * รหัส PIN ปลอดภัย: `1234` หรือ `8888`
   * สรุปรายรับรวมวันนี้ (฿), จำนวนคิววันนี้, จำนวนการใช้สิทธิ์แพ็คเกจ, สถานะคิว (Pending, In Progress, Ready)
   * จัดการแพ็คเกจลูกค้า (เพิ่ม/ลดโควตา, ยกเลิก, ออกแพ็คเกจใหม่)
   * รับรถ Walk-in ด่วน ฿500 และฟังก์ชันล็อกช่องเวลาปิดปรับปรุง

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Framework:** Next.js 16 (App Router + Turbopack)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Google Font Prompt
* **Icons:** Lucide React
* **Testing:** Node.js Native Test Runner (`tsx --test`) 34 Test Cases ผ่าน 100%

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รัน Automated Test Suite (34 Test Cases)
npm test

# 3. รัน Development Server
npm run dev
# เปิดเบราว์เซอร์ที่ http://localhost:3000

# 4. ทดสอบ Production Build
npm run build
```

---

## 📦 การนำขึ้น Git และ GitHub (Git Instructions)

หากยังไม่ได้ติดตั้ง Git ในเครื่อง สามารถติดตั้งผ่าน Windows Package Manager ได้ทันที:
```powershell
winget install --id Git.Git -e --source winget
```

จากนั้นเริ่มต้น Git repository และ push ขึ้น GitHub:
```bash
git init
git add .
git commit -m "feat: Autoboutique Phuket luxury blue detailing web application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/autoboutique-phuket.git
git push -u origin main
```
