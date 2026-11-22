// --- Autoboutique Phuket Core Business Logic & Pricing Engine ---
// Streamlined Luxury Car Wash Studio (No Car Size Matrix - Flat ฿500 Standard Wash)

export type Language = 'th' | 'en' | 'ru';

export type ServiceType =
  | 'wash'
  | 'interior'
  | 'ceramic'
  | 'ppf'
  | 'wrap'
  | 'film'
  | 'accessories'
  | 'maintenance';

export type CarSize = 'S' | 'M' | 'L' | 'XL' | 'Supercar';

export interface BookingRecord {
  id: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  carInfo: string;
  serviceKey: ServiceType;
  service: string;
  subOptionId?: string;
  subOption?: string;
  size?: CarSize;
  date: string;
  vipDelivery?: boolean;
  status: 'pending' | 'step1' | 'step2' | 'step3' | 'step4' | 'ready' | 'cancelled';
  isWalkIn?: boolean;
  createdAt?: string; // ISO date string
  paidAmount?: number;
  paymentMethod?: 'promptpay' | 'package' | 'cash';
  paymentStatus?: 'paid' | 'pending' | 'package_redeemed';
  usedPackageId?: string;
  paymentSlipUrl?: string;
  isPackageRefunded?: boolean;
  isPackageForfeited?: boolean;
}

export interface PackageDeal {
  id: string;
  serviceKey: ServiceType;
  nameTh: string;
  nameEn: string;
  nameRu?: string;
  totalUses: number;
  price: number;
  singlePrice: number;
  savings: number;
  validityDays: number;
  descriptionTh: string;
  descriptionEn: string;
  popular?: boolean;
  badgeTh?: string;
}

export interface CustomerPackage {
  id: string;
  packageId: string;
  serviceKey: ServiceType;
  packageNameTh: string;
  packageNameEn: string;
  customerName: string;
  phone: string;
  carInfo: string;
  totalQuota: number;
  remainingQuota: number;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'exhausted' | 'cancelled';
  pricePaid: number;
}

export interface DateOption {
  dateStr: string;
  dayTh: string;
  dayEn: string;
  dayRu?: string;
  dateNum: string;
  isClosed?: boolean;
}

export interface WeekSchedule {
  weekIndex: number;
  monthTh: string;
  monthEn: string;
  monthRu?: string;
  dates: DateOption[];
}

export interface MonthOption {
  year: number;
  month: number; // 1-12
  monthIndex: number; // 0-11
  key: string; // e.g. "2026-11"
  labelTh: string; // "พฤศจิกายน 2569"
  labelEn: string; // "November 2026"
  labelRu: string; // "Ноябрь 2026"
  shortTh: string; // "พ.ย. 69"
  shortEn: string; // "Nov 26"
  shortRu: string; // "Ноя 26"
}

export interface CalendarDay {
  dateStr: string;
  dayNum: number;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  dayNameTh: string;
  dayNameEn: string;
  dayNameRu: string;
  isClosed: boolean;
  isPast: boolean;
  isToday: boolean;
}

export interface SubOption {
  id: string;
  labelTh: string;
  labelEn: string;
  labelRu?: string;
  addPrice: number;
}

// Flat-rate Car Wash Sub-Options (฿500 Base + Optional Studio Add-ons)
export const SERVICE_SUB_OPTIONS: Record<ServiceType, SubOption[]> = {
  wash: [
    { id: 'standard', labelTh: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน', labelEn: 'Standard Wash & Vacuum', labelRu: 'Стандартная мойка и салон', addPrice: 0 },
    { id: 'engine', labelTh: '+ ล้างห้องเครื่องขจัดคราบน้ำมัน (+฿500)', labelEn: '+ Engine Bay Degreasing (+฿500)', labelRu: '+ Мойка подкапотного (+฿500)', addPrice: 500 },
    { id: 'wax', labelTh: '+ เคลือบสีสูตร Hydrophobic Deep Gloss (+฿400)', labelEn: '+ Hydrophobic Deep Gloss Wax (+฿400)', labelRu: '+ Гидрофобный воск (+฿400)', addPrice: 400 },
    { id: 'glass', labelTh: '+ ขัดเคลือบกระจกไล่น้ำฝน (+฿300)', labelEn: '+ Rain Repellent Glass Coat (+฿300)', labelRu: '+ Антидождь стекла (+฿300)', addPrice: 300 },
  ],
  interior: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  ceramic: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  ppf: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  wrap: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  film: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  accessories: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
  maintenance: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน', labelEn: 'Standard Wash', labelRu: 'Стандартная мойка', addPrice: 0 },
  ],
};

