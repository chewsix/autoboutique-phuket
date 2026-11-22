'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AFTERCARE_GUIDELINES } from '@/data/mockData';
import {
  X,
  Shield,
  Sparkles,
  AlertTriangle,
  Droplets,
  Sun,
  Calendar,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

export const AftercareModal: React.FC = () => {
  const { activeModal, setActiveModal, language } = useApp();
  const isTh = language === 'th';

  if (!activeModal) return null;

  const isPPF = activeModal === 'aftercare_ppf';
  const data = isPPF ? AFTERCARE_GUIDELINES.ppf : AFTERCARE_GUIDELINES.ceramic;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="h-5 w-5 text-cyan-400" />;
      case 'Shield':
        return <Shield className="h-5 w-5 text-cyan-400" />;
      case 'Sun':
        return <Sun className="h-5 w-5 text-sky-300" />;
      case 'Droplets':
        return <Droplets className="h-5 w-5 text-cyan-400" />;
      case 'Calendar':
        return <Calendar className="h-5 w-5 text-emerald-400" />;
      case 'XCircle':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'Sparkles':
        return <Sparkles className="h-5 w-5 text-cyan-300" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-gradient-to-b from-dark-850 to-dark-950 p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-0.5 text-xs font-bold text-cyan-300">
            {isPPF ? 'Magnus Pro TPU Official Care' : 'IGL Coatings Master Care'}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {isTh ? data.titleTh : data.titleEn}
          </h2>
        </div>

        {/* 7-Day Curing Warning Callout */}
        <div className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-3.5 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-100">
            <span className="font-bold block text-white">
              {isTh ? data.cureTimeNoticeTh : data.cureTimeNoticeEn}
            </span>
            <p className="text-[11px] text-cyan-200/90 mt-0.5">
              {isTh
                ? 'ความชื้นใต้ฟิล์มและพันธะโมเลกุลเซรามิกกำลังเชื่อมต่อกับชั้นเคลือบสีแท้ ห้ามล้างด้วยน้ำแรงดันสูง'
                : 'Moisture is actively evaporating and ceramic nanoparticles are fully cross-linking.'}
            </p>
          </div>
        </div>

        {/* Rules List */}
        <div className="mt-4 space-y-3">
          {(isTh ? data.rulesTh : data.rulesEn).map((rule, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-dark-750 bg-dark-900/80 p-3.5 flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-dark-850 shrink-0 border border-dark-700">
                {renderIcon(rule.icon)}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-white">{rule.title}</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Disclaimer Footer */}
        <div className="mt-5 pt-3.5 border-t border-dark-750 flex items-center justify-between text-xs">
          <span className="text-[10px] text-gray-400">
            {isTh ? 'สงวนลิขสิทธิ์คู่มือโดย C-Cube Automotive ภูเก็ต' : 'Autoboutique Phuket Official Care Guide'}
          </span>
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 text-white font-bold hover:opacity-95 text-xs shadow-cyan-glow/20"
          >
            {isTh ? 'รับทราบและปิด' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
