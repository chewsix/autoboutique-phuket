'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  AppView,
  CustomerTab,
  VehicleSize,
  ServiceCategoryId,
  ServiceItem,
  Booking,
  CarTrackerJob,
  EWarrantyCard,
  LineFlexMessagePayload,
  StagePhoto,
} from '@/types';
import {
  MOCK_BOOKINGS,
  MOCK_ACTIVE_JOBS,
  MOCK_WARRANTIES,
  SERVICE_ITEMS,
} from '@/data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  view: AppView;
  setView: (view: AppView) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  selectedVehicleSize: VehicleSize;
  setSelectedVehicleSize: (size: VehicleSize) => void;
  selectedCategory: ServiceCategoryId;
  setSelectedCategory: (cat: ServiceCategoryId) => void;
  prefilledService: ServiceItem | null;
  setPrefilledService: (service: ServiceItem | null) => void;
  prefilledWarrantyBooking: EWarrantyCard | null;
  setPrefilledWarrantyBooking: (card: EWarrantyCard | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  activeJobs: CarTrackerJob[];
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  advanceJobStage: (jobId: string) => void;
  regressJobStage: (jobId: string) => void;
  toggleStageChecklistItem: (jobId: string, stageNum: number, itemIndex: number) => void;
  addStagePhoto: (jobId: string, stageNum: number, photo: Omit<StagePhoto, 'id'>) => void;
  warranties: EWarrantyCard[];
  liffFrameMode: boolean;
  toggleLiffFrame: () => void;
  activeModal: 'aftercare_ppf' | 'aftercare_ceramic' | null;
  setActiveModal: (modal: 'aftercare_ppf' | 'aftercare_ceramic' | null) => void;
  selectedInspectionJob: CarTrackerJob | null;
  setSelectedInspectionJob: (job: CarTrackerJob | null) => void;
  lineToastPayload: LineFlexMessagePayload | null;
  showLineToast: (payload: LineFlexMessagePayload) => void;
  closeLineToast: () => void;
  activeLightboxPhoto: StagePhoto | null;
  setActiveLightboxPhoto: (photo: StagePhoto | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th');
  const [view, setView] = useState<AppView>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('catalog');
  const [selectedVehicleSize, setSelectedVehicleSize] = useState<VehicleSize>('M');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryId>('ceramic');
  const [prefilledService, setPrefilledService] = useState<ServiceItem | null>(null);
  const [prefilledWarrantyBooking, setPrefilledWarrantyBooking] = useState<EWarrantyCard | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeJobs, setActiveJobs] = useState<CarTrackerJob[]>(MOCK_ACTIVE_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('JOB-M2-8888');
  const [warranties, setWarranties] = useState<EWarrantyCard[]>(MOCK_WARRANTIES);
  const [liffFrameMode, setLiffFrameMode] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<'aftercare_ppf' | 'aftercare_ceramic' | null>(null);
  const [selectedInspectionJob, setSelectedInspectionJob] = useState<CarTrackerJob | null>(null);
  const [lineToastPayload, setLineToastPayload] = useState<LineFlexMessagePayload | null>(null);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<StagePhoto | null>(null);

  // Toggle language between TH and EN
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'th' ? 'en' : 'th'));
  };

  const toggleLiffFrame = () => {
    setLiffFrameMode((prev) => !prev);
  };

  const showLineToast = (payload: LineFlexMessagePayload) => {
    setLineToastPayload(payload);
  };

  const closeLineToast = () => {
    setLineToastPayload(null);
  };

  // Add a new booking and automatically sync with active jobs if applicable
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const newId = `BK-${new Date().getFullYear()}-${String(bookings.length + 86).padStart(3, '0')}`;
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBooking: Booking = {
      ...bookingData,
      id: newId,
      createdAt,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Also auto-create a Job in the live tracker so user can track it right away!
    const matchedService = SERVICE_ITEMS.find((s) => s.id === bookingData.serviceId);
    const newJobId = `JOB-${bookingData.licensePlate.replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;

    const newJob: CarTrackerJob = {
      id: newJobId,
      bookingId: newId,
      customerName: bookingData.customerName,
      phone: bookingData.customerPhone,
      carBrand: bookingData.carBrand,
      carModel: bookingData.carModel,
      carColor: 'Metallic Black',
      licensePlate: bookingData.licensePlate,
      province: bookingData.province || 'ภูเก็ต',
      vehicleSize: bookingData.vehicleSize,
      serviceNameTh: bookingData.serviceNameTh,
      serviceNameEn: bookingData.serviceNameEn,
      brandPartner: matchedService?.brandPartner || 'Autoboutique',
      bayNameTh: bookingData.bayType === 'detailing' ? 'ช่องบริการ Detailing Bay 2' : 'ห้องสตูดิโอ คลีนรูม Bay 1',
      bayNameEn: bookingData.bayType === 'detailing' ? 'Detailing Bay 2' : 'Studio Cleanroom Bay 1',
      leadTechnician: 'ช่างเอก (Master Certified)',
      startDate: `${bookingData.bookingDate} ${bookingData.timeSlot || '09:00'}`,
      estimatedFinish: `${bookingData.bookingDate} 17:00`,
      currentStage: 1,
      inspectionPhotoCount: 3,
      stages: [
        {
          stage: 1,
          titleTh: '1. ตรวจรับรถและบันทึกรอยเดิมรอบคัน (Vehicle Inspection)',
          titleEn: '1. Vehicle Reception & 360° Inspection',
          subtitleTh: 'ตรวจวัดสภาพสีและจุดตำหนิเดิม 360°',
          subtitleEn: 'Paint condition and pre-existing defect mapping',
          timestamp: 'เพิ่งรับรถ (Just Checked-in)',
          technician: 'ช่างบอย & ช่างเอก',
          notesTh: 'เปิดใบรับงานใหม่เรียบร้อย รอคิวขึ้นฮ้อยท์ตรวจความเรียบร้อยรอบคัน',
          notesEn: 'New service order initiated. Staged for initial inspection checklist.',
          checklist: [
            { labelTh: 'ตรวจเช็กรอยขีดข่วนเดิมรอบคันและถ่ายภาพบันทึก', labelEn: '360 photographic inspection', done: true },
            { labelTh: 'ตรวจวัดความหนาชั้นสีด้วยเครื่อง Digital Gauge', labelEn: 'Paint gauge depth scanning', done: false },
            { labelTh: 'ตรวจสอบสัมภาระและระบบไฟฟ้าภายในรถ', labelEn: 'Cockpit & electrical systems check', done: true },
          ],
          photos: [
            {
              id: 'ph-new-1',
              url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
              captionTh: 'ตรวจรับรถและบันทึกจุดตำหนิเดิม',
              captionEn: 'Vehicle check-in condition documentation',
              timestamp: 'เพิ่งรับรถ',
              type: 'before',
            },
          ],
        },
        {
          stage: 2,
          titleTh: '2. ล้างเตรียมผิวและขัดปรับสภาพสี (Surface Prep)',
          titleEn: '2. Surface Prep & Decontamination',
          subtitleTh: 'ล้างทำความสะอาด 12 ขั้นตอน ลูบดินน้ำมัน ขัดลบรอย',
          subtitleEn: 'Intensive decontamination and paint correction',
          checklist: [
            { labelTh: 'สลายคราบยางมะตอยและผงเหล็กผ้าเบรก', labelEn: 'Iron & tar decontamination', done: false },
            { labelTh: 'ลูบดินน้ำมันขจัดละอองไอเกลือทะเลภูเก็ต', labelEn: 'Coastal sea-salt clay therapy', done: false },
            { labelTh: 'ขัดปรับสภาพผิวสี Stage 1-2', labelEn: 'Paint correction polishing', done: false },
          ],
        },
        {
          stage: 3,
          titleTh: '3. ติดตั้งในห้องสตูดิโอปลอดฝุ่น (Cleanroom Studio)',
          titleEn: '3. Cleanroom Installation / Application',
          subtitleTh: 'ลงน้ำยาเคลือบเซรามิก หรือ ติดตั้งฟิล์ม PPF ในห้องแอร์ควบคุมความชื้น',
          subtitleEn: 'Application under strict dust-free temperature control',
          checklist: [
            { labelTh: 'ทำความสะอาดพื้นผิวด้วยสารขจัดคราบน้ำมัน IPA', labelEn: 'IPA surface sterilisation', done: false },
            { labelTh: 'ติดตั้งงานมาตรฐานสตูดิโอ C-Cube', labelEn: 'C-Cube studio installation standard', done: false },
          ],
        },
        {
          stage: 4,
          titleTh: '4. ตรวจสอบคุณภาพด้วยระบบไฟเฉพาะ (Studio Light QC)',
          titleEn: '4. Studio Light Quality Control',
          subtitleTh: 'ตรวจสอบด้วยระบบไฟ Hexagon และตรวจเช็กความเรียบร้อย 100%',
          subtitleEn: 'Hexagon lighting defect detection and edge verification',
          checklist: [
            { labelTh: 'ส่องไฟ SunMatch ตรวจสอบความสม่ำเสมอของผิวงาน', labelEn: 'SunMatch uniformity check', done: false },
            { labelTh: 'ทดสอบการคืนตัวและการยึดเกาะ', labelEn: 'Adhesion & hydrophobicity test', done: false },
          ],
        },
        {
          stage: 5,
          titleTh: '5. พร้อมส่งมอบรถ (Ready for Pickup)',
          titleEn: '5. Ready for Customer Pickup',
          subtitleTh: 'รถจอดรอส่งมอบ ณ ช่องส่งมอบ VIP พร้อมใบรับประกัน E-Warranty',
          subtitleEn: 'Staged at VIP Lounge with digital warranty registered',
          checklist: [
            { labelTh: 'ทำความสะอาดห้องโดยสารรอบสุดท้าย', labelEn: 'Final interior detailing wipe', done: false },
            { labelTh: 'ออกใบรับประกันดิจิทัล E-Warranty', labelEn: 'Issuance of Digital E-Warranty Card', done: false },
          ],
        },
      ],
    };

    setActiveJobs((prev) => [newJob, ...prev]);
    setSelectedJobId(newJobId);

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const cancelBooking = (id: string) => {
    updateBookingStatus(id, 'cancelled');
  };

  // Add a photo to a specific stage of a job
  const addStagePhoto = (jobId: string, stageNum: number, photo: Omit<StagePhoto, 'id'>) => {
    setActiveJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const newPhoto: StagePhoto = {
          ...photo,
          id: `ph-user-${Date.now().toString().slice(-5)}`,
        };
        const updatedStages = job.stages.map((st) => {
          if (st.stage !== stageNum) return st;
          return {
            ...st,
            photos: [...(st.photos || []), newPhoto],
          };
        });
        return {
          ...job,
          stages: updatedStages,
          inspectionPhotoCount: job.inspectionPhotoCount + 1,
        };
      })
    );
  };

  // Advance stage for a car in the live tracker (Stage 1 -> 2 -> 3 -> 4 -> 5)
  // and trigger simulated LINE Flex Message preview toast!
  const advanceJobStage = (jobId: string) => {
    setActiveJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const nextStage = Math.min(5, job.currentStage + 1) as 1 | 2 | 3 | 4 | 5;
        const now = new Date();
        const timeStr = `${now.getDate()} พ.ย. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const updatedStages = job.stages.map((st) => {
          if (st.stage === job.currentStage) {
            // mark previous stage checklist as all completed
            return {
              ...st,
              timestamp: st.timestamp && !st.timestamp.includes('Progress') ? st.timestamp : timeStr,
              checklist: st.checklist.map((c) => ({ ...c, done: true })),
            };
          }
          if (st.stage === nextStage) {
            return {
              ...st,
              timestamp: nextStage === 5 ? timeStr : 'กำลังดำเนินการ (In Progress)',
            };
          }
          return st;
        });

        const targetStageObj = updatedStages.find((st) => st.stage === nextStage);
        const stageTitle = targetStageObj
          ? targetStageObj.titleTh
          : `ขั้นตอนที่ ${nextStage}`;

        // Trigger realistic LINE Official Account Flex Message notification toast
        setLineToastPayload({
          isOpen: true,
          carPlate: job.licensePlate,
          province: job.province,
          carBrand: job.carBrand,
          carModel: job.carModel,
          customerName: job.customerName,
          serviceName: job.serviceNameTh,
          stageNumber: nextStage,
          stageTitle,
          timestamp: timeStr,
          progressPercent: nextStage * 20,
          bayName: job.bayNameTh,
          photoUrl: targetStageObj?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
        });

        return {
          ...job,
          currentStage: nextStage,
          stages: updatedStages,
        };
      })
    );
  };

  // Regress stage for admin if they made a mistake
  const regressJobStage = (jobId: string) => {
    setActiveJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const prevStage = Math.max(1, job.currentStage - 1) as 1 | 2 | 3 | 4 | 5;
        return {
          ...job,
          currentStage: prevStage,
        };
      })
    );
  };

  // Toggle specific checklist item on stage
  const toggleStageChecklistItem = (jobId: string, stageNum: number, itemIndex: number) => {
    setActiveJobs((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        const updatedStages = job.stages.map((st) => {
          if (st.stage !== stageNum) return st;
          const updatedChecklist = st.checklist.map((item, idx) =>
            idx === itemIndex ? { ...item, done: !item.done } : item
          );
          return { ...st, checklist: updatedChecklist };
        });
        return { ...job, stages: updatedStages };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        view,
        setView,
        customerTab,
        setCustomerTab,
        selectedVehicleSize,
        setSelectedVehicleSize,
        selectedCategory,
        setSelectedCategory,
        prefilledService,
        setPrefilledService,
        prefilledWarrantyBooking,
        setPrefilledWarrantyBooking,
        bookings,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        activeJobs,
        selectedJobId,
        setSelectedJobId,
        advanceJobStage,
        regressJobStage,
        toggleStageChecklistItem,
        addStagePhoto,
        warranties,
        liffFrameMode,
        toggleLiffFrame,
        activeModal,
        setActiveModal,
        selectedInspectionJob,
        setSelectedInspectionJob,
        lineToastPayload,
        showLineToast,
        closeLineToast,
        activeLightboxPhoto,
        setActiveLightboxPhoto,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
