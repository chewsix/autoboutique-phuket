export type Language = 'th' | 'en';

export type AppView = 'customer' | 'admin';

export type CustomerTab = 'catalog' | 'booking' | 'tracker' | 'warranty';

export type VehicleSize = 'S' | 'M' | 'L' | 'XL' | 'SUPER';

export interface VehicleSizeInfo {
  id: VehicleSize;
  nameTh: string;
  nameEn: string;
  subTh: string;
  subEn: string;
  examplesTh: string;
  examplesEn: string;
  icon: string;
}

export interface CarModelLookup {
  brand: string;
  model: string;
  size: VehicleSize;
  tag?: string;
  badge?: string;
}

export type ServiceCategoryId = 'wash' | 'ceramic' | 'ppf' | 'wrap' | 'tint';

export interface ServiceCategory {
  id: ServiceCategoryId;
  titleTh: string;
  titleEn: string;
  taglineTh: string;
  taglineEn: string;
  badgeTh?: string;
  badgeEn?: string;
  iconName: string;
}

export interface ServiceItem {
  id: string;
  categoryId: ServiceCategoryId;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  badgeTh?: string;
  badgeEn?: string;
  popular?: boolean;
  brandPartner?: 'IGL Coatings' | 'Magnus Pro' | 'Avery Dennison' | 'C-Cube Signature';
  pricing: Record<VehicleSize, number>;
  duration: Record<VehicleSize, string>;
  bayType: 'detailing' | 'cleanroom';
  warrantyYears?: number;
  featuresTh: string[];
  featuresEn: string[];
  tintOptions?: number[]; // for window film, e.g. [40, 60, 80]
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  carBrand: string;
  carModel: string;
  licensePlate: string;
  province: string;
  vehicleSize: VehicleSize;
  serviceId: string;
  serviceNameTh: string;
  serviceNameEn: string;
  bayType: 'detailing' | 'cleanroom';
  bookingDate: string; // YYYY-MM-DD
  timeSlot?: string; // e.g. "08:30 - 10:00" for detailing
  status: 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priceEstimate: number;
  notes?: string;
  createdAt: string;
}

export interface StageChecklistItem {
  labelTh: string;
  labelEn: string;
  done: boolean;
}

export interface StagePhoto {
  id: string;
  url: string;
  captionTh: string;
  captionEn: string;
  timestamp?: string;
  type?: 'before' | 'after' | 'work' | 'qc';
}

export interface StageDetail {
  stage: 1 | 2 | 3 | 4 | 5;
  titleTh: string;
  titleEn: string;
  subtitleTh: string;
  subtitleEn: string;
  timestamp?: string;
  notesTh?: string;
  notesEn?: string;
  technician?: string;
  checklist: StageChecklistItem[];
  photos?: StagePhoto[];
}

export interface CarTrackerJob {
  id: string;
  bookingId?: string;
  customerName: string;
  phone: string;
  carBrand: string;
  carModel: string;
  carColor: string;
  licensePlate: string;
  province: string;
  vehicleSize: VehicleSize;
  serviceNameTh: string;
  serviceNameEn: string;
  brandPartner: string;
  bayNameTh: string;
  bayNameEn: string;
  leadTechnician: string;
  startDate: string;
  estimatedFinish: string;
  currentStage: 1 | 2 | 3 | 4 | 5;
  stages: StageDetail[];
  inspectionPhotoCount: number;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  typeTh: string;
  typeEn: string;
  technician: string;
  remarksTh: string;
  remarksEn: string;
}

export interface EWarrantyCard {
  id: string;
  warrantyNumber: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  licensePlate: string;
  vinNumber: string;
  productBrand: 'Magnus Pro' | 'IGL Coatings' | 'Avery Dennison';
  productNameTh: string;
  productNameEn: string;
  coverageYears: number;
  installDate: string;
  expiryDate: string;
  nextInspectionDate: string;
  isDueSoon: boolean;
  status: 'active' | 'expiring_soon' | 'completed';
  maintenanceHistory: MaintenanceRecord[];
}

export interface LineFlexMessagePayload {
  isOpen: boolean;
  carPlate: string;
  province: string;
  carBrand: string;
  carModel: string;
  customerName: string;
  serviceName: string;
  stageNumber: number;
  stageTitle: string;
  timestamp: string;
  progressPercent: number;
  bayName: string;
  photoUrl?: string;
}
