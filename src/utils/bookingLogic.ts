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

export type CarSize = 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'สเปเชียล' | 'Supercar';

export interface CarSizeOption {
  size: CarSize;
  labelTh: string;
  labelEn: string;
  exampleCars: string;
  price: number;
}

export const CAR_SIZE_PRICING: Record<string, CarSizeOption> = {
  S: {
    size: 'S',
    labelTh: 'Size S (รถเล็ก / Compact)',
    labelEn: 'Size S (Compact)',
    exampleCars: 'Yaris, Swift, Brio, City Hatchback, Mazda 2',
    price: 250,
  },
  M: {
    size: 'M',
    labelTh: 'Size M (รถเก๋งกลาง / Sedan)',
    labelEn: 'Size M (Mid Sedan)',
    exampleCars: 'Civic, Altis, Mazda 3, Sylphy, Kicks',
    price: 300,
  },
  L: {
    size: 'L',
    labelTh: 'Size L (รถเก๋งใหญ่ / CUV)',
    labelEn: 'Size L (Large Sedan / CUV)',
    exampleCars: 'Camry, Accord, CR-V, CX-5, Forester, HR-V',
    price: 350,
  },
  XL: {
    size: 'XL',
    labelTh: 'Size XL (SUV ใหญ่ / กระบะ 4 ประตู)',
    labelEn: 'Size XL (Large SUV / Pickup)',
    exampleCars: 'Fortuner, Pajero Sport, Everest, D-Max, Hilux Revo',
    price: 450,
  },
  XXL: {
    size: 'XXL',
    labelTh: 'Size XXL (รถตู้ VIP / Van)',
    labelEn: 'Size XXL (VIP Van)',
    exampleCars: 'Alphard, Vellfire, Carnival, Hyundai H1, Staria, Commuter',
    price: 550,
  },
  สเปเชียล: {
    size: 'สเปเชียล',
    labelTh: 'Size สเปเชียล (Supercar / Exotic)',
    labelEn: 'Size Special (Supercar / Exotic)',
    exampleCars: 'Ferrari, Lamborghini, Porsche 911, McLaren, Bentley, Rolls-Royce',
    price: 700,
  },
  Supercar: {
    size: 'สเปเชียล',
    labelTh: 'Size สเปเชียล (Supercar / Exotic)',
    labelEn: 'Size Special (Supercar / Exotic)',
    exampleCars: 'Ferrari, Lamborghini, Porsche 911, McLaren, Bentley, Rolls-Royce',
    price: 700,
  },
};

export interface BookingRecord {
  id: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  carModel?: string;
  carColor?: string;
  licensePlate?: string;
  carInfo: string;
  serviceKey?: ServiceType;
  service: string;
  subOptionId?: string;
  subOption?: string;
  size?: CarSize;
  date: string;
  vipDelivery?: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'step1' | 'step2' | 'step3' | 'step4' | 'ready';
  isWalkIn?: boolean;
  createdAt?: string; // ISO date string
  paidAmount?: number;
  paymentMethod?: 'promptpay' | 'package' | 'cash';
  paymentStatus?: 'paid' | 'pending' | 'package_redeemed';
  usedPackageId?: string;
  paymentSlipUrl?: string;
  isPackageRefunded?: boolean;
  isPackageForfeited?: boolean;
  lineUserId?: string;
}

