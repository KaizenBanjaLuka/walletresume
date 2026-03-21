import { Space_Mono } from 'next/font/google';
import './globals.css';

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
});

export const metadata = {
  metadataBase: new URL('https://wlltresume.xyz'),
  title: {
    default:  'wlltresume.xyz — your onchain resume',
    template: '%s | wlltresume.xyz',
  },
  description:
    'Generate a shareable Web3 CV from your wallet history. No signup. No data stored.',
  openGraph: {
    siteName:    'wlltresume.xyz',
    type:        'website',
    title:       'wlltresume.xyz — your onchain resume',
    description: 'Generate a shareable Web3 CV from your wallet history. No signup. No data stored.',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'wlltresume.xyz — your onchain resume',
    description: 'Generate a shareable Web3 CV from your wallet history. No signup. No data stored.',
    images:      ['/api/og'],
  },
  // favicon: place favicon.ico + apple-touch-icon.png in /public
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>{children}</body>
    </html>
  );
}
