'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CustomerTab } from '@/types';
import {
  Layers,
  CalendarCheck,
  Activity,
  Award,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { customerTab, setCustomerTab, language, activeJobs, warranties } = useApp();
  const isTh = language === 'th';

  const inProgressJobsCount = activeJobs.filter(
    (j) => j.currentStage >= 1 && j.currentStage <= 4
  ).length;

  const dueWarrantyCount = warranties.filter((w) => w.isDueSoon).length;

  const navItems: {
    id: CustomerTab;
    labelTh: string;
    labelEn: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'catalog',
      labelTh: 'ราคา & บริการ',
      labelEn: 'Estimator',
      icon: Layers,
    },
    {
      id: 'booking',
      labelTh: 'จองคิวช่องบริการ',
      labelEn: 'Book Bay',
      icon: CalendarCheck,
    },
    {
      id: 'tracker',
      labelTh: 'สถานะสด',
      labelEn: 'Live Status',
      icon: Activity,
      badge: inProgressJobsCount > 0 ? inProgressJobsCount : undefined,
      badgeColor: 'bg-cyan-500 text-dark-950 font-bold',
    },
    {
      id: 'warranty',
      labelTh: 'ใบรับประกัน',
      labelEn: 'E-Warranty',
      icon: Award,
      badge: dueWarrantyCount > 0 ? dueWarrantyCount : undefined,
      badgeColor: 'bg-royal-600 text-white font-bold',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-dark-800/90 bg-dark-950/95 backdrop-blur-xl py-1.5 px-2 max-w-lg md:max-w-2xl mx-auto md:rounded-t-2xl shadow-2xl">
      <div className="grid grid-cols-4 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = customerTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCustomerTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-dark-850/50'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-cyan-400' : 'text-gray-400'
                  }`}
                />
                {item.badge !== undefined && (
                  <span
                    className={`absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold ${
                      item.badgeColor || 'bg-royal-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium leading-none truncate max-w-full ${
                  isActive ? 'text-cyan-300 font-bold' : 'text-gray-400'
                }`}
              >
                {isTh ? item.labelTh : item.labelEn}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 h-0.5 w-6 rounded-full bg-gradient-to-r from-royal-500 to-cyan-400 shadow-cyan-glow"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