// --- Official Studio Car Wash Packages & Vouchers ---
export const OFFICIAL_PACKAGES: PackageDeal[] = [
  {
    id: 'PKG-WASH-12',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถพรีเมียม 12 ครั้ง (Super Wash Pass 12)',
    nameEn: 'Super Wash Pass (12 Sessions)',
    nameRu: 'Пакет премиум мойки 12 раз',
    totalUses: 12,
    price: 5000,
    singlePrice: 500,
    savings: 1000,
    validityDays: 365,
    descriptionTh: 'ล้างรถพรีเมียม 12 ครั้ง เฉลี่ยเพียงครั้งละ ฿416 (ปกติครั้งละ ฿500 ประหยัดทันที ฿1,000)',
    descriptionEn: '12 detailing washes @ ฿416/session (regular ฿500, save ฿1,000)',
    popular: true,
    badgeTh: '🔥 สุดคุ้ม ประหยัด ฿1,000',
  },
  {
    id: 'PKG-WASH-6',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถพรีเมียม 6 ครั้ง (Mini Wash Pass 6)',
    nameEn: 'Mini Wash Pass (6 Sessions)',
    nameRu: 'Пакет мойки 6 раз',
    totalUses: 6,
    price: 2700,
    singlePrice: 500,
    savings: 300,
    validityDays: 180,
    descriptionTh: 'ล้างรถพรีเมียม 6 ครั้ง เฉลี่ยครั้งละ ฿450 (ประหยัด ฿300 จากปกติ ฿3,000)',
    descriptionEn: '6 detailing washes @ ฿450/session (save ฿300)',
    popular: false,
    badgeTh: 'ประหยัด ฿300',
  },
  {
    id: 'PKG-WASH-WAX-8',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถ + เคลือบสีแว็กซ์ 8 ครั้ง (VIP Gloss Pass 8)',
    nameEn: 'VIP Wash & Wax Pass (8 Sessions)',
    nameRu: 'Пакет мойки с воском 8 раз',
    totalUses: 8,
    price: 5900,
    singlePrice: 900,
    savings: 1300,
    validityDays: 365,
    descriptionTh: 'ล้างสีดูดฝุ่น + เคลือบสีเงาฉ่ำ Hydrophobic 8 ครั้ง (ประหยัด ฿1,300)',
    descriptionEn: '8 premium washes with hydrophobic gloss wax sealant',
    popular: true,
    badgeTh: '✨ แนะนำ เคลือบสีฉ่ำลึก',
  },
];

export const INITIAL_CUSTOMER_PACKAGES: CustomerPackage[] = [
  {
    id: 'CPKG-001',
    packageId: 'PKG-WASH-12',
    serviceKey: 'wash',
    packageNameTh: 'แพ็คเกจล้างรถพรีเมียม 12 ครั้ง',
    packageNameEn: 'Super Wash Pass (12 Sessions)',
    customerName: 'คุณอัครวัฒน์ ชัยกิตติคุณ',
    phone: '089-999-8877',
    carInfo: 'BMW M2 Coupe (กข 8888 ภูเก็ต)',
    totalQuota: 12,
    remainingQuota: 11,
    purchaseDate: '2026-11-01',
    expiryDate: '2027-11-01',
    status: 'active',
    pricePaid: 5000,
  },
  {
    id: 'CPKG-002',
    packageId: 'PKG-WASH-6',
    serviceKey: 'wash',
    packageNameTh: 'แพ็คเกจล้างรถพรีเมียม 6 ครั้ง',
    packageNameEn: 'Mini Wash Pass (6 Sessions)',
    customerName: 'คุณวิชัย รัตนการุณ',
    phone: '081-345-6789',
    carInfo: 'Porsche 911 GT3 (7กง 7777 ภูเก็ต)',
    totalQuota: 6,
    remainingQuota: 5,
    purchaseDate: '2026-11-15',
    expiryDate: '2027-05-15',
    status: 'active',
    pricePaid: 2700,
  },
];

