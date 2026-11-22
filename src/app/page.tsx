'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Car,
  ShieldCheck,
  AlertCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Camera,
  Check,
  Truck,
  Sparkles,
  ChevronDown,
  Trash2,
  Plus,
  Lock,
  Unlock,
  MessageCircle,
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
  Sliders,
  Upload,
  Copy,
  FileCheck,
  ShieldAlert,
  Award,
  Compass,
  MapPin,
  Flame,
  CheckSquare,
  BadgeCheck,
  Timer,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
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
  BookingRecord,
  PackageDeal,
  CustomerPackage,
  ServiceType,
  Language,
} from '@/utils/bookingLogic';

// Initial Realistic Car Wash Bookings (Flat ฿500 Base Rate - No Car Size Matrix)
const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-001',
    timeSlot: '08:30',
    customerName: 'คุณอัครวัฒน์ ชัยกิตติคุณ',
    phone: '089-999-8877',
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
    status: 'pending',
    createdAt: '2026-11-25T08:00:00Z',
    paidAmount: 500,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-003',
    timeSlot: '10:30',
    customerName: 'คุณวิชัย รัตนการุณ',
    phone: '081-345-6789',
    carInfo: 'Porsche 911 GT3 (7กง 7777 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'engine',
    subOption: '+ ล้างห้องเครื่องขจัดคราบน้ำมัน (+฿500)',
    date: '2026-11-25',
    status: 'step2',
    createdAt: '2026-11-25T08:30:00Z',
    paidAmount: 1000,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-004',
    timeSlot: '13:00',
    customerName: 'คุณเอกภพ ว่องไว',
    phone: '082-345-6789',
    carInfo: 'Mercedes-Benz C350e (4กณ 5678 ภูเก็ต)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'standard',
    subOption: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน',
    date: '2026-11-25',
    status: 'ready',
    createdAt: '2026-11-25T11:00:00Z',
    paidAmount: 500,
    paymentMethod: 'promptpay',
    paymentStatus: 'paid',
  },
  {
    id: 'BK-005',
    timeSlot: '15:30',
    customerName: 'คุณธีรเดช สุขสวัสดิ์',
    phone: '086-999-7711',
    carInfo: 'Ford Ranger Raptor (กง 7711 กระบี่)',
    serviceKey: 'wash',
    service: 'ล้างรถพรีเมียม & คลีนภายใน (Car Detailing & Premium Car Wash)',
    subOptionId: 'standard',
    subOption: 'ล้างพรีเมียม + ดูดฝุ่นมาตรฐาน',
    date: '2026-11-25',
    status: 'pending',
    createdAt: '2026-11-25T14:30:00Z',
    paidAmount: 0,
    paymentMethod: 'package',
    paymentStatus: 'package_redeemed',
    usedPackageId: 'CPKG-001',
  },
];

