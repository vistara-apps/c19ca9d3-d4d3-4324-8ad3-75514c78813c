import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NutriGenius - Your Personalized Daily Food Guide',
  description: 'Get instant, personalized daily food recommendations and meal ideas for your health goals, considering dietary restrictions.',
  keywords: 'nutrition, meal planning, health goals, dietary restrictions, AI recommendations',
  authors: [{ name: 'NutriGenius Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e40af',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="floating-elements">
            <div className="floating-element w-20 h-20 bg-accent/20 top-10 left-10" style={{ animationDelay: '0s' }} />
            <div className="floating-element w-16 h-16 bg-primary/20 top-20 right-20" style={{ animationDelay: '5s' }} />
            <div className="floating-element w-12 h-12 bg-purple-500/20 bottom-20 left-20" style={{ animationDelay: '10s' }} />
            <div className="floating-element w-24 h-24 bg-pink-500/20 bottom-10 right-10" style={{ animationDelay: '15s' }} />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