// Cancellation policy for package bookings:
// If cancelled within 15 minutes of booking creation: 100% refund quota.
// If cancelled after 15 minutes: quota is forfeited per studio policy.
export function checkCancellationPackagePolicy(
  booking: BookingRecord,
  currentTimeMs: number = Date.now()
): {
  isPackageBooking: boolean;
  within15Minutes: boolean;
  minutesElapsed: number;
  willRefundQuota: boolean;
  messageTh: string;
  messageEn: string;
} {
  if (booking.paymentMethod !== 'package' || !booking.usedPackageId) {
    return {
      isPackageBooking: false,
      within15Minutes: false,
      minutesElapsed: 0,
      willRefundQuota: false,
      messageTh: 'การจองนี้ไม่ได้ใช้สิทธิ์แพ็คเกจ (ไม่มีการหักหรือคืนโควต้า)',
      messageEn: 'This booking did not use a package credit.',
    };
  }

  // Calculate elapsed time since booking creation
  const createdTime = booking.createdAt ? new Date(booking.createdAt).getTime() : currentTimeMs;
  const diffMinutes = Math.max(0, Math.floor((currentTimeMs - createdTime) / (1000 * 60)));
  const within15Minutes = diffMinutes <= 15;

  if (within15Minutes) {
    return {
      isPackageBooking: true,
      within15Minutes: true,
      minutesElapsed: diffMinutes,
      willRefundQuota: true,
      messageTh: `ยกเลิกภายใน 15 นาที (${diffMinutes} นาทีที่ผ่านมา): คืนสิทธิ์ 1 ครั้งเข้าแพ็คเกจให้ลูกค้าทันที`,
      messageEn: `Cancelled within 15 mins (${diffMinutes}m ago): 1 credit will be refunded to customer package.`,
    };
  } else {
    return {
      isPackageBooking: true,
      within15Minutes: false,
      minutesElapsed: diffMinutes,
      willRefundQuota: false,
      messageTh: `ยกเลิกเกิน 15 นาที (${diffMinutes} นาทีที่ผ่านมา): ตามนโยบายสตูดิโอ หักสิทธิ์ 1 ครั้งของแพ็คเกจ (ไม่คืนเครดิต)`,
      messageEn: `Cancelled after 15 mins (${diffMinutes}m ago): 1 package credit is forfeited per studio policy.`,
    };
  }
}

// 3 Dynamic Booking Weeks
export const WEEKS_SCHEDULE: WeekSchedule[] = [
  {
    weekIndex: 0,
    monthTh: 'พฤศจิกายน 2569',
    monthEn: 'November 2026',
    monthRu: 'Ноябрь 2026',
    dates: [
      { dateStr: '2026-11-25', dayTh: 'พ.', dayEn: 'Wed', dayRu: 'Ср', dateNum: '25' },
      { dateStr: '2026-11-26', dayTh: 'พฤ.', dayEn: 'Thu', dayRu: 'Чт', dateNum: '26' },
      { dateStr: '2026-11-27', dayTh: 'ศ.', dayEn: 'Fri', dayRu: 'Пт', dateNum: '27' },
      { dateStr: '2026-11-28', dayTh: 'ส.', dayEn: 'Sat', dayRu: 'Сб', dateNum: '28' },
      { dateStr: '2026-11-29', dayTh: 'อา.', dayEn: 'Sun', dayRu: 'Вс (Закрыто)', dateNum: '29 (ปิด)', isClosed: true },
      { dateStr: '2026-11-30', dayTh: 'จ.', dayEn: 'Mon', dayRu: 'Пн', dateNum: '30' },
    ],
  },
  {
    weekIndex: 1,
    monthTh: 'ธันวาคม 2569',
    monthEn: 'December 2026',
    monthRu: 'Декабрь 2026',
    dates: [
      { dateStr: '2026-12-01', dayTh: 'อ.', dayEn: 'Tue', dayRu: 'Вт', dateNum: '01' },
      { dateStr: '2026-12-02', dayTh: 'พ.', dayEn: 'Wed', dayRu: 'Ср', dateNum: '02' },
      { dateStr: '2026-12-03', dayTh: 'พฤ.', dayEn: 'Thu', dayRu: 'Чт', dateNum: '03' },
      { dateStr: '2026-12-04', dayTh: 'ศ.', dayEn: 'Fri', dayRu: 'Пт', dateNum: '04' },
      { dateStr: '2026-12-05', dayTh: 'ส.', dayEn: 'Sat', dayRu: 'Сб', dateNum: '05' },
      { dateStr: '2026-12-06', dayTh: 'อา.', dayEn: 'Sun', dayRu: 'Вс (Закрыто)', dateNum: '06 (ปิด)', isClosed: true },
    ],
  },
  {
    weekIndex: 2,
    monthTh: 'ธันวาคม 2569',
    monthEn: 'December 2026',
    monthRu: 'Декабрь 2026',
    dates: [
      { dateStr: '2026-12-07', dayTh: 'จ.', dayEn: 'Mon', dayRu: 'Пн', dateNum: '07' },
      { dateStr: '2026-12-08', dayTh: 'อ.', dayEn: 'Tue', dayRu: 'Вт', dateNum: '08' },
      { dateStr: '2026-12-09', dayTh: 'พ.', dayEn: 'Wed', dayRu: 'Ср', dateNum: '09' },
      { dateStr: '2026-12-10', dayTh: 'พฤ.', dayEn: 'Thu', dayRu: 'Чт', dateNum: '10' },
      { dateStr: '2026-12-11', dayTh: 'ศ.', dayEn: 'Fri', dayRu: 'Пт', dateNum: '11' },
      { dateStr: '2026-12-12', dayTh: 'ส.', dayEn: 'Sat', dayRu: 'Сб', dateNum: '12' },
    ],
  },
];