export default function Home() {
  // Global View States
  const [lang, setLang] = useState<Language>('th');
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<'booking' | 'packages' | 'vault'>('booking');

  // Brand Story Modal (from autoboutiqueth.com/#about)
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // Customer Packages State
  const [customerPackages, setCustomerPackages] = useState<CustomerPackage[]>(INITIAL_CUSTOMER_PACKAGES);
  const [selectedPackageIdToRedeem, setSelectedPackageIdToRedeem] = useState<string | null>(null);

  // Enforced PromptPay QR Modal with Slip Verification
  const [promptPayModal, setPromptPayModal] = useState<{
    open: boolean;
    type: 'booking' | 'package';
    title: string;
    amount: number;
    packageDraft?: PackageDeal;
  }>({
    open: false,
    type: 'booking',
    title: '',
    amount: 0,
  });

  // PromptPay Countdown Timer (15 Minutes)
  const [qrCountdown, setQrCountdown] = useState<number>(900); // 15 mins in secs

  // Slip Upload State inside PromptPay Modal
  const [uploadedSlipPreview, setUploadedSlipPreview] = useState<string | null>(null);
  const [isVerifyingSlip, setIsVerifyingSlip] = useState(false);
  const [slipVerified, setSlipVerified] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [promptPayCopied, setPromptPayCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Official Digital Booking Receipt Modal
  const [bookingReceiptModal, setBookingReceiptModal] = useState<BookingRecord | null>(null);
  const [receiptCopied, setReceiptCopied] = useState(false);

  // LINE Notification Status Toast & Banner
  const [lineNotificationSuccess, setLineNotificationSuccess] = useState<string | null>(null);

  // Vehicle Search in Tab 3
  const [vehicleSearchQuery, setVehicleSearchQuery] = useState('');

  // Admin Active Sub-Tab, Filter & Date
  const [adminActiveTab, setAdminActiveTab] = useState<'dashboard' | 'bookings' | 'packages'>('dashboard');
  const [adminSelectedDate, setAdminSelectedDate] = useState<string>('2026-11-25');
  const [adminBookingFilter, setAdminBookingFilter] = useState<'all' | 'pending' | 'inprogress' | 'ready'>('all');
  const [adminNewPackageModalOpen, setAdminNewPackageModalOpen] = useState(false);
  const [newPkgSelectedDealId, setNewPkgSelectedDealId] = useState('PKG-WASH-12');
  const [newPkgCustomerName, setNewPkgCustomerName] = useState('');
  const [newPkgPhone, setNewPkgPhone] = useState('');
  const [newPkgCar, setNewPkgCar] = useState('');

  // Calendar State
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');

  // Customer Booking Form States (No Car Size!)
  const [selectedSubOption, setSelectedSubOption] = useState<string>('standard');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [formName, setFormName] = useState('คุณอัครวัฒน์ ชัยกิตติคุณ');
  const [formPhone, setFormPhone] = useState('089-999-8877');
  const [formCar, setFormCar] = useState('BMW M2 (กข 8888 ภูเก็ต)');
  const [vipDelivery, setVipDelivery] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Full-Month Advance Calendar Modal State
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [calendarModalMonth, setCalendarModalMonth] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 11,
  });

  // Calendar Integration Modal/Banner
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<BookingRecord | null>(null);

  // Service Showcase Modal (ดูตัวอย่างงาน)
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);

  // Photo Lightbox Modal
  const [lightboxData, setLightboxData] = useState<{
    open: boolean;
    title: string;
    caption: string;
    url: string;
  }>({
    open: false,
    title: '',
    caption: '',
    url: '',
  });

  // Admin PIN Security State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPinModalOpen, setAdminPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Admin Modals & State
  const [cancelModalBooking, setCancelModalBooking] = useState<BookingRecord | null>(null);
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [lockSlotModalOpen, setLockSlotModalOpen] = useState(false);
  const [lockedSlots, setLockedSlots] = useState<string[]>([]);

  // Walk-in Form State (No Car Size)
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInCar, setWalkInCar] = useState('');
  const [walkInTime, setWalkInTime] = useState('08:30');

  // Shared Bookings State
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [activeCarId, setActiveCarId] = useState<string>('BK-001');

  // Loyalty Stamp Card State (7/10 stamps default)
  const [stampsCount, setStampsCount] = useState<number>(7);
  const [isHydrated, setIsHydrated] = useState(false);

  // Dynamic or pre-configured active week derived from selectedDate
  const activeWeek = useMemo(() => {
    if (WEEKS_SCHEDULE[currentWeekIndex]?.dates.some((d) => d.dateStr === selectedDate)) {
      return WEEKS_SCHEDULE[currentWeekIndex];
    }
    const fixedWeek = WEEKS_SCHEDULE.find((w) => w.dates.some((d) => d.dateStr === selectedDate));
    if (fixedWeek) return fixedWeek;
    return getWeekScheduleForDate(selectedDate);
  }, [selectedDate, currentWeekIndex]);

  // Global Keyboard Listener for Modal Escape Dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPromptPayModal((prev) => ({ ...prev, open: false }));
        setBookingReceiptModal(null);
        setAdminPinModalOpen(false);
        setCancelModalBooking(null);
        setWalkInModalOpen(false);
        setAdminNewPackageModalOpen(false);
        setLockSlotModalOpen(false);
        setLightboxData((prev) => ({ ...prev, open: false }));
        setShowcaseModalOpen(false);
        setCalendarModalOpen(false);
        setAboutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // PromptPay Countdown Timer
  useEffect(() => {
    if (!promptPayModal.open) {
      setQrCountdown(900);
      return;
    }
    const interval = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [promptPayModal.open]);

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

        const savedAuth = sessionStorage.getItem('autoboutique_luxe_admin_auth');
        if (savedAuth === 'true') setIsAdminAuthenticated(true);

        const savedPackages = localStorage.getItem('autoboutique_luxe_customer_packages');
        if (savedPackages) {
          const parsedPackages = JSON.parse(savedPackages);
          if (Array.isArray(parsedPackages) && parsedPackages.length > 0) {
            setCustomerPackages(parsedPackages);
          }
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
      console.warn('Failed saving customer packages:', e);
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

  // Language Change
  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('autoboutique_luxe_lang', newLang);
    } catch (e) {}
  };

  const isTh = lang === 'th';
  const isRu = lang === 'ru';

  // Tracking car
  const currentTrackingCar =
    bookings.find((b) => b.id === activeCarId) || bookings[0] || INITIAL_BOOKINGS[0];
  const trackerStage = mapStatusToStage(currentTrackingCar.status);

  // Price calculation: Flat ฿500 Base Rate + Optional Add-on
  const currentPriceObj = calculatePrice('wash', selectedSubOption);
  const currentPrice = currentPriceObj.price;

  // Selected active package for ฿0 redemption
  const activeRedeemPackage = customerPackages.find(
    (p) => p.id === selectedPackageIdToRedeem && p.status === 'active' && p.remainingQuota > 0
  );

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
          `📱 ข้อความ LINE แจ้งเตือนส่งถึง ${payload.customerName} (${payload.carInfo}) สำเร็จแล้ว!`
        );
        setTimeout(() => setLineNotificationSuccess(null), 6000);
      }
    } catch (err) {
      console.warn('LINE notification dispatch failed:', err);
    }
  };

  // Process Slip File (Validation & Preview)
  const processSlipFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setToastMessage(isTh ? 'กรุณาอัปโหลดไฟล์รูปภาพสลิปเท่านั้น' : 'Please upload an image file');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setIsVerifyingSlip(true);
    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        setUploadedSlipPreview(reader.result as string);
        setIsVerifyingSlip(false);
        setSlipVerified(true);
      }, 1200);
    };
    reader.onerror = () => {
      setIsVerifyingSlip(false);
      setToastMessage(isTh ? 'เกิดข้อผิดพลาดในการอ่านไฟล์สลิป' : 'Failed to read slip image');
    };
    reader.readAsDataURL(file);
  };

  const handleSlipFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processSlipFile(file);
  };

  // Drag and Drop Slip Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processSlipFile(file);
  };

  // Simulate Slip Upload for Testing
  const handleSimulateSlipUpload = () => {
    setIsVerifyingSlip(true);
    setTimeout(() => {
      setUploadedSlipPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
      setIsVerifyingSlip(false);
      setSlipVerified(true);
    }, 1000);
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
      customerName: formName.trim() || 'คุณลูกค้า',
      phone: formPhone.trim() || '089-999-8877',
      carInfo: formCar.trim() || 'Mercedes-Benz (กข 8888 ภูเก็ต)',
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

    setToastMessage(
      isTh
        ? `✅ จองคิวล้างรถสำเร็จ! รหัส ${newBookingId} ส่งข้อความยืนยันทาง LINE เรียบร้อย`
        : `Booking Confirmed #${newBookingId}! LINE alert sent.`
    );
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Buy Package with PromptPay
  const handleCompletePackagePayment = (deal: PackageDeal) => {
    const newPkgId = `CPKG-${String(customerPackages.length + 1).padStart(3, '0')}`;
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(today.getDate() + deal.validityDays);

    const newCustomerPkg: CustomerPackage = {
      id: newPkgId,
      packageId: deal.id,
      serviceKey: deal.serviceKey,
      packageNameTh: deal.nameTh,
      packageNameEn: deal.nameEn,
      customerName: formName.trim() || 'คุณลูกค้าคนพิเศษ',
      phone: formPhone.trim() || '089-999-8877',
      carInfo: formCar.trim() || 'BMW M2 Coupe (กข 8888 ภูเก็ต)',
      totalQuota: deal.totalUses,
      remainingQuota: deal.totalUses,
      purchaseDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'active',
      pricePaid: deal.price,
    };

    setCustomerPackages((prev) => [newCustomerPkg, ...prev]);
    setPromptPayModal({ open: false, type: 'package', title: '', amount: 0 });
    setUploadedSlipPreview(null);
    setSlipVerified(false);

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#2563EB', '#3B82F6', '#60A5FA', '#FFFFFF'],
      });
    } catch (e) {}

    setToastMessage(
      isTh
        ? `🎉 ซื้อ ${deal.nameTh} สำเร็จแล้ว! โควตา ${deal.totalUses} ครั้ง พร้อมใช้งานทันที`
        : `Package purchased successfully! ${deal.totalUses} uses available.`
    );
    setTimeout(() => setToastMessage(null), 4000);
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
    }

    setToastMessage(
      isTh ? `🔄 อัปเดตสถานะคิว ${id} และส่งแจ้งเตือน LINE เรียบร้อย` : `Stage updated for ${id}`
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Admin Create Walk-in (Flat ฿500 Base Rate)
  const handleCreateWalkIn = () => {
    if (!walkInName.trim() || !walkInCar.trim()) {
      setToastMessage(isTh ? 'กรุณากรอกชื่อและทะเบียนรถ' : 'Please fill all fields');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    const newId = `BK-${String(bookings.length + 1).padStart(3, '0')}`;
    const priceResult = calculatePrice('wash', 'standard');

    const newRecord: BookingRecord = {
      id: newId,
      timeSlot: walkInTime,
      customerName: walkInName.trim(),
      phone: formatPhoneInput(walkInPhone) || '089-000-0000',
      carInfo: walkInCar.trim().toUpperCase(),
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
    setWalkInModalOpen(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInCar('');

    setToastMessage(
      isTh ? `🚗 บันทึกคิว Walk-in ${newId} (฿${priceResult.price}) เรียบร้อย` : 'Walk-in booking created'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Admin Cancel Booking with 15-Minute Policy Enforcement
  const handleConfirmCancelBooking = () => {
    if (!cancelModalBooking) return;
    const policyResult = checkCancellationPackagePolicy(cancelModalBooking);

    if (policyResult.isPackageBooking && policyResult.willRefundQuota && cancelModalBooking.usedPackageId) {
      setCustomerPackages((prev) =>
        prev.map((p) => {
          if (p.id === cancelModalBooking.usedPackageId) {
            const nextQuota = Math.min(p.totalQuota, p.remainingQuota + 1);
            return {
              ...p,
              remainingQuota: nextQuota,
              status: 'active',
            };
          }
          return p;
        })
      );
    }

    setBookings((prev) => prev.filter((b) => b.id !== cancelModalBooking.id));
    setCancelModalBooking(null);

    setToastMessage(
      policyResult.isPackageBooking
        ? policyResult.messageTh
        : isTh
        ? `🗑️ ยกเลิกคิว ${cancelModalBooking.id} เรียบร้อย`
        : 'Booking cancelled'
    );
    setTimeout(() => setToastMessage(null), 4000);
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
    setToastMessage(isTh ? '✅ อัปเดตโควตาแพ็คเกจเรียบร้อย' : 'Package quota adjusted');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Admin Cancel Package
  const handleCancelPackage = (packageId: string) => {
    if (!window.confirm(isTh ? 'คุณต้องการยกเลิกแพ็คเกจนี้ใช่หรือไม่?' : 'Cancel this package?')) return;
    setCustomerPackages((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, status: 'cancelled' } : p))
    );
    setToastMessage(isTh ? '🗑️ ยกเลิกแพ็คเกจเรียบร้อย' : 'Package cancelled');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Admin Issue New Package Manually
  const handleAdminIssueNewPackage = () => {
    if (!newPkgCustomerName.trim() || !newPkgCar.trim()) {
      setToastMessage(isTh ? 'กรุณากรอกชื่อและข้อมูลรถ' : 'Please fill customer and car info');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    const deal = OFFICIAL_PACKAGES.find((d) => d.id === newPkgSelectedDealId) || OFFICIAL_PACKAGES[0];
    const newId = `CPKG-${String(customerPackages.length + 1).padStart(3, '0')}`;
    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(today.getDate() + deal.validityDays);

    const newPkg: CustomerPackage = {
      id: newId,
      packageId: deal.id,
      serviceKey: 'wash',
      packageNameTh: deal.nameTh,
      packageNameEn: deal.nameEn,
      customerName: newPkgCustomerName.trim(),
      phone: formatPhoneInput(newPkgPhone) || '089-000-0000',
      carInfo: newPkgCar.trim().toUpperCase(),
      totalQuota: deal.totalUses,
      remainingQuota: deal.totalUses,
      purchaseDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'active',
      pricePaid: deal.price,
    };

    setCustomerPackages((prev) => [newPkg, ...prev]);
    setAdminNewPackageModalOpen(false);
    setNewPkgCustomerName('');
    setNewPkgPhone('');
    setNewPkgCar('');
    setToastMessage(isTh ? `✅ ออกแพ็คเกจ ${newId} ให้ลูกค้าเรียบร้อย` : 'New package issued');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Admin Daily Calculations (แดชบอร์ดรายวัน)
  const dailyBookings = useMemo(() => {
    return bookings.filter((b) => b.date === adminSelectedDate);
  }, [bookings, adminSelectedDate]);

  const filteredAdminBookings = useMemo(() => {
    if (adminBookingFilter === 'all') return dailyBookings;
    if (adminBookingFilter === 'pending') {
      return dailyBookings.filter((b) => b.status === 'pending' || b.status === 'step1');
    }
    if (adminBookingFilter === 'inprogress') {
      return dailyBookings.filter((b) => ['step2', 'step3', 'step4'].includes(b.status));
    }
    if (adminBookingFilter === 'ready') {
      return dailyBookings.filter((b) => b.status === 'ready');
    }
    return dailyBookings;
  }, [dailyBookings, adminBookingFilter]);

  const dailyRevenue = useMemo(() => {
    return dailyBookings.reduce((sum, b) => {
      if (b.paymentStatus === 'paid' && b.paidAmount) return sum + b.paidAmount;
      return sum;
    }, 0);
  }, [dailyBookings]);

  const dailyPackageRedemptions = useMemo(() => {
    return dailyBookings.filter((b) => b.paymentMethod === 'package').length;
  }, [dailyBookings]);

  const dailyPendingCount = useMemo(() => {
    return dailyBookings.filter((b) => b.status === 'pending' || b.status === 'step1').length;
  }, [dailyBookings]);

  const dailyInProgressCount = useMemo(() => {
    return dailyBookings.filter(
      (b) => b.status === 'step2' || b.status === 'step3' || b.status === 'step4'
    ).length;
  }, [dailyBookings]);

  const dailyReadyCount = useMemo(() => {
    return dailyBookings.filter((b) => b.status === 'ready').length;
  }, [dailyBookings]);

  // Search filtered vehicles in Customer Tab 3
  const matchingVehicles = useMemo(() => {
    if (!vehicleSearchQuery.trim()) return bookings;
    const q = vehicleSearchQuery.toLowerCase().trim();
    return bookings.filter(
      (b) =>
        b.carInfo.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q)
    );
  }, [bookings, vehicleSearchQuery]);

  const warranty = getWarrantyInfo('wash', selectedSubOption, isTh);
  const currentShowcase = SERVICE_SHOWCASE_DATA.wash;

  // Format countdown mm:ss
  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#060913] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(255,255,255,0))] text-slate-100 flex justify-center items-start pb-20 selection:bg-blue-600 selection:text-white font-sans antialiased">
      <div className="w-full max-w-md md:my-6 md:rounded-3xl md:border md:border-blue-500/20 md:shadow-[0_0_50px_rgba(37,99,235,0.15)] md:overflow-hidden bg-[#0A0F1D] flex flex-col min-h-screen md:min-h-[92vh] relative shadow-2xl border-x border-slate-900 transition-all duration-300">
        
        {/* ==================== LUXURY BLUE STUDIO HEADER ==================== */}
        <header className="sticky top-0 z-40 bg-[#060913]/95 backdrop-blur-md border-b border-blue-500/20 px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCustomerTab('booking')}
              className="flex items-center gap-2 group text-left transition active:scale-98"
            >
              <div className="h-9 w-auto flex items-center">
                <img
                  src="/logo.png"
                  alt="Autoboutique"
                  className="h-8 md:h-9 w-auto object-contain brightness-110 drop-shadow-[0_2px_12px_rgba(37,99,235,0.4)] transition group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-wider text-white">
                    AUTOBOUTIQUE
                  </span>
                  <span className="text-[9px] bg-blue-600/20 text-blue-300 font-bold px-1.5 py-0.2 rounded border border-blue-500/40">
                    PHUKET
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                  Operated by C-Cube Automotive (Est. 2008)
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Brand Story Button (autoboutiqueth.com/#about) */}
            <button
              type="button"
              onClick={() => setAboutModalOpen(true)}
              className="text-[11px] font-bold text-blue-300 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              title="About Autoboutique Story"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline">About</span>
            </button>

            {/* Language Switcher */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-0.5 flex text-[10px] font-bold">
              <button
                type="button"
                onClick={() => handleLangChange('th')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'th' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TH
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('en')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'en' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLangChange('ru')}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === 'ru' ? 'bg-blue-600 text-white shadow-sm font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                RU
              </button>
            </div>

            {/* Admin Switcher (Protected by PIN) */}
            <button
              type="button"
              onClick={() => {
                if (view === 'admin') {
                  setView('customer');
                } else if (isAdminAuthenticated) {
                  setView('admin');
                } else {
                  setAdminPinModalOpen(true);
                }
              }}
              className={`p-1.5 rounded-lg border transition active:scale-95 ${
                view === 'admin'
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-blue-400'
              }`}
              title="Admin Portal"
            >
              {view === 'admin' ? <Unlock className="w-4 h-4 text-blue-400" /> : <Lock className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-gradient-to-r from-slate-900 via-[#0F172A] to-blue-950 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-blue-500/40 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{toastMessage}</span>
            </span>
            <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* LINE Notification Banner */}
        {lineNotificationSuccess && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/40 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
            <span className="flex items-center gap-1.5 font-medium">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lineNotificationSuccess}</span>
            </span>
            <button onClick={() => setLineNotificationSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Calendar Integration Banner (Appears after successful booking) */}
        {lastConfirmedBooking && (
          <div className="bg-gradient-to-r from-[#0F172A] via-[#060913] to-[#0F172A] border-b border-blue-500/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">
                  {isTh ? 'จองสำเร็จ! นัดหมายบันทึกแล้ว' : 'Booking Confirmed!'}
                </p>
                <p className="text-[11px] text-blue-300/80">
                  {lastConfirmedBooking.date} • {lastConfirmedBooking.timeSlot} น.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setBookingReceiptModal(lastConfirmedBooking)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition flex items-center gap-1 shadow-sm active:scale-95"
              >
                <Receipt className="w-3 h-3" />
                <span>{isTh ? 'ใบเสร็จ' : 'Receipt'}</span>
              </button>
              <a
                href={generateGoogleCalendarUrl(lastConfirmedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#060913] hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium px-2 py-1 rounded-lg transition"
                title="Google Calendar"
              >
                +Calendar
              </a>
            </div>
          </div>
        )}

        {/* ==================== VIEW 1: ADMIN BACKEND (หลังบ้านแอดมิน) ==================== */}
        {view === 'admin' ? (
          <div className="flex-1 p-4 space-y-4">
            {/* Admin Header Banner */}
            <div className="bg-gradient-to-br from-[#0F172A] via-[#0A0F1D] to-slate-900 border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 bg-blue-950/80 border border-blue-500/30 px-2.5 py-0.5 rounded-full">
                    Executive Studio Portal
                  </span>
                  <h2 className="text-base font-bold mt-1.5 text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>{isTh ? 'ระบบบริหารจัดการสตูดิโอ' : 'Studio Management'}</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setView('customer')}
                  className="bg-[#060913] hover:bg-slate-800 text-blue-300 border border-blue-500/30 text-xs px-2.5 py-1.5 rounded-lg transition font-medium active:scale-95"
                >
                  {isTh ? '➔ หน้าร้าน' : '➔ Front Store'}
                </button>
              </div>

              {/* Sub-Tab Navigation */}
              <div className="grid grid-cols-3 gap-1 mt-4 bg-[#060913] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('dashboard')}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    adminActiveTab === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>{isTh ? 'เดชบอร์ดรายวัน' : 'Daily Stats'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('bookings')}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    adminActiveTab === 'bookings'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isTh ? 'คิวนัดหมาย' : 'Bookings'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminActiveTab('packages')}
                  className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                    adminActiveTab === 'packages'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>{isTh ? 'แพ็คเกจลูกค้า' : 'Packages'}</span>
                </button>
              </div>
            </div>

            {/* Date Selector & Search for Admin View */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {isTh ? 'เลือกวันที่ดูข้อมูล:' : 'Select Date:'}
              </span>
              <input
                type="date"
                value={adminSelectedDate}
                onChange={(e) => setAdminSelectedDate(e.target.value)}
                className="bg-[#060913] border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* ADMIN SUB-TAB 1: DAILY DASHBOARD (เดชบอร์ดรายวัน) */}
            {adminActiveTab === 'dashboard' && (
              <div className="space-y-4">
                {/* 4 Essential Daily Metric Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Today's Cash/QR Revenue */}
                  <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-2xl relative overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {isTh ? 'รายรับวันนี้ (โอน/สด)' : "Today's Revenue"}
                    </span>
                    <p className="text-xl font-black text-white mt-0.5">
                      ฿{dailyRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400 font-medium mt-1 block">
                      {dailyBookings.filter((b) => b.paymentStatus === 'paid').length} {isTh ? 'บิลชำระเงิน' : 'paid bills'}
                    </span>
                  </div>

                  {/* Today's Total Bookings */}
                  <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-2xl relative overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-2">
                      <Car className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {isTh ? 'จำนวนคิววันนี้' : "Today's Bookings"}
                    </span>
                    <p className="text-xl font-black text-white mt-0.5">
                      {dailyBookings.length} {isTh ? 'คัน' : 'cars'}
                    </p>
                    <span className="text-[10px] text-blue-300 font-medium mt-1 block">
                      {dailyPackageRedemptions} {isTh ? 'ใช้สิทธิ์แพ็คเกจ' : 'package uses'}
                    </span>
                  </div>

                  {/* Queue Status Breakdown */}
                  <div className="bg-[#0F172A] border border-slate-800 p-3.5 rounded-2xl col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-200">
                        {isTh ? 'สถานะคิวงานประจำวัน' : 'Daily Job Status'}
                      </span>
                      <span className="text-[10px] text-slate-400">{adminSelectedDate}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#060913] border border-slate-800/80 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">รอดำเนินการ</span>
                        <span className="text-base font-bold text-blue-300">{dailyPendingCount}</span>
                      </div>
                      <div className="bg-[#060913] border border-slate-800/80 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">กำลังล้าง</span>
                        <span className="text-base font-bold text-indigo-400">{dailyInProgressCount}</span>
                      </div>
                      <div className="bg-[#060913] border border-slate-800/80 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 block">พร้อมส่งมอบ</span>
                        <span className="text-base font-bold text-emerald-400">{dailyReadyCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Studio Intake Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWalkInModalOpen(true)}
                    className="bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isTh ? '+ รับรถ Walk-in (฿500)' : '+ Walk-in (฿500)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLockSlotModalOpen(true)}
                    className="bg-[#0F172A] hover:bg-slate-800 border border-slate-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isTh ? 'ล็อกช่องเวลา' : 'Lock Bay Slot'}</span>
                  </button>
                </div>

                {/* Today's Schedule Overview */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2">
                  <h3 className="text-xs font-bold text-slate-200">
                    {isTh ? `ตารางคิววันที่ ${adminSelectedDate}` : `Schedule for ${adminSelectedDate}`}
                  </h3>

                  {dailyBookings.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3 text-center">
                      {isTh ? 'ไม่มีคิวนัดหมายในวันนี้' : 'No bookings for this date.'}
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {dailyBookings.map((b) => (
                        <div
                          key={b.id}
                          className="bg-[#060913] border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-blue-400 mr-2">{b.timeSlot} น.</span>
                            <span className="text-slate-200 font-semibold">{b.carInfo}</span>
                            <span className="text-[10px] text-slate-400 block">{b.customerName}</span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.status === 'ready'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : b.status === 'pending'
                                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN SUB-TAB 2: BOOKINGS LIST & STATUS ADVANCEMENT */}
            {adminActiveTab === 'bookings' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200">
                    {isTh ? `รายการคิวทั้งหมด (${filteredAdminBookings.length} คัน)` : 'All Bookings'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setWalkInModalOpen(true)}
                    className="text-blue-400 hover:underline text-xs font-bold flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Walk-in ฿500</span>
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
                  {(['all', 'pending', 'inprogress', 'ready'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setAdminBookingFilter(filterKey)}
                      className={`px-2.5 py-1 rounded-lg border transition whitespace-nowrap ${
                        adminBookingFilter === filterKey
                          ? 'bg-blue-600 text-white border-blue-500 font-bold'
                          : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {filterKey === 'all'
                        ? 'ทั้งหมด'
                        : filterKey === 'pending'
                        ? 'รอดำเนินการ'
                        : filterKey === 'inprogress'
                        ? 'กำลังล้าง'
                        : 'พร้อมส่งมอบ'}
                    </button>
                  ))}
                </div>

                {filteredAdminBookings.length === 0 ? (
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-500">
                    {isTh ? 'ไม่มีรายการจองตามตัวกรองที่เลือก' : 'No bookings found.'}
                  </div>
                ) : (
                  filteredAdminBookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-blue-400">{b.id}</span>
                            <span className="text-xs font-bold text-white">{b.timeSlot} น.</span>
                            {b.paymentMethod === 'package' && (
                              <span className="text-[9px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800">
                                แพ็คเกจ ฿0
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-200 mt-1">{b.carInfo}</h4>
                          <p className="text-[11px] text-slate-400">
                            {b.customerName} • {b.phone}
                          </p>
                          {b.subOption && (
                            <p className="text-[10px] text-blue-300 mt-0.5">{b.subOption}</p>
                          )}
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-extrabold text-blue-400 block">
                            {b.paymentMethod === 'package' ? '฿0 (สิทธิ์)' : `฿${b.paidAmount?.toLocaleString()}`}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium">
                            {b.paymentStatus === 'paid' ? 'ชำระแล้ว' : 'ใช้สิทธิ์แพ็คเกจ'}
                          </span>
                        </div>
                      </div>

                      {/* Slip Attachment Check if present */}
                      {b.paymentSlipUrl && (
                        <div className="flex items-center gap-2 bg-[#060913] p-2 rounded-xl border border-slate-800 text-[11px]">
                          <img
                            src={b.paymentSlipUrl}
                            alt="slip"
                            className="w-8 h-8 rounded object-cover cursor-pointer hover:scale-105 transition"
                            onClick={() =>
                              setLightboxData({
                                open: true,
                                title: `สลิปโอนเงินคิว ${b.id}`,
                                caption: `${b.customerName} - ฿${b.paidAmount}`,
                                url: b.paymentSlipUrl!,
                              })
                            }
                          />
                          <span className="text-emerald-400 font-medium">แนบสลิปโอนเงินแล้ว (คลิกดูภาพ)</span>
                        </div>
                      )}

                      {/* Status Update Step Selector */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400">อัปเดตสเต็ป:</span>
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleUpdateBookingStage(b.id, e.target.value as BookingRecord['status'])
                            }
                            className="bg-[#060913] border border-slate-700 text-white text-[11px] px-2 py-1 rounded-lg outline-none focus:border-blue-500"
                          >
                            <option value="pending">รอดำเนินการ</option>
                            <option value="step1">1: รับรถ & ตรวจสภาพ</option>
                            <option value="step2">2: สลายคราบช่วงล่าง</option>
                            <option value="step3">3: ล้างโฟม pH 7</option>
                            <option value="step4">4: เช็ดแห้ง & คลีนภายใน</option>
                            <option value="ready">5: เสร็จสมบูรณ์ (พร้อมส่งมอบ)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => setCancelModalBooking(b)}
                          className="text-red-400 hover:text-red-300 text-[11px] font-medium flex items-center gap-1 active:scale-95"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>ยกเลิก</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ADMIN SUB-TAB 3: CUSTOMER PACKAGES MANAGEMENT */}
            {adminActiveTab === 'packages' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">
                      {isTh ? 'ตรวจสอบและจัดการแพ็คเกจลูกค้า' : 'Customer Packages'}
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      มีทั้งหมด {customerPackages.length} แพ็คเกจในระบบ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminNewPackageModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isTh ? '+ ออกแพ็คเกจ' : '+ Issue'}</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {customerPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-blue-300 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-500/30">
                              {pkg.id}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                pkg.status === 'active'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : pkg.status === 'exhausted'
                                  ? 'bg-slate-800 text-slate-400'
                                  : 'bg-red-950 text-red-400'
                              }`}
                            >
                              {pkg.status}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{pkg.packageNameTh}</h4>
                          <p className="text-[11px] text-slate-300">
                            {pkg.customerName} • {pkg.carInfo}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            โทร: {pkg.phone} • หมดอายุ: {pkg.expiryDate}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-blue-400">
                            {pkg.remainingQuota} / {pkg.totalQuota} ครั้ง
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ฿{pkg.pricePaid.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quota modifier actions */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">ปรับโควตาสิทธิ์:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustPackageQuota(pkg.id, -1)}
                            disabled={pkg.remainingQuota <= 0}
                            className="bg-[#060913] border border-slate-700 hover:border-slate-500 text-slate-200 px-2 py-0.5 rounded text-xs disabled:opacity-30 active:scale-95"
                          >
                            -1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustPackageQuota(pkg.id, 1)}
                            disabled={pkg.remainingQuota >= pkg.totalQuota}
                            className="bg-[#060913] border border-slate-700 hover:border-slate-500 text-slate-200 px-2 py-0.5 rounded text-xs disabled:opacity-30 active:scale-95"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelPackage(pkg.id)}
                            className="text-red-400 hover:text-red-300 ml-2 text-[11px] active:scale-95"
                          >
                            ยกเลิกแพ็คเกจ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ==================== VIEW 2: CUSTOMER FRONT-END ==================== */
          <div className="flex-1 flex flex-col">
            
            {/* Top 3-Pill Sub-Navigation with Micro-interactions */}
            <div className="grid grid-cols-3 gap-1 p-2 bg-[#060913] border-b border-slate-800">
              <button
                type="button"
                onClick={() => setCustomerTab('booking')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 ${
                  customerTab === 'booking'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md font-extrabold ring-1 ring-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isTh ? 'จองคิวล้างรถ' : 'Book Wash'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerTab('packages')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 ${
                  customerTab === 'packages'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md font-extrabold ring-1 ring-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>{isTh ? 'แพ็คเกจเหมาจ่าย' : 'Packages'}</span>
              </button>
              <button
                type="button"
                onClick={() => setCustomerTab('vault')}
                className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95 ${
                  customerTab === 'vault'
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md font-extrabold ring-1 ring-blue-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{isTh ? 'รถสด & แต้ม' : 'Tracker'}</span>
              </button>
            </div>

            {/* TAB 1: 📅 จองคิวล้างรถ (Luxury 3-Section Frictionless Flow) */}
            {customerTab === 'booking' ? (
              <div className="p-4 space-y-4">
                {/* Luxury Studio Hero Card (Styled in Deep Blue / Royal Sapphire) */}
                <div className="bg-gradient-to-br from-[#0F172A] via-[#0A0F1D] to-[#060913] border border-blue-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider bg-blue-950/80 border border-blue-500/30 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                        Beyond Clean. Professionally Detailed.
                      </span>
                      <h2 className="text-base font-extrabold text-white autoboutique-title-bar">
                        {isTh ? 'ล้างรถพรีเมียม & ดูดฝุ่นละเอียด' : 'Premium Hand Wash & Vacuum'}
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 pl-3">
                        {isTh
                          ? 'โฟม pH 7 ปลอดภัย 100% ต่อสีรถและชั้นเคลือบเซรามิก/PPF'
                          : '100% pH Neutral scratch-free studio detailing'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block uppercase">ราคาเริ่มต้น</span>
                      <span className="text-xl font-black text-blue-400">฿500</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isTh ? 'การันตีฝนตก 24 ชม. ล้างซ้ำฟรี' : '24-Hr Clean Guarantee'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowcaseModalOpen(true)}
                      className="text-blue-400 hover:underline font-semibold active:scale-95 transition"
                    >
                      {isTh ? 'ดูตัวอย่างงาน' : 'Preview'}
                    </button>
                  </div>
                </div>

                {/* SECTION 1: บริการล้างรถ & ออปชันเสริม (Service & Add-ons) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      1
                    </span>
                    <span>{isTh ? 'เลือกบริการและออปชันเสริม' : 'Choose Wash Options'}</span>
                  </label>

                  <div className="space-y-1.5">
                    {SERVICE_SUB_OPTIONS.wash.map((opt) => {
                      const isSelected = selectedSubOption === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedSubOption(opt.id)}
                          className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between text-xs active:scale-99 ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500 text-white shadow-md ring-1 ring-blue-500/30'
                              : 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold block flex items-center gap-1.5">
                              <span>{isTh ? opt.labelTh : opt.labelEn}</span>
                              {isSelected && <BadgeCheck className="w-3.5 h-3.5 text-blue-400" />}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              {opt.id === 'standard'
                                ? 'ล้างภายนอก โฟม 2 ถัง ดูดฝุ่น เช็ดแห้ง เคลือบยาง'
                                : opt.id === 'engine'
                                ? 'ล้างห้องเครื่องด้วยน้ำยาสลายคราบน้ำมันและเคลือบเงา'
                                : opt.id === 'wax'
                                ? 'ลงแว็กซ์สูตร Hydrophobic เงาลื่นลึก น้ำไม่เกาะ'
                                : 'ขัดกระจกบานหน้าและรอบคัน ไล่น้ำฝนทัศนวิสัยชัด'}
                            </span>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <span className="font-bold text-blue-400">
                              {opt.addPrice === 0 ? '฿500' : `+฿${opt.addPrice}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: เลือกวันและเวลานัดหมาย (Date & Time) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                        2
                      </span>
                      <span>{isTh ? 'เลือกวันและเวลาที่สะดวก' : 'Select Date & Time'}</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setCalendarModalOpen(true)}
                      className="text-blue-400 hover:underline text-xs font-medium flex items-center gap-1 active:scale-95 transition"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{isTh ? 'ปฏิทินล่วงหน้า' : 'Calendar'}</span>
                    </button>
                  </div>

                  {/* Week Selector */}
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          if (currentWeekIndex > 0) setCurrentWeekIndex((prev) => prev - 1);
                        }}
                        disabled={currentWeekIndex <= 0}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-blue-300">
                        {activeWeek.monthTh}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (currentWeekIndex < WEEKS_SCHEDULE.length - 1)
                            setCurrentWeekIndex((prev) => prev + 1);
                        }}
                        disabled={currentWeekIndex >= WEEKS_SCHEDULE.length - 1}
                        className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-1 text-center">
                      {activeWeek.dates.map((d) => (
                        <button
                          key={d.dateStr}
                          type="button"
                          disabled={d.isClosed}
                          onClick={() => setSelectedDate(d.dateStr)}
                          className={`p-2 rounded-xl border transition flex flex-col items-center justify-center active:scale-95 ${
                            d.isClosed
                              ? 'bg-slate-950/40 border-slate-900 text-slate-600 cursor-not-allowed opacity-30'
                              : selectedDate === d.dateStr
                              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 border-blue-400 text-white font-extrabold shadow-md'
                              : 'bg-[#060913] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] font-medium">{d.dayTh}</span>
                          <span className="font-bold text-xs mt-0.5">{d.dateNum.split(' ')[0]}</span>
                          {d.isClosed && (
                            <span className="text-[8px] text-red-400 font-bold">ปิด</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3-Column Time Slot Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {TIME_SLOTS.map((slot) => {
                      const avail = getSlotAvailability(selectedDate, slot, bookings, lockedSlots);
                      const isSelected = bookingTimeSlot === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={avail.isFull}
                          onClick={() => setBookingTimeSlot(slot)}
                          className={`p-2.5 rounded-xl border transition text-center flex flex-col items-center justify-between active:scale-95 ${
                            avail.isFull
                              ? 'bg-[#060913] border-slate-900 text-slate-600 opacity-40 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white font-extrabold shadow-md ring-2 ring-blue-500/50'
                              : 'bg-[#0F172A] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-bold text-xs">{slot} น.</span>
                          <span
                            className={`text-[9px] mt-1 font-bold ${
                              avail.isFull
                                ? 'text-red-400'
                                : isSelected
                                ? 'text-white'
                                : 'text-emerald-400'
                            }`}
                          >
                            {avail.isFull ? 'เต็ม' : `ว่าง ${avail.available} คัน`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: ข้อมูลรถและผู้จอง (Car & Contact) with Real-time Helpers */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                      3
                    </span>
                    <span>{isTh ? 'ข้อมูลรถและผู้จอง' : 'Vehicle & Contact'}</span>
                  </label>

                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                    <input
                      type="text"
                      value={formCar}
                      onChange={(e) => setFormCar(e.target.value.toUpperCase())}
                      placeholder="ยี่ห้อ / รุ่น / เลขทะเบียนรถ (เช่น BMW M2 กข 8888 ภูเก็ต)"
                      className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 uppercase tracking-wide transition"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="ชื่อผู้จอง"
                        className="bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 transition"
                      />
                      <div className="relative">
                        <input
                          type="tel"
                          value={formPhone}
                          onChange={(e) => setFormPhone(formatPhoneInput(e.target.value))}
                          placeholder="เบอร์โทรศัพท์ (08X-XXX-XXXX)"
                          className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 transition"
                        />
                        {isValidThaiPhone(formPhone) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 absolute right-2.5 top-3" />
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 pt-1 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={vipDelivery}
                        onChange={(e) => setVipDelivery(e.target.checked)}
                        className="rounded border-slate-700 text-blue-600 focus:ring-0"
                      />
                      <span>{isTh ? 'ต้องการบริการรับ-ส่งรถถึงที่ (VIP Concierge)' : 'VIP Pickup & Delivery'}</span>
                    </label>
                  </div>
                </div>

                {/* Summary & Checkout Action */}
                <div className="pt-2">
                  {/* If Customer has selected an active package to redeem */}
                  {activeRedeemPackage ? (
                    <div className="bg-gradient-to-r from-blue-950/90 to-[#0F172A] border border-blue-700 p-3.5 rounded-2xl space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                          <Ticket className="w-4 h-4 text-blue-400" />
                          <span>ใช้สิทธิ์แพ็คเกจ: {activeRedeemPackage.packageNameTh}</span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          คงเหลือ {activeRedeemPackage.remainingQuota} ครั้ง
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={!bookingTimeSlot}
                        onClick={() => handleCompleteBookingPayment('package', activeRedeemPackage.id)}
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition flex items-center justify-center gap-2 active:scale-98"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {bookingTimeSlot
                            ? isTh
                              ? `ยืนยันใช้สิทธิ์จองคิว ฿0 (${bookingTimeSlot} น.)`
                              : `Confirm ฿0 Booking (${bookingTimeSlot})`
                            : isTh
                            ? 'กรุณาเลือกเวลานัดหมาย'
                            : 'Select Time Slot First'}
                        </span>
                      </button>
                    </div>
                  ) : (
                    /* PromptPay QR Trigger */
                    <button
                      type="button"
                      disabled={!bookingTimeSlot}
                      onClick={() => {
                        setUploadedSlipPreview(null);
                        setSlipVerified(false);
                        setPromptPayModal({
                          open: true,
                          type: 'booking',
                          title: `จองคิวล้างรถพรีเมียม (${selectedDate} เวลา ${bookingTimeSlot} น.)`,
                          amount: currentPrice,
                        });
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white font-black py-3.5 rounded-xl text-xs shadow-xl shadow-blue-600/30 transition flex items-center justify-center gap-2 tracking-wide active:scale-98"
                    >
                      <QrCode className="w-4 h-4 text-white" />
                      <span>
                        {bookingTimeSlot
                          ? isTh
                            ? `สแกน PromptPay QR เพื่อจองคิว (฿${currentPrice.toLocaleString()})`
                            : `Scan PromptPay QR (฿${currentPrice.toLocaleString()})`
                          : isTh
                          ? 'กรุณาเลือกเวลานัดหมายด้านบน'
                          : 'Select Time Slot First'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : customerTab === 'packages' ? (
              /* TAB 2: 🎟️ แพ็คเกจเหมาจ่าย & วอชเชอร์ (Packages & Deals) */
              <div className="p-4 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-base font-extrabold text-white tracking-tight">
                    {isTh ? 'แพ็คเกจเหมาจ่ายสุดคุ้ม' : 'Car Wash Packages'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {isTh
                      ? 'เหมาจ่ายสุดคุ้ม ประหยัดสูงสุด พร้อมสิทธิ์จองคิวฟรี ฿0 ตลอดอายุการใช้งาน'
                      : 'Prepaid wash credits at member pricing'}
                  </p>
                </div>

                {/* Section 1: แพ็คเกจของฉัน (My Active Packages) */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-blue-400" />
                      <span>{isTh ? 'แพ็คเกจของฉัน' : 'My Active Packages'}</span>
                    </h3>
                    <span className="text-[11px] text-blue-400 font-semibold">
                      {customerPackages.filter((p) => p.status === 'active').length} {isTh ? 'รายการ' : 'active'}
                    </span>
                  </div>

                  {customerPackages.filter((p) => p.status === 'active').length === 0 ? (
                    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 text-center text-xs text-slate-500">
                      {isTh ? 'คุณยังไม่มีแพ็คเกจล้างรถ เลือกซื้อแพ็คเกจเหมาจ่ายสุดคุ้มด้านล่างได้ทันที' : 'No active packages.'}
                    </div>
                  ) : (
                    customerPackages
                      .filter((p) => p.status === 'active')
                      .map((pkg) => (
                        <div
                          key={pkg.id}
                          className="bg-[#0F172A] border border-blue-500/30 rounded-2xl p-3.5 space-y-2.5 relative overflow-hidden shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-500/40">
                              {pkg.packageNameTh}
                            </span>
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                              คงเหลือ {pkg.remainingQuota} / {pkg.totalQuota} ครั้ง
                            </span>
                          </div>

                          <div>
                            <p className="text-xs text-slate-200 font-medium">
                              {pkg.customerName} • {pkg.carInfo}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              รหัส: {pkg.id} • หมดอายุ: {pkg.expiryDate}
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.round((pkg.remainingQuota / pkg.totalQuota) * 100)}%` }}
                            />
                          </div>

                          {/* 1-Tap Book with this package */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPackageIdToRedeem(pkg.id);
                              setCustomerTab('booking');
                              setToastMessage(isTh ? `🎟️ เลือกใช้สิทธิ์ ${pkg.packageNameTh} เรียบร้อย` : 'Redeeming package');
                              setTimeout(() => setToastMessage(null), 3000);
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{isTh ? '📅 ใช้สิทธิ์จองคิวล้างรถ (฿0)' : 'Book with this package (฿0)'}</span>
                          </button>
                        </div>
                      ))
                  )}
                </div>

                {/* Section 2: เลือกซื้อแพ็คเกจเหมาจ่ายสุดคุ้ม (Official Deals Catalog) */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>{isTh ? 'เลือกซื้อแพ็คเกจเหมาจ่ายสุดคุ้ม' : 'Official Package Deals'}</span>
                  </h3>

                  {OFFICIAL_PACKAGES.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 space-y-3 relative hover:border-blue-500/40 transition shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-full">
                            {deal.badgeTh}
                          </span>
                          <h4 className="font-bold text-sm text-white mt-1.5">{deal.nameTh}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{deal.descriptionTh}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                            {isTh ? 'ราคาแพ็คเกจ' : 'Package Price'}
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-blue-400">฿{deal.price.toLocaleString()}</span>
                            <span className="text-xs text-slate-500 line-through">
                              ฿{(deal.totalUses * deal.singlePrice).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUploadedSlipPreview(null);
                            setSlipVerified(false);
                            setPromptPayModal({
                              open: true,
                              type: 'package',
                              title: `ซื้อ ${deal.nameTh}`,
                              amount: deal.price,
                              packageDraft: deal,
                            });
                          }}
                          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition shadow-md active:scale-95"
                        >
                          {isTh ? 'ซื้อแพ็คเกจนี้' : 'Buy Package'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section 3: 15-Minute Policy Card */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                    <Info className="w-4 h-4" />
                    <span>{isTh ? 'นโยบายการยกเลิกคืนสิทธิ์โควตา 15 นาที' : '15-Minute Cancellation Policy'}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {isTh
                      ? 'เมื่อใช้สิทธิ์แพ็คเกจจองคิว หากทำการยกเลิกภายใน 15 นาทีหลังจากจอง ระบบจะคืนสิทธิ์ให้ทันที 1 ครั้งเต็ม หากยกเลิกหลังจาก 15 นาที จะถือว่าเป็นการสละสิทธิ์ตามระเบียบสตูดิโอ'
                      : 'Cancellations within 15 minutes of booking creation receive a full package credit refund. After 15 minutes, credits are forfeited.'}
                  </p>
                </div>
              </div>
            ) : (
              /* TAB 3: 🚗 รถของฉัน, ติดตามสถานะสด & สะสมแต้ม (Live Tracker & Vault) */
              <div className="p-4 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={vehicleSearchQuery}
                    onChange={(e) => setVehicleSearchQuery(e.target.value)}
                    placeholder={isTh ? '🔍 ค้นหาด้วยทะเบียน หรือ รหัสจอง (เช่น กข 8888, BK-001)' : 'Search plate or ID...'}
                    className="w-full pl-9 pr-8 py-2 text-xs border border-slate-800 rounded-xl bg-[#0F172A] text-white outline-none focus:border-blue-500 transition"
                  />
                  {vehicleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVehicleSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Vehicle Selector (Cards) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {matchingVehicles.map((car) => {
                    const isSelected = car.id === currentTrackingCar.id;
                    return (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => setActiveCarId(car.id)}
                        className={`p-2.5 rounded-xl border text-left shrink-0 transition min-w-[140px] active:scale-95 ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md ring-1 ring-blue-500/40'
                            : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-blue-400 font-bold block">{car.id}</span>
                        <span className="font-bold text-xs truncate block text-slate-200">{car.carInfo}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{car.timeSlot} น.</span>
                      </button>
                    );
                  })}
                </div>

                {/* SECTION 1: 5-Stage Detailing Progress with Estimated Time */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <Timer className="w-3 h-3 text-blue-400" />
                        <span>คาดว่าเสร็จสิ้น: {getEstimatedCompletion(currentTrackingCar.timeSlot)} น.</span>
                      </span>
                      <h3 className="font-bold text-sm text-white mt-0.5">
                        {currentTrackingCar.carInfo}
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-500/40">
                      สเต็ป {trackerStage} / 5
                    </span>
                  </div>

                  {/* 5-Step Vertical Flow */}
                  <div className="space-y-3 pt-2">
                    {[1, 2, 3, 4, 5].map((stepNum) => {
                      const stepDetails = getStageDetails(stepNum, isTh);
                      const isCompleted = trackerStage > stepNum;
                      const isCurrent = trackerStage === stepNum;
                      const hasReached = trackerStage >= stepNum;

                      return (
                        <div key={stepNum} className="flex items-start gap-3 relative">
                          {/* Step number badge */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-500/25 font-black animate-pulse'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isCompleted ? '✓' : stepNum}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4
                                className={`text-xs font-bold ${
                                  isCurrent ? 'text-blue-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                                }`}
                              >
                                {isTh ? stepDetails.titleTh : stepDetails.titleEn}
                              </h4>
                              {isCurrent && (
                                <span className="text-[10px] bg-blue-950/80 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                                  {isTh ? 'กำลังล้าง' : 'In Progress'}
                                </span>
                              )}
                              {trackerStage === 5 && stepNum === 5 && (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  {isTh ? 'พร้อมส่งมอบ' : 'Ready'}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {isTh ? stepDetails.descTh : stepDetails.descEn}
                            </p>

                            {/* Inspection Photo for reached stages */}
                            {hasReached && (
                              <button
                                type="button"
                                onClick={() =>
                                  setLightboxData({
                                    open: true,
                                    title: isTh ? stepDetails.titleTh : stepDetails.titleEn,
                                    caption: isTh ? stepDetails.photoCaptionTh : stepDetails.photoCaptionEn,
                                    url: stepDetails.photoUrl,
                                  })
                                }
                                className="mt-2 flex items-center gap-2 group text-left active:scale-95 transition"
                              >
                                <div className="relative rounded-lg overflow-hidden border border-slate-700 w-16 h-11 shrink-0">
                                  <img
                                    src={stepDetails.photoUrl}
                                    alt="photo"
                                    className="w-full h-full object-cover group-hover:scale-105 transition"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center text-white text-[9px] font-semibold">
                                    <Camera className="w-3 h-3" />
                                  </div>
                                </div>
                                <span className="text-[10px] text-blue-400 underline font-medium">
                                  {isTh ? 'กดดูภาพถ่ายหน้างานจริง' : 'View live photo'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: การันตีความสะอาด 24 ชม. (Studio Cleanliness Guarantee) */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                    <div>
                      <h4 className="font-bold text-xs text-white">
                        {isTh ? warranty.titleTh : warranty.titleEn}
                      </h4>
                      <span className="text-[10px] text-slate-400">ID: {warranty.warrantyId}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isTh ? warranty.descTh : warranty.descEn}
                  </p>
                </div>

                {/* SECTION 3: บัตรสะสมแต้มล้างรถ (Autoboutique Wash Pass) */}
                <div className="bg-gradient-to-br from-[#0F172A] via-[#0A0F1D] to-[#060913] text-white border border-blue-500/30 rounded-2xl p-4 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] bg-blue-950/80 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase border border-blue-500/30">
                        VIP Loyalty Card
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1">AUTOBOUTIQUE WASH PASS</h4>
                    </div>
                    <span className="text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-1 rounded-lg shadow-sm">
                      {stampsCount} / 10 {isTh ? 'ดวง' : 'Stamps'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {isTh
                      ? 'สะสมครบ 10 ดวง รับสิทธิ์ล้างรถพรีเมียมฟรี 1 ครั้ง (มูลค่า ฿500)'
                      : 'Collect 10 stamps to get 1 free premium wash!'}
                  </p>

                  {/* Stamp grid */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                      const isStamped = num <= stampsCount;
                      const isReward = num === 10;
                      return (
                        <div
                          key={num}
                          className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition ${
                            isStamped
                              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 border-blue-400 text-white shadow-md'
                              : isReward
                              ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-600'
                          }`}
                        >
                          {isStamped ? '✓' : isReward ? '🎁' : num}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== FOOTER (Matching autoboutiqueth.com) ==================== */}
            <footer className="mt-auto border-t border-slate-800/80 bg-[#060913] px-4 py-6 text-center text-xs space-y-3">
              <div className="flex flex-col items-center justify-center gap-1">
                <img
                  src="/logo.png"
                  alt="Autoboutique"
                  className="h-7 w-auto object-contain brightness-110 drop-shadow"
                />
                <h4 className="text-sm font-extrabold text-white tracking-wider mt-1">
                  AUTOBOUTIQUE PHUKET
                </h4>
                <p className="text-[11px] text-slate-400">
                  Operated by C-Cube Automotive (Since 2008)
                </p>
                <p className="text-[11px] text-blue-400 italic font-medium">
                  “Luxury you can feel.”
                </p>
              </div>

              {/* Social Channels */}
              <div className="flex items-center justify-center gap-4 text-slate-400 pt-1">
                <a
                  href="https://www.facebook.com/autoboutiquebyccube/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition text-[11px] font-semibold flex items-center gap-1"
                >
                  Facebook
                </a>
                <span>•</span>
                <a
                  href="https://www.tiktok.com/@autoboutique_phuket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition text-[11px] font-semibold flex items-center gap-1"
                >
                  TikTok
                </a>
                <span>•</span>
                <a
                  href="https://bit.ly/2G7JXMY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition text-[11px] font-semibold flex items-center gap-1"
                >
                  LINE OA
                </a>
              </div>

              <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                © 2026 Autoboutique Phuket. Crafted for Perfection, Driven by Passion.
              </div>
            </footer>
          </div>
        )}

        {/* BOTTOM NAVIGATION (Mobile-First 3-Tab Bar for Customers) */}
        {view === 'customer' && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#060913]/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 z-40 flex items-center justify-around">
            <button
              type="button"
              onClick={() => setCustomerTab('booking')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition active:scale-90 ${
                customerTab === 'booking' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[10px]">{isTh ? 'จองคิว' : 'Booking'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomerTab('packages')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition active:scale-90 ${
                customerTab === 'packages' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span className="text-[10px]">{isTh ? 'แพ็คเกจ' : 'Packages'}</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomerTab('vault')}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition active:scale-90 ${
                customerTab === 'vault' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-4 h-4" />
              <span className="text-[10px]">{isTh ? 'สถานะสด' : 'Live Status'}</span>
            </button>
          </nav>
        )}

        {/* ==================== ALL MODALS & OVERLAYS ==================== */}

        {/* MODAL 0: BRAND STORY & PHILOSOPHY (Directly from autoboutiqueth.com/#about) */}
        {aboutModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAboutModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/40 rounded-3xl p-5 w-full max-w-sm text-left space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Studio Header Image */}
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 relative">
                <img
                  src="/c_cube.jpg"
                  alt="Autoboutique Studio"
                  className="w-full h-36 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/carwash.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <span className="text-[9px] font-black uppercase text-blue-300 bg-[#060913]/90 px-2 py-0.5 rounded border border-blue-500/40">
                    Est. 2008 • Phuket
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Autoboutique Overview
                </span>
                <h3 className="font-extrabold text-base text-white mt-1 autoboutique-title-bar">
                  Crafted for Perfection, Driven by Passion
                </h3>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[50vh] overflow-y-auto pr-1">
                <p>
                  <strong className="text-white">Autoboutique</strong> คือศูนย์บริการดูแล ตกแต่งรถยนต์ ระดับพรีเมียมในจังหวัดภูเก็ต ที่รวมทุกศิลปะของการดูแลรถเข้ากับความหรูหราเข้าด้วยกัน ทุกบริการของเราถูกออกแบบมาเพื่อสะท้อนรสนิยม และเสริมเสน่ห์ให้รถของคุณโดดเด่นในทุกมุมมอง และในทุกๆการขับขี่
                </p>

                <p>
                  เริ่มต้นจากความหลงใหลในดูแลตกแต่งรถยนต์ ภายใต้ชื่อเดิม <strong className="text-white">C-Cube Automotive</strong> ซึ่งก่อตั้งขึ้นในปี 2008 และในปี 2024 เรารีแบรนด์เป็น <strong>Autoboutique</strong> เพื่อสะท้อนตัวตนใหม่ที่หรูหรา ทันสมัย และใส่ใจในทุกรายละเอียดมากยิ่งขึ้น
                </p>

                {/* The Vision Behind the Shine Quote Box */}
                <div className="bg-[#060913] border-l-4 border-blue-500 p-3 rounded-r-xl space-y-1">
                  <h4 className="font-bold text-xs text-blue-400">The Vision Behind the Shine</h4>
                  <p className="text-[11px] text-white italic">
                    “รถไม่ใช่แค่พาหนะ แต่มันคือความภาคภูมิใจที่ควรได้รับการดูแลอย่างประณีตที่สุด”
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    “Beyond a ride — it’s pride, and it deserves perfection.”
                  </p>
                </div>

                {/* 4 Core Pillars */}
                <div className="space-y-2 pt-1">
                  <h4 className="font-bold text-xs text-white">4 เสาหลักแห่งมาตรฐาน Autoboutique:</h4>
                  <ul className="space-y-1.5 text-[11px] text-slate-300">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Perfection in Every Detail:</strong> ใส่ใจในทุกจุด แม้ในส่วนที่มองไม่เห็น</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Premium Personalization:</strong> บริการระดับพรีเมียมปรับให้ตรงกับความต้องการของลูกค้า</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Integrity & Trust:</strong> ซื่อสัตย์ จริงใจ บนพื้นฐานของความโปร่งใส</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Innovative Craftsmanship:</strong> เลือกใช้วัสดุและเทคโนโลยีที่ดีที่สุด</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAboutModalOpen(false)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-extrabold py-2.5 rounded-xl text-xs shadow-md transition active:scale-98"
              >
                เข้าใจแล้ว • เข้าสู่หน้าจองคิว
              </button>
            </div>
          </div>
        )}

        {/* MODAL 1: ENFORCED PromptPay QR Code Modal with Slip Verification Proof */}
        {promptPayModal.open && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPromptPayModal({ open: false, type: 'booking', title: '', amount: 0 });
                setUploadedSlipPreview(null);
                setSlipVerified(false);
              }
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 w-full max-w-sm text-center space-y-3.5 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => {
                  setPromptPayModal({ open: false, type: 'booking', title: '', amount: 0 });
                  setUploadedSlipPreview(null);
                  setSlipVerified(false);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Official PromptPay Header */}
              <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-2.5 rounded-2xl border border-blue-400/30 flex items-center justify-between px-3">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-white" />
                  <span className="font-extrabold text-[11px] tracking-wider">THAI QR PAYMENT</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-200 font-mono bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-400/30">
                  <Timer className="w-3 h-3 text-blue-300" />
                  <span>{formatCountdown(qrCountdown)}</span>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-300">{promptPayModal.title}</h3>
                <p className="text-2xl font-black text-blue-400 mt-1">
                  ฿{promptPayModal.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">หจก. ซี-คิวบ์ ออโตโมทีฟ (Autoboutique Phuket)</p>
              </div>

              {/* High-Resolution PromptPay QR SVG Graphic */}
              <div className="bg-white p-3.5 rounded-2xl inline-block shadow-xl border-4 border-slate-100">
                <svg className="w-40 h-40 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="25" height="25" fill="#0F172A" />
                  <rect x="8" y="8" width="19" height="19" fill="#FFFFFF" />
                  <rect x="12" y="12" width="11" height="11" fill="#0F172A" />

                  <rect x="70" y="5" width="25" height="25" fill="#0F172A" />
                  <rect x="73" y="8" width="19" height="19" fill="#FFFFFF" />
                  <rect x="77" y="12" width="11" height="11" fill="#0F172A" />

                  <rect x="5" y="70" width="25" height="25" fill="#0F172A" />
                  <rect x="8" y="73" width="19" height="19" fill="#FFFFFF" />
                  <rect x="12" y="77" width="11" height="11" fill="#0F172A" />

                  {/* QR Dots Pattern */}
                  <rect x="35" y="10" width="8" height="8" fill="#0F172A" />
                  <rect x="50" y="15" width="8" height="8" fill="#0F172A" />
                  <rect x="40" y="30" width="6" height="6" fill="#0F172A" />
                  <rect x="60" y="35" width="8" height="8" fill="#0F172A" />
                  <rect x="45" y="45" width="10" height="10" fill="#1D4ED8" />
                  <rect x="35" y="60" width="8" height="8" fill="#0F172A" />
                  <rect x="55" y="65" width="6" height="6" fill="#0F172A" />
                  <rect x="70" y="70" width="8" height="8" fill="#0F172A" />
                  <rect x="40" y="80" width="8" height="8" fill="#0F172A" />
                  <rect x="80" y="85" width="8" height="8" fill="#0F172A" />
                </svg>
              </div>

              {/* Copy PromptPay ID */}
              <div className="flex items-center justify-between bg-[#060913] px-3 py-2 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-400">พร้อมเพย์: <strong className="text-white">096-636-9933</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText('0966369933');
                      }
                    } catch (e) {}
                    setPromptPayCopied(true);
                    setToastMessage('📋 คัดลอกเลขพร้อมเพย์เรียบร้อย');
                    setTimeout(() => {
                      setPromptPayCopied(false);
                      setToastMessage(null);
                    }, 2500);
                  }}
                  className="text-blue-400 hover:underline font-bold flex items-center gap-1 text-[11px] active:scale-95 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{promptPayCopied ? 'คัดลอกแล้ว!' : 'คัดลอก'}</span>
                </button>
              </div>

              {/* ENFORCED SLIP VERIFICATION SECTION (With Drag & Drop) */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`bg-[#060913] p-3 rounded-2xl border transition text-left space-y-2 ${
                  isDragOver ? 'border-blue-400 bg-blue-950/20' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                    <span>แนบสลิปเพื่อยืนยันการชำระเงิน</span>
                  </span>
                  {slipVerified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                      ตรวจสอบผ่านแล้ว
                    </span>
                  )}
                </div>

                {/* Upload Zone */}
                {uploadedSlipPreview ? (
                  <div className="flex items-center gap-2.5 bg-[#0F172A] p-2 rounded-xl border border-emerald-500/40">
                    <img
                      src={uploadedSlipPreview}
                      alt="slip"
                      className="w-10 h-10 object-cover rounded-lg border border-slate-700"
                    />
                    <div className="flex-1 text-[11px]">
                      <p className="font-bold text-emerald-400">แนบสลิปสำเร็จ (Slip Attached)</p>
                      <p className="text-[10px] text-slate-400">ยอดเงิน ฿{promptPayModal.amount.toLocaleString()}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedSlipPreview(null);
                        setSlipVerified(false);
                      }}
                      className="text-slate-400 hover:text-red-400 p-1 active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {/* Hidden Real File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleSlipFileUpload}
                      className="hidden"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isVerifyingSlip}
                        className="bg-[#0F172A] hover:bg-slate-800 text-slate-200 text-xs font-semibold py-2 px-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-400" />
                        <span>อัปโหลดสลิป</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSimulateSlipUpload}
                        disabled={isVerifyingSlip}
                        className="bg-[#0F172A] hover:bg-slate-800 text-blue-300 text-xs font-semibold py-2 px-2.5 rounded-xl border border-blue-500/30 transition flex items-center justify-center gap-1 active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>สลิปตัวอย่าง</span>
                      </button>
                    </div>

                    {isVerifyingSlip && (
                      <div className="text-center py-1 text-[11px] text-blue-400 animate-pulse font-medium">
                        ⏳ กำลังตรวจสอบสลิปการโอนเงิน...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ENFORCED ACTION BUTTON: Disabled if slip is not attached */}
              {slipVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    if (promptPayModal.type === 'booking') {
                      handleCompleteBookingPayment('promptpay');
                    } else if (promptPayModal.packageDraft) {
                      handleCompletePackagePayment(promptPayModal.packageDraft);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันสลิปถูกต้อง & เสร็จสิ้นการจอง</span>
                </button>
              ) : (
                <div className="space-y-1">
                  <button
                    type="button"
                    disabled
                    className="w-full bg-slate-800 text-slate-500 font-bold py-3.5 rounded-xl text-xs cursor-not-allowed border border-slate-700 flex items-center justify-center gap-1.5 opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    <span>กรุณาสแกน QR และแนบสลิปโอนเงินก่อนยืนยัน</span>
                  </button>
                  <p className="text-[10px] text-slate-500">
                    *ระบบจะปลดล็อกปุ่มยืนยันทันทีหลังจากท่านอัปโหลดหรือกดสลิปตัวอย่าง
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: Official Digital Receipt Modal (High-End Printable VIP Detailing Ticket) */}
        {bookingReceiptModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setBookingReceiptModal(null);
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 w-full max-w-sm text-left space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setBookingReceiptModal(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close receipt"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center pb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold text-blue-400 tracking-wider uppercase">
                  Digital Booking Receipt
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">AUTOBOUTIQUE PHUKET</h3>
                <p className="text-[10px] text-slate-400">หจก. ซี-คิวบ์ ออโตโมทีฟ • โทร 096 636 9933</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">รหัสการจอง:</span>
                  <span className="font-mono font-bold text-blue-400">{bookingReceiptModal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">วันและเวลานัดหมาย:</span>
                  <span className="font-bold text-white">
                    {bookingReceiptModal.date} ({bookingReceiptModal.timeSlot} น.)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ลูกค้า:</span>
                  <span className="text-slate-200">{bookingReceiptModal.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">รถยนต์:</span>
                  <span className="font-bold text-white">{bookingReceiptModal.carInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">บริการ:</span>
                  <span className="text-slate-200">{bookingReceiptModal.service}</span>
                </div>
                {bookingReceiptModal.subOption && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">ออปชันเสริม:</span>
                    <span className="text-blue-300">{bookingReceiptModal.subOption}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <span className="font-bold text-slate-300">ยอดชำระ:</span>
                  <span className="font-bold text-emerald-400">
                    {bookingReceiptModal.paymentMethod === 'package'
                      ? 'สิทธิ์แพ็คเกจ (฿0)'
                      : `฿${bookingReceiptModal.paidAmount?.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#060913] hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-400" />
                  <span>พิมพ์ใบเสร็จ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const text = `🚗 คิวนัดหมาย Autoboutique Phuket\nรหัส: ${bookingReceiptModal.id}\nรถ: ${bookingReceiptModal.carInfo}\nวันที่: ${bookingReceiptModal.date} เวลา ${bookingReceiptModal.timeSlot} น.`;
                    try {
                      if (navigator.share) {
                        navigator.share({ title: 'Autoboutique Booking', text });
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                        setReceiptCopied(true);
                        setTimeout(() => setReceiptCopied(false), 2000);
                      }
                    } catch (e) {}
                  }}
                  className="bg-[#060913] hover:bg-slate-800 text-blue-300 font-bold py-2 rounded-xl text-xs border border-blue-500/30 transition flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{receiptCopied ? 'คัดลอกแล้ว!' : 'แชร์คิว'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBookingReceiptModal(null)}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition active:scale-98"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: Admin Security PIN Modal */}
        {adminPinModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setAdminPinModalOpen(false);
                setPinInput('');
                setPinError(false);
              }
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 w-full max-w-xs text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => {
                  setAdminPinModalOpen(false);
                  setPinInput('');
                  setPinError(false);
                }}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close PIN modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
                <Lock className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-white">Admin Security Access</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">กรุณาใส่รหัส PIN 4 หลักเพื่อเข้าหลังบ้าน</p>
              </div>

              {/* PIN bullets */}
              <div className="flex justify-center gap-3 py-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border transition ${
                      pinInput.length > idx
                        ? 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                        : 'bg-[#060913] border-slate-800'
                    }`}
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-red-400 text-xs font-semibold animate-shake">
                  รหัส PIN ไม่ถูกต้อง (ลอง 1234 หรือ 8888)
                </p>
              )}

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '➔'].map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (key === 'C') {
                        setPinInput('');
                        setPinError(false);
                      } else if (key === '➔') {
                        handlePinSubmit();
                      } else if (pinInput.length < 4) {
                        const next = pinInput + key;
                        setPinInput(next);
                        if (next.length === 4) {
                          if (verifyAdminPin(next)) {
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
                        }
                      }
                    }}
                    className="h-11 rounded-xl bg-[#060913] border border-slate-800 hover:border-blue-500/40 text-white font-bold text-sm transition active:scale-95"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: Cancel Booking Modal with 15-Minute Policy Protection */}
        {cancelModalBooking && (() => {
          const policy = checkCancellationPackagePolicy(cancelModalBooking);
          return (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setCancelModalBooking(null);
              }}
            >
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-4 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
                <button
                  type="button"
                  onClick={() => setCancelModalBooking(null)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-white"
                  aria-label="Close cancel modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div>
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                    ยืนยันการยกเลิกคิว
                  </span>
                  <h3 className="font-bold text-base text-white mt-1.5">
                    ยกเลิกคิว {cancelModalBooking.id}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cancelModalBooking.customerName} • {cancelModalBooking.carInfo}
                  </p>
                </div>

                {policy.isPackageBooking && (
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed ${
                      policy.willRefundQuota
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : 'bg-blue-950/40 border-blue-800 text-blue-300'
                    }`}
                  >
                    <p className="font-bold mb-1">
                      {policy.willRefundQuota ? '✅ คืนโควตาแพ็คเกจ 1 ครั้ง' : '⚠️ หักสิทธิ์ตามกฎระเบียบ 15 นาที'}
                    </p>
                    <p className="text-[11px]">{policy.messageTh}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancelModalBooking(null)}
                    className="flex-1 bg-[#060913] hover:bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs border border-slate-700 transition active:scale-95"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancelBooking}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-95"
                  >
                    ยืนยันยกเลิก
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL 5: Walk-in Modal for Admin (Flat ฿500 Rate) */}
        {walkInModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setWalkInModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setWalkInModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close walk-in modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Admin Intake
                </span>
                <h3 className="font-bold text-sm text-white mt-1">รับรถ Walk-in หน้าร้าน (฿500)</h3>
              </div>

              <input
                type="text"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="ชื่อลูกค้า"
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500"
              />

              <input
                type="text"
                value={walkInCar}
                onChange={(e) => setWalkInCar(e.target.value.toUpperCase())}
                placeholder="ข้อมูลรถ / ทะเบียน (เช่น Porsche 911 กข 9999)"
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500 uppercase"
              />

              <select
                value={walkInTime}
                onChange={(e) => setWalkInTime(e.target.value)}
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2.5 rounded-xl outline-none focus:border-blue-500"
              >
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    รอบ {t} น.
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleCreateWalkIn}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-extrabold py-2.5 rounded-xl text-xs transition shadow-md active:scale-98"
              >
                บันทึกคิว Walk-in ทันที (฿500)
              </button>
            </div>
          </div>
        )}

        {/* MODAL 6: Admin Issue New Customer Package Modal */}
        {adminNewPackageModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAdminNewPackageModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setAdminNewPackageModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close package modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Admin Package Issuer
                </span>
                <h3 className="font-bold text-sm text-white mt-1">ออกแพ็คเกจใหม่ให้ลูกค้า</h3>
              </div>

              <select
                value={newPkgSelectedDealId}
                onChange={(e) => setNewPkgSelectedDealId(e.target.value)}
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500"
              >
                {OFFICIAL_PACKAGES.map((deal) => (
                  <option key={deal.id} value={deal.id}>
                    {deal.nameTh} - ฿{deal.price.toLocaleString()}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={newPkgCustomerName}
                onChange={(e) => setNewPkgCustomerName(e.target.value)}
                placeholder="ชื่อลูกค้า"
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500"
              />

              <input
                type="tel"
                value={newPkgPhone}
                onChange={(e) => setNewPkgPhone(formatPhoneInput(e.target.value))}
                placeholder="เบอร์โทรศัพท์ (08X-XXX-XXXX)"
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500"
              />

              <input
                type="text"
                value={newPkgCar}
                onChange={(e) => setNewPkgCar(e.target.value.toUpperCase())}
                placeholder="รถยนต์ / ทะเบียน"
                className="w-full bg-[#060913] border border-slate-800 text-white text-xs px-3 py-2 rounded-xl outline-none focus:border-blue-500 uppercase"
              />

              <button
                type="button"
                onClick={handleAdminIssueNewPackage}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition active:scale-98"
              >
                ออกแพ็คเกจให้ลูกค้าทันที
              </button>
            </div>
          </div>
        )}

        {/* MODAL 7: Lock Slot Modal */}
        {lockSlotModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLockSlotModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setLockSlotModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close lock slot modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Capacity Manager
                </span>
                <h3 className="font-bold text-sm text-white mt-1">ล็อกช่องเวลา (ปิดปรับปรุง)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">วันที่: {adminSelectedDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const key = `${adminSelectedDate}_${slot}`;
                  const isLocked = lockedSlots.includes(key);
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setLockedSlots((prev) =>
                          isLocked ? prev.filter((k) => k !== key) : [...prev, key]
                        );
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between active:scale-95 ${
                        isLocked
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-[#060913] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{slot} น.</span>
                      {isLocked ? <Lock className="w-3.5 h-3.5 text-red-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-500" />}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setLockSlotModalOpen(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition active:scale-98"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        )}

        {/* MODAL 8: Photo Lightbox Modal */}
        {lightboxData.open && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setLightboxData({ open: false, title: '', caption: '', url: '' });
            }}
          >
            <div className="max-w-md w-full space-y-3 relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setLightboxData({ open: false, title: '', caption: '', url: '' })}
                className="absolute right-0 -top-8 text-white/80 hover:text-white"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <img src={lightboxData.url} alt="lightbox" className="w-full h-auto max-h-[70vh] object-contain" />
              </div>

              <div className="bg-[#0F172A] border border-slate-800 p-3 rounded-xl text-xs">
                <h4 className="font-bold text-white">{lightboxData.title}</h4>
                <p className="text-slate-400 text-[11px] mt-0.5">{lightboxData.caption}</p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 9: Service Showcase Modal (ดูตัวอย่างงาน) */}
        {showcaseModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowcaseModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowcaseModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close showcase"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Showcase Gallery
                </span>
                <h3 className="font-bold text-sm text-white mt-1">
                  {isTh ? currentShowcase.titleTh : currentShowcase.titleEn}
                </h3>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                {(isTh ? currentShowcase.highlightsTh : currentShowcase.highlightsEn).map((hl, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {currentShowcase.images.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={img.url} alt="showcase" className="w-full h-24 object-cover" />
                    <p className="p-1.5 text-[9px] text-slate-400 truncate">
                      {isTh ? img.captionTh : img.captionEn}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowcaseModalOpen(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold py-2.5 rounded-xl text-xs transition active:scale-98"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

        {/* MODAL 10: Advance Calendar Modal (6 Months Jump) */}
        {calendarModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setCalendarModalOpen(false);
            }}
          >
            <div className="bg-[#0F172A] border border-blue-500/30 rounded-3xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative text-left animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setCalendarModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
                aria-label="Close calendar modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
                  Advance Schedule
                </span>
                <h3 className="font-bold text-sm text-white mt-1">เลือกวันนัดหมายล่วงหน้า</h3>
              </div>

              {/* Month Selector Pills */}
              <div className="flex flex-wrap gap-1 text-[11px]">
                {ADVANCE_MONTHS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setCalendarModalMonth({ year: m.year, month: m.month })}
                    className={`px-2.5 py-1 rounded-lg border transition active:scale-95 ${
                      calendarModalMonth.year === m.year && calendarModalMonth.month === m.month
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 font-extrabold'
                        : 'bg-[#060913] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isTh ? m.shortTh : m.shortEn}
                  </button>
                ))}
              </div>

              {/* Days Grid */}
              {(() => {
                const { days, startOffset } = getCalendarDaysForMonth(
                  calendarModalMonth.year,
                  calendarModalMonth.month
                );
                return (
                  <div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 font-bold mb-1">
                      <span>จ.</span>
                      <span>อ.</span>
                      <span>พ.</span>
                      <span>พฤ.</span>
                      <span>ศ.</span>
                      <span>ส.</span>
                      <span className="text-red-400">อา.</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {days.map((d) => (
                        <button
                          key={d.dateStr}
                          type="button"
                          disabled={d.isClosed || d.isPast}
                          onClick={() => {
                            setSelectedDate(d.dateStr);
                            setCalendarModalOpen(false);
                            setToastMessage(`📅 เลือกวันที่ ${d.dateStr} เรียบร้อย`);
                            setTimeout(() => setToastMessage(null), 2500);
                          }}
                          className={`p-1.5 rounded-lg border transition text-center active:scale-95 ${
                            d.isClosed || d.isPast
                              ? 'opacity-30 border-slate-900 cursor-not-allowed text-slate-600'
                              : selectedDate === d.dateStr
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400 text-white font-extrabold'
                              : 'bg-[#060913] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {d.dayNum}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <button
                type="button"
                onClick={() => setCalendarModalOpen(false)}
                className="w-full bg-[#060913] hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs border border-slate-700 transition active:scale-98"
              >
                ปิด
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
