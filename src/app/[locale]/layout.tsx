import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import { Inter, Space_Grotesk, Cairo } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SmoothScrolling from '@/components/SmoothScrolling';
import FloatingContact from '@/components/FloatingContact/FloatingContact';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'HomePage'});
  return {
    title: t('title'),
    description: t('heroSubtitle'),
  };
}

import CustomCursor from '@/components/UI/CustomCursor';

import { neon } from '@neondatabase/serverless';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontClass = locale === 'ar' ? cairo.variable : `${inter.variable} ${spaceGrotesk.variable}`;

  let dbSettings: any = {};
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const settingsRows = await sql`SELECT * FROM settings`;
    dbSettings = settingsRows.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch settings for layout:", error);
  }

  return (
    <html lang={locale} dir={dir} className={fontClass}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScrolling>
            <CustomCursor />
            <Navbar />
            {children}
            <Footer dbSettings={dbSettings} />
            <FloatingContact dbSettings={dbSettings} />
          </SmoothScrolling>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
