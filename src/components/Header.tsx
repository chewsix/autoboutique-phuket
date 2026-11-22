'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Shield,
  Smartphone,
  Monitor,
  Globe,
  SlidersHorizontal,
  Car,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    toggleLanguage,
    view,
    setView,
    liffFrameMode,
    toggleLiffFrame,
    customerTab,
  } = useApp();

  const isTh = language === 'th';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-800/90 bg-dark-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Brand Logo & Name (Autoboutique Phuket - Official Identity) */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-royal-600 via-royal-700 to-cyan-500 border border-cyan-400/40 shadow-cyan-glow/30">
            <Shield className="h-5 w-5 text-white" />
            <Sparkles className="absolute -top-1 -right-1 h-3.5 w-3.5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wider text-base sm:text-lg text-white font-mono">
                AUTOBOUTIQUE
              </span>
              <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 text-[10px] font-black text-cyan-300 border border-cyan-400/30">
                PHUKET
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-gray-400 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-gray-300 font-medium">
                {isTh ? 'โดย C-Cube Automotive ภูเก็ต' : 'By C-Cube Automotive'}
              </span>
              <span className="hidden sm:inline-block text-gray-600">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/40">
                <CalendarCheck className="h-2.5 w-2.5" />
                LINE Menu 3: BOOKING
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls: Switcher & Lang Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* LIFF Mobile Simulator Mode Toggle (only when in customer view) */}
          {view === 'customer' && (
            <button
              onClick={toggleLiffFrame}
              title={isTh ? 'สลับมุมมอง LINE LIFF มือถือ / เต็มจอ' : 'Toggle LINE LIFF Simulator'}
              className={`hidden md:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                liffFrameMode
                  ? 'bg-royal-600/30 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow/20'
                  : 'bg-dark-850 text-gray-300 hover:text-white border border-dark-700 hover:border-cyan-500/30'
              }`}
            >
              {liffFrameMode ? (
                <>
                  <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>LIFF Mode</span>
                </>
              ) : (
                <>
                  <Monitor className="h-3.5 w-3.5" />
                  <span>Responsive</span>
                </>
              )}
            </button>
          )}

          {/* View Switcher: Customer vs Admin */}
          <div className="flex items-center rounded-lg bg-dark-850 p-0.5 border border-dark-700">
            <button
              onClick={() => setView('customer')}
              className={`flex items-center gap-1 rounded-md px-2 sm:px-3 py-1 text-xs font-semibold transition-all ${
                view === 'customer'
                  ? 'bg-gradient-to-r from-royal-600 to-cyan-600 text-white font-bold shadow-cyan-glow/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Car className="h-3.5 w-3.5" />
              <span>{isTh ? 'ลูกค้า (LIFF)' : 'Customer'}</span>
            </button>
            <button
              onClick={() => setView('admin')}
              className={`flex items-center gap-1 rounded-md px-2 sm:px-3 py-1 text-xs font-semibold transition-all ${
                view === 'admin'
                  ? 'bg-gradient-to-r from-royal-600 to-cyan-600 text-white font-bold shadow-cyan-glow/30'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{isTh ? 'แอดมินร้าน' : 'Admin'}</span>
            </button>
          </div>

          {/* Language Switcher TH / EN */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 rounded-lg bg-dark-850 px-2.5 py-1.5 text-xs font-bold text-gray-200 border border-dark-700 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span className={language === 'th' ? 'text-cyan-300 font-extrabold' : 'text-gray-400'}>
              TH
            </span>
            <span className="text-gray-600">/</span>
            <span className={language === 'en' ? 'text-cyan-300 font-extrabold' : 'text-gray-400'}>
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
