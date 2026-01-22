import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorks } from '../components/HowItWorks';
import { SessionInterfacePreview } from '../components/SessionInterfacePreview';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} isLoggedIn={false} />
      <main>
        <HeroSection onNavigate={onNavigate} />
        <FeaturesSection />
        <HowItWorks />
        <SessionInterfacePreview />
        <TestimonialsSection />
        <CTASection onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
}
