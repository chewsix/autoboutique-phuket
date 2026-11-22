'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  ShieldCheck,
  Camera,
  Layers,
  CheckCircle2,
  AlertCircle,
  Car,
  FileCheck,
} from 'lucide-react';

export const InspectionDetailModal: React.FC = () => {
  const { selectedInspectionJob, setSelectedInspectionJob, language } = useApp();
  const isTh = language === 'th';

  if (!selectedInspectionJob) return null;

  const job = selectedInspectionJob;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-dark-750 bg-gradient-to-b from-dark-850 to-dark-950 p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedInspectionJob(null)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-400">
            <FileCheck className="h-3.5 w-3.5" />
            <span>{isTh ? 'ใบรายงานตรวจรับรถ 360° Inspection Report' : '360° Inspection Report'}</span>
          </div>
          <h2 className="text-lg font-black text-white">
            {job.carBrand} {job.carModel} ({job.licensePlate} {job.province})
          </h2>
          <p className="text-xs text-cyan-400 font-medium">
            {isTh ? job.serviceNameTh : job.serviceNameEn}
          </p>
        </div>

        {/* Paint Thickness Digital Gauge Mapping */}
        <div className="mt-4 rounded-xl border border-dark-750 bg-dark-900 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              {isTh ? 'ผลวัดความหนาชั้นเคลือบสี (Digital Paint Gauge)' : 'Digital Paint Thickness Gauge'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">
              {isTh ? 'สถานะ: สีเดิมโรงงาน 100%' : 'OEM Factory Paint Verified'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
              <span className="text-[10px] text-gray-400 block">{isTh ? 'ฝากระโปรงหน้า' : 'Front Hood'}</span>
              <span className="font-mono font-black text-white text-sm">132 µm</span>
            </div>
            <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
              <span className="text-[10px] text-gray-400 block">{isTh ? 'หลังคา' : 'Roof Panel'}</span>
              <span className="font-mono font-black text-white text-sm">128 µm</span>
            </div>
            <div className="bg-dark-950 p-2.5 rounded-lg border border-dark-800">
              <span className="text-[10px] text-gray-400 block">{isTh ? 'ประตูข้างเฉลี่ย' : 'Door Panels'}</span>
              <span className="font-mono font-black text-white text-sm">125 µm</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400">
            {isTh
              ? '* วัดด้วยเครื่อง Elcometer มาตรฐานเยอรมัน ค่าความหนาเฉลี่ย 120-135 ไมครอน ปลอดภัยสำหรับการขัดปรับสภาพสี'
              : '* Calibrated Elcometer precision gauge. Optimal clearcoat safe for 2-stage correction.'}
          </p>
        </div>

        {/* Pre-existing documented defects */}
        <div className="mt-4 rounded-xl border border-dark-750 bg-dark-900 p-4 space-y-2.5">
          <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-cyan-400" />
            {isTh ? 'จุดที่บันทึกก่อนเริ่มงาน (Pre-existing Condition):' : 'Pre-existing Condition Log:'}
          </span>

          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-start gap-2 bg-dark-950/80 p-2 rounded-lg border border-dark-800">
              <AlertCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{isTh ? 'พบสะเก็ดหินดีดขนาด 1 มม. บริเวณกันชนหน้าล่างขวา 2 จุด' : '2 micro rock-chips (1mm) documented on lower right front bumper.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-dark-950/80 p-2 rounded-lg border border-dark-800">
              <AlertCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{isTh ? 'รอยขนแมวบางๆ (Micro-swirls) บริเวณฝากระโปรงท้าย — เตรียมขัดลบใน Stage 2' : 'Fine wash swirls on trunk lid — scheduled for DA correction in Stage 2.'}</span>
            </div>
            <div className="flex items-start gap-2 bg-dark-950/80 p-2 rounded-lg border border-dark-800">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{isTh ? 'ล้อแม็กซ์ทั้ง 4 วง และสปลิตเตอร์คาร์บอนไฟเบอร์ สภาพสมบูรณ์ 100%' : 'All 4 forged rims and carbon splitters pristine with zero curb rash.'}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-dark-750 flex items-center justify-between text-xs">
          <div className="text-[10px] text-gray-400">
            <span>{isTh ? `หัวหน้าผู้บันทึก: ${job.leadTechnician}` : `Master: ${job.leadTechnician}`}</span>
          </div>
          <button
            onClick={() => setSelectedInspectionJob(null)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-royal-600 to-cyan-500 text-white font-bold hover:opacity-95 text-xs shadow-cyan-glow/20"
          >
            {isTh ? 'ปิดหน้าต่าง' : 'Close Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