export const ADVANCE_MONTHS: MonthOption[] = [
  {
    year: 2026,
    month: 11,
    monthIndex: 10,
    key: '2026-11',
    labelTh: 'พฤศจิกายน 2569',
    labelEn: 'November 2026',
    labelRu: 'Ноябрь 2026',
    shortTh: 'พ.ย. 69',
    shortEn: 'Nov 26',
    shortRu: 'Ноя 26',
  },
  {
    year: 2026,
    month: 12,
    monthIndex: 11,
    key: '2026-12',
    labelTh: 'ธันวาคม 2569',
    labelEn: 'December 2026',
    labelRu: 'Декабрь 2026',
    shortTh: 'ธ.ค. 69',
    shortEn: 'Dec 26',
    shortRu: 'Дек 26',
  },
  {
    year: 2027,
    month: 1,
    monthIndex: 0,
    key: '2027-01',
    labelTh: 'มกราคม 2570',
    labelEn: 'January 2027',
    labelRu: 'Яนварь 2027',
    shortTh: 'ม.ค. 70',
    shortEn: 'Jan 27',
    shortRu: 'Янв 27',
  },
  {
    year: 2027,
    month: 2,
    monthIndex: 1,
    key: '2027-02',
    labelTh: 'กุมภาพันธ์ 2570',
    labelEn: 'February 2027',
    labelRu: 'Февраль 2027',
    shortTh: 'ก.พ. 70',
    shortEn: 'Feb 27',
    shortRu: 'Фев 27',
  },
  {
    year: 2027,
    month: 3,
    monthIndex: 2,
    key: '2027-03',
    labelTh: 'มีนาคม 2570',
    labelEn: 'March 2027',
    labelRu: 'Март 2027',
    shortTh: 'มี.ค. 70',
    shortEn: 'Mar 27',
    shortRu: 'Мар 27',
  },
  {
    year: 2027,
    month: 4,
    monthIndex: 3,
    key: '2027-04',
    labelTh: 'เมษายน 2570',
    labelEn: 'April 2027',
    labelRu: 'Апрель 2027',
    shortTh: 'เม.ย. 70',
    shortEn: 'Apr 27',
    shortRu: 'Апр 27',
  },
  {
    year: 2027,
    month: 5,
    monthIndex: 4,
    key: '2027-05',
    labelTh: 'พฤษภาคม 2570',
    labelEn: 'May 2027',
    labelRu: 'Май 2027',
    shortTh: 'พ.ค. 70',
    shortEn: 'May 27',
    shortRu: 'Май 27',
  },
];

export function isDateSunday(dateStr: string): boolean {
  if (dateStr === '2026-11-29' || dateStr === '2026-12-06') return true;
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      const dt = new Date(y, m - 1, d);
      return dt.getDay() === 0;
    }
  }
  return false;
}

export function getCalendarDaysForMonth(
  year: number,
  month: number
): {
  days: CalendarDay[];
  startOffset: number; // 0 = Mon, 1 = Tue, ..., 6 = Sun
} {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];
  const dayNamesTh = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  // Start offset with Monday as column 0
  const firstDt = new Date(year, month - 1, 1);
  const firstDow = firstDt.getDay(); // 0 is Sun
  const startOffset = (firstDow + 6) % 7; // Mon=0, Tue=1, ..., Sun=6

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(year, month - 1, d);
    const dayOfWeek = dt.getDay();
    const mm = String(month).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateStr = `${year}-${mm}-${dd}`;
    const isClosed = dayOfWeek === 0;
    const isPast = dateStr < '2026-11-25';
    const isToday = dateStr === '2026-11-25';

    days.push({
      dateStr,
      dayNum: d,
      dayOfWeek,
      dayNameTh: dayNamesTh[dayOfWeek],
      dayNameEn: dayNamesEn[dayOfWeek],
      dayNameRu: dayNamesRu[dayOfWeek],
      isClosed,
      isPast,
      isToday,
    });
  }

  return { days, startOffset };
}

