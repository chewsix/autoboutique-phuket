'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  CheckCircle2,
  Car,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Bell,
  MessageCircle,
} from 'lucide-react';

export const LineFlexMessageModal: React.FC = () => {
  const {
    lineToastPayload,
    closeLineToast,
    setView,
    setCustomerTab,
    language,
  } = useApp();

  const isTh = language === 'th';

  if (!lineToastPayload || !lineToastPayload.isOpen) return null;

  const payload = lineToastPayload;

  const handleOpenCustomerTracker = () => {
    closeLineToast();
    setView('customer');
    setCustomerTab('tracker');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-[28px] border border-cyan-500/40 bg-[#0B0F17] p-4 sm:p-5 shadow-[0_10px_50px_rgba(14,165,233,0.25)] ring-1 ring-cyan-500/30">
        {/* Floating LINE badge notification indicator */}
        <div className="absolute -top-3.5 left-5 inline-flex items-center gap-1.5 rounded-full bg-[#06C755] px-3 py-0.5 text-[11px] font-black text-white shadow-md">
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{isTh ? 'LINE Official Account Flex Message' : 'LINE OA Push Preview'}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={closeLineToast}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white transition-colors"
          title={isTh ? 'ปิดการแจ้งเตือน' : 'Close Notification'}
        >
          <X className="h-4 w-4" />
        </button>

        {/* LINE OA Header bar */}
        <div className="mt-2.5 flex items-center gap-2.5 border-b border-dark-800 pb-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-600 via-royal-700 to-cyan-500 border border-cyan-400/40 text-white shadow-cyan-glow/20">
            <span className="font-mono font-black text-xs">AB</span>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#06C755] text-white">
              <CheckCircle2 className="h-3 w-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">Autoboutique Phuket</span>
              <span className="rounded bg-[#06C755]/20 px-1 py-0.2 text-[9px] font-bold text-[#06C755] border border-[#06C755]/30">
                Verified OA
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              {isTh ? 'แจ้งเตือนสถานะรถของคุณอัตโนมัติ' : 'Automated Car Progress Notification'}
            </p>
          </div>
        </div>

        {/* LINE Bubble Card Content in Deep Black / Navy */}
        <div className="mt-3.5 rounded-2xl bg-dark-900 border border-dark-800 p-3.5 space-y-3">
          {/* Top Plate & Car Model */}
          <div className="flex items-center justify-between">
            <span className="font-mono font-black text-xs text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              {payload.carPlate} {payload.province}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              {payload.timestamp}
            </span>
          </div>

          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-white">
              {payload.carBrand} {payload.carModel}
            </h3>
            <p className="text-[11px] text-cyan-400 font-medium">
              {payload.serviceName}
            </p>
          </div>

          {/* Progress Bar (Royal Blue to Electric Cyan to LINE Green) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">
                {isTh ? `ขั้นตอนที่ ${payload.stageNumber}/5` : `Stage ${payload.stageNumber} of 5`}
              </span>
              <span className="text-cyan-300 font-bold font-mono">
                {payload.progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-dark-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-royal-600 via-cyan-400 to-[#06C755] transition-all duration-500 shadow-cyan-glow"
                style={{ width: `${payload.progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Current Stage Card */}
          <div className="rounded-xl border border-dark-750 bg-dark-950 p-2.5 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>{isTh ? 'สถานะปัจจุบันล่าสุด' : 'Latest Milestone'}</span>
            </div>
            <div className="text-xs font-bold text-white">
              {payload.stageTitle}
            </div>
            <div className="text-[10px] text-gray-400">
              {payload.bayName}
            </div>
          </div>

          {/* Optional Stage Photo thumbnail */}
          {payload.photoUrl && (
            <div className="relative h-28 w-full overflow-hidden rounded-xl border border-dark-750 bg-dark-950">
              <img
                src={payload.photoUrl}
                alt="Stage preview"
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-1 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
                Live Studio Photo
              </div>
            </div>
          )}
        </div>

        {/* LINE Action Button */}
        <div className="mt-3.5 space-y-2">
          <button
            onClick={handleOpenCustomerTracker}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 px-4 py-2.5 text-xs font-extrabold text-white shadow-cyan-glow/40 transition-all transform active:scale-95"
          >
            <span>{isTh ? 'แตะเพื่อเปิดดูสถานะสดใน LINE LIFF' : 'Open Live Tracker in LIFF'}</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={closeLineToast}
            className="w-full text-center text-[11px] font-medium text-gray-400 hover:text-gray-200 py-1"
          >
            {isTh ? 'ปิดหน้าต่างตัวอย่าง' : 'Dismiss Preview'}
          </button>
        </div>
      </div>
    </div>
  );
};
