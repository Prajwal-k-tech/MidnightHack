import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from 'sonner';
import { ClickSpark } from '@/components/ui/ClickSpark';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'dApp | Midnight',
  description: 'A privacy-first dating platform on the Midnight blockchain',
  keywords: ['Midnight', 'Compact', 'Privacy', 'Smart Contracts', 'Blockchain', 'DApp', 'Dating'],
  authors: [{ name: 'Your Name' }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased')}>
        <div className="dark:glow-background">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative min-h-screen bg-background text-foreground">
              {children}
            </div>
          <Toaster />
          <ClickSpark />          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}