export function getWeekScheduleForDate(dateStr: string): WeekSchedule {
  for (const week of WEEKS_SCHEDULE) {
    if (week.dates.some((d) => d.dateStr === dateStr)) {
      return week;
    }
  }

  const parts = dateStr.split('-');
  const y = parseInt(parts[0], 10) || 2026;
  const m = parseInt(parts[1], 10) || 11;
  const d = parseInt(parts[2], 10) || 25;
  const targetDate = new Date(y, m - 1, d);
  const dayOfWeek = targetDate.getDay();

  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayDate = new Date(targetDate);
  mondayDate.setDate(targetDate.getDate() + diffToMonday);

  const dates: DateOption[] = [];
  const dayThMap = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  const dayEnMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayRuMap = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  for (let i = 0; i < 6; i++) {
    const cur = new Date(mondayDate);
    cur.setDate(mondayDate.getDate() + i);
    const cy = cur.getFullYear();
    const cm = String(cur.getMonth() + 1).padStart(2, '0');
    const cd = String(cur.getDate()).padStart(2, '0');
    const cStr = `${cy}-${cm}-${cd}`;
    const cDow = cur.getDay();
    const isClosed = cDow === 0;

    dates.push({
      dateStr: cStr,
      dayTh: dayThMap[cDow],
      dayEn: dayEnMap[cDow],
      dayRu: dayRuMap[cDow],
      dateNum: cd + (isClosed ? ' (ปิด)' : ''),
      isClosed,
    });
  }

  const thMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
  ];
  const enMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const ruMonths = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ];

  const mIdx = targetDate.getMonth();
  const yr = targetDate.getFullYear();
  const yrTh = yr + 543;

  return {
    weekIndex: 999,
    monthTh: `${thMonths[mIdx]} ${yrTh}`,
    monthEn: `${enMonths[mIdx]} ${yr}`,
    monthRu: `${ruMonths[mIdx]} ${yr}`,
    dates,
  };
}

export function formatBookingDate(dateStr: string, lang: Language = 'th'): string {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);

  const thMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];
  const enMonths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const ruMonths = [
    'янв.', 'февр.', 'марта', 'апр.', 'мая', 'июня',
    'июля', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.',
  ];

  if (lang === 'th') {
    return `${d} ${thMonths[m - 1]} ${y + 543}`;
  } else if (lang === 'ru') {
    return `${d} ${ruMonths[m - 1]} ${y}`;
  } else {
    return `${enMonths[m - 1]} ${d}, ${y}`;
  }
}

export const TIME_SLOTS = ['08:30', '09:30', '10:30', '13:00', '14:00', '15:30'];

// Admin Security PINs
export const ADMIN_SECURITY_PINS = ['8888', '1234'];

export function verifyAdminPin(pin: string): boolean {
  return ADMIN_SECURITY_PINS.includes(pin.trim());
}

// Flat-Rate Car Wash Pricing: Standard Wash = ฿500 (No Car Size Differentiation)
export function calculatePrice(
  service: ServiceType = 'wash',
  arg2?: any,
  arg3?: any
): { price: number; duration: string; durationEn: string; durationRu?: string; noteTh?: string; noteEn?: string; noteRu?: string } {
  // Support either calculatePrice('wash', subOptionId) or calculatePrice('wash', size, subOptionId)
  let subOptionId = 'standard';
  if (typeof arg2 === 'string' && (arg2 === 'standard' || arg2 === 'engine' || arg2 === 'wax' || arg2 === 'glass')) {
    subOptionId = arg2;
  } else if (typeof arg3 === 'string') {
    subOptionId = arg3;
  }

  const BASE_PRICE = 500;
  let add = 0;
  if (subOptionId === 'engine') add = 500;
  else if (subOptionId === 'wax') add = 400;
  else if (subOptionId === 'glass') add = 300;

  return {
    price: BASE_PRICE + add,
    duration: '1 ชม.',
    durationEn: '1 hr',
    durationRu: '1 час',
    noteTh: 'ล้างสีดูดฝุ่นพรีเมียม pH 7 ปลอดภัยต่อสีรถ',
    noteEn: '100% pH-Neutral foam detailing wash',
    noteRu: 'Премиум детейлинг мойка с pH-нейтральной пеной',
  };
}

