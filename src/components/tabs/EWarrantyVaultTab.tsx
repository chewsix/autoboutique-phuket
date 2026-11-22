'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { EWarrantyCard } from '@/types';
import {
  Award,
  Shield,
  Calendar,
  CheckCircle2,
  Clock,
  QrCode,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
  AlertTriangle,
  History,
  Car,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const EWarrantyVaultTab: React.FC = () => {
  const {
    language,
    warranties,
    setCustomerTab,
    setPrefilledWarrantyBooking,
    setActiveModal,
  } = useApp();

  const isTh = language === 'th';
  const [expandedWarrantyId, setExpandedWarrantyId] = useState<string | null>(
    warranties[0]?.id || null
  );

  const handleBookMaintenance = (card: EWarrantyCard) => {
    setPrefilledWarrantyBooking(card);
    setCustomerTab('booking');
  };

  const toggleExpand = (id: string) => {
    setExpandedWarrantyId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              <Award className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isTh ? 'ระบบใบรับประกันดิจิทัล E-Warranty Vault' : 'Official Digital E-Warranty Vault'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isTh ? 'ใบรับประกันดิจิทัล & นัดตรวจระยะ' : 'Digital Warranty & Maintenance'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-0.5">
              {isTh
                ? 'ออกโดย Autoboutique Phuket (C-Cube Automotive) ร่วมกับ Magnus Pro & IGL Coatings'
                : 'Authenticated warranties backed by C-Cube Automotive, Magnus Pro & IGL.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('aftercare_ppf')}
              className="inline-flex items-center gap-1 rounded-xl bg-royal-700/20 border border-cyan-500/30 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-royal-600/30 hover:text-white transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isTh ? 'คู่มือดูแล PPF' : 'PPF Guide'}</span>
            </button>
            <button
              onClick={() => setActiveModal('aftercare_ceramic')}
              className="inline-flex items-center gap-1 rounded-xl bg-cyan-700/20 border border-cyan-500/30 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-600/30 hover:text-white transition-all"
            >
              <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isTh ? 'คู่มือเคลือบแก้ว' : 'Ceramic Guide'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Warranty Cards List */}
      <div className="space-y-4">
        {warranties.map((card) => {
          const isExpanded = expandedWarrantyId === card.id;

          return (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-dark-850 via-dark-900 to-dark-950 shadow-2xl transition-all"
            >
              {/* Electric Cyan & Royal Blue luxury top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-royal-600 via-cyan-400 to-royal-600"></div>

              {/* Watermark brand logo background */}
              <div className="absolute top-4 right-4 pointer-events-none opacity-5">
                <Shield className="h-48 w-48 text-cyan-400" />
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Header Row: Product, Brand, Status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-dark-750 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-cyan-500/15 px-2.5 py-1 text-xs font-black text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                      {card.productBrand}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {card.warrantyNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {card.isDueSoon && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[11px] font-bold text-cyan-200 border border-cyan-400/50 animate-pulse">
                        <AlertTriangle className="h-3 w-3 text-cyan-300" />
                        {isTh ? 'ถึงกำหนดเช็กระยะ 6 เดือน!' : '6-Month Due Soon!'}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" />
                      {isTh ? `รับประกัน ${card.coverageYears} ปี (ACTIVE)` : `${card.coverageYears} Yrs (ACTIVE)`}
                    </span>
                  </div>
                </div>

                {/* Car Spec & Product Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">
                      {card.carModel}
                    </h2>
                    <p className="text-sm font-semibold text-cyan-300 mt-0.5">
                      {isTh ? card.productNameTh : card.productNameEn}
                    </p>
                  </div>

                  {/* QR Code authentication simulator */}
                  <div className="flex items-center gap-3 bg-dark-950 p-2.5 rounded-xl border border-dark-750 shrink-0">
                    <div className="bg-white p-1 rounded-lg">
                      <QrCode className="h-8 w-8 text-black" />
                    </div>
                    <div className="text-[10px]">
                      <span className="text-gray-400 block">{isTh ? 'สแกนตรวจสอบ' : 'Official Verification'}</span>
                      <span className="text-cyan-400 font-mono font-bold">VERIFIED #C-CUBE</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid (Crisp White typography) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
                  <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">{isTh ? 'ป้ายทะเบียน' : 'License Plate'}</span>
                    <span className="font-mono font-bold text-white block mt-0.5">{card.licensePlate}</span>
                  </div>
                  <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">{isTh ? 'วันที่เริ่มรับประกัน' : 'Install Date'}</span>
                    <span className="font-mono text-gray-200 block mt-0.5">{card.installDate}</span>
                  </div>
                  <div className="bg-dark-900/60 p-2.5 rounded-xl border border-dark-750">
                    <span className="text-[10px] text-gray-400 block">{isTh ? 'วันหมดอายุการรับประกัน' : 'Expiry Date'}</span>
                    <span className="font-mono text-cyan-300 font-bold block mt-0.5">{card.expiryDate}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${card.isDueSoon ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-dark-900/60 border-dark-750'}`}>
                    <span className="text-[10px] text-gray-400 block">{isTh ? 'กำหนดตรวจระยะถัดไป' : 'Next Checkup'}</span>
                    <span className={`font-mono font-bold block mt-0.5 ${card.isDueSoon ? 'text-cyan-300' : 'text-gray-200'}`}>
                      {card.nextInspectionDate}
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => toggleExpand(card.id)}
                    className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5"
                  >
                    <History className="h-3.5 w-3.5 text-cyan-400" />
                    <span>
                      {isTh
                        ? `ดูประวัติตรวจเช็กสภาพ (${card.maintenanceHistory.length} ครั้ง)`
                        : `Maintenance Log (${card.maintenanceHistory.length} records)`}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-cyan-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleBookMaintenance(card)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-600 via-royal-500 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 px-5 py-2.5 text-xs font-black text-white shadow-cyan-glow transition-all transform active:scale-95"
                  >
                    <span>{isTh ? 'นัดหมายตรวจเช็กระยะ 6 เดือนฟรี' : 'Book Free 6-Month Checkup'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Expanded Maintenance History Log */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dark-750 space-y-2.5 animate-fade-in">
                    <span className="text-xs font-bold text-gray-200 block">
                      {isTh ? 'บันทึกประวัติการบำรุงรักษาและการตรวจสภาพ:' : 'Service Maintenance History Log:'}
                    </span>

                    <div className="space-y-2">
                      {card.maintenanceHistory.map((rec) => (
                        <div
                          key={rec.id}
                          className="rounded-xl border border-dark-750 bg-dark-950/80 p-3 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-cyan-300">
                              {isTh ? rec.typeTh : rec.typeEn}
                            </span>
                            <span className="font-mono text-gray-400 text-[11px]">{rec.date}</span>
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {isTh ? `ช่างผู้บันทึก: ${rec.technician}` : `Applicator: ${rec.technician}`}
                          </div>
                          <p className="text-gray-300 text-[11px] mt-1 bg-dark-900/80 p-2 rounded border border-dark-800">
                            {isTh ? rec.remarksTh : rec.remarksEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
