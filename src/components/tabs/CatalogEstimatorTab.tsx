'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  VEHICLE_SIZES,
  SERVICE_CATEGORIES,
  SERVICE_ITEMS,
  POPULAR_CAR_MODELS,
} from '@/data/mockData';
import { VehicleSize, ServiceCategoryId, ServiceItem, CarModelLookup } from '@/types';
import {
  CarFront,
  Car,
  Shield,
  Truck,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Sun,
  Eye,
  Info,
  Search,
  X,
  Check,
} from 'lucide-react';

export const CatalogEstimatorTab: React.FC = () => {
  const {
    language,
    selectedVehicleSize,
    setSelectedVehicleSize,
    selectedCategory,
    setSelectedCategory,
    setPrefilledService,
    setCustomerTab,
    setActiveModal,
    liffFrameMode,
  } = useApp();

  const isTh = language === 'th';
  const [activeTintLevel, setActiveTintLevel] = useState<number>(60);
  const [carSearchQuery, setCarSearchQuery] = useState<string>('');
  const [activeSelectedCar, setActiveSelectedCar] = useState<CarModelLookup | null>(null);

  const currentSizeObj = VEHICLE_SIZES.find((s) => s.id === selectedVehicleSize) || VEHICLE_SIZES[1];

  const filteredServices = SERVICE_ITEMS.filter(
    (item) => item.categoryId === selectedCategory
  );

  const handleBookService = (service: ServiceItem) => {
    setPrefilledService(service);
    setCustomerTab('booking');
  };

  // Quick Car Model Select
  const handleSelectCarModel = (car: CarModelLookup) => {
    setActiveSelectedCar(car);
    setSelectedVehicleSize(car.size);
    setCarSearchQuery('');
  };

  const handleClearSelectedCar = () => {
    setActiveSelectedCar(null);
  };

  // Filter popular models based on user search query
  const cleanQuery = carSearchQuery.trim().toLowerCase();
  const matchingCars = cleanQuery
    ? POPULAR_CAR_MODELS.filter(
        (c) =>
          `${c.brand} ${c.model}`.toLowerCase().includes(cleanQuery) ||
          c.model.toLowerCase().includes(cleanQuery) ||
          c.brand.toLowerCase().includes(cleanQuery) ||
          (c.tag && c.tag.toLowerCase().includes(cleanQuery))
      )
    : [];

  const getSizeIcon = (sizeId: VehicleSize) => {
    switch (sizeId) {
      case 'S':
        return <CarFront className="h-4 w-4" />;
      case 'M':
        return <Car className="h-4 w-4" />;
      case 'L':
        return <Shield className="h-4 w-4" />;
      case 'XL':
        return <Truck className="h-4 w-4" />;
      case 'SUPER':
        return <Flame className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-5 pb-24 pt-2">
      {/* Studio Headline Banner in Royal Blue / Cyan theme */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-dark-950 via-dark-850 to-dark-950 p-4 sm:p-5 shadow-xl">
        <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>

        <div className="space-y-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-xs font-bold text-cyan-300 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isTh ? 'สตูดิโอระดับเวิลด์คลาสในภูเก็ต' : 'World-Class Studio in Phuket'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">
              {isTh ? 'ประเมินราคาตามขนาดรถของคุณ' : 'Smart Price & Bay Estimator'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              {isTh
                ? 'เลือกขนาดรถเพื่อดูราคา ระยะเวลา และจองคิวช่องบริการสตูดิโอปลอดฝุ่น C-Cube'
                : 'Select your vehicle size to calculate bespoke pricing and turn-around time.'}
            </p>
          </div>

          {/* Guide buttons: Stacked in 2-column row below description on mobile/LIFF so text never wraps vertically */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dark-800/90 sm:flex sm:w-auto">
            <button
              onClick={() => setActiveModal('aftercare_ppf')}
              className="w-full sm:w-auto text-xs font-semibold text-cyan-300 hover:text-white bg-royal-700/20 hover:bg-royal-600/30 border border-cyan-500/30 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{isTh ? 'คู่มือดูแล PPF' : 'PPF Care'}</span>
            </button>
            <button
              onClick={() => setActiveModal('aftercare_ceramic')}
              className="w-full sm:w-auto text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span>{isTh ? 'คู่มือเคลือบแก้ว' : 'Ceramic Care'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Car Model Search & Popular Pills */}
      <section className="rounded-2xl border border-dark-800 bg-dark-850 p-3.5 sm:p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
            <Search className="h-4 w-4 text-cyan-400" />
            <span>{isTh ? 'ค้นหารุ่นรถของคุณ (เทียบไซส์อัตโนมัติ)' : 'Quick Model Finder & Size Matcher'}</span>
          </label>
          <span className="text-[10px] text-gray-400">
            {isTh ? 'คลิกเพื่อเลือกไซส์ทันที' : 'Auto-selects vehicle size'}
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            value={carSearchQuery}
            onChange={(e) => setCarSearchQuery(e.target.value)}
            placeholder={
              isTh
                ? 'พิมพ์ค้นหา เช่น Porsche 911, M2, Alphard, BYD Seal, Model Y...'
                : 'Search your car model (e.g. Porsche 911, Alphard, Model Y)...'
            }
            className="w-full rounded-xl border border-dark-700 bg-dark-900 py-2.5 pl-9 pr-8 text-xs text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
          {carSearchQuery && (
            <button
              onClick={() => setCarSearchQuery('')}
              className="absolute right-2.5 top-2.5 p-1 rounded-full text-gray-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Search Dropdown Results */}
        {carSearchQuery.trim() && (
          <div className="rounded-xl border border-dark-700 bg-dark-900 p-2 space-y-1 max-h-48 overflow-y-auto">
            {matchingCars.length > 0 ? (
              matchingCars.map((car, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectCarModel(car)}
                  className="w-full text-left p-2 rounded-lg hover:bg-dark-800 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{car.brand} {car.model}</span>
                    {car.tag && (
                      <span className="text-[10px] text-gray-400 bg-dark-800 px-1.5 py-0.5 rounded">
                        {car.tag}
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50 text-[10px]">
                    Size {car.size}
                  </span>
                </button>
              ))
            ) : (
              <div className="text-center py-2 text-xs text-gray-500">
                {isTh ? 'ไม่พบรุ่นที่ตรงกัน กรุณาเลือกจากแถบไซส์ด้านล่าง' : 'No exact model found. Please select by size below.'}
              </div>
            )}
          </div>
        )}

        {/* Popular Quick Select Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
            {isTh ? 'รุ่นยอดนิยมในภูเก็ต (คลิกเพื่อเลือกไซส์):' : 'Popular in Phuket (1-Click Match):'}
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {POPULAR_CAR_MODELS.slice(0, 10).map((car, idx) => {
              const isMatched = activeSelectedCar?.model === car.model;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectCarModel(car)}
                  className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
                    isMatched
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-500'
                      : 'border-dark-700 bg-dark-900 text-gray-300 hover:border-cyan-500/40'
                  }`}
                >
                  <span>{car.brand} {car.model.split('/')[0]}</span>
                  <span className="font-mono text-[9px] font-bold text-cyan-400 bg-dark-800 px-1 py-0.2 rounded">
                    {car.size}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Car Feedback Banner */}
        {activeSelectedCar && (
          <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <div>
                <span className="font-bold text-white">
                  {activeSelectedCar.brand} {activeSelectedCar.model}
                </span>
                <span className="text-cyan-300 ml-1.5">
                  {isTh ? `➔ กำหนดเป็น Size ${activeSelectedCar.size} อัตโนมัติ` : `➔ Auto-matched to Size ${activeSelectedCar.size}`}
                </span>
              </div>
            </div>
            <button
              onClick={handleClearSelectedCar}
              className="text-[10px] text-gray-400 hover:text-white"
            >
              {isTh ? 'รีเซ็ต' : 'Reset'}
            </button>
          </div>
        )}
      </section>

      {/* Step 1: Vehicle Size Selector (Guaranteed 2-column mobile & LIFF frame layout) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-royal-600 to-cyan-500 text-[10px] font-extrabold text-white">
              1
            </span>
            {isTh ? 'เลือกรุ่น / ขนาดตัวถังรถ (Vehicle Size)' : 'Select Vehicle Class & Size'}
          </label>
          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {isTh ? currentSizeObj.nameTh : currentSizeObj.nameEn}
          </span>
        </div>

        {/* Grid: 2 columns in mobile or LIFF frame mode; 5 columns on full desktop */}
        <div className={liffFrameMode ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-2 sm:grid-cols-5 gap-2'}>
          {VEHICLE_SIZES.map((size) => {
            const isSelected = selectedVehicleSize === size.id;
            const isSupercar = size.id === 'SUPER';

            return (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedVehicleSize(size.id);
                  if (activeSelectedCar && activeSelectedCar.size !== size.id) {
                    setActiveSelectedCar(null);
                  }
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 relative ${
                  isSupercar ? (liffFrameMode ? 'col-span-2' : 'col-span-2 sm:col-span-1') : ''
                } ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-b from-royal-900/40 via-cyan-950/30 to-dark-850 shadow-cyan-glow/20 ring-1 ring-cyan-400'
                    : 'border-dark-800 bg-dark-850/80 hover:border-cyan-500/40 text-gray-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected
                        ? 'bg-gradient-to-r from-royal-600 to-cyan-500 text-white font-bold'
                        : 'bg-dark-750 text-gray-300'
                    }`}
                  >
                    {getSizeIcon(size.id)}
                  </div>
                  <span
                    className={`text-xs font-mono font-black ${
                      isSelected ? 'text-cyan-300' : 'text-gray-400'
                    }`}
                  >
                    {size.id}
                  </span>
                </div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  {size.id === 'SUPER'
                    ? 'Supercar (Exotic)'
                    : `Size ${size.id}`}
                </div>
                <div className="text-[10px] text-gray-400 truncate w-full mt-0.5">
                  {isTh ? size.subTh : size.subEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected size explanation badge */}
        <div className="rounded-xl border border-dark-800 bg-dark-850/50 p-2.5 flex items-start gap-2 text-[11px] text-gray-300">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-gray-200">
              {isTh ? 'ตัวอย่างรถยนต์ในกลุ่มนี้: ' : 'Typical Models: '}
            </span>
            <span className="text-gray-400">
              {isTh ? currentSizeObj.examplesTh : currentSizeObj.examplesEn}
            </span>
          </div>
        </div>
      </section>

      {/* Step 2: Category Selector */}
      <section className="space-y-2.5">
        <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-royal-600 to-cyan-500 text-[10px] font-extrabold text-white">
            2
          </span>
          {isTh ? 'เลือกหมวดหมู่บริการ (Service Category)' : 'Select Service Category'}
        </label>

        {/* Category Horizontal Scrolling / Grid */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-r from-royal-600/30 to-cyan-600/30 text-white shadow-cyan-glow/20 ring-1 ring-cyan-400'
                    : 'border-dark-800 bg-dark-850 text-gray-400 hover:text-gray-200 hover:border-dark-700'
                }`}
              >
                {cat.id === 'wash' && <Sparkles className="h-4 w-4 text-cyan-400" />}
                {cat.id === 'ceramic' && <ShieldCheck className="h-4 w-4 text-cyan-300" />}
                {cat.id === 'ppf' && <Shield className="h-4 w-4 text-royal-400" />}
                {cat.id === 'wrap' && <Sparkles className="h-4 w-4 text-sky-400" />}
                {cat.id === 'tint' && <Sun className="h-4 w-4 text-cyan-400" />}
                <span>{isTh ? cat.titleTh : cat.titleEn}</span>
                {cat.badgeTh && (
                  <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-dark-750 text-gray-300 font-normal">
                    {isTh ? cat.badgeTh : cat.badgeEn}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Special Interactive Widget for Window Film Tint Preview */}
      {selectedCategory === 'tint' && (
        <section className="rounded-2xl border border-dark-800 bg-dark-850 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {isTh ? 'จำลองระดับความเข้มฟิล์มกรองแสง (Tint Simulator)' : 'Avery Dennison Tint Preview'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {activeTintLevel}% Darkness
            </span>
          </div>

          {/* Interactive Tint Silhouette Simulator */}
          <div className="relative h-24 rounded-xl border border-dark-750 overflow-hidden bg-gradient-to-r from-sky-950/40 via-dark-850 to-royal-950/40 flex items-center justify-center p-3">
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                backgroundColor: `rgba(7, 9, 14, ${activeTintLevel / 100 * 0.95})`,
              }}
            ></div>

            <div className="relative z-10 text-center space-y-1">
              <div className="text-xs font-bold text-white drop-shadow">
                {activeTintLevel === 40 && (isTh ? '40% - สว่างหรูหรา ขับขี่กลางคืนสบายตา' : '40% - Light Luxury & Crystal Night Drive')}
                {activeTintLevel === 60 && (isTh ? '60% - มาตรฐานยอดนิยม กันร้อนสูง มีความเป็นส่วนตัว' : '60% - Executive Balanced Privacy & High IR Rejection')}
                {activeTintLevel === 80 && (isTh ? '80% - มืดสนิทภายนอก เพิ่มความปลอดภัยระดับ VIP' : '80% - VIP Maximum Darkness & Total Exterior Privacy')}
              </div>
              <p className="text-[10px] text-gray-300">
                {isTh ? 'ป้องกันรังสีอินฟราเรด (IR) 96% | ป้องกันรังสี UV 99.9%' : '96% Infrared Heat Rejection | 99.9% UV Block'}
              </p>
            </div>
          </div>

          {/* Level Selector Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[40, 60, 80].map((level) => (
              <button
                key={level}
                onClick={() => setActiveTintLevel(level)}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                  activeTintLevel === level
                    ? 'border-cyan-400 bg-cyan-600/25 text-white ring-1 ring-cyan-400'
                    : 'border-dark-750 bg-dark-900 text-gray-400 hover:text-gray-200'
                }`}
              >
                {level}% {isTh ? (level === 40 ? 'บานหน้า' : level === 60 ? 'รอบคัน' : 'มืดพิเศษ') : `Tint ${level}%`}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Services List for Selected Category */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            {isTh
              ? `พบ ${filteredServices.length} แพ็กเกจสำหรับ ${currentSizeObj.nameTh}`
              : `Found ${filteredServices.length} packages for ${currentSizeObj.nameEn}`}
          </div>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            {isTh ? 'พร้อมรับจองคิวออนไลน์' : 'Online Booking Open'}
          </div>
        </div>

        <div className="space-y-4">
          {filteredServices.map((service) => {
            const price = service.pricing[selectedVehicleSize] || 0;
            const duration = service.duration[selectedVehicleSize] || '1 วัน';

            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-dark-800 bg-gradient-to-b from-dark-850 to-dark-900 p-4 sm:p-5 shadow-subtle-card hover:border-cyan-500/40 transition-all duration-300"
              >
                {/* Subtle Electric Cyan Glow Accent */}
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-dark-750 px-2 py-0.5 text-[10px] font-bold text-gray-300 border border-dark-700">
                        {service.brandPartner}
                      </span>
                      {service.popular && (
                        <span className="rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-extrabold text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                          {isTh ? 'ยอดนิยม' : 'Best Seller'}
                        </span>
                      )}
                      {service.warrantyYears && (
                        <span className="rounded-md bg-royal-600/20 px-2 py-0.5 text-[10px] font-bold text-royal-300 border border-royal-500/40">
                          {isTh ? `รับประกัน ${service.warrantyYears} ปี` : `${service.warrantyYears}-Year Warranty`}
                        </span>
                      )}
                      <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                        {service.bayType === 'detailing'
                          ? isTh ? 'ช่อง Detailing Bay' : 'Detailing Bay'
                          : isTh ? 'ห้องสตูดิโอ Cleanroom' : 'Studio Cleanroom'}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {isTh ? service.nameTh : service.nameEn}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isTh ? service.descTh : service.descEn}
                    </p>
                  </div>

                  {/* Price & Duration Box (Crisp White typography) */}
                  <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1 sm:text-right shrink-0 bg-dark-950/80 p-3 rounded-xl border border-dark-800 min-w-[140px]">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                        {isTh ? 'ราคาประเมิน (ไซส์ ' + selectedVehicleSize + ')' : `Est. Price (${selectedVehicleSize})`}
                      </div>
                      <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-baseline justify-end gap-1">
                        <span className="text-sm font-sans text-cyan-400 font-bold">฿</span>
                        <span>{price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-gray-300 font-medium">
                      <Clock className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{isTh ? `ระยะเวลา ~ ${duration}` : `Est. ~ ${duration}`}</span>
                    </div>
                  </div>
                </div>

                {/* Features checklist */}
                <div className="mt-4 pt-3.5 border-t border-dark-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(isTh ? service.featuresTh : service.featuresEn).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-gray-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action button in Royal Blue to Electric Cyan */}
                <div className="mt-4 flex items-center justify-end">
                  <button
                    onClick={() => handleBookService(service)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-royal-600 via-royal-500 to-cyan-500 hover:from-royal-500 hover:to-cyan-400 px-5 py-2.5 text-xs font-extrabold text-white shadow-cyan-glow/30 transition-all transform active:scale-95"
                  >
                    <span>{isTh ? 'จองคิวบริการนี้' : 'Book This Service'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
