'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { X, ZoomIn, Clock, ShieldCheck, Tag } from 'lucide-react';

export const PhotoLightboxModal: React.FC = () => {
  const { activeLightboxPhoto, setActiveLightboxPhoto, language } = useApp();
  const isTh = language === 'th';

  if (!activeLightboxPhoto) return null;

  const photo = activeLightboxPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border border-dark-750 bg-dark-900 overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setActiveLightboxPhoto(null)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/70 text-gray-300 hover:text-white hover:bg-black/90 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Big Photo View */}
        <div className="relative max-h-[65vh] w-full overflow-hidden bg-black flex items-center justify-center">
          <img
            src={photo.url}
            alt={photo.captionEn}
            className="w-full h-auto max-h-[65vh] object-contain"
          />
          {photo.type && (
            <span className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-royal-600 to-cyan-500 text-white font-bold px-2.5 py-1 text-[10px] uppercase shadow-cyan-glow">
              {photo.type === 'before'
                ? isTh ? 'ภาพสภาพเดิมก่อนทำ' : 'Pre-work Photo'
                : photo.type === 'after'
                ? isTh ? 'ภาพเสร็จสมบูรณ์' : 'Finished Result'
                : photo.type === 'qc'
                ? isTh ? 'ภาพตรวจสอบ QC' : 'QC Inspection'
                : isTh ? 'ภาพขั้นตอนการติดตั้ง' : 'Work in Progress'}
            </span>
          )}
        </div>

        {/* Photo Caption & Metadata */}
        <div className="p-4 sm:p-5 space-y-2 border-t border-dark-800 bg-dark-950">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span>Autoboutique Studio Phuket QC Photo Record</span>
            </span>
            {photo.timestamp && (
              <span className="flex items-center gap-1 font-mono text-[11px] text-gray-400">
                <Clock className="h-3 w-3 text-cyan-400" />
                <span>{photo.timestamp}</span>
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white">
            {isTh ? photo.captionTh : photo.captionEn}
          </h3>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveLightboxPhoto(null)}
              className="px-4 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-xs font-semibold text-gray-200 transition-colors"
            >
              {isTh ? 'ปิดหน้าต่าง' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