// Slot Count & Availability
export function getSlotAvailability(
  dateStr: string,
  slotTime: string,
  bookings: BookingRecord[],
  lockedSlots: string[] = [],
  totalBays: number = 2
) {
  const isSunday = isDateSunday(dateStr);

  const slotKey = `${dateStr}_${slotTime}`;
  const isLocked = lockedSlots.includes(slotKey);

  if (isSunday || isLocked) {
    return {
      booked: totalBays,
      total: totalBays,
      available: 0,
      isFull: true,
      isClosed: isSunday,
      isLocked: isLocked,
    };
  }

  const booked = bookings.filter((b) => b.date === dateStr && b.timeSlot === slotTime).length;
  const available = Math.max(0, totalBays - booked);
  const isFull = booked >= totalBays;

  return {
    booked,
    total: totalBays,
    available,
    isFull,
    isClosed: false,
    isLocked: false,
  };
}

// Stage mapping
export function mapStatusToStage(status: BookingRecord['status']): number {
  switch (status) {
    case 'pending':
    case 'step1':
      return 1;
    case 'step2':
      return 2;
    case 'step3':
      return 3;
    case 'step4':
      return 4;
    case 'ready':
      return 5;
    default:
      return 1;
  }
}

// Stage text labels & studio photos tailored specifically for Car Wash
export function getStageDetails(stageNum: number, isTh: boolean) {
  const stages = [
    {
      num: 1,
      titleTh: '1. รับรถและตรวจเช็กสภาพก่อนล้าง',
      titleEn: '1. Vehicle Check-in & Pre-wash Inspection',
      descTh: 'ตรวจเช็กทรัพย์สิน สภาพสี รอยสะเก็ดหินเดิม และบันทึกเข้าระบบ',
      descEn: 'Valuables verification, pre-wash defect inspection & digital logging',
      photoUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
      photoCaptionTh: 'ภาพบันทึกสภาพรถและรอยเดิมก่อนเริ่มงานล้าง',
      photoCaptionEn: 'Pre-wash intake inspection photo recorded in studio system',
    },
    {
      num: 2,
      titleTh: '2. ฉีดน้ำแรงดันสูง & พ่นโฟม pH บาลานซ์',
      titleEn: '2. High Pressure Rinse & Snow Foam',
      descTh: 'ฉีดโฟมละเอียด pH 7 สลายคราบฝังแน่น ล้างล้อแม็ก ซุ้มล้อ และเทคนิค 2 ถังไร้รอย',
      descEn: 'pH-neutral snow foam, deep wheel decontamination & 2-bucket wash technique',
      photoUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
      photoCaptionTh: 'ภาพการพ่นโฟม pH-Neutral นุ่มหนาขจัดคราบสิ่งสกปรก',
      photoCaptionEn: 'High-density snow foam lifting road grime and dirt safely',
    },
    {
      num: 3,
      titleTh: '3. เช็ดแห้ง เป่าลม & ดูดฝุ่นภายใน',
      titleEn: '3. Microfiber Drying & Interior Vacuum',
      descTh: 'เช็ดแห้งด้วยผ้าไมโครไฟเบอร์พรีเมียม เป่าลมไล่น้ำทุกซอก และดูดฝุ่นละเอียดในห้องโดยสาร',
      descEn: 'Premium microfiber hand drying, compressed air blow-out & deep interior vacuuming',
      photoUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      photoCaptionTh: 'ภาพการเป่าลมไล่น้ำและดูดฝุ่นทำความสะอาดเบาะพรม',
      photoCaptionEn: 'Compressed air drying and deep cabin detailing under inspection lighting',
    },
    {
      num: 4,
      titleTh: '4. เคลือบยางดำ & ตรวจสอบคุณภาพ QC',
      titleEn: '4. Tire Dressing & Studio Quality Control (QC)',
      descTh: 'เคลือบยางสูตรแห้งสนิท เช็ดกระจกใส ไร้คราบมัน และตรวจความสะอาดใต้ไฟสตูดิโอ',
      descEn: 'Non-sling satin tire dressing, streak-free glass polish & QC studio light inspection',
      photoUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
      photoCaptionTh: 'ภาพการตรวจเช็กความสะอาดและความเงางามใต้แสงไฟ Studio Light QC',
      photoCaptionEn: 'Studio Light QC check inspecting gloss, glass clarity and wheels',
    },
    {
      num: 5,
      titleTh: '5. รถสะอาดเงางาม พร้อมส่งมอบ',
      titleEn: '5. Sparkling Clean & Ready for Handover',
      descTh: 'รถสะอาดสมบูรณ์แบบ 100% กลิ่นหอมสดชื่น พร้อมส่งมอบหรือรอรับรถที่สตูดิโอ',
      descEn: 'Vehicle detailing completed to studio standards. Ready for customer pickup.',
      photoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      photoCaptionTh: 'ภาพรถสะอาดเงางามพร้อมส่งมอบ ณ ช่องจอดส่งมอบ',
      photoCaptionEn: 'Spotless vehicle ready in the handover bay',
    },
  ];

  return stages[Math.min(Math.max(stageNum - 1, 0), 4)];
}

