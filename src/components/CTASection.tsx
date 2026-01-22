import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  onNavigate: (page: string) => void;
}

export function CTASection({ onNavigate }: CTASectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl mb-6">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-xl mb-8 text-blue-50">
          Join ArisTutor today and experience the power of peer-to-peer learning. 
          Get help when you need it, share your knowledge, and earn credits along the way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('auth')}
            className="bg-white text-blue-500 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('auth')}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
          >
            Become a Tutor
          </button>
        </div>
        <p className="mt-6 text-blue-100 text-sm">
          No credit card required • Free to join • Earn credits by tutoring
        </p>
      </div>
    </section>
  );
}