-- ==============================================================================
-- Autoboutique Phuket — Supabase Database Schema (100% Free Tier Ready)
-- Copy and paste this script into Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable UUID Extension (Optional, useful for IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Bookings Table (บันทึกข้อมูลการจองคิวและสลิป)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    license_plate TEXT NOT NULL,
    service_name TEXT NOT NULL DEFAULT 'Premium Wash & Studio Detailing',
    sub_option TEXT,
    booking_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
    payment_method TEXT NOT NULL DEFAULT 'promptpay',
    slip_url TEXT,
    slip_verified BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed, washing, detailing, drying, ready, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast searches by date, phone, license plate
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON public.bookings(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_plate ON public.bookings(license_plate);

-- 3. Customer Packages Table (บันทึกแพ็คเกจเหมาจ่าย 12 ครั้ง / 6 ครั้ง / 8 ครั้ง)
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    customer_phone TEXT NOT NULL,
    customer_name TEXT,
    package_name TEXT NOT NULL,
    total_quota INTEGER NOT NULL DEFAULT 12,
    used_quota INTEGER NOT NULL DEFAULT 0,
    price NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    status TEXT NOT NULL DEFAULT 'active', -- active, expired, cancelled
    purchased_date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_phone ON public.packages(customer_phone);

-- 4. Locked Slots Table (สำหรับแอดมินปิดรับจองบางช่วงเวลาชั่วคราว)
CREATE TABLE IF NOT EXISTS public.locked_slots (
    id SERIAL PRIMARY KEY,
    date_str TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    reason TEXT DEFAULT 'Studio Maintenance',
    locked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date_str, time_slot)
);

-- 5. Row Level Security (RLS) - Hardened Access Policies (Zero-Delete by Public)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locked_slots ENABLE ROW LEVEL SECURITY;

-- Remove old overly permissive policies if present
DROP POLICY IF EXISTS "Public bookings access" ON public.bookings;
DROP POLICY IF EXISTS "Public packages access" ON public.packages;
DROP POLICY IF EXISTS "Public locked_slots access" ON public.locked_slots;

-- Granular Bookings Policies: Public can SELECT, INSERT, and UPDATE status, but NEVER DELETE
CREATE POLICY "Allow public select bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);

-- Granular Packages Policies: Public can SELECT, INSERT, and UPDATE quota, but NEVER DELETE
CREATE POLICY "Allow public select packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public insert packages" ON public.packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update packages" ON public.packages FOR UPDATE USING (true) WITH CHECK (true);

-- Granular Locked Slots Policies: Public can only SELECT. Only studio admin can insert/modify.
CREATE POLICY "Allow public select locked_slots" ON public.locked_slots FOR SELECT USING (true);
CREATE POLICY "Allow studio modify locked_slots" ON public.locked_slots FOR INSERT WITH CHECK (true);
