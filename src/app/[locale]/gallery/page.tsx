import { neon } from '@neondatabase/serverless';
import Gallery from '@/components/Services/Gallery';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';

// Fallback mock data in case DB is completely empty
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

export default async function AllGalleryPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  
  const title = locale === 'ar' ? 'معرض الصور الشامل' : 'Complete Gallery Portfolio';
  const desc = locale === 'ar' 
    ? 'تصفح جميع أعمالنا وإنجازاتنا من مختلف المشاريع والأقسام في مكان واحد.' 
    : 'Explore all our works and achievements from various projects and categories in one place.';
  
  let images: string[] = [];
  
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const galleryRes = await sql`SELECT image_url FROM gallery ORDER BY created_at DESC`;
    
    if (galleryRes.length > 0) {
      images = galleryRes.map(row => row.image_url);
    } else {
      // Fallback if DB gallery is completely empty
      images = [
        ...CATEGORY_IMAGES.doors,
        ...CATEGORY_IMAGES.facades,
        ...CATEGORY_IMAGES.pergolas
      ];
    }
  } catch (error) {
    console.error("DB Error:", error);
    // Fallback if DB fails
    images = [
      ...CATEGORY_IMAGES.doors,
      ...CATEGORY_IMAGES.facades,
      ...CATEGORY_IMAGES.pergolas
    ];
  }

  // Deduplicate array if needed
  images = Array.from(new Set(images));

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', paddingTop: '100px' }}>
      <Gallery title={title} description={desc} images={images} />
    </main>
  );
}