// Context-Aware Cleanliness Guarantee & Rain Warranty
export function getWarrantyInfo(serviceKey: ServiceType = 'wash', subOptionId?: string, isTh: boolean = true) {
  return {
    warrantyId: 'AB-WSH-9921',
    titleTh: 'รับประกันความสะอาด & กันฝน 24 ชั่วโมง (Studio Quality & Rain Guarantee)',
    titleEn: '24-Hour Studio Cleanliness & Rain Guarantee',
    descTh: 'การันตีความสะอาด 100% หากพบจุดตกหล่นหรือเกิดฝนตกภายใน 24 ชม. สามารถนำรถกลับมาล้างภายนอกซ้ำได้ฟรีทันที',
    descEn: '100% Cleanliness satisfaction guarantee or free rain wash within 24 hours',
    validTh: 'รับประกันความสะอาด & ฝนตก 24 ชม.',
    validEn: '24-Hour Cleanliness Guarantee',
    nextCheckTh: 'แนะนำล้างทำความสะอาดทุก 2-3 สัปดาห์ เพื่อรักษาสภาพสีรถ',
    nextCheckEn: 'Recommended routine wash every 2-3 weeks',
    canBookMaintenance: false,
    buttonTextTh: '📅 จองคิวล้างรถรอบถัดไป',
    buttonTextEn: '📅 Book Next Wash',
  };
}

// Service Name localized helper (Supports TH, EN, RU)
export function getServiceName(serviceKey: ServiceType = 'wash', langOrIsTh: Language | boolean): string {
  const lang: Language = typeof langOrIsTh === 'boolean' ? (langOrIsTh ? 'th' : 'en') : langOrIsTh;

  if (lang === 'ru') return 'Премиум мойка и детейлинг интерьера (#PMW)';
  return lang === 'th'
    ? 'ล้างรถพรีเมียม & คลีนภายใน (Premium Wash & Detailing #PMW)'
    : 'Premium Wash & Detailing (#PMW)';
}

