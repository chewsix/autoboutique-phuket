'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  Calendar as CalendarIcon,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Phone,
  Car,
  AlertCircle,
  X,
  Sparkles,
  ChevronDown,
  Trash2,
  Plus,
  Lock,
  Unlock,
  Star,
  Info,
  Gift,
  Download,
  Share2,
  RefreshCw,
  ExternalLink,
  QrCode,
  Printer,
  Receipt,
  Ticket,
  Wallet,
  TrendingUp,
  CheckCheck,
  Edit,
  DollarSign,
  BarChart3,
  Send,
  Upload,
  Copy,
  FileCheck,
  ShieldAlert,
  Award,
  MapPin,
  CheckSquare,
  BadgeCheck,
  Users,
  Search,
  Filter,
  Smartphone,
  Landmark,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';

import {
  calculatePrice,
  getSlotAvailability,
  mapStatusToStage,
  getStageDetails,
  getWarrantyInfo,
  getServiceName,
  generateGoogleCalendarUrl,
  generateIcsCalendarContent,
  verifyAdminPin,
  SERVICE_SUB_OPTIONS,
  WEEKS_SCHEDULE,
  ADVANCE_MONTHS,
  getCalendarDaysForMonth,
  getWeekScheduleForDate,
  formatBookingDate,
  TIME_SLOTS,
  SERVICE_SHOWCASE_DATA,
  OFFICIAL_PACKAGES,
  INITIAL_CUSTOMER_PACKAGES,
  checkCancellationPackagePolicy,
  formatPhoneInput,
  isValidThaiPhone,
  getEstimatedCompletion,
  generatePromptPayPayload,
  PROMPTPAY_ID,
  PROMPTPAY_NAME,
  formatPromptPayId,
  BookingRecord,
  PackageDeal,
  CustomerPackage,
  CalendarDay,
  ServiceType,
  Language,
} from '@/utils/bookingLogic';

import {
  isSupabaseConfigured,
  fetchRemoteBookings,
  upsertRemoteBooking,
  updateRemoteBookingStatus,
  fetchRemotePackages,
  upsertRemotePackage,
} from '@/utils/supabaseClient';

// Initial Realistic Car Wash Bookings (Flat ฿500 Base Rate - No Car Size Matrix)
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-001',
    timeSlot: '08:30',
    customerName: 'คุณอัครวัฒน์ ชัยกิตติคุณ',
    phone: '066-109-8306',
    carInfo: 'BMW M2 Coupe (กข 8888 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'wax',
    subOption: '+ เคลือบสีสูตร Hydrophobic Deep Gloss (+฿400)',
    date: '2026-11-25',
    status: 'step3',
    createdAt: '2026-11-25T07:30:00Z',
    paidAmount: 900,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-002',
    timeSlot: '09:30',
    customerName: 'คุณสิริพร พัฒนพงศ์',
    phone: '084-555-9090',
    carInfo: 'Toyota Alphard (3ขข 1234 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'standard',
    subOption: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน',
    date: '2026-11-25',
    status: 'step2',
    createdAt: '2026-11-25T08:15:00Z',
    paidAmount: 500,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-003',
    timeSlot: '13:00',
    customerName: 'Mr. Alexander Vance',
    phone: '091-234-5678',
    carInfo: 'Porsche 911 Carrera (7กง 7777 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'engine',
    subOption: '+ ล้างห้องเครื่องขจัดคราบน้ำมัน (+฿500)',
    date: '2026-11-25',
    status: 'step1',
    createdAt: '2026-11-25T09:30:00Z',
    paidAmount: 1000,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-004',
    timeSlot: '14:00',
    customerName: 'คุณวิชัย รัตนการุณ',
    phone: '081-345-6789',
    carInfo: 'Mercedes-Benz G-Class (5กษ 9999 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'standard',
    subOption: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน (สิทธิ์แพ็คเกจ)',
    date: '2026-11-25',
    status: 'pending',
    createdAt: '2026-11-25T11:00:00Z',
    paidAmount: 0,
    paymentMethod: 'package',
    paymentStatus: 'package_redeemed',
    usedPackageId: 'CPKG-002',
  },
];

// Top Thai Mobile Banking Apps (for 1-Device Deep Link Launcher)
interface ThaiBankApp {
  id: string;
  name: string;
  bankNameTh: string;
  bankNameEn: string;
  scheme: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const THAI_BANK_APPS: ThaiBankApp[] = [
  { id: 'kbank', name: 'K PLUS', bankNameTh: 'กสิกรไทย', bankNameEn: 'KBank', scheme: 'kplus://', bgClass: 'bg-emerald-950/80 hover:bg-emerald-900', textClass: 'text-emerald-300', borderClass: 'border-emerald-600/40' },
  { id: 'scb', name: 'SCB EASY', bankNameTh: 'ไทยพาณิชย์', bankNameEn: 'SCB', scheme: 'scbeasy://', bgClass: 'bg-purple-950/80 hover:bg-purple-900', textClass: 'text-purple-300', borderClass: 'border-purple-600/40' },
  { id: 'ktb', name: 'Krungthai NEXT', bankNameTh: 'กรุงไทย', bankNameEn: 'KTB', scheme: 'ktbnext://', bgClass: 'bg-sky-950/80 hover:bg-sky-900', textClass: 'text-sky-300', borderClass: 'border-sky-600/40' },
  { id: 'bbl', name: 'Bualuang m', bankNameTh: 'กรุงเทพ', bankNameEn: 'BBL', scheme: 'bualuangmbanking://', bgClass: 'bg-blue-950/80 hover:bg-blue-900', textClass: 'text-blue-300', borderClass: 'border-blue-600/40' },
  { id: 'ttb', name: 'ttb touch', bankNameTh: 'ทีทีบี', bankNameEn: 'TTB', scheme: 'ttbtouch://', bgClass: 'bg-indigo-950/80 hover:bg-indigo-900', textClass: 'text-indigo-300', borderClass: 'border-indigo-600/40' },
  { id: 'bay', name: 'KMA กรุงศรี', bankNameTh: 'กรุงศรี', bankNameEn: 'Krungsri', scheme: 'kma://', bgClass: 'bg-amber-950/80 hover:bg-amber-900', textClass: 'text-amber-300', borderClass: 'border-amber-600/40' },
];

export default function AutoboutiqueApp() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [view, setView] = useState<'booking' | 'packages' | 'tracker' | 'admin'>('booking');
  const [lang, setLang] = useState<Language>('th');
  const isTh = lang === 'th';
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Booking Flow State
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const selectedService = SERVICE_SHOWCASE_DATA.wash;
  const [selectedSubOption, setSelectedSubOption] = useState<string>('standard');
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('09:30');
  const [selectedWeekIdx, setSelectedWeekIdx] = useState<number>(0);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(0);
  const [calendarViewMode, setCalendarViewMode] = useState<'week' | 'month'>('week');

  // Client & Vehicle Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCar, setFormCar] = useState('');
  const [vipDelivery, setVipDelivery] = useState(false);
  const [activeCarId, setActiveCarId] = useState<string>('BK-001');

  // Studio Records & Persisted State
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [customerPackages, setCustomerPackages] = useState<CustomerPackage[]>(INITIAL_CUSTOMER_PACKAGES);
  const [lockedSlots, setLockedSlots] = useState<{ date: string; slot: string }[]>([]);
  const [stampsCount, setStampsCount] = useState<number>(6);

  // PromptPay & Slip Verification Modal State
  const [promptPayModal, setPromptPayModal] = useState<{
    open: boolean;
    type: 'booking' | 'package';
    title: string;
    amount: number;
    pkgId?: string;
  }>({ open: false, type: 'booking', title: '', amount: 0 });
  const [uploadedSlipPreview, setUploadedSlipPreview] = useState<string | null>(null);
  const [slipVerified, setSlipVerified] = useState(false);
  const [slipChecking, setSlipChecking] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState<number>(900); // 15 mins (900s)
  const [selectedPackageIdToRedeem, setSelectedPackageIdToRedeem] = useState<string | null>(null);

  // Executive Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPinModalOpen, setAdminPinModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'bookings' | 'packages'>('dashboard');
  const [adminSelectedDate, setAdminSelectedDate] = useState<string>('2026-11-25');
  const [adminBookingFilter, setAdminBookingFilter] = useState<'all' | 'pending' | 'inprogress' | 'ready' | 'cancelled'>('all');
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>('');

