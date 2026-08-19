import HeroSection from '@/components/Home/HeroSection';
import AboutSection from '@/components/Home/AboutSection';
import ServicesSection from '@/components/Home/ServicesSection';
import { neon } from '@neondatabase/serverless';

export default async function HomePage() {
  let dbProjects: any[] = [];
  let dbAboutImages: any[] = [];
  let dbSettings: any = {};

  try {
    const sql = neon(process.env.DATABASE_URL!);
    dbProjects = await sql`SELECT * FROM projects ORDER BY order_index ASC, id DESC`;
    dbAboutImages = await sql`SELECT * FROM about_images ORDER BY order_index ASC, id DESC`;
    
    const settingsRows = await sql`SELECT * FROM settings`;
    dbSettings = settingsRows.reduce((acc: any, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
  } catch (error) {
    console.error("Failed to fetch from DB:", error);
  }

  return (
    <main className="main-container">
      <HeroSection dbSettings={dbSettings} />
      <ServicesSection dbProjects={dbProjects} />
      <AboutSection dbImages={dbAboutImages} dbSettings={dbSettings} />
    </main>
  );
}
