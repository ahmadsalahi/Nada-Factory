import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { neon } from '@neondatabase/serverless';
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

export const dynamic = 'force-dynamic';

export default async function ServicePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  
  let title = '';
  let desc = '';
  let images: string[] = [];
  
  try {
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if slug is numeric (fallback for older projects without a slug) or a string slug
    const projectId = parseInt(decodedSlug, 10);
    const isNumeric = !isNaN(projectId) && projectId.toString() === decodedSlug;

    const projectRes = isNumeric 
      ? await sql`SELECT * FROM projects WHERE id = ${projectId}`
      : await sql`SELECT * FROM projects WHERE slug = ${decodedSlug}`;

    if (projectRes.length > 0) {
      const project = projectRes[0];
      title = locale === 'ar' ? project.title_ar : project.title_en;
      desc = locale === 'ar' ? project.desc_ar : project.desc_en;
      
      const galleryRes = await sql`SELECT image_url FROM gallery WHERE project_id = ${project.id} ORDER BY created_at DESC`;
      images = galleryRes.map(row => row.image_url);
    } else {
      // Fallback to hardcoded mock data if project is not in DB yet
      if (CATEGORY_IMAGES[decodedSlug]) {
        const t = await getTranslations({ locale, namespace: 'Services' });
        title = t(`${decodedSlug}Title` as any);
        desc = t(`${decodedSlug}Desc` as any);
        images = CATEGORY_IMAGES[decodedSlug];
      } else {
        notFound();
      }
    }
  } catch (error) {
    console.error("DB Error:", error);
    // Fallback to hardcoded mock data if DB fails
    if (CATEGORY_IMAGES[decodedSlug]) {
      const t = await getTranslations({ locale, namespace: 'Services' });
      title = t(`${decodedSlug}Title` as any);
      desc = t(`${decodedSlug}Desc` as any);
      images = CATEGORY_IMAGES[decodedSlug];
    } else {
      notFound();
    }
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '100px' }}>
      <Gallery title={title} description={desc} images={images} />
    </main>
  );
}