  // Modals & Inspection State
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInCar, setWalkInCar] = useState('');
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingRecord | null>(null);
  const [viewSlipModalUrl, setViewSlipModalUrl] = useState<string | null>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<BookingRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lineNotificationSuccess, setLineNotificationSuccess] = useState<string | null>(null);
  const [trackerSearchTerm, setTrackerSearchTerm] = useState<string>('');
  const [copiedPromptPay, setCopiedPromptPay] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [mobilePaymentTab, setMobilePaymentTab] = useState<'single_device' | 'qr_scan'>('single_device');
  const [hasOneTapTriggered, setHasOneTapTriggered] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrLoading, setQrLoading] = useState<boolean>(false);

  // Guaranteed Auto-Dismissing Toast Notification System
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showToast = useCallback((msg: string, duration: number = 2800) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Instant Client-Side QR Code Generation (Zero-Latency, No external network failure)
  useEffect(() => {
    if (promptPayModal.open && promptPayModal.amount > 0) {
      setQrLoading(true);
      const payload = generatePromptPayPayload(PROMPTPAY_ID, promptPayModal.amount);
      QRCode.toDataURL(payload, {
        width: 360,
        margin: 1,
        color: {
          dark: '#0A0F1D',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      })
        .then((url) => {
          setQrDataUrl(url);
          setQrLoading(false);
        })
        .catch((err) => {
          console.error('QR code generation error:', err);
          setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`);
          setQrLoading(false);
        });
    }
  }, [promptPayModal.open, promptPayModal.amount]);

  const slipFileInputRef = useRef<HTMLInputElement>(null);

  // Calculate pricing
  const priceResult = useMemo(() => {
    return calculatePrice('wash', selectedSubOption);
  }, [selectedSubOption]);

  const currentPrice = priceResult.price;

  // Active Week Schedule
  const currentWeekSchedule = useMemo(() => {
    if (selectedWeekIdx < WEEKS_SCHEDULE.length) {
      return WEEKS_SCHEDULE[selectedWeekIdx];
    }
    return getWeekScheduleForDate(selectedDate);
  }, [selectedWeekIdx, selectedDate]);

  // Active Month Days for Month Calendar
  const currentMonthData = useMemo(() => {
    return ADVANCE_MONTHS[selectedMonthIdx] || ADVANCE_MONTHS[0];
  }, [selectedMonthIdx]);

  const monthCalendarDays = useMemo(() => {
    const { days, startOffset } = getCalendarDaysForMonth(currentMonthData.year, currentMonthData.month);
    const blanks: (CalendarDay | null)[] = Array(startOffset).fill(null);
    return [...blanks, ...days];
  }, [currentMonthData]);

  // 15-Minute Payment Countdown Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (promptPayModal.open && paymentCountdown > 0) {
      timer = setInterval(() => {
        setPaymentCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [promptPayModal.open, paymentCountdown]);

  // Global Escape Key Listener for Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (promptPayModal.open) setPromptPayModal({ open: false, type: 'booking', title: '', amount: 0 });
        if (adminPinModalOpen) setAdminPinModalOpen(false);
        if (walkInModalOpen) setWalkInModalOpen(false);
        if (cancelModalBooking) setCancelModalBooking(null);
        if (viewSlipModalUrl) setViewSlipModalUrl(null);
        if (lastConfirmedBooking) setLastConfirmedBooking(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [promptPayModal.open, adminPinModalOpen, walkInModalOpen, cancelModalBooking, viewSlipModalUrl, lastConfirmedBooking]);

  // Load Persisted Data from LocalStorage on Mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedBookings = localStorage.getItem('autoboutique_luxe_bookings');
        if (savedBookings) {
          const parsed = JSON.parse(savedBookings);
          if (Array.isArray(parsed) && parsed.length > 0) setBookings(parsed);
        }
        const savedActiveCar = localStorage.getItem('autoboutique_luxe_active_car_id');
        if (savedActiveCar) setActiveCarId(savedActiveCar);

        const savedStamps = localStorage.getItem('autoboutique_luxe_stamps');
        if (savedStamps) setStampsCount(parseInt(savedStamps, 10));

        const savedLocked = localStorage.getItem('autoboutique_luxe_locked_slots');
        if (savedLocked) setLockedSlots(JSON.parse(savedLocked));

        const savedLang = localStorage.getItem('autoboutique_luxe_lang') as Language;
        if (savedLang) setLang(savedLang);

        const savedTheme = localStorage.getItem('autoboutique_luxe_theme') as 'dark' | 'light';
        if (savedTheme) {
          setTheme(savedTheme);
          if (savedTheme === 'light') {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
          } else {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
          }
        }

        const savedAuth = sessionStorage.getItem('autoboutique_luxe_admin_auth');
        if (savedAuth === 'true') setIsAdminAuthenticated(true);

        const savedPackages = localStorage.getItem('autoboutique_luxe_customer_packages');
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setCustomerPackages(parsedPackages);
          }
        }

        // Live Supabase Cloud Sync (if configured)
        if (isSupabaseConfigured()) {
          fetchRemoteBookings().then((remoteData) => {
            if (remoteData && remoteData.length > 0) {
              const mapped: BookingRecord[] = remoteData.map((b: any) => ({
                id: b.id,
                timeSlot: b.time_slot,
                customerName: b.customer_name,
                phone: b.phone,
                carInfo: b.license_plate,
                serviceKey: 'wash',
                service: b.service_name || 'ล้างรถพรีเมียม & คลีนภายใน',
                subOptionId: b.sub_option ? 'custom' : 'standard',
                subOption: b.sub_option || 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน',
                date: b.booking_date,
                status: b.status === 'confirmed' ? 'step1' : b.status === 'washing' ? 'step2' : b.status === 'detailing' ? 'step3' : b.status === 'drying' ? 'step4' : b.status === 'ready' ? 'step5' : (b.status || 'pending'),
                createdAt: b.created_at || new Date().toISOString(),
                paidAmount: Number(b.total_price) || 500,
                paymentMethod: b.payment_method || 'promptpay',
                paymentStatus: 'paid',
                paymentSlipUrl: b.slip_url || undefined,
              }));
              setBookings(mapped);
            }
          });

          fetchRemotePackages().then((remotePkgs) => {
            if (remotePkgs && remotePkgs.length > 0) {
              const mappedPkgs: CustomerPackage[] = remotePkgs.map((p: any) => ({
                id: p.id,
                packageId: p.package_id || 'pkg-wash-12',
                serviceKey: 'wash',
                packageNameTh: p.package_name || 'Super Wash Pass (12 ครั้ง)',
                packageNameEn: p.package_name || 'Super Wash Pass (12 Passes)',
                customerName: p.customer_name || 'VIP Member',
                phone: p.customer_phone || '',
                carInfo: p.car_info || 'ไม่ระบุทะเบียน',
                totalQuota: p.total_quota || 12,
                remainingQuota: p.remaining_quota ?? ((p.total_quota || 12) - (p.used_quota || 0)),
                purchaseDate: p.purchased_date || new Date().toISOString(),
                expiryDate: '2027-12-31',
                status: (p.status as any) || 'active',
                pricePaid: Number(p.price) || 5000,
              }));
              setCustomerPackages(mappedPkgs);
            }
          });
        }
      }
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save Bookings
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('autoboutique_luxe_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Failed saving bookings:', e);
    }
  }, [bookings, isHydrated]);

  // Save Customer Packages
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('autoboutique_luxe_customer_packages', JSON.stringify(customerPackages));
    } catch (e) {
      console.warn('Failed saving packages:', e);
    }
  }, [customerPackages, isHydrated]);

  // Save Locked Slots
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('autoboutique_luxe_locked_slots', JSON.stringify(lockedSlots));
    } catch (e) {
      console.warn('Failed saving locked slots:', e);
    }
  }, [lockedSlots, isHydrated]);

  // Save Lang
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoboutique_luxe_lang', newLang);
    }
  };

  // Toggle Theme (Dark / Light Mode)
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('autoboutique_luxe_theme', nextTheme);
      if (nextTheme === 'light') {
        document.body.classList.add('theme-light');
        document.body.classList.remove('theme-dark');
      } else {
        document.body.classList.add('theme-dark');
        document.body.classList.remove('theme-light');
      }
    }
    showToast(
      isTh
        ? (nextTheme === 'light' ? '☀️ สลับสู่โหมดสว่าง (Executive Alabaster)' : '🌙 สลับสู่โหมดมืด (Midnight Obsidian)')
        : (nextTheme === 'light' ? '☀️ Switched to Light Mode' : '🌙 Switched to Dark Mode'),
      2500
    );
  };

  // Send LINE Flex Notification via API
  const sendLineNotification = async (payload: {
    type: 'booking_confirmed' | 'stage_update';
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
  }) => {
    try {
      const res = await fetch('/api/line-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setLineNotificationSuccess(
          isTh
            ? `📱 ข้อความ LINE แจ้งเตือนส่งถึง ${payload.customerName} สำเร็จแล้ว!`
            : `LINE notification sent to ${payload.customerName} successfully.`
        );
        setTimeout(() => setLineNotificationSuccess(null), 6000);
      }
    } catch (err) {
      console.warn('LINE notification dispatch failed:', err);
    }
  };

  // Process Slip File (Validation, Client-Side Canvas Compression to ~80KB, & Preview)
  const handleProcessSlipFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert(isTh ? 'กรุณาอัปโหลดไฟล์รูปภาพสลิปเท่านั้น (JPEG, PNG)' : 'Please upload an image file (JPEG, PNG)');
      return;
    }
    setSlipChecking(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          setUploadedSlipPreview(compressedDataUrl);
        } else {
          setUploadedSlipPreview(e.target?.result as string);
        }
        setSlipChecking(false);
        setSlipVerified(true);
      };
      img.onerror = () => {
        setSlipChecking(false);
        alert(isTh ? 'ไม่สามารถอ่านไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง' : 'Failed to read image file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Copy PromptPay Number (for Mobile & Desktop)
  const handleCopyPromptPay = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(PROMPTPAY_ID);
      }
      setCopiedPromptPay(true);
      setTimeout(() => setCopiedPromptPay(false), 2500);
      showToast(isTh ? `คัดลอกเลขพร้อมเพย์ ${formatPromptPayId(PROMPTPAY_ID)} แล้ว` : `Copied PromptPay ID: ${PROMPTPAY_ID}`, 2500);
    } catch {
      window.prompt(isTh ? 'คัดลอกเลขพร้อมเพย์:' : 'Copy PromptPay ID:', PROMPTPAY_ID);
    }
  };

  // Copy Exact Amount
  const handleCopyAmount = (amount: number) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(amount.toFixed(2));
      }
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2500);
      showToast(isTh ? `คัดลอกยอดเงิน ฿${amount.toLocaleString()}.00 แล้ว` : `Copied Amount: ฿${amount.toLocaleString()}.00`, 2500);
    } catch {
      window.prompt(isTh ? 'คัดลอกยอดเงิน:' : 'Copy amount:', amount.toFixed(2));
    }
  };

  // Download QR Code Image to Device (Instant offline base64 download)
  const handleDownloadQr = (amount: number) => {
    if (!qrDataUrl) {
      showToast(isTh ? 'กำลังสร้างภาพ QR Code กรุณารอสักครู่' : 'Generating QR Code...', 2000);
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = qrDataUrl;
      a.download = `autoboutique-promptpay-${amount}thb.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(isTh ? '📥 บันทึกภาพ QR Code ลงเครื่องเรียบร้อยแล้ว' : '📥 QR Code image saved to device', 2500);
    } catch {
      window.open(qrDataUrl, '_blank');
    }
  };

  // 1-Tap Mobile Pay: Saves QR image to album and copies PromptPay ID
  const handleOneTapMobilePay = (amount: number) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(PROMPTPAY_ID);
      }
      setCopiedPromptPay(true);
      setTimeout(() => setCopiedPromptPay(false), 3000);
    } catch {
      // fallback
    }

    handleDownloadQr(amount);
    setHasOneTapTriggered(true);

    showToast(
      isTh
        ? `📥 บันทึกรูป QR และคัดลอกเลขพร้อมเพย์ ${formatPromptPayId(PROMPTPAY_ID)} สำเร็จแล้ว!`
        : `📥 Saved QR to album & copied PromptPay ID!`,
      3000
    );
  };

  // Open Mobile Banking App via URL Scheme
  const handleOpenBankApp = (scheme: string, bankNameTh: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = scheme;
      setTimeout(() => {
        showToast(
          isTh
            ? `กำลังเปิดแอป ${bankNameTh}... หากไม่ขึ้นอัตโนมัติ กรุณาสลับไปเปิดแอปธนาคารที่ติดตั้งไว้`
            : `Opening ${bankNameTh}... If it doesn't open, switch to your banking app directly.`,
          3500
        );
      }, 600);
    }
  };

  // Open Payment Modal
  const handleOpenPromptPayModal = (type: 'booking' | 'package', title: string, amount: number, pkgId?: string) => {
    setPromptPayModal({ open: true, type, title, amount, pkgId });
    setUploadedSlipPreview(null);
    setSlipVerified(false);
    setPaymentCountdown(900); // 15:00
    setMobilePaymentTab('single_device');
    setHasOneTapTriggered(false);
  };

  // Confirm booking & payment
  const handleCompleteBookingPayment = async (
    paymentMethod: 'promptpay' | 'package',
    pkgId?: string
  ) => {
    const newBookingId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const cleanSubOpt = SERVICE_SUB_OPTIONS.wash.find((s) => s.id === selectedSubOption);

    const newRecord: BookingRecord = {
      id: newBookingId,
      timeSlot: bookingTimeSlot,
      customerName: formName.trim() || 'คุณลูกค้า VIP',
      phone: formPhone.trim() || '066-109-8306',
      carInfo: formCar.trim() || 'รถยนต์ลูกค้า (ภูเก็ต)',
      serviceKey: 'wash',
      service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
      subOptionId: selectedSubOption,
      subOption: isTh ? cleanSubOpt?.labelTh : cleanSubOpt?.labelEn,
      date: selectedDate,
      vipDelivery,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paidAmount: paymentMethod === 'package' ? 0 : currentPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'package' ? 'package_redeemed' : 'paid',
      usedPackageId: pkgId || undefined,
      paymentSlipUrl: uploadedSlipPreview || undefined,
    };

    // Deduct package quota if applicable
    if (paymentMethod === 'package' && pkgId) {
      setCustomerPackages((prev) =>
        prev.map((p) => {
          if (p.id === pkgId) {
            const nextQuota = Math.max(0, p.remainingQuota - 1);
            return {
              ...p,
              remainingQuota: nextQuota,
              status: nextQuota === 0 ? 'exhausted' : 'active',
            };
          }
          return p;
        })
      );
      setSelectedPackageIdToRedeem(null);
    }

    // Add booking to state
    setBookings((prev) => [newRecord, ...prev]);
    setActiveCarId(newBookingId);
    setLastConfirmedBooking(newRecord);
    setPromptPayModal({ open: false, type: 'booking', title: '', amount: 0 });
    setUploadedSlipPreview(null);
    setSlipVerified(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#FFFFFF'],
      });
    } catch (e) {}

    // Send LINE Push Notification
    await sendLineNotification({
      type: 'booking_confirmed',
      bookingId: newRecord.id,
      customerName: newRecord.customerName,
      phone: newRecord.phone,
      carInfo: newRecord.carInfo,
      service: newRecord.service,
      timeSlot: newRecord.timeSlot,
      date: newRecord.date,
      paidAmount: newRecord.paidAmount,
      paymentMethod: newRecord.paymentMethod,
      stageName: 'รับรถ & ตรวจสภาพก่อนล้าง',
      stageNumber: 1,
    });

    // Sync to Cloud Database (Supabase) if configured
    upsertRemoteBooking({
      id: newRecord.id,
      customerName: newRecord.customerName,
      phone: newRecord.phone,
      licensePlate: newRecord.carInfo,
      serviceName: newRecord.service,
      subOption: newRecord.subOption,
      bookingDate: newRecord.date,
      timeSlot: newRecord.timeSlot,
      totalPrice: newRecord.paidAmount,
      paymentMethod: newRecord.paymentMethod,
      slipUrl: newRecord.paymentSlipUrl,
      status: 'confirmed',
    });

    showToast(
      isTh
        ? `✅ บันทึกนัดหมายสำเร็จ! รหัส ${newBookingId} ส่งการแจ้งเตือนยืนยันเรียบร้อย`
        : `Appointment Confirmed #${newBookingId}! Notification dispatched.`,
      4500
    );
  };

  // Handle Purchasing New Package Pass
  const handleCompletePackagePurchase = (pkgId: string) => {
    const pkgDeal = OFFICIAL_PACKAGES.find((p) => p.id === pkgId);
    if (!pkgDeal) return;

    const newCustPkg: CustomerPackage = {
      id: `CPKG-${String(customerPackages.length + 1).padStart(3, '0')}`,
      packageId: pkgDeal.id,
      serviceKey: 'wash',
      packageNameTh: pkgDeal.nameTh,
      packageNameEn: pkgDeal.nameEn,
      customerName: formName.trim() || 'คุณลูกค้า VIP',
      phone: formPhone.trim() || '066-109-8306',
      carInfo: formCar.trim() || 'รถยนต์สมาชิก (ภูเก็ต)',
      totalQuota: pkgDeal.totalUses,
      remainingQuota: pkgDeal.totalUses,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + pkgDeal.validityDays * 86400000).toISOString().split('T')[0],
      status: 'active',
      pricePaid: pkgDeal.price,
    };

    setCustomerPackages((prev) => [newCustPkg, ...prev]);
    setPromptPayModal({ open: false, type: 'package', title: '', amount: 0 });
    setUploadedSlipPreview(null);
    setSlipVerified(false);

    upsertRemotePackage({
      id: newCustPkg.id,
      customerPhone: newCustPkg.phone,
      customerName: newCustPkg.customerName,
      packageName: newCustPkg.packageNameTh,
      totalQuota: newCustPkg.totalQuota,
      usedQuota: 0,
      price: newCustPkg.pricePaid,
      status: 'active',
      purchasedDate: newCustPkg.purchaseDate,
    });

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    showToast(
      isTh
        ? `🎉 เปิดใช้งานแพ็คเกจ ${pkgDeal.nameTh} สำเร็จ! ได้รับโควตา ${pkgDeal.totalUses} ครั้งเรียบร้อย`
        : `Package ${pkgDeal.nameEn} activated successfully!`,
      4500
    );
  };

  // Admin PIN Auth
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verifyAdminPin(pinInput)) {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('autoboutique_luxe_admin_auth', 'true');
      }
      setAdminPinModalOpen(false);
      setPinInput('');
      setPinError(false);
      setView('admin');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  // Admin Stage Advancement
  const handleUpdateBookingStage = async (id: string, newStatus: BookingRecord['status']) => {
    const targetBooking = bookings.find((b) => b.id === id);
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    if (targetBooking) {
      const stageNum = mapStatusToStage(newStatus);
      const stageInfo = getStageDetails(stageNum, isTh);

      await sendLineNotification({
        type: 'stage_update',
        bookingId: targetBooking.id,
        customerName: targetBooking.customerName,
        phone: targetBooking.phone,
        carInfo: targetBooking.carInfo,
        service: targetBooking.service,
        timeSlot: targetBooking.timeSlot,
        date: targetBooking.date,
        stageName: isTh ? stageInfo.titleTh : stageInfo.titleEn,
        stageNumber: stageNum,
        stagePhotoUrl: stageInfo.photoUrl,
      });

      // Sync updated stage to Supabase
      updateRemoteBookingStatus(id, newStatus);
    }

    showToast(
      isTh ? `🔄 อัปเดตสถานะคิว ${id} และส่งแจ้งเตือน LINE เรียบร้อย` : `Stage updated for ${id}`,
      3000
    );
  };

  // Admin Create Walk-in (Flat ฿500 Base Rate)
  const handleCreateWalkIn = () => {
    if (!walkInName.trim() || !walkInCar.trim()) {
      showToast(isTh ? 'กรุณากรอกชื่อและทะเบียนรถ' : 'Please fill all fields', 2500);
      return;
    }
    const newId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const newRecord: BookingRecord = {
      id: newId,
      timeSlot: '09:30',
      customerName: walkInName.trim(),
      phone: walkInPhone.trim() || '066-109-8306',
      carInfo: walkInCar.trim(),
      serviceKey: 'wash',
      service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
      subOptionId: 'standard',
      subOption: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน (Walk-in)',
      date: adminSelectedDate,
      status: 'step1',
      createdAt: new Date().toISOString(),
      paidAmount: priceResult.price, // ฿500
      paymentMethod: 'promptpay',
      paymentStatus: 'paid',
    };

    setBookings((prev) => [newRecord, ...prev]);
    upsertRemoteBooking({
      id: newRecord.id,
      customerName: newRecord.customerName,
      phone: newRecord.phone,
      licensePlate: newRecord.carInfo,
      serviceName: newRecord.service,
      subOption: newRecord.subOption,
      bookingDate: newRecord.date,
      timeSlot: newRecord.timeSlot,
      totalPrice: newRecord.paidAmount,
      paymentMethod: newRecord.paymentMethod,
      status: 'step1',
    });
    setWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInCar('');

    showToast(
      isTh ? `🚗 บันทึกคิว Walk-in ${newId} (฿${priceResult.price}) เรียบร้อย` : 'Walk-in booking created',
      2500
    );
  };

  // Admin Cancel Booking with 15-Minute Policy Enforcement
  const handleConfirmCancelBooking = () => {
    if (!cancelModalBooking) return;
    const policyResult = checkCancellationPackagePolicy(cancelModalBooking);

    if (policyResult.isPackageBooking && policyResult.willRefundQuota && cancelModalBooking.usedPackageId) {
      setCustomerPackages((prev) =>
        prev.map((p) => {
          if (p.id === cancelModalBooking.usedPackageId) {
            const refunded = Math.min(p.totalQuota, p.remainingQuota + 1);
            return {
              ...p,
              remainingQuota: refunded,
              status: 'active',
            };
          }
          return p;
        })
      );
    }

    setBookings((prev) => prev.filter((b) => b.id !== cancelModalBooking.id));
    updateRemoteBookingStatus(cancelModalBooking.id, 'cancelled');
    setCancelModalBooking(null);

    showToast(
      policyResult.isPackageBooking
        ? policyResult.messageTh
        : isTh
        ? `🗑️ ยกเลิกคิว ${cancelModalBooking.id} เรียบร้อย`
        : 'Booking cancelled',
      3500
    );
  };

  // Admin Edit Package Quota (+1 or -1)
  const handleAdjustPackageQuota = (packageId: string, delta: number) => {
    setCustomerPackages((prev) =>
      prev.map((p) => {
        if (p.id === packageId) {
          const updated = Math.max(0, Math.min(p.totalQuota, p.remainingQuota + delta));
          return {
            ...p,
            remainingQuota: updated,
            status: updated === 0 ? 'exhausted' : 'active',
          };
        }
        return p;
      })
    );
    showToast(isTh ? '✅ อัปเดตโควตาแพ็คเกจเรียบร้อย' : 'Package quota adjusted', 2500);
  };

  // Admin Cancel Package
  const handleCancelPackage = (packageId: string) => {
    if (!window.confirm(isTh ? 'คุณต้องการยกเลิกแพ็คเกจนี้ใช่หรือไม่?' : 'Cancel this package?')) return;
    setCustomerPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, status: 'cancelled' } : p))
    );
    showToast(isTh ? '🗑️ ยกเลิกแพ็คเกจเรียบร้อย' : 'Package cancelled', 2500);
  };

  // Admin Toggle Slot Lock
  const handleToggleLockSlot = (date: string, slot: string) => {
    const isLocked = lockedSlots.some((l) => l.date === date && l.slot === slot);
    if (isLocked) {
      setLockedSlots((prev) => prev.filter((l) => !(l.date === date && l.slot === slot)));
      showToast(isTh ? `ปลดล็อคช่องบริการ ${slot} เรียบร้อย` : `Unlocked slot ${slot}`, 2500);
    } else {
      setLockedSlots((prev) => [...prev, { date, slot }]);
      showToast(isTh ? `ล็อคช่องบริการ ${slot} เรียบร้อย` : `Locked slot ${slot}`, 2500);
    }
  };

  // Admin Daily Financial Metrics
  const adminMetrics = useMemo(() => {
    const daysBookings = bookings.filter((b) => b.date === adminSelectedDate);
    const activeDaysBookings = daysBookings.filter((b) => b.status !== 'cancelled');
    const revenue = activeDaysBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
    const completed = activeDaysBookings.filter((b) => b.status === 'ready').length;
    const inProgress = activeDaysBookings.filter((b) => ['step1', 'step2', 'step3', 'step4'].includes(b.status)).length;
    const pending = activeDaysBookings.filter((b) => b.status === 'pending').length;
    const totalSlots = TIME_SLOTS.length * 2; // 2 bays
    const capacityPct = Math.min(100, Math.round((activeDaysBookings.length / totalSlots) * 100));

    return {
      revenue,
      completed,
      inProgress,
      pending,
      totalCount: activeDaysBookings.length,
      capacityPct,
    };
  }, [bookings, adminSelectedDate]);

  // Admin Filtered Bookings
  const adminFilteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (b.date !== adminSelectedDate) return false;
      if (adminBookingFilter === 'pending') return b.status === 'pending';
      if (adminBookingFilter === 'inprogress') return ['step1', 'step2', 'step3', 'step4'].includes(b.status);
      if (adminBookingFilter === 'ready') return b.status === 'ready';
      if (adminBookingFilter === 'cancelled') return b.status === 'cancelled';
      return true;
    }).filter((b) => {
      if (!adminSearchTerm.trim()) return true;
      const q = adminSearchTerm.toLowerCase().trim();
      const cleanNums = q.replace(/[^0-9]/g, '');
      return (
        b.carInfo.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        (cleanNums.length >= 3 && b.phone.replace(/[^0-9]/g, '').includes(cleanNums))
      );
    });
  }, [bookings, adminSelectedDate, adminBookingFilter, adminSearchTerm]);

  // Active Vehicle in Live Tracker
  const activeCarRecord = useMemo(() => {
    if (trackerSearchTerm.trim()) {
      const q = trackerSearchTerm.toLowerCase().trim();
      const cleanNums = q.replace(/[^0-9]/g, '');
      const matched = bookings.find(
        (b) =>
          b.carInfo.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          (cleanNums.length >= 3 && b.phone.replace(/[^0-9]/g, '').includes(cleanNums))
      );
      if (matched) return matched;
    }
    return bookings.find((b) => b.id === activeCarId) || bookings[0];
  }, [bookings, activeCarId, trackerSearchTerm]);

  const activeStageNumber = activeCarRecord ? mapStatusToStage(activeCarRecord.status) : 1;
  const activeStageInfo = getStageDetails(activeStageNumber, isTh);
  const estimatedCompletionTime = activeCarRecord ? getEstimatedCompletion(activeCarRecord.timeSlot) : '10:30';

  // Format countdown mm:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#080C14] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs tracking-widest text-blue-400 uppercase font-semibold">Autoboutique Phuket • Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === 'light' ? 'theme-light bg-[#F8FAFC] text-slate-900' : 'theme-dark bg-[#080C14] text-slate-100'
      } flex flex-col items-center ambient-cobalt-glow selection:bg-blue-600 selection:text-white transition-colors duration-300`}
    >
      {/* Toast Notification Banner (Auto-dismissing & Interactive Dismiss) */}
      {toastMessage && (
        <div
          onClick={() => setToastMessage(null)}
          className="fixed top-4 z-[70] max-w-sm sm:max-w-md mx-auto px-4 py-2.5 rounded-full bg-slate-900/95 text-blue-100 border border-blue-500/50 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2.5 cursor-pointer transition hover:scale-105 active:scale-95"
          role="status"
          aria-live="polite"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <span className="truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setToastMessage(null);
            }}
            className="ml-auto text-slate-400 hover:text-white p-0.5 rounded-full"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* LINE Notification Banner */}
      {lineNotificationSuccess && (
        <div className="fixed top-16 z-50 px-5 py-3 rounded-full bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 text-xs md:text-sm font-medium shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-2.5">
          <BadgeCheck className="w-4 h-4 text-emerald-400" />
          <span>{lineNotificationSuccess}</span>
        </div>
      )}

      {/* Main Container - Dual Ergonomics for Mobile and Desktop Centered */}
      <div
        className={`w-full max-w-4xl mx-auto flex flex-col min-h-screen border-x ${
          theme === 'light' ? 'border-slate-200 bg-white/95' : 'border-slate-900/80 bg-[#080C14]/90'
        } backdrop-blur-md transition-colors duration-300`}
      >
        
        {/* =========================================================================
            EXECUTIVE BRAND HEADER
            ========================================================================= */}
        <header
          className={`border-b ${
            theme === 'light' ? 'border-slate-200 bg-white/90' : 'border-slate-800/80 bg-[#0B0F19]/90'
          } sticky top-0 z-40 backdrop-blur-md px-4 py-3.5 md:px-6 transition-colors duration-300`}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Brand Logo & Heritage */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-400/30">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-lg font-bold tracking-tight text-white uppercase font-sans">
                    Autoboutique <span className="text-blue-500 font-light">Phuket</span>
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 uppercase tracking-wider">
                    C-Cube Automotive
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-normal">
                  {isTh ? 'สตูดิโอดักฝุ่น & ล้างรถระดับพรีเมียม (Est. 2008)' : 'Luxury Automotive Detailing Studio (Est. 2008)'}
                </p>
              </div>
            </div>

            {/* Top Right: Hotline, Language & Theme Mode */}
            <div className="flex items-center gap-2 md:gap-3">
              <a
                href="tel:0661098306"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium">066 109 8306</span>
              </a>

              {/* Language Selector */}
              <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-xs">
                {(['th', 'en', 'ru'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLanguageChange(l)}
                    className={`px-2 py-1 rounded-md font-medium text-[11px] uppercase transition ${
                      lang === l
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Luxury Theme Switcher (Dark / Light) */}
              <button
                type="button"
                onClick={handleToggleTheme}
                className={`p-1.5 rounded-lg border text-xs font-semibold transition flex items-center gap-1.5 active:scale-95 ${
                  theme === 'light'
                    ? 'bg-amber-100/90 text-amber-900 border-amber-300/80 hover:bg-amber-200 shadow-sm'
                    : 'bg-slate-900/80 text-blue-300 border-slate-800 hover:text-white hover:border-blue-500/50'
                }`}
                title={theme === 'dark' ? (isTh ? 'สลับเป็นโหมดสว่าง' : 'Switch to Light Mode') : (isTh ? 'สลับเป็นโหมดมืด' : 'Switch to Dark Mode')}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline text-[11px] font-medium">{isTh ? 'สว่าง' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-700" />
                    <span className="hidden sm:inline text-[11px] font-medium">{isTh ? 'มืด' : 'Dark'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Operating Status Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-900/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-300 font-medium">
                {isTh ? 'สตูดิโอเปิดบริการ: จันทร์ - เสาร์ (08:30 - 17:30 น.)' : 'Studio Hours: Mon - Sat (08:30 - 17:30)'}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-500">
              {isTh ? '📍 ถนนเฉลิมพระเกียรติ ร.9 (บายพาส) ภูเก็ต' : 'Phuket Bypass Road'}
            </span>
          </div>

          {/* =========================================================================
              EXECUTIVE SEGMENTED NAVIGATION BAR
              ========================================================================= */}
          <nav className="mt-3 grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
            <button
              onClick={() => setView('booking')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition ${
                view === 'booking'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="truncate">{isTh ? 'นัดหมายบริการ' : 'Appointment'}</span>
            </button>

            <button
              onClick={() => setView('packages')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition ${
                view === 'packages'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="truncate">{isTh ? 'แพ็คเกจเหมาจ่าย' : 'Passes'}</span>
            </button>

            <button
              onClick={() => setView('tracker')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition ${
                view === 'tracker'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="truncate">{isTh ? 'ติดตามสถานะ' : 'Live Tracker'}</span>
            </button>

            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setView('admin');
                } else {
                  setAdminPinModalOpen(true);
                }
              }}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-medium transition ${
                view === 'admin'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg shadow-blue-900/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="truncate">{isTh ? 'ผู้ดูแลระบบ' : 'Admin'}</span>
            </button>
          </nav>
        </header>

        {/* =========================================================================
            TAB 1: APPOINTMENT CONCIERGE (นัดหมายบริการ)
            ========================================================================= */}
        {view === 'booking' && (
          <main className="p-4 md:p-6 space-y-6 flex-1">
            {/* Step Indicator Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="autoboutique-title-bar">
                <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                  CONCIERGE BOOKING
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {isTh ? 'นัดหมายเข้ารับบริการล้างสี & ดีเทลลิ่ง' : 'Reserve Studio Detailing Appointment'}
                </h2>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                <span className="text-blue-400 font-bold">1</span>
                <span>/</span>
                <span>3</span>
                <span className="hidden sm:inline text-slate-500 ml-1">{isTh ? 'ขั้นตอน' : 'Steps'}</span>
              </div>
            </div>

            {/* STEP 1: SERVICE HERO & STUDIO ADD-ONS */}
            <section className="luxe-panel rounded-2xl p-4 md:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider">
                      STUDIO BASE
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-white">
                      {isTh ? selectedService.titleTh : selectedService.titleEn}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    {isTh
                      ? 'บริการล้างสี ดูดฝุ่น พ่นโฟม pH 7 ทำความสะอาดซุ้มล้อและคราบน้ำมัน ปลอดภัยต่อสีและฟิล์ม PPF ทุกชนิด'
                      : 'Comprehensive pH 7 active foam wash, wheel barrel detailing, and interior microfiber sanitization.'}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-2xl md:text-3xl font-extrabold text-blue-400 font-sans tracking-tight">
                    ฿{currentPrice.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isTh ? 'ราคาเดียวมาตรฐาน (ไม่แบ่งขนาดรถ)' : 'Flat Rate (No Car Size Matrix)'}
                  </p>
                </div>
              </div>

              {/* Studio Detailing Specifications Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{isTh ? 'ระยะเวลา' : 'Duration'}</p>
                    <p className="font-semibold text-slate-200">1 {isTh ? 'ชั่วโมง' : 'Hour'}</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{isTh ? 'ผลิตภัณฑ์' : 'Product'}</p>
                    <p className="font-semibold text-slate-200">pH 7 Premium</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{isTh ? 'เทคนิค' : 'Technique'}</p>
                    <p className="font-semibold text-slate-200">Two-Bucket 100%</p>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400">{isTh ? 'การรับประกัน' : 'Guarantee'}</p>
                    <p className="font-semibold text-slate-200">24 ชม. กันน้ำฝน</p>
                  </div>
                </div>
              </div>

              {/* Studio Detailing Add-ons */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isTh ? 'ตัวเลือกเสริมระดับสตูดิโอ (Studio Detailing Add-ons):' : 'Select Studio Detailing Options:'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICE_SUB_OPTIONS.wash.map((opt) => {
                    const isSelected = selectedSubOption === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedSubOption(opt.id)}
                        className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-950/40'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <CheckCheck className="w-3 h-3" />}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">
                              {isTh ? opt.labelTh : opt.labelEn}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {opt.addPrice > 0 ? `+฿${opt.addPrice} บาท` : isTh ? 'รวมในแพ็กเกจแล้ว' : 'Included in Base'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-400 shrink-0">
                          {opt.addPrice > 0 ? `+฿${opt.addPrice}` : '฿0'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* STEP 2: INTERACTIVE APPOINTMENT CALENDAR & BAY SLOTS */}
            <section className="luxe-panel rounded-2xl p-4 md:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                    {isTh ? 'วันและเวลาเข้ารับบริการ' : 'Select Schedule & Bay Slot'}
                  </h3>
                </div>

                {/* Week/Month View Switcher */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('week')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                      calendarViewMode === 'week' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {isTh ? 'รายสัปดาห์' : 'Week'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalendarViewMode('month')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                      calendarViewMode === 'month' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {isTh ? 'รายเดือน' : 'Month'}
                  </button>
                </div>
              </div>

              {/* View 1: Week Mode */}
              {calendarViewMode === 'week' && (
                <div className="space-y-3">
                  {/* Week Selector Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {WEEKS_SCHEDULE.map((w, idx) => (
                      <button
                        key={w.weekIndex}
                        type="button"
                        onClick={() => setSelectedWeekIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg border shrink-0 text-xs font-medium transition ${
                          selectedWeekIdx === idx
                            ? 'bg-blue-900/40 border-blue-500 text-blue-200 font-semibold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isTh ? w.monthTh : w.monthEn} ({isTh ? `สัปดาห์ที่ ${w.weekIndex + 1}` : `Week ${w.weekIndex + 1}`})
                      </button>
                    ))}
                  </div>

                  {/* Day Cards in Week */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {currentWeekSchedule.dates.map((day) => {
                      const isSelected = selectedDate === day.dateStr;
                      return (
                        <button
                          key={day.dateStr}
                          type="button"
                          disabled={day.isClosed}
                          onClick={() => {
                            if (!day.isClosed) setSelectedDate(day.dateStr);
                          }}
                          className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[78px] ${
                            day.isClosed
                              ? 'bg-slate-950/40 border-slate-900 opacity-40 cursor-not-allowed text-slate-600'
                              : isSelected
                              ? 'bg-blue-900/50 border-blue-500 shadow-md shadow-blue-900/30'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <span className="text-[11px] uppercase font-medium">{isTh ? day.dayTh : day.dayEn}</span>
                          <span className="text-base font-bold my-0.5 text-white">{day.dateNum}</span>
                          <span className="text-[10px] text-slate-400">
                            {day.isClosed ? (isTh ? 'ปิดทำการ' : 'Closed') : (isTh ? currentWeekSchedule.monthTh : currentWeekSchedule.monthEn)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 2: Month Mode */}
              {calendarViewMode === 'month' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      {isTh ? currentMonthData.labelTh : currentMonthData.labelEn}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {ADVANCE_MONTHS.map((m, idx) => (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setSelectedMonthIdx(idx)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                            selectedMonthIdx === idx
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {isTh ? m.shortTh : m.shortEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                    {['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map((d, i) => (
                      <span key={d} className={`py-1 text-[11px] font-semibold ${i === 6 ? 'text-red-400' : 'text-slate-400'}`}>
                        {d}
                      </span>
                    ))}
                    {monthCalendarDays.map((d, idx) => {
                      if (!d) return <div key={idx} className="h-9" />;
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <button
                          key={d.dateStr}
                          type="button"
                          disabled={d.isClosed}
                          onClick={() => {
                            if (!d.isClosed) setSelectedDate(d.dateStr);
                          }}
                          className={`h-9 rounded-lg border text-xs font-semibold transition flex items-center justify-center ${
                            d.isClosed
                              ? 'bg-slate-950 border-slate-900 text-slate-600 opacity-40 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-600 border-blue-400 text-white'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
                          }`}
                        >
                          {d.dayNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Time Slots Selection Matrix */}
              <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">
                    {isTh ? 'รอบเวลาบริการ (Studio Bay Capacity: 2 ช่องบริการ/รอบ):' : 'Select Time Slot:'}
                  </span>
                  <span className="text-[11px] text-blue-400 font-medium">
                    {formatBookingDate(selectedDate, lang)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const lockedKeys = lockedSlots.map((l) => `${l.date}_${l.slot}`);
                    const avail = getSlotAvailability(selectedDate, slot, bookings, lockedKeys);
                    const isSelected = bookingTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={avail.isFull}
                        onClick={() => setBookingTimeSlot(slot)}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                          avail.isFull
                            ? 'bg-slate-950/50 border-slate-900 text-slate-600 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-900/50 border-blue-500 shadow-md shadow-blue-900/30'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <span className="text-sm font-bold text-white">{slot} น.</span>
                        <span
                          className={`text-[10px] mt-1 font-medium px-1.5 py-0.5 rounded-full ${
                            avail.isFull
                              ? 'bg-red-950/60 text-red-400 border border-red-900/50'
                              : avail.available === 1
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-900/50'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/50'
                          }`}
                        >
                          {avail.isFull
                            ? isTh ? 'เต็มแล้ว' : 'Full'
                            : isTh
                            ? `ว่าง ${avail.available} ช่อง`
                            : `${avail.available} Left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* STEP 3: CLIENT & VEHICLE PROFILE */}
            <section className="luxe-panel rounded-2xl p-4 md:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
                <Car className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                  {isTh ? 'ข้อมูลลูกค้าและรถยนต์' : 'Client & Vehicle Profile'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Client Full Name */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">
                    {isTh ? 'ชื่อ-นามสกุล ผู้ติดต่อ' : 'Client Full Name'}:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isTh ? 'ระบุชื่อ-นามสกุล ของท่าน' : 'e.g. John Doe'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Mobile Number with Auto-formatting and Live Validation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-medium">
                      {isTh ? 'เบอร์โทรศัพท์มือถือ' : 'Mobile Phone'}:
                    </label>
                    {formPhone && (
                      <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                        isValidThaiPhone(formPhone) ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {isValidThaiPhone(formPhone) ? '✓ ถูกต้อง' : '10 หลัก (08X-XXX-XXXX)'}
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={12}
                    placeholder="08X-XXX-XXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(formatPhoneInput(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>

                {/* Vehicle Model & License Plate */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-300 font-medium">
                    {isTh ? 'ยี่ห้อ รุ่น และทะเบียนรถยนต์' : 'Vehicle Model & License Plate'}:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isTh ? 'ระบุยี่ห้อ รุ่น และเลขทะเบียน (เช่น Honda Civic กข 1234 ภูเก็ต)' : 'e.g. Honda Civic (1กข 1234 Phuket)'}
                    value={formCar}
                    onChange={(e) => setFormCar(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* VIP Pick-up / Delivery Service Toggle */}
                <div className="sm:col-span-2 pt-1">
                  <label className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between cursor-pointer hover:border-slate-700 transition">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={vipDelivery}
                        onChange={(e) => setVipDelivery(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {isTh ? 'ต้องการบริการ รับ-ส่ง รถยนต์ระดับ VIP (Phuket Concierge Delivery)' : 'Request VIP Vehicle Delivery'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {isTh ? 'เจ้าหน้าที่จะโทรยืนยันสถานที่รับรถล่วงหน้า 30 นาที' : 'Concierge team will contact for pickup coordination'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-400 shrink-0">FREE</span>
                  </label>
                </div>
              </div>
            </section>

            {/* ACTION BAR: PROCEED TO PAYMENT & VERIFICATION */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-300 font-medium">
                  {isTh ? 'สรุปยอดนัดหมายเข้ารับบริการ' : 'Appointment Total:'}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-extrabold text-white">฿{currentPrice.toLocaleString()}</span>
                  <span className="text-xs text-blue-400 font-medium">
                    {isTh ? '(รวมภาษีและผลิตภัณฑ์สตูดิโอ)' : '(Net Total)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* If Client has Package Pass, Show Redeem Option */}
                {customerPackages.some((p) => p.status === 'active' && p.remainingQuota > 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      const availPkg = customerPackages.find((p) => p.status === 'active' && p.remainingQuota > 0);
                      if (availPkg) {
                        handleCompleteBookingPayment('package', availPkg.id);
                      }
                    }}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-slate-900 border border-blue-500/40 text-blue-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4 text-blue-400" />
                    <span>{isTh ? 'ใช้สิทธิ์แพ็คเกจ (฿0)' : 'Redeem Pass'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleOpenPromptPayModal('booking', isTh ? 'ชำระค่านัดหมายบริการล้างรถ' : 'Studio Detailing Appointment', currentPrice);
                  }}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs md:text-sm font-bold shadow-lg shadow-blue-900/40 transition flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{isTh ? 'สแกน QR Code & แนบสลิปจองคิว' : 'Scan PromptPay & Confirm'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </main>
        )}

        {/* =========================================================================
            TAB 2: STUDIO PRIVILEGE PASSES (แพ็คเกจเหมาจ่าย)
            ========================================================================= */}
        {view === 'packages' && (
          <main className="p-4 md:p-6 space-y-6 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="autoboutique-title-bar">
                <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                  STUDIO PRIVILEGE PASSES
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {isTh ? 'เอกสิทธิ์แพ็คเกจล้างรถเหมาจ่ายสุดคุ้ม' : 'Official Studio Prepaid Wash Passes'}
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 font-semibold">
                {isTh ? 'ประหยัดสูงสุด ฿1,300' : 'Save up to ฿1,300'}
              </span>
            </div>

            {/* Official Package Passes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OFFICIAL_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`luxe-panel rounded-2xl p-5 flex flex-col justify-between relative transition ${
                    pkg.popular ? 'border-blue-500/50 shadow-xl shadow-blue-950/50' : 'hover:border-slate-700'
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow uppercase tracking-wider">
                      {isTh ? pkg.badgeTh : 'POPULAR'}
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        {isTh ? pkg.nameTh : pkg.nameEn}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {isTh ? pkg.descriptionTh : pkg.descriptionEn}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-blue-400 font-sans">
                          ฿{pkg.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          ฿{(pkg.singlePrice * pkg.totalUses).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {isTh ? `ประหยัดทันที ฿${pkg.savings.toLocaleString()} บาท` : `Save ฿${pkg.savings}`}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{isTh ? 'จำนวนครั้งที่ได้รับ' : 'Total Sessions'}:</span>
                      <span className="text-slate-200 font-bold">{pkg.totalUses} ครั้ง</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{isTh ? 'อายุการใช้งาน' : 'Validity'}:</span>
                      <span className="text-slate-200 font-bold">{pkg.validityDays} วัน</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleOpenPromptPayModal('package', isTh ? `ชำระเงิน ${pkg.nameTh}` : pkg.nameEn, pkg.price, pkg.id);
                      }}
                      className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{isTh ? 'ซื้อแพ็คเกจนี้ (PromptPay)' : 'Purchase Pass'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Studio 15-Minute Cancellation Policy Notice Card */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{isTh ? 'เงื่อนไขและนโยบายการยกเลิกนัดหมาย (Studio Cancellation Terms):' : 'Studio Cancellation Policy:'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                {isTh
                  ? '• หากท่านกดยกเลิกนัดหมาย "ภายใน 15 นาที" นับจากเวลาที่ยืนยันจอง ระบบจะคืนสิทธิ์โควตา 1 ครั้งเข้าแพ็คเกจให้โดยอัตโนมัติทันที'
                  : '• Cancellations made within 15 minutes of booking creation will automatically receive a 100% quota refund back to the pass.'}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pl-6">
                {isTh
                  ? '• หากยกเลิก "เกิน 15 นาที" จะถือว่าใช้สิทธิ์ 1 ครั้งของแพ็คเกจตามนโยบายรักษาช่องบริการของสตูดิโอ'
                  : '• Cancellations made after 15 minutes will forfeit 1 package credit per studio bay allocation policy.'}
              </p>
            </div>

            {/* Active Customer Passes Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-400" />
                <span>{isTh ? 'แพ็คเกจของคุณที่พร้อมใช้งาน (Active Customer Passes)' : 'Your Active Passes'}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customerPackages.map((cp) => (
                  <div
                    key={cp.id}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">{cp.id}</span>
                        <h4 className="text-sm font-bold text-white">{isTh ? cp.packageNameTh : cp.packageNameEn}</h4>
                        <p className="text-[11px] text-slate-400">{cp.customerName} • {cp.phone}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                        cp.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {cp.status}
                      </span>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{isTh ? 'สิทธิ์คงเหลือ' : 'Remaining'}:</span>
                        <span className="font-bold text-blue-400">{cp.remainingQuota} / {cp.totalQuota} {isTh ? 'ครั้ง' : 'Passes'}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${(cp.remainingQuota / cp.totalQuota) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">
                        {isTh ? `หมดอายุ: ${cp.expiryDate}` : `Exp: ${cp.expiryDate}`}
                      </span>
                      {cp.status === 'active' && cp.remainingQuota > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setView('booking');
                            showToast(isTh ? 'เลือกวันและเวลานัดหมายเพื่อใช้สิทธิ์แพ็คเกจ' : 'Select schedule to redeem pass', 3500);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                        >
                          {isTh ? 'ใช้สิทธิ์จองคิวทันที' : 'Use Pass'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* =========================================================================
            TAB 3: LIVE DETAILING TRACKER (ติดตามสถานะรถสด)
            ========================================================================= */}
        {view === 'tracker' && (
          <main className="p-4 md:p-6 space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="autoboutique-title-bar">
                <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                  LIVE DETAILING MONITOR
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {isTh ? 'ระบบตรวจสอบสถานะการล้างรถสด' : 'Live Detailing Tracking System'}
                </h2>
              </div>

              {/* Vehicle Search / Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder={isTh ? 'ค้นหาทะเบียนรถ / รหัสจอง' : 'Search plate or ID...'}
                  value={trackerSearchTerm}
                  onChange={(e) => setTrackerSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Active Vehicle Status Card */}
            {activeCarRecord ? (
              <div className="space-y-6">
                <div className="luxe-panel rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                        <span className="text-xs font-bold text-blue-400 uppercase font-mono">{activeCarRecord.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-semibold border border-blue-800/60">
                          {isTh ? 'กำลังดำเนินการ' : 'In Progress'}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-white mt-1">
                        {activeCarRecord.carInfo}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {activeCarRecord.customerName} • {activeCarRecord.phone}
                      </p>
                    </div>

                    <div className="text-left sm:text-right bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{isTh ? 'เวลาส่งมอบโดยประมาณ' : 'Estimated Ready'}</p>
                      <p className="text-lg font-bold text-emerald-400 font-sans">{estimatedCompletionTime} น.</p>
                      <p className="text-[10px] text-slate-500">{isTh ? 'รอบนัดหมาย' : 'Slot'}: {activeCarRecord.timeSlot} น.</p>
                    </div>
                  </div>

                  {/* 5-Stage Visual Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">
                        {isTh ? 'ขั้นตอนปัจจุบัน' : 'Current Stage'}: <strong className="text-white">{activeStageInfo.titleTh}</strong>
                      </span>
                      <span className="font-bold text-blue-400">{activeStageNumber} / 5</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((st) => (
                        <div
                          key={st}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            st <= activeStageNumber
                              ? 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-sm shadow-blue-500/50'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stage Technical Detail Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="sm:col-span-1 h-36 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                      <img
                        src={activeStageInfo.photoUrl}
                        alt="Stage Detail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-[10px] text-slate-300 font-medium">Autoboutique Phuket Bay #1</span>
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                          <span>{isTh ? activeStageInfo.titleTh : activeStageInfo.titleEn}</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {isTh ? activeStageInfo.descTh : activeStageInfo.descEn}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => setLastConfirmedBooking(activeCarRecord)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isTh ? 'เปิดใบเสร็จ VIP' : 'View Work Order'}</span>
                        </button>

                        <a
                          href={generateGoogleCalendarUrl({
                            service: activeCarRecord.service,
                            carInfo: activeCarRecord.carInfo,
                            date: activeCarRecord.date,
                            timeSlot: activeCarRecord.timeSlot,
                          })}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                        >
                          <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Google Cal</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
                <Car className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">{isTh ? 'ไม่พบคิวรถที่ค้นหา' : 'No matching vehicle found'}</p>
              </div>
            )}
          </main>
        )}

        {/* =========================================================================
            TAB 4: EXECUTIVE STUDIO PORTAL (ระบบบริหารจัดการสตูดิโอ)
            ========================================================================= */}
        {view === 'admin' && isAdminAuthenticated && (
          <main className="p-4 md:p-6 space-y-6 flex-1">
            {/* Executive Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="autoboutique-title-bar">
                <span className="text-[11px] font-semibold tracking-wider text-blue-400 uppercase">
                  EXECUTIVE PORTAL
                </span>
                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {isTh ? 'ระบบบริหารจัดการสตูดิโอและคิวงาน' : 'Studio Management Portal'}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isTh ? '+ ลูกค้า Walk-in (฿500)' : '+ Walk-in'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    sessionStorage.removeItem('autoboutique_luxe_admin_auth');
                    setView('booking');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition"
                >
                  {isTh ? 'ออกจากระบบ' : 'Lock'}
                </button>
              </div>
            </div>

            {/* Daily Financial & Operational KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="luxe-panel p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{isTh ? 'รายรับวันนี้' : 'Today Revenue'}</span>
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-white font-sans">
                  ฿{adminMetrics.revenue.toLocaleString()}
                </div>
                <p className="text-[10px] text-slate-500">{adminMetrics.totalCount} {isTh ? 'คิวที่ชำระแล้ว' : 'Paid bookings'}</p>
              </div>

              <div className="luxe-panel p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{isTh ? 'ส่งมอบแล้ว' : 'Completed'}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-white font-sans">
                  {adminMetrics.completed} <span className="text-xs text-slate-400 font-normal">{isTh ? 'คัน' : 'Cars'}</span>
                </div>
                <p className="text-[10px] text-slate-500">{isTh ? 'ผ่านการตรวจสภาพ' : 'Inspected'}</p>
              </div>

              <div className="luxe-panel p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{isTh ? 'กำลังล้าง' : 'In Bay'}</span>
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-white font-sans">
                  {adminMetrics.inProgress} <span className="text-xs text-slate-400 font-normal">{isTh ? 'ช่อง' : 'Bays'}</span>
                </div>
                <p className="text-[10px] text-slate-500">{isTh ? 'กำลังทำงานในช่องล้าง' : 'Active detailing'}</p>
              </div>

              <div className="luxe-panel p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>{isTh ? 'อัตราครองช่อง' : 'Capacity'}</span>
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-lg md:text-xl font-bold text-white font-sans">
                  {adminMetrics.capacityPct}%
                </div>
                <p className="text-[10px] text-slate-500">2 {isTh ? 'ช่องบริการมาตรฐาน' : 'Bays total'}</p>
              </div>
            </div>

            {/* Filter Bar & Date Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={adminSelectedDate}
                  onChange={(e) => setAdminSelectedDate(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-blue-500"
                />
                <span className="text-xs text-slate-400">
                  {formatBookingDate(adminSelectedDate, lang)}
                </span>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {(['all', 'pending', 'inprogress', 'ready', 'cancelled'] as const).map((fil) => (
                  <button
                    key={fil}
                    type="button"
                    onClick={() => setAdminBookingFilter(fil)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition shrink-0 ${
                      adminBookingFilter === fil
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {fil === 'all'
                      ? isTh ? 'ทั้งหมด' : 'All'
                      : fil === 'pending'
                      ? isTh ? 'รอยืนยัน' : 'Pending'
                      : fil === 'inprogress'
                      ? isTh ? 'กำลังล้าง' : 'In Progress'
                      : fil === 'ready'
                      ? isTh ? 'พร้อมส่งมอบ' : 'Ready'
                      : isTh ? 'ยกเลิก' : 'Cancelled'}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Bookings Table */}
            <div className="luxe-panel rounded-2xl overflow-hidden border border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3.5">{isTh ? 'เวลา' : 'Time'}</th>
                      <th className="py-3 px-3.5">{isTh ? 'ทะเบียน / รถยนต์' : 'Vehicle'}</th>
                      <th className="py-3 px-3.5">{isTh ? 'ลูกค้า / ติดต่อ' : 'Client'}</th>
                      <th className="py-3 px-3.5">{isTh ? 'ยอดชำระ' : 'Amount'}</th>
                      <th className="py-3 px-3.5">{isTh ? 'สลิปโอน' : 'Slip'}</th>
                      <th className="py-3 px-3.5">{isTh ? 'สถานะงาน' : 'Stage'}</th>
                      <th className="py-3 px-3.5 text-right">{isTh ? 'จัดการ' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {adminFilteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap">
                          {b.timeSlot} น.
                        </td>
                        <td className="py-3 px-3.5">
                          <p className="font-semibold text-white whitespace-nowrap">{b.carInfo}</p>
                          <p className="text-[10px] text-blue-400 font-mono">{b.id}</p>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <p className="text-slate-200">{b.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{b.phone}</p>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="font-bold text-emerald-400">
                            ฿{(b.paidAmount || 0).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {b.paymentMethod === 'package' ? 'สิทธิ์แพ็คเกจ' : 'PromptPay'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {b.paymentSlipUrl ? (
                            <button
                              type="button"
                              onClick={() => setViewSlipModalUrl(b.paymentSlipUrl || null)}
                              className="px-2 py-1 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 hover:text-white text-[10px] font-semibold transition"
                            >
                              {isTh ? '🔍 ดูสลิป' : 'View Slip'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateBookingStage(b.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-white outline-none focus:border-blue-500"
                          >
                            <option value="pending">{isTh ? 'รอยืนยัน (Pending)' : 'Pending'}</option>
                            <option value="step1">{isTh ? 'ขั้น 1: ตรวจสภาพก่อนล้าง' : 'Stage 1: Pre-Inspect'}</option>
                            <option value="step2">{isTh ? 'ขั้น 2: พ่นโฟม & ล้างช่วงล่าง' : 'Stage 2: Active Foam'}</option>
                            <option value="step3">{isTh ? 'ขั้น 3: ล้างมือถังคู่ & ซุ้มล้อ' : 'Stage 3: Two-Bucket Hand Wash'}</option>
                            <option value="step4">{isTh ? 'ขั้น 4: เช็ดแห้ง & เป่าลมไล่น้ำ' : 'Stage 4: Air Blow Dry'}</option>
                            <option value="ready">{isTh ? 'ขั้น 5: พร้อมส่งมอบรถ' : 'Stage 5: Ready for Handover'}</option>
                            <option value="cancelled">{isTh ? 'ยกเลิกแล้ว (Cancelled)' : 'Cancelled'}</option>
                          </select>
                        </td>
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                            title="Cancel Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {adminFilteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                          {isTh ? 'ไม่พบคิวการจองในเงื่อนไขนี้' : 'No bookings found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* =========================================================================
            PROMPTPAY & SLIP VERIFICATION MODAL (Optimized for 1-Device Mobile & Desktop)
            ========================================================================= */}
        {promptPayModal.open && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in ${
            theme === 'light' ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-black/80 backdrop-blur-md'
          }`}>
            <div className={`rounded-2xl w-full max-w-lg p-4 sm:p-5 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl transition-all ${
              theme === 'light' ? 'bg-white border border-slate-200 text-slate-900' : 'luxe-panel text-white'
            }`}>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                      {isTh ? 'สแกนพร้อมเพย์ทางการ (EMVCo PromptPay)' : 'OFFICIAL PROMPTPAY SETTLEMENT'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{promptPayModal.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimer(paymentCountdown)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPromptPayModal({ open: false, type: 'booking', title: '', amount: 0 })}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Centerpiece: High-Contrast White PromptPay QR Card */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-900 text-center space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black tracking-wider text-blue-800 font-sans">THAI QR PAYMENT</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      พร้อมเพย์
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                    โหมดทดสอบ ฿{promptPayModal.amount.toFixed(2)}
                  </span>
                </div>

                {/* QR Code Image - Instant Client-Side Generated */}
                <div className="w-52 h-52 sm:w-56 sm:h-56 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                  {qrLoading || !qrDataUrl ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                      <span className="text-xs">กำลังสร้าง QR Code...</span>
                    </div>
                  ) : (
                    <img
                      src={qrDataUrl}
                      alt="PromptPay EMVCo QR Code 1800500068403"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Account & Amount Info Strip */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[10px] text-slate-500 font-medium">
                      {isTh ? 'เลขประจำตัวประชาชน (พร้อมเพย์)' : 'PromptPay ID'}
                    </div>
                    <div className="font-mono font-bold text-slate-900 text-sm sm:text-base tracking-wider">
                      {formatPromptPayId(PROMPTPAY_ID)}
                    </div>
                    <div className="text-[10px] text-slate-600 truncate">{PROMPTPAY_NAME}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block">{isTh ? 'ยอดชำระ' : 'Amount'}</span>
                    <span className="text-base sm:text-lg font-black text-blue-600 font-mono">
                      ฿{promptPayModal.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1-Tap Action Buttons (Save QR to Photos & Copy ID) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleOneTapMobilePay(promptPayModal.amount)}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  <Download className="w-4 h-4 text-sky-200 shrink-0" />
                  <span>
                    {hasOneTapTriggered
                      ? isTh ? '✓ บันทึกภาพแล้ว (กดซ้ำได้)' : '✓ Saved to Photos'
                      : isTh ? '📥 บันทึกรูป QR ลงเครื่อง' : '📥 Save QR Image'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPromptPay}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white text-xs font-semibold transition border border-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {copiedPromptPay ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-emerald-400">{isTh ? 'คัดลอกเลขแล้ว' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>{isTh ? 'คัดลอกเลขพร้อมเพย์' : 'Copy ID'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Quick Bank App Launchers Grid (Mobile Deep-Links) */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-blue-400 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                    {isTh ? 'เปิดแอปธนาคารในเครื่องนี้เพื่อโอน' : 'Launch Banking App'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isTh ? 'เลือกธนาคาร' : 'Tap to Open'}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {THAI_BANK_APPS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => handleOpenBankApp(bank.scheme, bank.bankNameTh)}
                      className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition active:scale-95 ${bank.bgClass} ${bank.borderClass}`}
                    >
                      <Landmark className={`w-3.5 h-3.5 ${bank.textClass}`} />
                      <span className="text-[10px] font-bold text-white leading-tight">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slip Upload & Verification Section */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-blue-400 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-blue-500" />
                    {isTh ? 'แนบสลิปหลักฐานการโอนเงิน' : 'Upload Payment Slip'}
                  </span>
                  {slipVerified && (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {isTh ? 'แนบสลิปแล้ว' : 'Slip Attached'}
                    </span>
                  )}
                </div>

                <input
                  ref={slipFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleProcessSlipFile(e.target.files[0]);
                  }}
                  className="hidden"
                />

                {uploadedSlipPreview ? (
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={uploadedSlipPreview}
                        alt="Slip Preview"
                        className="w-10 h-12 rounded-lg object-cover border border-slate-300 dark:border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {isTh ? 'สลิปโอนเงินพร้อมเพย์' : 'Payment Slip'}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isTh ? 'สลิปพร้อมยืนยันการจอง' : 'Ready to Submit'}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedSlipPreview(null);
                        setSlipVerified(false);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => slipFileInputRef.current?.click()}
                    className="p-3 sm:p-3.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-900/60 cursor-pointer text-center space-y-1 transition active:scale-[0.99]"
                  >
                    <Upload className="w-4 h-4 text-blue-500 mx-auto" />
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {isTh ? 'แตะที่นี่เพื่อเลือกสลิปจากอัลบั้ม' : 'Tap to select slip from photo album'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isTh ? 'เมื่อโอนในแอปธนาคารเสร็จ สลิปจะอยู่บนสุดของอัลบั้ม' : 'Select transfer slip from camera roll'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Confirm & Test Shortcut */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  disabled={!slipVerified}
                  onClick={() => {
                    if (promptPayModal.type === 'booking') {
                      handleCompleteBookingPayment('promptpay');
                    } else if (promptPayModal.type === 'package' && promptPayModal.pkgId) {
                      handleCompletePackagePurchase(promptPayModal.pkgId);
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${
                    slipVerified
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-900/40 cursor-pointer active:scale-[0.99]'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {!slipVerified
                      ? isTh ? 'กรุณาแนบสลิปเพื่อยืนยันการจอง' : 'Attach Slip to Unlock'
                      : isTh ? 'ยืนยันการจองคิว VIP และแจ้งเตือนสตูดิโอ' : 'Confirm & Notify Studio'}
                  </span>
                </button>

                {/* Instant Test Mode Bypass Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (promptPayModal.type === 'booking') {
                      handleCompleteBookingPayment('promptpay');
                    } else if (promptPayModal.type === 'package' && promptPayModal.pkgId) {
                      handleCompletePackagePurchase(promptPayModal.pkgId);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-blue-300 text-xs font-semibold transition active:scale-[0.99] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isTh ? '🧪 ยืนยันการจองทันที (โหมดทดสอบระบบ ฿1 ไม่ต้องแนบสลิป)' : '🧪 Instant Test Confirm (฿1 Test Mode)'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            ADMIN PIN MODAL
            ========================================================================= */}
        {adminPinModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="luxe-panel rounded-2xl w-full max-w-sm p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-500/40 flex items-center justify-center mx-auto text-blue-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{isTh ? 'ระบบบริหารจัดการสตูดิโอ' : 'Executive Studio Auth'}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isTh ? 'กรุณากรอกรหัส PIN ผู้ดูแลระบบ (1234 หรือ 8888)' : 'Enter 4-digit security PIN'}
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className="w-36 mx-auto px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-center text-xl font-mono tracking-widest text-white outline-none focus:border-blue-500"
                />
                {pinError && (
                  <p className="text-[11px] text-red-400 font-medium">{isTh ? 'รหัส PIN ไม่ถูกต้อง' : 'Incorrect PIN'}</p>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAdminPinModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    {isTh ? 'ยกเลิก' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    {isTh ? 'เข้าสู่ระบบ' : 'Unlock'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            ADMIN WALK-IN MODAL
            ========================================================================= */}
        {walkInModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="luxe-panel rounded-2xl w-full max-w-md p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">
                  {isTh ? 'บันทึกคิวลูกค้า Walk-in (฿1 - ทดสอบ)' : 'New Walk-in Reception'}
                </h3>
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1">{isTh ? 'ชื่อลูกค้า' : 'Client Name'}:</label>
                  <input
                    type="text"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    placeholder="ระบุชื่อลูกค้า"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">{isTh ? 'เบอร์โทรศัพท์' : 'Phone'}:</label>
                  <input
                    type="tel"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(formatPhoneInput(e.target.value))}
                    placeholder="08X-XXX-XXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">{isTh ? 'รุ่นและทะเบียนรถ' : 'Vehicle Plate'}:</label>
                  <input
                    type="text"
                    value={walkInCar}
                    onChange={(e) => setWalkInCar(e.target.value)}
                    placeholder="ระบุยี่ห้อ รุ่น และทะเบียน"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setWalkInModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
                >
                  {isTh ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleCreateWalkIn}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                >
                  {isTh ? 'บันทึกคิว (฿1)' : 'Save Walk-in (฿1)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            CANCEL BOOKING CONFIRMATION MODAL (15-MIN RULE ENFORCED)
            ========================================================================= */}
        {cancelModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="luxe-panel rounded-2xl w-full max-w-md p-5 space-y-4">
              <div className="flex items-center gap-2.5 text-amber-400">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h3 className="text-base font-bold text-white">{isTh ? 'ยืนยันการยกเลิกนัดหมาย' : 'Cancel Appointment'}</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <p className="text-slate-200 font-bold">{cancelModalBooking.carInfo}</p>
                <p className="text-slate-400">รหัส: {cancelModalBooking.id} • {cancelModalBooking.customerName}</p>
                <p className="text-blue-400 font-semibold">{cancelModalBooking.date} เวลา {cancelModalBooking.timeSlot} น.</p>
              </div>

              {/* 15-Minute Policy Evaluation Output */}
              {(() => {
                const policy = checkCancellationPackagePolicy(cancelModalBooking);
                return (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      policy.willRefundQuota
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                        : 'bg-red-950/40 border-red-800/60 text-red-300'
                    }`}
                  >
                    <p className="font-semibold">{isTh ? 'ผลการตรวจสอบตามนโยบายสตูดิโอ:' : 'Studio Policy Check:'}</p>
                    <p className="mt-1">{isTh ? policy.messageTh : policy.messageEn}</p>
                  </div>
                );
              })()}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold"
                >
                  {isTh ? 'ปิดหน้าต่าง' : 'Dismiss'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancelBooking}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  {isTh ? 'ยืนยันยกเลิกคิว' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SLIP INSPECTION MODAL
            ========================================================================= */}
        {viewSlipModalUrl && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="luxe-panel rounded-2xl w-full max-w-sm p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">{isTh ? 'ตรวจสอบสลิปโอนเงิน' : 'Payment Slip Inspection'}</span>
                <button
                  type="button"
                  onClick={() => setViewSlipModalUrl(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full max-h-[70vh] overflow-y-auto rounded-xl bg-black border border-slate-800 flex items-center justify-center">
                <img src={viewSlipModalUrl} alt="Bank Slip" className="w-full object-contain" />
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            PRINTABLE VIP WORK ORDER & RECEIPT MODAL
            ========================================================================= */}
        {lastConfirmedBooking && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="luxe-panel rounded-2xl w-full max-w-md p-5 space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">{isTh ? 'ใบเสร็จรับเงินสตูดิโอ (VIP Work Order)' : 'Studio Detailing Receipt'}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLastConfirmedBooking(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Printable Invoice Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="text-center pb-3 border-b border-slate-900">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">AUTOBOUTIQUE PHUKET</h4>
                  <p className="text-[10px] text-slate-400">Operated by C-Cube Automotive (Since 2008)</p>
                  <p className="text-[10px] text-blue-400 font-mono mt-1">NO: {lastConfirmedBooking.id}</p>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isTh ? 'ลูกค้า' : 'Client'}:</span>
                    <span className="text-white font-semibold">{lastConfirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isTh ? 'เบอร์ติดต่อ' : 'Phone'}:</span>
                    <span className="text-white font-mono">{lastConfirmedBooking.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isTh ? 'ยานยนต์' : 'Vehicle'}:</span>
                    <span className="text-white font-semibold">{lastConfirmedBooking.carInfo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isTh ? 'วันเวลานัดหมาย' : 'Appointment'}:</span>
                    <span className="text-blue-400 font-semibold">{lastConfirmedBooking.date} ({lastConfirmedBooking.timeSlot} น.)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isTh ? 'บริการ' : 'Service'}:</span>
                    <span className="text-white text-right max-w-[200px]">{lastConfirmedBooking.service}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-300">{isTh ? 'ยอดชำระสุทธิ' : 'Total Paid'}:</span>
                  <span className="text-lg font-extrabold text-blue-400 font-sans">
                    ฿{(lastConfirmedBooking.paidAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isTh ? 'พิมพ์ใบเสร็จ' : 'Print'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Autoboutique Detailing Work Order #${lastConfirmedBooking.id} | ${lastConfirmedBooking.carInfo} | ${lastConfirmedBooking.date} ${lastConfirmedBooking.timeSlot} น.`
                    );
                    showToast(isTh ? 'คัดลอกข้อมูลใบเสร็จเรียบร้อย' : 'Copied to clipboard', 2500);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isTh ? 'แชร์ / คัดลอก' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STUDIO FOOTER
            ========================================================================= */}
        <footer className="mt-auto border-t border-slate-900 bg-[#060913] p-4 md:p-6 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-bold text-slate-300 tracking-wider uppercase font-sans">Autoboutique Phuket</span>
            <span>•</span>
            <span>C-Cube Automotive Co., Ltd.</span>
            <span>•</span>
            <a href="tel:0661098306" className="text-blue-400 hover:text-blue-300 transition font-mono">
              📞 066 109 8306
            </a>
          </div>
          <p className="text-[11px] text-slate-600">
            {isTh
              ? 'สตูดิโอดีเทลลิ่ง ล้างสี ดูดฝุ่น เคลือบแก้วเซรามิก และฟิล์มใสกันรอย PPF มาตรฐานสากลแห่งภูเก็ต'
              : 'Premier Automotive Detailing, Ceramic Coatings, and Paint Protection Film Studio in Phuket.'}
          </p>
          <p className="text-[10px] text-slate-700 font-mono">
            © 2008 - 2026 Autoboutique Phuket. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
