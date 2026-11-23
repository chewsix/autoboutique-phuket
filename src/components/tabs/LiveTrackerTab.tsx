'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Car,
  CheckCircle2,
  Clock,
  Shield,
  Activity,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  FileText,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle,
  UserCheck,
  Camera,
  ZoomIn,
} from 'lucide-react';

export const LiveTrackerTab: React.FC = () => {
  const {
    language,
    activeJobs,
    selectedJobId,
    setSelectedJobId,
    toggleStageChecklistItem,
    setSelectedInspectionJob,
    setActiveLightboxPhoto,
  } = useApp();

  const isTh = language === 'th';
  const [plateSearch, setPlateSearch] = useState('');

  // Find currently selected job
  const currentJob =
    activeJobs.find((j) => j.id === selectedJobId) || activeJobs[0];

  // Filter jobs by search plate if any
  const filteredJobs = plateSearch.trim()
    ? activeJobs.filter((j) =>
        j.licensePlate.toLowerCase().includes(plateSearch.toLowerCase()) ||
        j.carModel.toLowerCase().includes(plateSearch.toLowerCase()) ||
        j.customerName.toLowerCase().includes(plateSearch.toLowerCase())
      )
    : activeJobs;

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>{isTh ? 'ระบบติดตามสถานะรถแบบเรียลไทม์' : 'Live Studio Progress Tracker'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isTh ? 'สถานะรถในสตูดิโอ C-Cube' : 'Real-time Vehicle Status'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              {isTh
                ? 'ตรวจสอบ 5 ขั้นตอนความประณีต อัปเดตสดโดยทีมช่าง Master Applicator พร้อมภาพถ่ายจริง'
                : 'Live 5-stage updates directly from our cleanroom master technicians with stage photos.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://line.me/R/ti/p/@autoboutique"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] px-3.5 py-2 text-xs font-bold text-white shadow-md transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{isTh ? 'ติดต่อช่างผ่าน LINE' : 'LINE Master'}</span>
            </a>
            <a
              href="tel:0661098306"
              className="inline-flex items-center gap-1.5 rounded-xl bg-dark-850 border border-dark-700 hover:border-cyan-500 px-3 py-2 text-xs font-semibold text-gray-200 transition-all"
            >
              <PhoneCall className="h-3.5 w-3.5 text-cyan-400" />
              <span>066 109 8306</span>
            </a>
          </div>
        </div>
      </div>

      {/* Car Selector Pills / Plate Search */}
      <section className="space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-200">
            {isTh ? 'เลือกรถที่ต้องการติดตาม (Cars in Studio):' : 'Select Vehicle to Track:'}
          </label>
          <div className="w-full sm:w-60">
            <input
              type="text"
              value={plateSearch}
              onChange={(e) => setPlateSearch(e.target.value)}
              placeholder={isTh ? 'ค้นหาป้ายทะเบียน เช่น 8888...' : 'Search plate or model...'}
              className="w-full rounded-lg border border-dark-700 bg-dark-900 px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Vehicle Carousel Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {filteredJobs.map((job) => {
            const isSelected = job.id === currentJob.id;
            const isComplete = job.currentStage === 5;

            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`shrink-0 text-left p-3 rounded-xl border transition-all duration-200 min-w-[210px] ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-b from-royal-950/40 via-dark-850 to-dark-900 shadow-cyan-glow/20 ring-1 ring-cyan-400'
                    : 'border-dark-800 bg-dark-850 hover:border-dark-700 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-black rounded px-1.5 py-0.5 border ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-dark-950 border-dark-750 text-gray-300'
                    }`}
                  >
                    {job.licensePlate} {job.province}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-600/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isComplete
                      ? isTh ? 'เสร็จแล้ว' : 'Ready'
                      : isTh ? `ขั้นตอนที่ ${job.currentStage}/5` : `Stage ${job.currentStage}/5`}
                  </span>
                </div>

                <div className="text-xs font-bold text-white truncate mt-1">
                  {job.carBrand} {job.carModel}
                </div>
                <div className="text-[10px] text-gray-400 truncate mt-0.5">
                  {isTh ? job.serviceNameTh : job.serviceNameEn}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Vehicle Main Detail Card */}
      {currentJob && (
        <div className="space-y-4">
          {/* Vehicle Spec Card */}
          <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-5 shadow-lg relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-dark-750 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-royal-600 to-cyan-600 text-white shadow-cyan-glow/30">
                  <Car className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {currentJob.carBrand} {currentJob.carModel}
                    </h2>
                    <span className="rounded bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800/50 font-mono">
                      {currentJob.licensePlate} {currentJob.province}
                    </span>
                  </div>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                    {isTh ? currentJob.serviceNameTh : currentJob.serviceNameEn}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                    currentJob.currentStage === 5
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      currentJob.currentStage === 5 ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'
                    }`}
                  ></span>
                  {currentJob.currentStage === 5
                    ? isTh ? 'พร้อมส่งมอบรถแล้ว' : 'Ready for Pickup'
                    : isTh ? `กำลังดำเนินการ (ขั้นตอนที่ ${currentJob.currentStage}/5)` : `In Progress (Stage ${currentJob.currentStage}/5)`}
                </span>
                <div className="text-[10px] text-gray-400 mt-1">
                  {isTh ? 'คาดว่าจะเสร็จสิ้น: ' : 'Est. Completion: '}
                  <span className="text-gray-200 font-mono">{currentJob.estimatedFinish}</span>
                </div>
              </div>
            </div>

            {/* Quick metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
              <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                <span className="text-[10px] text-gray-400 block">{isTh ? 'ช่องบริการ' : 'Assigned Bay'}</span>
                <span className="font-semibold text-gray-200 truncate block">
                  {isTh ? currentJob.bayNameTh : currentJob.bayNameEn}
                </span>
              </div>
              <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                <span className="text-[10px] text-gray-400 block">{isTh ? 'หัวหน้าช่างผู้ดูแล' : 'Lead Master'}</span>
                <span className="font-semibold text-gray-200 truncate block">
                  {currentJob.leadTechnician}
                </span>
              </div>
              <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                <span className="text-[10px] text-gray-400 block">{isTh ? 'เจ้าของรถ' : 'Owner'}</span>
                <span className="font-semibold text-gray-200 truncate block">
                  {currentJob.customerName}
                </span>
              </div>
              <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                <span className="text-[10px] text-gray-400 block">{isTh ? 'บันทึกภาพตรวจสภาพ' : 'Inspection Photos'}</span>
                <button
                  onClick={() => setSelectedInspectionJob(currentJob)}
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline text-left block"
                >
                  {isTh ? `${currentJob.inspectionPhotoCount} ภาพบันทึก (ดู)` : `${currentJob.inspectionPhotoCount} Photos (View)`}
                </button>
              </div>
            </div>
          </div>

          {/* 5-Stage Timeline */}
          <div className="rounded-2xl border border-dark-800 bg-dark-850 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <span>{isTh ? 'ขั้นตอนการปฏิบัติงาน 5 ลำดับขั้น' : '5-Stage Precision Process'}</span>
              </h3>
              <span className="text-[11px] text-gray-400">
                {isTh ? 'อัปเดตแบบเรียลไทม์' : 'Live Sync'}
              </span>
            </div>

            {/* Stages Stack */}
            <div className="space-y-3">
              {currentJob.stages.map((st) => {
                const isPassed = st.stage < currentJob.currentStage;
                const isCurrent = st.stage === currentJob.currentStage;
                const isUpcoming = st.stage > currentJob.currentStage;

                return (
                  <div
                    key={st.stage}
                    className={`rounded-xl border p-3.5 transition-all duration-200 ${
                      isCurrent
                        ? 'border-cyan-400/80 bg-gradient-to-r from-royal-950/40 via-dark-850 to-dark-850 shadow-cyan-glow/20 ring-1 ring-cyan-400/50'
                        : isPassed
                        ? 'border-emerald-500/30 bg-dark-900/90 text-gray-300'
                        : 'border-dark-750 bg-dark-950/60 opacity-60 text-gray-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Stage Number / Status Icon */}
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isPassed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isCurrent
                              ? 'bg-gradient-to-r from-royal-600 to-cyan-500 text-white font-black shadow-cyan-glow/40 animate-pulse'
                              : 'bg-dark-800 text-gray-500 border border-dark-700'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4" /> : st.stage}
                        </div>

                        {/* Stage Title & Subtitle */}
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                isCurrent ? 'text-white' : isPassed ? 'text-gray-200' : 'text-gray-400'
                              }`}
                            >
                              {isTh ? st.titleTh : st.titleEn}
                            </h4>
                            {isCurrent && (
                              <span className="rounded bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-cyan-300 border border-cyan-500/40 uppercase">
                                {isTh ? 'กำลังทำ' : 'Active'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400">
                            {isTh ? st.subtitleTh : st.subtitleEn}
                          </p>
                        </div>
                      </div>

                      {/* Timestamp badge */}
                      {st.timestamp && (
                        <div className="shrink-0 text-right">
                          <span
                            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                              isCurrent
                                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                                : 'bg-dark-800 text-gray-400'
                            }`}
                          >
                            {st.timestamp}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stage Technician & Notes (if active or passed) */}
                    {(isCurrent || isPassed) && (st.notesTh || st.technician) && (
                      <div className="mt-2.5 rounded-lg bg-dark-950/70 p-2.5 border border-dark-750 text-[11px] space-y-1">
                        {st.technician && (
                          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-[10px]">
                            <UserCheck className="h-3 w-3" />
                            <span>{isTh ? `ผู้รับผิดชอบ: ${st.technician}` : `Applicator: ${st.technician}`}</span>
                          </div>
                        )}
                        {st.notesTh && (
                          <p className="text-gray-300 leading-relaxed">
                            {isTh ? st.notesTh : st.notesEn}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Stage Checklist Items */}
                    {st.checklist && st.checklist.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-dark-750 space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 block font-semibold">
                          {isTh ? 'รายการตรวจเช็กมาตรฐาน (QC Checklist):' : 'Stage QC Checklist:'}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {st.checklist.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-1.5 rounded-lg text-[11px] transition-colors ${
                                item.done
                                  ? 'bg-emerald-950/20 text-emerald-300 border border-emerald-900/30'
                                  : 'bg-dark-900/40 text-gray-400 border border-dark-750'
                              }`}
                            >
                              <CheckCircle2
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  item.done ? 'text-emerald-400' : 'text-gray-600'
                                }`}
                              />
                              <span className="leading-tight">{isTh ? item.labelTh : item.labelEn}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stage Photo Previews */}
                    {st.photos && st.photos.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-dark-750 space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1 text-cyan-400 font-bold">
                            <Camera className="h-3 w-3" />
                            <span>{isTh ? `ภาพบันทึกขั้นตอน (${st.photos.length} ภาพ)` : `Studio QC Photos (${st.photos.length})`}</span>
                          </span>
                          <span className="text-[9px] text-gray-500 font-normal">
                            {isTh ? 'แตะรูปเพื่อขยายใหญ่' : 'Tap to enlarge'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {st.photos.map((ph) => (
                            <button
                              key={ph.id}
                              onClick={() => setActiveLightboxPhoto(ph)}
                              className="group relative h-24 sm:h-28 rounded-xl overflow-hidden border border-dark-750 hover:border-cyan-400 transition-all text-left bg-dark-950 shadow-sm"
                            >
                              <img
                                src={ph.url}
                                alt={ph.captionEn}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-1.5">
                                <span className="text-[10px] font-bold text-white line-clamp-1 drop-shadow">
                                  {isTh ? ph.captionTh : ph.captionEn}
                                </span>
                              </div>
                              <div className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ZoomIn className="h-3 w-3" />
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
        </div>
      )}
    </div>
  );
};
