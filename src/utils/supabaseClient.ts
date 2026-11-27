// src/utils/supabaseClient.ts
// Lightweight, zero-dependency REST client for Supabase Free Tier
// Automatically active when NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

const getHeaders = (prefer?: string): Record<string, string> => {
  const headers: Record<string, string> = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
  if (prefer) headers.Prefer = prefer;
  return headers;
};

export async function fetchRemoteBookings(): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=created_at.desc`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Supabase fetch bookings error:', err);
    return null;
  }
}

export async function upsertRemoteBooking(booking: any): Promise<boolean> {
  if (!isSupabaseConfigured() || !booking) return false;
  try {
    const payload = {
      id: booking.id,
      customer_name: booking.customerName || booking.customer_name || 'ลูกค้าทั่วไป',
      phone: booking.phone || '',
      license_plate: booking.licensePlate || booking.license_plate || booking.carInfo || 'ไม่ระบุทะเบียน',
      service_name: booking.serviceName || booking.service_name || booking.service || 'ล้างรถพรีเมียม',
      sub_option: booking.subOption || booking.sub_option || null,
      booking_date: booking.bookingDate || booking.booking_date || booking.date || new Date().toISOString().split('T')[0],
      time_slot: booking.timeSlot || booking.time_slot || '08:30',
      total_price: booking.totalPrice ?? booking.total_price ?? booking.paidAmount ?? 0,
      payment_method: booking.paymentMethod || booking.payment_method || 'promptpay',
      slip_url: booking.slipUrl || booking.slip_url || booking.paymentSlipUrl || null,
      status: booking.status || 'confirmed',
      updated_at: new Date().toISOString()
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: getHeaders('resolution=merge-duplicates'),
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('Supabase save booking error:', err);
    return false;
  }
}

export async function updateRemoteBookingStatus(id: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: getHeaders('return=minimal'),
      body: JSON.stringify({ status, updated_at: new Date().toISOString() })
    });
    return res.ok;
  } catch (err) {
    console.warn('Supabase update status error:', err);
    return false;
  }
}

export async function fetchRemotePackages(): Promise<any[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/packages?select=*`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Supabase fetch packages error:', err);
    return null;
  }
}

export async function upsertRemotePackage(pkg: any): Promise<boolean> {
  if (!isSupabaseConfigured() || !pkg) return false;
  try {
    const payload = {
      id: pkg.id,
      customer_phone: pkg.customerPhone || pkg.customer_phone || pkg.phone || '',
      customer_name: pkg.customerName || pkg.customer_name || null,
      package_name: pkg.packageName || pkg.package_name || pkg.packageNameTh || 'Super Wash Pass',
      total_quota: pkg.totalQuota ?? pkg.total_quota ?? 12,
      used_quota: pkg.usedQuota ?? pkg.used_quota ?? 0,
      price: pkg.price ?? pkg.pricePaid ?? 0,
      status: pkg.status || 'active',
      purchased_date: pkg.purchasedDate || pkg.purchased_date || pkg.purchaseDate || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };
    const res = await fetch(`${SUPABASE_URL}/rest/v1/packages`, {
      method: 'POST',
      headers: getHeaders('resolution=merge-duplicates'),
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('Supabase save package error:', err);
    return false;
  }
}
