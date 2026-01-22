import { Search, Users, GraduationCap } from 'lucide-react';
import heroImage from 'figma:asset/1c99d7d9db29153987c72cdf3b7cca4734c6394e.png';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-5xl md:text-6xl">
                Learn & Earn with Peer-to-Peer Support
              </h1>
              <div className="flex-shrink-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <GraduationCap className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <p className="text-xl mb-8 text-blue-50">
              Connect with verified tutors, exchange knowledge, and build your academic
              skills - all while earning credits.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('auth')}
                className="bg-white text-blue-500 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Get Help Now
              </button>
              <button
                onClick={() => onNavigate('auth')}
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Help Others
              </button>
            </div>
          </div>

          {/* Right illustration */}
          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Peer-to-peer learning illustration"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}