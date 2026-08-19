import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Gallery from '@/components/Services/Gallery';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

// A mock mapping of category images
const CATEGORY_IMAGES: Record<string, string[]> = {
  doors: [
    '/images/project/IMG-20250406-WA0060.jpg',
    '/images/project/IMG-20250421-WA0014.jpg',
    '/images/project/IMG-20250422-WA0007.jpg',
    '/images/project/IMG-20250422-WA0008.jpg',
    '/images/project/IMG-20250428-WA0028.jpg',
    '/images/project/IMG-20250428-WA0030.jpg',
    '/images/project/IMG-20250614-WA0028.jpg',
    '/images/project/IMG-20250624-WA0011.jpg',
  ],
  facades: [
    '/images/project/IMG-20250827-WA0064.jpg',
    '/images/project/IMG-20251115-WA0055.jpg',
    '/images/project/IMG-20251115-WA0060.jpg',
    '/images/project/IMG-20251216-WA0010.jpg',
    '/images/project/IMG-20260103-WA0008.jpg',
    '/images/project/IMG-20260103-WA0009.jpg',
    '/images/project/IMG-20260103-WA0010.jpg',
    '/images/project/IMG-20260107-WA0025.jpg',
  ],
  pergolas: [
    '/images/project/IMG-20260216-WA0097.jpg',
    '/images/project/IMG-20260517-WA0004.jpeg',
    '/images/project/IMG-20260712-WA0067.jpg',
    '/images/project/IMG-20260712-WA0080.jpg',
    '/images/project/٢٠٢٦٠٢١٢_١٠٥٨٥٨.jpg',
    '/images/project/٢٠٢٦٠٣٣١_١٣٠٥١٨.jpg',
    '/images/project/٢٠٢٦٠٥١٣_١٠٥٠٥٣.jpg',
    '/images/project/٢٠٢٦٠٥١٣_١٠٥٠٥٥.jpg',
  ]
};

export default async function ServicePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params;
  
  if (!CATEGORY_IMAGES[slug]) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'Services' });
  const titleKey = `${slug}Title` as any;
  const descKey = `${slug}Desc` as any;
  
  const title = t(titleKey);
  const desc = t(descKey);
  const images = CATEGORY_IMAGES[slug];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '100px' }}>
      <Gallery title={title} description={desc} images={images} />
    </main>
  );
}