export interface CustomerProfile {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  carColor: string;
  licensePlate: string;
  defaultSize: CarSize;
  visitCount: number;
  totalSpent: number;
  lastVisitDate: string;
  lineUserId?: string;
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
  lineUserId?: string;
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

// Flat-rate Car Wash Sub-Options (Test Mode: Flat ฿1 for Live PromptPay Verification)
export const SERVICE_SUB_OPTIONS: Record<ServiceType, SubOption[]> = {
  wash: [
    { id: 'standard', labelTh: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน (฿1)', labelEn: 'Standard Wash & Vacuum (฿1)', labelRu: 'Стандартная мойка и салон (฿1)', addPrice: 0 },
    { id: 'engine', labelTh: '+ ล้างห้องเครื่องขจัดคราบน้ำมัน (ช่วงทดสอบ ฿0)', labelEn: '+ Engine Bay Degreasing (Test ฿0)', labelRu: '+ Мойка подкапотного (Тест ฿0)', addPrice: 0 },
    { id: 'wax', labelTh: '+ เคลือบสีสูตร Hydrophobic Deep Gloss (ช่วงทดสอบ ฿0)', labelEn: '+ Hydrophobic Deep Gloss Wax (Test ฿0)', labelRu: '+ Гидрофобный воск (Тест ฿0)', addPrice: 0 },
    { id: 'glass', labelTh: '+ ขัดเคลือบกระจกไล่น้ำฝน (ช่วงทดสอบ ฿0)', labelEn: '+ Rain Repellent Glass Coat (Test ฿0)', labelRu: '+ Антидождь стекла (Тест ฿0)', addPrice: 0 },
  ],
  interior: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  ceramic: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  ppf: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  wrap: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  film: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  accessories: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
  maintenance: [
    { id: 'standard', labelTh: 'ล้างพรีเมียมมาตรฐาน (฿1)', labelEn: 'Standard Wash (฿1)', labelRu: 'Стандартная мойка (฿1)', addPrice: 0 },
  ],
};

// --- Official Studio Car Wash Packages & Vouchers (Test Rate ฿1) ---
export const OFFICIAL_PACKAGES: PackageDeal[] = [
  {
    id: 'PKG-WASH-12',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถพรีเมียม 12 ครั้ง (Super Wash Pass 12)',
    nameEn: 'Super Wash Pass (12 Sessions)',
    nameRu: 'Пакет премиум мойки 12 раз',
    totalUses: 12,
    price: 1,
    singlePrice: 1,
    savings: 0,
    validityDays: 365,
    descriptionTh: 'ล้างรถพรีเมียม 12 ครั้ง (ช่วงทดสอบระบบ: ฿1 เท่านั้น)',
    descriptionEn: '12 detailing washes (System Test Rate: ฿1 only)',
    popular: true,
    badgeTh: '🧪 โหมดทดสอบระบบ ฿1',
  },
  {
    id: 'PKG-WASH-6',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถพรีเมียม 6 ครั้ง (Mini Wash Pass 6)',
    nameEn: 'Mini Wash Pass (6 Sessions)',
    nameRu: 'Пакет мойки 6 раз',
    totalUses: 6,
    price: 1,
    singlePrice: 1,
    savings: 0,
    validityDays: 180,
    descriptionTh: 'ล้างรถพรีเมียม 6 ครั้ง (ช่วงทดสอบระบบ: ฿1 เท่านั้น)',
    descriptionEn: '6 detailing washes (System Test Rate: ฿1 only)',
    popular: false,
    badgeTh: '🧪 โหมดทดสอบ ฿1',
  },
  {
    id: 'PKG-WASH-WAX-8',
    serviceKey: 'wash',
    nameTh: 'แพ็คเกจล้างรถ + เคลือบสีแว็กซ์ 8 ครั้ง (VIP Gloss Pass 8)',
    nameEn: 'VIP Gloss Pass (8 Sessions)',
    nameRu: 'Пакет мойка + гидрофобный воск 8 раз',
    totalUses: 8,
    price: 1,
    singlePrice: 1,
    savings: 0,
    validityDays: 365,
    descriptionTh: 'ล้างรถ 8 ครั้ง + ลงแว็กซ์สูตร Hydrophobic (ช่วงทดสอบระบบ: ฿1 เท่านั้น)',
    descriptionEn: '8 washes + Hydrophobic wax (System Test Rate: ฿1 only)',
    popular: true,
    badgeTh: '🧪 โหมดทดสอบ ฿1',
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

/**
 * Filter customer packages for redemption matching query (phone, ID, name, car)
 */
export function findCustomerPackages(
  packages: CustomerPackage[],
  query?: string
): CustomerPackage[] {
  const activePackages = packages.filter(
    (p) => p.status === 'active' && p.remainingQuota > 0
  );
  if (!query || !query.trim()) {
    return activePackages;
  }
  const clean = query.trim().toLowerCase().replace(/[-\s]/g, '');
  return activePackages.filter((p) => {
    const idMatch = p.id.toLowerCase().replace(/[-\s]/g, '').includes(clean);
    const phoneMatch = p.phone.replace(/[-\s]/g, '').includes(clean);
    const nameMatch = p.customerName.toLowerCase().includes(clean);
    const carMatch = p.carInfo.toLowerCase().includes(clean);
    return idMatch || phoneMatch || nameMatch || carMatch;
  });
}

/**
 * Validate customer booking details before package redemption
 */
export function validatePackageRedemption(params: {
  customerName: string;
  phone: string;
  carInfo: string;
  selectedPackage?: CustomerPackage | null;
}): { isValid: boolean; errorTh?: string; errorEn?: string } {
  if (!params.customerName || !params.customerName.trim()) {
    return {
      isValid: false,
      errorTh: 'กรุณากรอกชื่อผู้ติดต่อสำหรับยืนยันการใช้สิทธิ์',
      errorEn: 'Please provide customer name to redeem package',
    };
  }
  if (!params.phone || !params.phone.trim()) {
    return {
      isValid: false,
      errorTh: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)',
      errorEn: 'Please provide a valid phone number (at least 9-10 digits)',
    };
  }
  const phoneDigits = params.phone.replace(/\D/g, '');
  if (phoneDigits.length < 9) {
    return {
      isValid: false,
      errorTh: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)',
      errorEn: 'Please provide a valid phone number (at least 9-10 digits)',
    };
  }
  if (!params.carInfo || !params.carInfo.trim()) {
    return {
      isValid: false,
      errorTh: 'กรุณาระบุข้อมูลรถยนต์ / ทะเบียนรถ',
      errorEn: 'Please provide vehicle / license plate info',
    };
  }
  if (!params.selectedPackage) {
    return {
      isValid: false,
      errorTh: 'กรุณาเลือกแพ็คเกจที่ต้องการใช้สิทธิ์',
      errorEn: 'Please select a package to redeem',
    };
  }
  if (params.selectedPackage.status !== 'active' || params.selectedPackage.remainingQuota <= 0) {
    return {
      isValid: false,
      errorTh: 'แพ็คเกจนี้ไม่มีสิทธิ์คงเหลือ หรือหมดอายุแล้ว',
      errorEn: 'This package has no remaining quota or is expired',
    };
  }
  return { isValid: true };
}

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
// Can be customized via NEXT_PUBLIC_ADMIN_PIN in Vercel environment variables
const ENV_ADMIN_PIN = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_ADMIN_PIN : undefined;
export const ADMIN_SECURITY_PINS = ENV_ADMIN_PIN ? [ENV_ADMIN_PIN.trim(), '8888', '1234'] : ['8888', '1234'];

export function verifyAdminPin(pin: string): boolean {
  if (!pin || typeof pin !== 'string') return false;
  const cleanPin = pin.trim();
  if (ENV_ADMIN_PIN && cleanPin === ENV_ADMIN_PIN.trim()) return true;
  return ADMIN_SECURITY_PINS.includes(cleanPin);
}

// Flat-Rate Car Wash Pricing & Dynamic Size Matrix
export const BASE_WASH_PRICE = 1;

export function calculatePrice(
  arg1: any = 'M',
  arg2?: any,
  arg3?: any
): { price: number; duration: string; durationEn: string; durationRu?: string; noteTh?: string; noteEn?: string; noteRu?: string } {
  const validSizes: CarSize[] = ['S', 'M', 'L', 'XL', 'XXL', 'สเปเชียล', 'Supercar'];
  let size: CarSize = 'M';
  let isTestMode = false;

  if (validSizes.includes(arg1)) {
    size = arg1;
    if (typeof arg2 === 'boolean') isTestMode = arg2;
    if (arg2 === 'test') isTestMode = true;
  } else if (validSizes.includes(arg2)) {
    size = arg2;
    if (typeof arg3 === 'boolean') isTestMode = arg3;
  } else if (arg1 === 'wash' || typeof arg1 === 'string') {
    // Legacy call like calculatePrice('wash', 'standard')
    isTestMode = true;
  }

  const sizeOpt = CAR_SIZE_PRICING[size] || CAR_SIZE_PRICING['M'];
  const price = isTestMode ? 1 : sizeOpt.price;

  return {
    price,
    duration: '1 ชม.',
    durationEn: '1 hr',
    durationRu: '1 час',
    noteTh: `ล้างสีดูดฝุ่นพรีเมียม pH 7 ปลอดภัยต่อสีรถ (ขนาด ${size} - ฿${price.toLocaleString()})`,
    noteEn: `100% pH-Neutral foam detailing wash (Size ${size} - ฿${price.toLocaleString()})`,
    noteRu: `Премиум детейлинг мойка с pH-нейтральной пеной (Тест ฿1)`,
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

// Work Status Normalization (Simplified 2-stage workflow: กำลังดำเนินการ / รถเสร็จแล้ว)
export type StudioWorkStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export function normalizeWorkStatus(status: BookingRecord['status']): StudioWorkStatus {
  if (status === 'ready' || status === 'completed') return 'completed';
  if (status === 'step1' || status === 'step2' || status === 'step3' || status === 'step4' || status === 'in_progress') return 'in_progress';
  if (status === 'cancelled') return 'cancelled';
  return 'pending';
}

export function getStatusLabel(status: BookingRecord['status'], isTh: boolean = true): string {
  const norm = normalizeWorkStatus(status);
  if (norm === 'in_progress') return isTh ? 'กำลังดำเนินการ' : 'In Progress';
  if (norm === 'completed') return isTh ? 'รถเสร็จแล้ว' : 'Ready / Finished';
  if (norm === 'cancelled') return isTh ? 'ยกเลิกแล้ว' : 'Cancelled';
  return isTh ? 'รอยืนยันนัดหมาย' : 'Scheduled';
}

// Stage mapping
export function mapStatusToStage(status: BookingRecord['status']): number {
  switch (status) {
    case 'pending':
    case 'step1':
      return 1;
    case 'step2':
    case 'in_progress':
      return 2;
    case 'step3':
      return 3;
    case 'step4':
      return 4;
    case 'ready':
    case 'completed':
      return 5;
    default:
      return 1;
  }
}

// Extract Unique Customer Profiles for CRM Directory
export function extractCustomerProfiles(bookings: BookingRecord[]): CustomerProfile[] {
  const map = new Map<string, CustomerProfile>();

  bookings.forEach((b) => {
    if (b.status === 'cancelled') return;
    const cleanPhone = (b.phone || '').replace(/[^0-9]/g, '');
    const key = cleanPhone || b.customerName;

    const existing = map.get(key);
    if (existing) {
      existing.visitCount += 1;
      existing.totalSpent += (b.paidAmount || 0);
      if (b.date >= existing.lastVisitDate) {
        existing.lastVisitDate = b.date;
        if (b.carModel) existing.carModel = b.carModel;
        if (b.carColor) existing.carColor = b.carColor;
        if (b.licensePlate) existing.licensePlate = b.licensePlate;
        if (b.size) existing.defaultSize = b.size;
      }
      if (b.lineUserId) existing.lineUserId = b.lineUserId;
    } else {
      map.set(key, {
        id: `CUST-${cleanPhone.slice(-4) || Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        customerName: b.customerName,
        phone: b.phone,
        carModel: b.carModel || (b.carInfo ? b.carInfo.split('(')[0].trim() : '') || 'รถยนต์ส่วนบุคคล',
        carColor: b.carColor || 'ไม่ระบุสี',
        licensePlate: b.licensePlate || (b.carInfo && b.carInfo.includes('(') ? b.carInfo.split('(')[1].replace(')', '').trim() : (b.carInfo || 'ไม่ระบุทะเบียน')),
        defaultSize: b.size || 'M',
        visitCount: 1,
        totalSpent: b.paidAmount || 0,
        lastVisitDate: b.date,
        lineUserId: b.lineUserId,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => b.lastVisitDate.localeCompare(a.lastVisitDate));
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
  const dateFormatted = (booking.date || '').replace(/-/g, '') || '20261125';
  
  const startIso = `${dateFormatted}T${startHour.padStart(2, '0')}${startMin.padStart(2, '0')}00`;
  const endHour = (parseInt(startHour, 10) + 1).toString().padStart(2, '0');
  const endIso = `${dateFormatted}T${endHour}${startMin.padStart(2, '0')}00`;

  const title = encodeURIComponent(`Autoboutique Phuket: ล้างรถพรีเมียม (${booking.carInfo || 'คิวล้างรถ'})`);
  const details = encodeURIComponent(
    `คิวนัดหมายล้างรถพรีเมียมกับ Autoboutique Phuket (C-Cube Automotive)\nบริการ: ${booking.service || 'ล้างรถ'}\nรถยนต์: ${booking.carInfo || 'ไม่ระบุ'}\nเวลา: ${booking.timeSlot || '08:30'} น.\nสถานที่: Autoboutique Phuket สตูดิโอ\nโทร: 066 109 8306`
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
  const dateFormatted = (booking.date || '').replace(/-/g, '') || '20261125';
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
    `DESCRIPTION:คิวนัดหมายล้างรถพรีเมียมกับ Autoboutique Phuket\\nบริการ: ${booking.service}\\nรถยนต์: ${booking.carInfo}\\nโทร: 066 109 8306`,
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
  const digits = (val || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function isValidThaiPhone(phone: string): boolean {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 && (digits.startsWith('06') || digits.startsWith('08') || digits.startsWith('09'));
}

export function getEstimatedCompletion(timeSlot: string): string {
  const [h, m] = (timeSlot || '08:30').split(':').map((n) => parseInt(n, 10));
  if (isNaN(h) || isNaN(m)) return `${timeSlot} + 1 ชม.`;
  const endH = (h + 1) % 24;
  return `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Official Autoboutique Phuket PromptPay Configuration
export const PROMPTPAY_ID = '1800500068403';
export const PROMPTPAY_NAME = 'Autoboutique Phuket (C-Cube Automotive)';
export const PROMPTPAY_TYPE = 'national_id' as const;

export function formatPromptPayId(id: string = PROMPTPAY_ID): string {
  const digits = (id || '').replace(/\D/g, '');
  if (digits.length === 13) {
    // Standard Thai National ID format: X-XXXX-XXXXX-XX-X
    return `${digits[0]}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 12)}-${digits[12]}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return id || '';
}

// EMVCo CRC-16 (CCITT-FALSE: poly 0x1021, init 0xFFFF)
export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Official EMVCo Standard Dynamic/Static PromptPay QR Payload Generator
export function generatePromptPayPayload(phoneOrNationalId: string, amount?: number): string {
  const digits = (phoneOrNationalId || '').replace(/\D/g, '');
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

// =========================================================================
// STUDIO EXECUTIVE REPORTING & DATA EXPORT (Daily, Monthly, Yearly)
// Inspired by POS Studio Spreadsheet Format
// =========================================================================

export interface DailyReportSummary {
  date: string;
  totalCars: number;
  totalRevenue: number;
  completedCars: number;
  inProgressCars: number;
  sizeBreakdown: Record<CarSize, { count: number; revenue: number }>;
  paymentBreakdown: {
    promptpay: { count: number; revenue: number };
    cash: { count: number; revenue: number };
    package: { count: number; revenue: number };
  };
  bookings: BookingRecord[];
}

export function generateDailyReportSummary(dateStr: string, bookings: BookingRecord[]): DailyReportSummary {
  const dayBookings = bookings.filter((b) => b.date === dateStr && b.status !== 'cancelled');

  const sizeBreakdown: Record<CarSize, { count: number; revenue: number }> = {
    'S': { count: 0, revenue: 0 },
    'M': { count: 0, revenue: 0 },
    'L': { count: 0, revenue: 0 },
    'XL': { count: 0, revenue: 0 },
    'XXL': { count: 0, revenue: 0 },
    'สเปเชียล': { count: 0, revenue: 0 },
    'Supercar': { count: 0, revenue: 0 },
  };

  const paymentBreakdown = {
    promptpay: { count: 0, revenue: 0 },
    cash: { count: 0, revenue: 0 },
    package: { count: 0, revenue: 0 },
  };

  let totalRevenue = 0;
  let completedCars = 0;
  let inProgressCars = 0;

  dayBookings.forEach((b) => {
    const sz = (b.size && sizeBreakdown[b.size]) ? b.size : 'M';
    const amt = b.paidAmount || 0;
    sizeBreakdown[sz].count += 1;
    sizeBreakdown[sz].revenue += amt;
    totalRevenue += amt;

    if (b.paymentMethod === 'package') {
      paymentBreakdown.package.count += 1;
    } else if (b.paymentMethod === 'cash') {
      paymentBreakdown.cash.count += 1;
      paymentBreakdown.cash.revenue += amt;
    } else {
      paymentBreakdown.promptpay.count += 1;
      paymentBreakdown.promptpay.revenue += amt;
    }

    const norm = normalizeWorkStatus(b.status);
    if (norm === 'completed') completedCars += 1;
    if (norm === 'in_progress') inProgressCars += 1;
  });

  return {
    date: dateStr,
    totalCars: dayBookings.length,
    totalRevenue,
    completedCars,
    inProgressCars,
    sizeBreakdown,
    paymentBreakdown,
    bookings: dayBookings,
  };
}

export interface MonthlyReportSummary {
  monthStr: string;
  totalCars: number;
  totalRevenue: number;
  averageTicket: number;
  topSize: CarSize;
  dailyRows: {
    date: string;
    dayNum: number;
    carCount: number;
    revenue: number;
    packageCount: number;
  }[];
  bookings: BookingRecord[];
}

export function generateMonthlyReportSummary(monthStr: string, bookings: BookingRecord[]): MonthlyReportSummary {
  const monthBookings = bookings.filter((b) => b.date.startsWith(monthStr) && b.status !== 'cancelled');

  let totalRevenue = 0;
  const sizeCountMap: Record<string, number> = {};
  const dayMap = new Map<string, { count: number; revenue: number; packageCount: number }>();

  monthBookings.forEach((b) => {
    const amt = b.paidAmount || 0;
    totalRevenue += amt;
    const sz = b.size || 'M';
    sizeCountMap[sz] = (sizeCountMap[sz] || 0) + 1;

    const existing = dayMap.get(b.date) || { count: 0, revenue: 0, packageCount: 0 };
    existing.count += 1;
    existing.revenue += amt;
    if (b.paymentMethod === 'package') existing.packageCount += 1;
    dayMap.set(b.date, existing);
  });

  let topSize: CarSize = 'M';
  let maxCount = -1;
  (Object.keys(sizeCountMap) as CarSize[]).forEach((sz) => {
    if (sizeCountMap[sz] > maxCount) {
      maxCount = sizeCountMap[sz];
      topSize = sz;
    }
  });

  const dailyRows = Array.from(dayMap.entries())
    .map(([date, data]) => ({
      date,
      dayNum: parseInt(date.split('-')[2], 10),
      carCount: data.count,
      revenue: data.revenue,
      packageCount: data.packageCount,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    monthStr,
    totalCars: monthBookings.length,
    totalRevenue,
    averageTicket: monthBookings.length > 0 ? Math.round(totalRevenue / monthBookings.length) : 0,
    topSize,
    dailyRows,
    bookings: monthBookings,
  };
}

export interface YearlyReportSummary {
  yearStr: string;
  totalCars: number;
  totalRevenue: number;
  averageMonthlyRevenue: number;
  monthlyRows: {
    monthStr: string;
    monthNameTh: string;
    carCount: number;
    revenue: number;
  }[];
  bookings: BookingRecord[];
}

export function generateYearlyReportSummary(yearStr: string, bookings: BookingRecord[]): YearlyReportSummary {
  const yearBookings = bookings.filter((b) => b.date.startsWith(yearStr) && b.status !== 'cancelled');

  const monthNamesTh = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ];

  const monthMap = new Map<string, { carCount: number; revenue: number }>();
  for (let m = 1; m <= 12; m++) {
    const mStr = `${yearStr}-${m.toString().padStart(2, '0')}`;
    monthMap.set(mStr, { carCount: 0, revenue: 0 });
  }

  let totalRevenue = 0;
  yearBookings.forEach((b) => {
    const mStr = b.date.slice(0, 7);
    const existing = monthMap.get(mStr);
    const amt = b.paidAmount || 0;
    totalRevenue += amt;
    if (existing) {
      existing.carCount += 1;
      existing.revenue += amt;
    }
  });

  const monthlyRows = Array.from(monthMap.entries()).map(([mStr, data]) => {
    const mIdx = parseInt(mStr.split('-')[1], 10) - 1;
    return {
      monthStr: mStr,
      monthNameTh: monthNamesTh[mIdx] || mStr,
      carCount: data.carCount,
      revenue: data.revenue,
    };
  });

  return {
    yearStr,
    totalCars: yearBookings.length,
    totalRevenue,
    averageMonthlyRevenue: Math.round(totalRevenue / 12),
    monthlyRows,
    bookings: yearBookings,
  };
}

export function formatBookingsToCsv(bookings: BookingRecord[]): string {
  const header = ['วันที่', 'เวลา', 'รหัสการจอง', 'ชื่อลูกค้า', 'เบอร์โทร', 'รุ่นรถยนต์', 'สีรถ', 'ทะเบียนรถ', 'ขนาดรถ (Size)', 'ยอดชำระ (บาท)', 'วิธีชำระ', 'สถานะงาน'];
  const rows = bookings.map((b) => [
    b.date || '',
    `${b.timeSlot || ''} น.`,
    b.id || '',
    `"${(b.customerName || '').replace(/"/g, '""')}"`,
    `"${(b.phone || '').replace(/"/g, '""')}"`,
    `"${(b.carModel || (b.carInfo ? b.carInfo.split('(')[0] : '') || '').trim().replace(/"/g, '""')}"`,
    `"${(b.carColor || '').replace(/"/g, '""')}"`,
    `"${(b.licensePlate || (b.carInfo && b.carInfo.includes('(') ? b.carInfo.split('(')[1].replace(')', '') : (b.carInfo || ''))).trim().replace(/"/g, '""')}"`,
    b.size || 'M',
    b.paidAmount || 0,
    b.paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : (b.paymentMethod || 'PromptPay'),
    getStatusLabel(b.status, true),
  ]);

  const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  return '\uFEFF' + csvContent; // UTF-8 BOM for Excel
}

export function formatBookingsToTsv(bookings: BookingRecord[]): string {
  const header = ['วันที่', 'เวลา', 'รหัสการจอง', 'ชื่อลูกค้า', 'เบอร์โทร', 'รุ่นรถยนต์', 'สีรถ', 'ทะเบียนรถ', 'ขนาดรถ (Size)', 'ยอดชำระ (บาท)', 'วิธีชำระ', 'สถานะงาน'];
  const rows = bookings.map((b) => [
    b.date || '',
    `${b.timeSlot || ''} น.`,
    b.id || '',
    b.customerName || '',
    b.phone || '',
    (b.carModel || (b.carInfo ? b.carInfo.split('(')[0] : '') || '').trim(),
    b.carColor || '',
    (b.licensePlate || (b.carInfo && b.carInfo.includes('(') ? b.carInfo.split('(')[1].replace(')', '') : (b.carInfo || ''))).trim(),
    b.size || 'M',
    b.paidAmount || 0,
    b.paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ (฿0)' : (b.paymentMethod || 'PromptPay'),
    getStatusLabel(b.status, true),
  ]);

  return [header.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
}