// Calendar Integration Helpers
export function generateGoogleCalendarUrl(booking: {
  service: string;
  date: string;
  timeSlot: string;
  carInfo: string;
}): string {
  const cleanTime = (booking.timeSlot || '08:30').split('-')[0].trim();
  const [startHour = '08', startMin = '30'] = cleanTime.split(':');
  const dateFormatted = booking.date.replace(/-/g, '');
  
  const startIso = `${dateFormatted}T${startHour.padStart(2, '0')}${startMin.padStart(2, '0')}00`;
  const endHour = (parseInt(startHour, 10) + 1).toString().padStart(2, '0');
  const endIso = `${dateFormatted}T${endHour}${startMin.padStart(2, '0')}00`;

  const title = encodeURIComponent(`Autoboutique Phuket: ล้างรถพรีเมียม (${booking.carInfo})`);
  const details = encodeURIComponent(
    `คิวนัดหมายล้างรถพรีเมียมกับ Autoboutique Phuket (C-Cube Automotive)\nบริการ: ${booking.service}\nรถยนต์: ${booking.carInfo}\nเวลา: ${booking.timeSlot} น.\nสถานที่: Autoboutique Phuket สตูดิโอ\nโทร: 096 636 9933`
  );
  const location = encodeURIComponent('Autoboutique Phuket (C-Cube Automotive), Phuket');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&ctz=Asia/Bangkok`;
}

export function generateIcsCalendarContent(booking: {
  service: string;
  date: string;
  timeSlot: string;
  carInfo: string;
}): string {
  const cleanTime = (booking.timeSlot || '08:30').split('-')[0].trim();
  const [startHour = '08', startMin = '30'] = cleanTime.split(':');
  const dateFormatted = booking.date.replace(/-/g, '');
  const startIso = `${dateFormatted}T${startHour.padStart(2, '0')}${startMin.padStart(2, '0')}00`;
  const endHour = (parseInt(startHour, 10) + 1).toString().padStart(2, '0');
  const endIso = `${dateFormatted}T${endHour}${startMin.padStart(2, '0')}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Autoboutique Phuket//NONSGML v1.0//TH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@autoboutiqueth.com`,
    `DTSTAMP:${dateFormatted}T000000Z`,
    `DTSTART:${startIso}`,
    `DTEND:${endIso}`,
    `SUMMARY:Autoboutique Phuket: ล้างรถพรีเมียม (${booking.carInfo})`,
    `DESCRIPTION:คิวนัดหมายล้างรถพรีเมียมกับ Autoboutique Phuket\\nบริการ: ${booking.service}\\nรถยนต์: ${booking.carInfo}\\nโทร: 096 636 9933`,
    'LOCATION:Autoboutique Phuket (C-Cube Automotive), Phuket',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// Service Showcase Highlights
export interface ServiceShowcase {
  titleTh: string;
  titleEn: string;
  highlightsTh: string[];
  highlightsEn: string[];
  images: { url: string; captionTh: string; captionEn: string }[];
}

export const SERVICE_SHOWCASE_DATA: Record<ServiceType, ServiceShowcase> = {
  wash: {
    titleTh: 'ตัวอย่างงาน: ล้างรถพรีเมียม & คลีนภายใน (#PMW)',
    titleEn: 'Service Preview: Premium Wash & Detailing',
    highlightsTh: [
      'ใช้โฟม pH Balance 100% ไม่กัดกร่อนชั้นเคลือบหรือสีรถเดิม',
      'ล้าง 2-Bucket System แยกถังล้างล้อและสีตัวถัง ป้องกันรอยขนแมว',
      'ดูดฝุ่นละเอียด เช็ดทำความสะอาดคอนโซล และเป่าลมไล่น้ำทุกซอก',
    ],
    highlightsEn: [
      '100% pH Neutral foam, completely safe on coatings & clear coat',
      '2-Bucket scratch-free wash technique with dedicated wheel brushes',
      'Deep interior vacuuming, wipe-down, and thorough blow-drying',
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        captionTh: 'การล้างโฟมเนื้อนุ่ม Decontamination ขจัดคราบฝังลึก',
        captionEn: 'High-density snow foam wash and gentle decontamination',
      },
      {
        url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80',
        captionTh: 'การเป่าลมไล่น้ำและเคลือบยางเงาสูตรแห้งไม่ดีด',
        captionEn: 'Compressed air drying and satin tire conditioning',
      },
    ],
  },
  interior: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  ceramic: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  ppf: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  wrap: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  film: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  accessories: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
  maintenance: { titleTh: 'ล้างรถพรีเมียม', titleEn: 'Premium Wash', highlightsTh: [], highlightsEn: [], images: [] },
};

// UI & Form Formatters
export function formatPhoneInput(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidThaiPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && (digits.startsWith('06') || digits.startsWith('08') || digits.startsWith('09'));
}

export function getEstimatedCompletion(timeSlot: string): string {
  const [h, m] = timeSlot.split(':').map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return `${timeSlot} + 1 ชม.`;
  const endH = (h + 1) % 24;
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// EMVCo CRC-16 (CCITT-FALSE: poly 0x1021, init 0xFFFF)
export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Official EMVCo Standard Dynamic/Static PromptPay QR Payload Generator
export function generatePromptPayPayload(phoneOrNationalId: string, amount?: number): string {
  const digits = phoneOrNationalId.replace(/\D/g, '');
  let subtag = '';

  if (digits.length === 13) {
    // Thai National ID / Tax ID
    subtag = '0213' + digits;
  } else {
    // Thai Mobile Phone (Formatted to E.164 without '+' with 0066 prefix, length 13)
    const mobileDigits = digits.startsWith('0') ? digits.slice(1) : digits;
    const formatted = '0066' + mobileDigits;
    subtag = '0113' + formatted;
  }

  const target = '0016A000000677010111' + subtag;
  const tag29 = '29' + target.length.toString().padStart(2, '0') + target;

  let payload = '000201' + (amount && amount > 0 ? '010212' : '010211') + tag29 + '5802TH' + '5303764';

  if (amount && amount > 0) {
    const amtStr = Number(amount).toFixed(2);
    payload += '54' + amtStr.length.toString().padStart(2, '0') + amtStr;
  }

  payload += '6304';
  const checksum = crc16(payload);
  return payload + checksum;
}


