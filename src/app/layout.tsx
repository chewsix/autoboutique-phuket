import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Autoboutique Phuket | Luxury Automotive Detailing Studio (C-Cube Automotive)',
  description:
    'Autoboutique Phuket — ศูนย์บริการดูแลและตกแต่งรถยนต์ระดับพรีเมียมในจังหวัดภูเก็ต โดย C-Cube Automotive (ก่อตั้งปี 2008) Crafted for Perfection, Driven by Passion. ระบบจองคิวล้างรถพรีเมียมออนไลน์',
  icons: {
    icon: '/logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080C14',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="min-h-screen antialiased font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
