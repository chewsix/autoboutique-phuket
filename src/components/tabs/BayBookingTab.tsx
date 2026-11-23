'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SERVICE_ITEMS, VEHICLE_SIZES } from '@/data/mockData';
import { VehicleSize, ServiceItem } from '@/types';
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
  Info,
  CalendarCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetailingSlotConfig {
  time: string;
  max: number;
}

const DETAILING_SLOTS: DetailingSlotConfig[] = [
  { time: '08:30 - 10:00', max: 2 },
  { time: '10:00 - 11:30', max: 2 },
  { time: '13:00 - 14:30', max: 2 },
  { time: '15:00 - 16:30', max: 2 },
];

export const BayBookingTab: React.FC = () => {
  const {
    language,
    selectedVehicleSize,
    setSelectedVehicleSize,
    prefilledService,
    setPrefilledService,
    prefilledWarrantyBooking,
    setPrefilledWarrantyBooking,
    bookings,
    addBooking,
    setCustomerTab,
    setSelectedJobId,
  } = useApp();

  const isTh = language === 'th';

  // Get tomorrow or today as default date formatted YYYY-MM-DD
  const getTodayOrNextWorkingDate = () => {
    const d = new Date();
    // If today is Sunday (day 0), advance to Monday
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    prefilledService?.id || 'ceramic-kenzo-2'
  );
  const [bookingDate, setBookingDate] = useState<string>(getTodayOrNextWorkingDate());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('08:30 - 10:00');
  const [cleanroomDropoffTime, setCleanroomDropoffTime] = useState<string>('09:00');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [carBrand, setCarBrand] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [province, setProvince] = useState<string>('ภูเก็ต');
  const [notes, setNotes] = useState<string>('');

  // Submission feedback state
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [isSundayWarning, setIsSundayWarning] = useState<boolean>(false);

  // Sync when prefilledService or warranty booking changes
  useEffect(() => {
    if (prefilledService) {
      setSelectedServiceId(prefilledService.id);
    }
  }, [prefilledService]);

  useEffect(() => {
    if (prefilledWarrantyBooking) {
      setCustomerName(prefilledWarrantyBooking.customerName);
      setCustomerPhone(prefilledWarrantyBooking.customerPhone);
      setCarModel(prefilledWarrantyBooking.carModel);
      setLicensePlate(prefilledWarrantyBooking.licensePlate);
      setNotes(`นัดตรวจสภาพระยะ E-Warranty: ${prefilledWarrantyBooking.warrantyNumber}`);
    }
  }, [prefilledWarrantyBooking]);

  const currentService =
    SERVICE_ITEMS.find((s) => s.id === selectedServiceId) || SERVICE_ITEMS[0];

  const isCleanroom = currentService.bayType === 'cleanroom';

  // Check if chosen date is Sunday
  useEffect(() => {
    if (bookingDate) {
      const parts = bookingDate.split('-');
      const pickedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      setIsSundayWarning(pickedDate.getDay() === 0);
    }
  }, [bookingDate]);

  // Calculate dynamic capacity for Detailing slots on chosen date
  const getSlotAvailability = (slotTime: string) => {
    const bookedOnDate = bookings.filter(
      (b) =>
        b.bookingDate === bookingDate &&
        b.timeSlot === slotTime &&
        b.status !== 'cancelled'
    ).length;
    const remaining = Math.max(0, 2 - bookedOnDate);
    return {
      booked: bookedOnDate,
      remaining,
      isFull: remaining === 0,
    };
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookingDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSundayWarning) {
      alert(
        isTh
          ? 'ขออภัย สตูดิโอปิดให้บริการในวันอาทิตย์ กรุณาเลือกวันจันทร์ถึงเสาร์'
          : 'Autoboutique Studio is closed on Sundays. Please select Mon-Sat.'
      );
      return;
    }

    const price = currentService.pricing[selectedVehicleSize] || 0;

    const newBooking = addBooking({
      customerName,
      customerPhone,
      carBrand,
      carModel,
      licensePlate,
      province,
      vehicleSize: selectedVehicleSize,
      serviceId: currentService.id,
      serviceNameTh: currentService.nameTh,
      serviceNameEn: currentService.nameEn,
      bayType: currentService.bayType,
      bookingDate,
      timeSlot: isCleanroom ? `Drop-off ${cleanroomDropoffTime}` : selectedTimeSlot,
      status: 'confirmed',
      priceEstimate: price,
      notes: notes || undefined,
    });

    setSubmittedBookingId(newBooking.id);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0EA5E9', '#2563EB', '#38BDF8', '#FFFFFF'],
      });
    } catch (err) {
      // ignore
    }
  };

  const resetForm = () => {
    setSubmittedBookingId(null);
    setPrefilledService(null);
    setPrefilledWarrantyBooking(null);
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Tab Header Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              <Shield className="h-3.5 w-3.5 text-cyan-400" />
              <span>
                {isTh ? 'LINE Rich Menu Button 3: ระบบจองคิวช่องบริการสตูดิโอ' : 'LINE OA Menu 3: Smart Bay Separation Booking'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isTh ? 'จองคิวเข้ารับบริการ (Online Bay Reservation)' : 'Reserve Studio Bay Slot'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              {isTh
                ? 'จัดสรรช่องบริการเฉพาะ: ช่อง Detailing และห้องคลีนรูมปลอดฝุ่นควบคุมอุณหภูมิ 22°C'
                : 'Smart scheduling for Detailing Bays & Temperature-Controlled Cleanrooms.'}
            </p>
          </div>

          <div className="rounded-xl border border-dark-800 bg-dark-900/90 px-3.5 py-2 text-right shrink-0">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
              {isTh ? 'เวลาทำการสตูดิโอ' : 'Operating Hours'}
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              จันทร์ - เสาร์ 08:30 - 18:00
            </span>
            <span className="text-[10px] text-red-400 block font-medium">
              {isTh ? '(หยุดทุกวันอาทิตย์)' : '(Closed Sundays)'}
            </span>
          </div>
        </div>
      </div>

      {/* Success Confirmation Card */}
      {submittedBookingId ? (
        <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-b from-dark-850 to-dark-950 p-6 text-center space-y-4 shadow-2xl animate-fade-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-cyan-glow/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div className="space-y-1">
            <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              {isTh ? 'จองคิวสำเร็จ • ยืนยันในระบบเรียบร้อย' : 'Booking Confirmed in Studio System'}
            </span>
            <h2 className="text-xl font-bold text-white mt-2">
              {isTh ? 'ขอบพระคุณที่ไว้วางใจ Autoboutique Phuket' : 'Thank You for Choosing Autoboutique'}
            </h2>
            <p className="text-xs text-gray-300">
              {isTh
                ? 'รหัสการจองของท่านได้ถูกบรรจุลงในระบบจัดการคิวของสตูดิโอแล้ว'
                : 'Your reservation is registered into our studio scheduling workflow.'}
            </p>
          </div>

          <div className="mx-auto max-w-sm rounded-xl border border-dark-800 bg-dark-900 p-4 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-dark-800 pb-2">
              <span className="text-gray-400">{isTh ? 'รหัสการจอง:' : 'Booking ID:'}</span>
              <span className="font-mono font-bold text-cyan-300">{submittedBookingId}</span>
            </div>
            <div className="flex justify-between border-b border-dark-800 pb-2">
              <span className="text-gray-400">{isTh ? 'รถยนต์:' : 'Vehicle:'}</span>
              <span className="font-bold text-white">{carBrand} {carModel} ({licensePlate})</span>
            </div>
            <div className="flex justify-between border-b border-dark-800 pb-2">
              <span className="text-gray-400">{isTh ? 'บริการ:' : 'Service:'}</span>
              <span className="font-semibold text-cyan-300">{isTh ? currentService.nameTh : currentService.nameEn}</span>
            </div>
            <div className="flex justify-between border-b border-dark-800 pb-2">
              <span className="text-gray-400">{isTh ? 'วันที่ & ช่องบริการ:' : 'Date & Bay:'}</span>
              <span className="font-medium text-gray-200">
                {bookingDate} • {isCleanroom ? `Drop-off ${cleanroomDropoffTime}` : selectedTimeSlot}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-400">{isTh ? 'ราคาประเมิน:' : 'Est. Price:'}</span>
              <span className="font-bold text-white font-mono text-base flex items-baseline gap-1">
                <span className="text-cyan-400 text-xs">฿</span>
                <span>{(currentService.pricing[selectedVehicleSize] || 0).toLocaleString()}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setCustomerTab('tracker');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 px-6 py-2.5 text-xs font-bold text-white shadow-cyan-glow/30 transition-all"
            >
              <span>{isTh ? 'ดูสถานะรถใน Live Tracker' : 'Track Car in Live Tracker'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={resetForm}
              className="w-full sm:w-auto rounded-xl border border-dark-700 bg-dark-800 px-5 py-2.5 text-xs font-medium text-gray-300 hover:text-white transition-all"
            >
              {isTh ? 'จองคันอื่นเพิ่มเติม' : 'Book Another Vehicle'}
            </button>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sunday Alert Banner */}
          {isSundayWarning && (
            <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3.5 flex items-start gap-2.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">
                  {isTh ? 'สตูดิโอปิดทำการในวันอาทิตย์' : 'Studio is Closed on Sundays'}
                </span>
                <p className="text-[11px] text-red-300 mt-0.5">
                  {isTh
                    ? 'กรุณาเลือกวันจันทร์ถึงเสาร์ เพื่อให้ระบบยืนยันคิวช่างผู้ชำนาญการและเตรียมห้องสตูดิโอ'
                    : 'Please choose Monday to Saturday for studio bay preparation.'}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Choose Service & Size */}
          <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>{isTh ? '1. เลือกบริการและขนาดตัวถัง' : '1. Service & Vehicle Classification'}</span>
            </h2>

            {/* Service Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                {isTh ? 'แพ็กเกจบริการที่ต้องการ' : 'Select Service Package'}
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
              >
                {SERVICE_ITEMS.map((service) => (
                  <option key={service.id} value={service.id}>
                    [{service.brandPartner}] {isTh ? service.nameTh : service.nameEn} — ฿
                    {(service.pricing[selectedVehicleSize] || 0).toLocaleString()} (
                    {service.bayType === 'detailing' ? 'Detailing Bay' : 'Studio Cleanroom'})
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Size Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-300">
                  {isTh ? 'ขนาดตัวถังรถ (Vehicle Size)' : 'Vehicle Size Classification'}
                </label>
                <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {isTh ? `ขนาดปัจจุบัน: ${selectedVehicleSize}` : `Selected: Size ${selectedVehicleSize}`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {VEHICLE_SIZES.map((size) => (
                  <button
                    type="button"
                    key={size.id}
                    onClick={() => setSelectedVehicleSize(size.id)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-bold transition-all ${
                      selectedVehicleSize === size.id
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400'
                        : 'border-dark-700 bg-dark-900 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {size.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Bay Type Badge Indicator */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isCleanroom
                  ? 'border-royal-500/40 bg-royal-950/30 text-royal-200'
                  : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-cyan-400" />
                <span className="font-semibold">
                  {isCleanroom
                    ? isTh ? 'ช่องบริการ: Studio Cleanroom Bay (ห้องปลอดฝุ่นมาตรฐานสูง)' : 'Assigned: Studio Cleanroom Bay (Dust-Free High Precision)'
                    : isTh ? 'ช่องบริการ: Wash & Detailing Bay (ระบบจองรายรอบเวลา)' : 'Assigned: Wash & Detailing Bay (Time-Slot Scheduling)'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-dark-900/80 px-2 py-1 rounded text-cyan-300">
                {isCleanroom ? (isTh ? 'งานจอดข้ามวัน/เต็มวัน' : 'Full Day / Multi-Day') : (isTh ? 'งานรอบ 1.5 ชม.' : '1.5-Hr Slot')}
              </span>
            </div>
          </div>

          {/* Section 2: Date & Time Slot Allocation */}
          <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-400" />
              <span>{isTh ? '2. วันที่และรอบเวลาเข้ารับบริการ' : '2. Date & Bay Time Allocation'}</span>
            </h2>

            {/* Date Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">
                {isTh ? 'เลือกวันที่นำรถเข้าสตูดิโอ' : 'Appointment Date'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={bookingDate}
                  onChange={handleDateChange}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs font-medium text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Time Slot Allocation depending on Bay Type */}
            {isCleanroom ? (
              /* Studio Cleanroom Bay: Drop-off Time Picker */
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-300">
                  {isTh
                    ? 'เวลาที่สะดวกนำรถมา Drop-off ในห้องคลีนรูม'
                    : 'Preferred Drop-off Arrival Time (Cleanroom)'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['08:30', '09:00', '10:00', '13:00'].map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setCleanroomDropoffTime(time)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        cleanroomDropoffTime === time
                          ? 'border-cyan-400 bg-gradient-to-r from-royal-600/30 to-cyan-600/30 text-white ring-1 ring-cyan-400'
                          : 'border-dark-700 bg-dark-900 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {time} น.
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400">
                  {isTh
                    ? '* บริการ PPF / เคลือบเซรามิก / แรปสี ใช้ระยะเวลา 1-3 วัน ทีมงานจะอัปเดตขั้นตอนผ่าน Live Tracker'
                    : '* PPF, Coating & Wrap jobs take 1-3 days. Live stages will be pushed to your tracker.'}
                </p>
              </div>
            ) : (
              /* Wash & Detailing Bay: 4 Time Slots with Live Capacity */
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-300">
                    {isTh ? 'เลือกรอบเวลา Detailing Bay (รอบละ 1.5 ชม.)' : 'Detailing Bay Slots (1.5h each)'}
                  </label>
                  <span className="text-[10px] text-gray-400">
                    {isTh ? 'ความจุ 2 คันต่อรอบ' : 'Max 2 vehicles / slot'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DETAILING_SLOTS.map((slot) => {
                    const { booked, remaining, isFull } = getSlotAvailability(slot.time);
                    const isSelected = selectedTimeSlot === slot.time;

                    return (
                      <button
                        type="button"
                        key={slot.time}
                        disabled={isFull}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isFull
                            ? 'border-dark-800 bg-dark-950/50 opacity-40 cursor-not-allowed text-gray-500'
                            : isSelected
                            ? 'border-cyan-400 bg-cyan-950/30 text-white ring-1 ring-cyan-400'
                            : 'border-dark-700 bg-dark-900 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`} />
                          <span className="text-xs font-bold font-mono">{slot.time}</span>
                        </div>

                        <div className="text-[10px] font-bold">
                          {isFull ? (
                            <span className="text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/60">
                              {isTh ? 'เต็มแล้ว (FULL)' : 'FULL'}
                            </span>
                          ) : (
                            <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                              {isTh ? `ว่าง ${remaining}/2 ช่อง` : `${remaining}/2 Available`}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Customer & Car Details */}
          <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <Car className="h-4 w-4 text-cyan-400" />
              <span>{isTh ? '3. ข้อมูลรถยนต์และเจ้าของรถ' : '3. Vehicle & Contact Information'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                  <User className="h-3 w-3 text-cyan-400" />
                  {isTh ? 'ชื่อ-นามสกุล ผู้ติดต่อ' : 'Customer Full Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="เช่น คุณกิตติธัช"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-cyan-400" />
                  {isTh ? 'เบอร์โทรศัพท์ (ติดต่อสตูดิโอ)' : 'Contact Phone'}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="08X-XXX-XXXX"
                  required
                />
              </div>

              {/* Car Brand */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">
                  {isTh ? 'ยี่ห้อรถยนต์ (Brand)' : 'Car Brand'}
                </label>
                <input
                  type="text"
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="เช่น Porsche, BMW, Mercedes"
                  required
                />
              </div>

              {/* Car Model */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">
                  {isTh ? 'รุ่นรถยนต์ (Model)' : 'Car Model'}
                </label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="เช่น 911 Carrera, M2, Alphard"
                  required
                />
              </div>

              {/* License Plate */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">
                  {isTh ? 'เลขทะเบียนรถ' : 'License Plate'}
                </label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none font-mono"
                  placeholder="เช่น กข 8888"
                  required
                />
              </div>

              {/* Province */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">
                  {isTh ? 'จังหวัดป้ายทะเบียน' : 'Province'}
                </label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  placeholder="ภูเก็ต, กรุงเทพฯ"
                  required
                />
              </div>
            </div>

            {/* Special Requests / Notes */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">
                {isTh ? 'หมายเหตุพิเศษ / กำชับช่าง' : 'Special Notes or Focus Points'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                placeholder={isTh ? 'เช่น ระวังล้อ Forged, ติดตั้งเสร็จก่อน 17:00, นัดตรวจสภาพระยะ 6 เดือน' : 'e.g. Forged wheels, pickup before 17:00, etc.'}
              ></textarea>
            </div>
          </div>

          {/* Pricing Summary & Submit (Crisp White & Royal Blue / Cyan Gradient) */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block">
                {isTh ? 'ยอดประมาณการสุทธิ (ไม่มีค่าธรรมเนียมแอบแฝง)' : 'Estimated Total (Zero Hidden Fees)'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono flex items-baseline gap-1">
                  <span className="text-cyan-400 text-base font-bold">฿</span>
                  <span>{(currentService.pricing[selectedVehicleSize] || 0).toLocaleString()}</span>
                </span>
                <span className="text-xs text-gray-400">
                  ({isTh ? `ไซส์ ${selectedVehicleSize}` : `Size ${selectedVehicleSize}`})
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSundayWarning}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-extrabold shadow-lg transition-all ${
                isSundayWarning
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-royal-600 via-royal-500 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 text-white shadow-cyan-glow/40 active:scale-95'
              }`}
            >
              <span>{isTh ? 'ยืนยันการจองช่องบริการทันที' : 'Confirm Bay Reservation'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
