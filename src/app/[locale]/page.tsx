import {useTranslations} from 'next-intl';
import HeroSection from '@/components/Home/HeroSection';
import AboutSection from '@/components/Home/AboutSection';
import ServicesSection from '@/components/Home/ServicesSection';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <main className="main-container">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
    </main>
  );
}
