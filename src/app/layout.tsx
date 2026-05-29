import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { LayoutWrapper } from '../components/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ಕೃಷಿಕಾ - AI Farming Operating System',
  description: 'A premium futuristic AI-powered sustainable agriculture operating system that helps Indian farmers with intelligent crop management, real-time market insights, and eco-friendly farming solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} h-full bg-[#0a0f0d] text-emerald-50 flex flex-col md:flex-row antialiased relative overflow-x-hidden`}>
        <AppProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
