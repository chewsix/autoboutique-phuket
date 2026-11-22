'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Car,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  PlusCircle,
  XCircle,
  RotateCcw,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  User,
  Sparkles,
  Camera,
  MessageCircle,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import { CarTrackerJob, StagePhoto } from '@/types';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    bookings,
    updateBookingStatus,
    activeJobs,
    advanceJobStage,
    regressJobStage,
    toggleStageChecklistItem,
    addStagePhoto,
    setSelectedJobId,
    setView,
    setCustomerTab,
    showLineToast,
    setActiveLightboxPhoto,
  } = useApp();

  const isTh = language === 'th';
  const [bayFilter, setBayFilter] = useState<'all' | 'detailing' | 'cleanroom'>('all');
  const [selectedAdminJobId, setSelectedAdminJobId] = useState<string>(
    activeJobs[0]?.id || ''
  );

  // Upload photo modal states
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoTargetStage, setPhotoTargetStage] = useState<number>(3);
  const [photoCaption, setPhotoCaption] = useState<string>('QC ตรวจสอบการพับขอบฟิล์มและอบอินฟราเรด');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80'
  );
  const [photoType, setPhotoType] = useState<'work' | 'qc' | 'before' | 'after'>('work');

  // Statistics calculation
  const totalBookingsToday = bookings.filter((b) => b.bookingDate === '2026-11-14').length;
  const inProgressCars = activeJobs.filter(
    (j) => j.currentStage >= 1 && j.currentStage <= 4
  ).length;
  const completedToday = activeJobs.filter((j) => j.currentStage === 5).length;
  const estimatedRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.priceEstimate || 0), 0);

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    if (bayFilter === 'all') return true;
    return b.bayType === bayFilter;
  });

  const selectedAdminJob =
    activeJobs.find((j) => j.id === selectedAdminJobId) || activeJobs[0];

  const handleAdvance = (jobId: string) => {
    advanceJobStage(jobId);
  };

  const handleRegress = (jobId: string) => {
    regressJobStage(jobId);
  };

  const handleTriggerLinePreview = (job: CarTrackerJob) => {
    const stageObj = job.stages.find((st) => st.stage === job.currentStage);
    const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';

    showLineToast({
      isOpen: true,
      carPlate: job.licensePlate,
      province: job.province,
      carBrand: job.carBrand,
      carModel: job.carModel,
      customerName: job.customerName,
      serviceName: job.serviceNameTh,
      stageNumber: job.currentStage,
      stageTitle: stageObj ? stageObj.titleTh : `ขั้นตอนที่ ${job.currentStage}`,
      timestamp: `วันนี้ ${timeStr}`,
      progressPercent: job.currentStage * 20,
      bayName: job.bayNameTh,
      photoUrl: stageObj?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
    });
  };

  const handleViewCustomerPerspective = (jobId: string) => {
    setSelectedJobId(jobId);
    setView('customer');
    setCustomerTab('tracker');
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdminJob) return;

    addStagePhoto(selectedAdminJob.id, photoTargetStage, {
      url: photoUrl,
      captionTh: photoCaption,
      captionEn: photoCaption,
      timestamp: 'เพิ่งอัปโหลด (Just Uploaded)',
      type: photoType,
    });

    setIsPhotoModalOpen(false);
  };

  // Preset sample studio photos for 1-click selection in the modal
  const sampleStudioPhotos = [
    {
      title: 'Cleanroom PPF Wrap',
      url: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Infrared Baking 60°C',
      url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Hexagon Light QC Check',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Paint Gauge Inspection',
      url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Showroom Delivery Ready',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="space-y-6 pb-24 pt-2">
      {/* Admin Top Banner */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isTh ? 'ระบบจัดการหลังบ้านสตูดิโอ (Shop Admin Console)' : 'Studio Admin Console'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isTh ? 'แผงควบคุมสตูดิโอ C-Cube ภูเก็ต' : 'Studio Management Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              {isTh
                ? 'ควบคุมคิวงานช่องบริการ จัดการสถานะรถสดในสตูดิโอ และยิงแจ้งเตือน LINE อัตโนมัติ'
                : 'Live queue monitoring, bay allocations & automated LINE status notifications.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setView('customer');
                setCustomerTab('tracker');
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 px-3.5 py-2 text-xs font-bold text-white shadow-cyan-glow/30 transition-all"
            >
              <Car className="h-4 w-4" />
              <span>{isTh ? 'เปิดดูมุมมองลูกค้า' : 'View as Customer'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{isTh ? 'การจองวันนี้' : 'Today Bookings'}</span>
            <CalendarCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalBookingsToday}</div>
          <span className="text-[10px] text-emerald-400 font-medium">
            {isTh ? 'คิวเต็ม 85% ของช่อง' : '85% Bay Occupancy'}
          </span>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{isTh ? 'รถในสตูดิโอ (Active)' : 'Active in Studio'}</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">{inProgressCars}</div>
          <span className="text-[10px] text-gray-400">
            {isTh ? 'อยู่ในขั้นตอน 1-4' : 'Stages 1 through 4'}
          </span>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{isTh ? 'เสร็จพร้อมส่งมอบ' : 'Ready for Handover'}</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">{completedToday}</div>
          <span className="text-[10px] text-emerald-300">
            {isTh ? 'รอส่งมอบที่ VIP Lounge' : 'Staged in VIP Bay'}
          </span>
        </div>

        <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{isTh ? 'มูลค่างานรวมในคิว' : 'Pipeline Volume'}</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
            <span className="text-cyan-400 text-sm">฿</span>
            <span>{(estimatedRevenue / 1000).toFixed(0)}k</span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {isTh ? 'คำนวณจากงานที่ยืนยัน' : 'Confirmed bookings'}
          </span>
        </div>
      </div>

      {/* Main Section 1: Live Status Updater (1-Click Advance Status) */}
      <section className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dark-750 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isTh ? 'อัปเดตสถานะรถแบบเรียลไทม์ (Live Tracker Updater)' : 'Live Job Stage Updater'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {isTh
                  ? 'กดเลื่อนขั้นตอนที่นี่ ระบบจะซิงก์ไปยังหน้าจอของลูกค้าและส่งแจ้งเตือน LINE ทันที'
                  : 'Advancing stage here instantly pushes updates to the customer’s Live Tracker and fires a LINE notification.'}
              </p>
            </div>
          </div>

          {/* Quick vehicle switcher dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedAdminJob?.id || ''}
              onChange={(e) => setSelectedAdminJobId(e.target.value)}
              className="w-full rounded-xl border border-dark-700 bg-dark-900 px-3 py-2 text-xs font-semibold text-white focus:border-cyan-500 focus:outline-none font-mono"
            >
              {activeJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.licensePlate} {j.province} — {j.carBrand} {j.carModel} (Stage {j.currentStage}/5)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAdminJob && (
          <div className="space-y-4">
            {/* Selected Car Highlight */}
            <div className="rounded-xl border border-dark-750 bg-dark-900/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    {selectedAdminJob.licensePlate} {selectedAdminJob.province}
                  </span>
                  <span className="font-bold text-white text-base">
                    {selectedAdminJob.carBrand} {selectedAdminJob.carModel} ({selectedAdminJob.carColor})
                  </span>
                </div>
                <div className="text-xs text-cyan-400 font-semibold">
                  {isTh ? selectedAdminJob.serviceNameTh : selectedAdminJob.serviceNameEn}
                </div>
                <div className="text-[11px] text-gray-400">
                  {isTh ? `ลูกค้า: ${selectedAdminJob.customerName} (${selectedAdminJob.phone})` : `Owner: ${selectedAdminJob.customerName}`}
                </div>
              </div>

              {/* Stage advancement controller & actions */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Upload Photo Button */}
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs font-semibold text-cyan-300 hover:text-white hover:bg-cyan-900/50 flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{isTh ? 'เพิ่มรูปภาพขั้นตอน' : 'Upload Stage Photo'}</span>
                </button>

                {/* LINE Preview Trigger Button */}
                <button
                  onClick={() => handleTriggerLinePreview(selectedAdminJob)}
                  className="px-3 py-2 rounded-xl bg-[#06C755]/15 hover:bg-[#06C755]/25 border border-[#06C755]/40 text-[#06C755] text-xs font-bold flex items-center gap-1.5 transition-all"
                  title={isTh ? 'ทดสอบดูตัวอย่าง LINE Flex Message' : 'Preview LINE Flex Message'}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>LINE Flex Toast</span>
                </button>

                {/* Regress */}
                <button
                  onClick={() => handleRegress(selectedAdminJob.id)}
                  disabled={selectedAdminJob.currentStage <= 1}
                  className="px-3 py-2 rounded-xl border border-dark-700 bg-dark-800 text-xs font-semibold text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isTh ? 'ย้อน 1 ขั้น' : 'Back'}</span>
                </button>

                {/* Advance */}
                <button
                  onClick={() => handleAdvance(selectedAdminJob.id)}
                  disabled={selectedAdminJob.currentStage >= 5}
                  className={`px-4 py-2 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all ${
                    selectedAdminJob.currentStage >= 5
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-gradient-to-r from-royal-600 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 text-white shadow-cyan-glow/30 active:scale-95'
                  }`}
                >
                  {selectedAdminJob.currentStage >= 5 ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isTh ? 'เสร็จสมบูรณ์แล้ว (Stage 5/5)' : 'Completed (5/5)'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isTh
                          ? `เลื่อนเป็นขั้นตอนที่ ${selectedAdminJob.currentStage + 1} ➔`
                          : `Advance to Stage ${selectedAdminJob.currentStage + 1} ➔`}
                      </span>
                    </>
                  )}
                </button>

                {/* Customer View Perspective */}
                <button
                  onClick={() => handleViewCustomerPerspective(selectedAdminJob.id)}
                  className="p-2 rounded-xl bg-dark-800 border border-dark-700 text-gray-300 hover:text-cyan-400"
                  title={isTh ? 'ดูมุมมองลูกค้า' : 'View in Customer Tracker'}
                >
                  <Car className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Stages Visual Stepper with Photo Previews */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {selectedAdminJob.stages.map((st) => {
                const isPassed = st.stage < selectedAdminJob.currentStage;
                const isCurrent = st.stage === selectedAdminJob.currentStage;

                return (
                  <div
                    key={st.stage}
                    className={`rounded-xl border p-3 text-xs transition-all flex flex-col justify-between ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-950/30 shadow-cyan-glow/20 ring-1 ring-cyan-400'
                        : isPassed
                        ? 'border-emerald-500/40 bg-emerald-950/20 text-gray-300'
                        : 'border-dark-750 bg-dark-900/60 opacity-50 text-gray-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-[10px] text-cyan-300">STAGE {st.stage}</span>
                        {isPassed && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                        {isCurrent && (
                          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="font-bold text-white text-[11px] truncate">
                        {isTh ? st.titleTh.split('.')[1] || st.titleTh : st.titleEn.split('.')[1] || st.titleEn}
                      </div>

                      {/* Interactive Checklist checkboxes */}
                      <div className="mt-2 space-y-1">
                        {st.checklist.map((item, idx) => (
                          <label
                            key={idx}
                            className="flex items-center gap-1.5 cursor-pointer text-[10px] text-gray-300 hover:text-white"
                          >
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() =>
                                toggleStageChecklistItem(selectedAdminJob.id, st.stage, idx)
                              }
                              className="rounded border-dark-600 text-cyan-500 focus:ring-0 h-3 w-3"
                            />
                            <span className={item.done ? 'line-through text-gray-500' : ''}>
                              {isTh ? item.labelTh.slice(0, 22) + '...' : item.labelEn.slice(0, 22) + '...'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Stage Photos Thumbnail preview in Admin */}
                    {st.photos && st.photos.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-dark-750">
                        <span className="text-[9px] font-bold text-cyan-300 block mb-1">
                          {st.photos.length} รูปถ่ายขั้นตอน:
                        </span>
                        <div className="grid grid-cols-2 gap-1">
                          {st.photos.map((ph) => (
                            <button
                              key={ph.id}
                              onClick={() => setActiveLightboxPhoto(ph)}
                              className="relative h-12 rounded-lg overflow-hidden border border-dark-750 hover:border-cyan-400 group"
                              title={ph.captionTh}
                            >
                              <img
                                src={ph.url}
                                alt={ph.captionEn}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                <ZoomIn className="h-3 w-3 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main Section 2: Bookings Management Table */}
      <section className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dark-750 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-royal-600/20 text-cyan-300 border border-cyan-500/40">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isTh ? 'รายการคิวจองช่องบริการ (Bay Bookings Queue)' : 'Bay Bookings Queue'}
              </h2>
              <p className="text-[11px] text-gray-400">
                {isTh ? 'ตรวจสอบและจัดการคิวจองช่อง Detailing และ Cleanroom' : 'Manage Detailing Bay & Studio Cleanroom reservations'}
              </p>
            </div>
          </div>

          {/* Bay Filter Pills */}
          <div className="flex items-center rounded-lg bg-dark-900 p-0.5 border border-dark-700">
            <button
              onClick={() => setBayFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                bayFilter === 'all' ? 'bg-gradient-to-r from-royal-600 to-cyan-600 text-white' : 'text-gray-400'
              }`}
            >
              {isTh ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setBayFilter('detailing')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                bayFilter === 'detailing' ? 'bg-gradient-to-r from-royal-600 to-cyan-600 text-white' : 'text-gray-400'
              }`}
            >
              Detailing Bay
            </button>
            <button
              onClick={() => setBayFilter('cleanroom')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                bayFilter === 'cleanroom' ? 'bg-gradient-to-r from-royal-600 to-cyan-600 text-white' : 'text-gray-400'
              }`}
            >
              Studio Cleanroom
            </button>
          </div>
        </div>

        {/* Bookings Table / Card List */}
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-dark-750 bg-dark-900/90 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-cyan-300 bg-dark-950 px-2 py-0.5 rounded border border-dark-750">
                    {b.id}
                  </span>
                  <span className="font-mono font-bold text-white text-xs bg-dark-800 px-2 py-0.5 rounded">
                    {b.licensePlate} {b.province}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.bayType === 'detailing'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-royal-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {b.bayType === 'detailing' ? 'Detailing Bay' : 'Studio Cleanroom'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.status === 'completed'
                        ? 'bg-emerald-950 text-emerald-400'
                        : b.status === 'in_progress'
                        ? 'bg-blue-950 text-cyan-300'
                        : b.status === 'cancelled'
                        ? 'bg-red-950 text-red-400'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    {b.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-white font-bold text-xs mt-1">
                  {b.carBrand} {b.carModel} • {b.customerName} ({b.customerPhone})
                </div>

                <div className="text-gray-400 text-[11px]">
                  {isTh ? b.serviceNameTh : b.serviceNameEn} • {b.bookingDate} ({b.timeSlot}) • ฿
                  {b.priceEstimate?.toLocaleString()}
                </div>

                {b.notes && (
                  <div className="text-[11px] text-cyan-300 italic bg-cyan-950/20 px-2 py-1 rounded border border-cyan-900/30 max-w-xl">
                    Note: {b.notes}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {b.status !== 'in_progress' && b.status !== 'completed' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'in_progress')}
                    className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-royal-600 to-cyan-600 hover:from-royal-500 hover:to-cyan-500 text-white font-semibold text-[11px]"
                  >
                    {isTh ? 'เช็กอินรับรถ' : 'Check-In'}
                  </button>
                )}

                {b.status !== 'completed' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'completed')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white font-semibold text-[11px]"
                  >
                    {isTh ? 'ส่งมอบแล้ว' : 'Complete'}
                  </button>
                )}

                {b.status !== 'cancelled' && (
                  <button
                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-900/50 text-red-400 hover:bg-red-900/60 font-medium text-[11px]"
                  >
                    {isTh ? 'ยกเลิก' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload Stage Photo Modal */}
      {isPhotoModalOpen && selectedAdminJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-dark-700 bg-dark-900 p-5 shadow-2xl">
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                <Camera className="h-4 w-4" />
                <span>{isTh ? 'อัปโหลดภาพถ่ายขั้นตอนการทำงาน' : 'Upload Studio Stage Photo'}</span>
              </div>
              <h3 className="text-sm font-black text-white">
                {selectedAdminJob.carBrand} {selectedAdminJob.carModel} ({selectedAdminJob.licensePlate})
              </h3>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-3.5 text-xs">
              {/* Select Stage */}
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">{isTh ? 'เลือกลำดับขั้นตอน:' : 'Select Target Stage:'}</label>
                <select
                  value={photoTargetStage}
                  onChange={(e) => setPhotoTargetStage(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-dark-700 bg-dark-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value={1}>Stage 1: Vehicle Inspection</option>
                  <option value={2}>Stage 2: Surface Prep & Paint Correction</option>
                  <option value={3}>Stage 3: Cleanroom PPF / Coating</option>
                  <option value={4}>Stage 4: Studio Light QC</option>
                  <option value={5}>Stage 5: Ready for Pickup</option>
                </select>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">{isTh ? 'คำอธิบายภาพ:' : 'Photo Caption:'}</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-gray-300 font-medium">{isTh ? 'URL รูปภาพ:' : 'Image URL:'}</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full rounded-xl border border-dark-700 bg-dark-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none font-mono text-[11px]"
                  required
                />
              </div>

              {/* Quick Sample Selector */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] text-gray-400 uppercase font-semibold block">
                  {isTh ? 'หรือเลือกภาพตัวอย่างจากสตูดิโอ:' : 'Or choose sample studio shot:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {sampleStudioPhotos.slice(0, 3).map((sample, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setPhotoUrl(sample.url);
                        setPhotoCaption(sample.title);
                      }}
                      className="p-1 rounded-lg border border-dark-700 hover:border-cyan-400 bg-dark-950 text-left text-[10px] truncate text-gray-300"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-dark-700 text-gray-300 hover:bg-dark-800"
                >
                  {isTh ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 text-white font-bold shadow-cyan-glow"
                >
                  {isTh ? 'บันทึกรูปลง Tracker' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
