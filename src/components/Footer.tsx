import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-white text-2xl">
                <span>Aris</span>
                <span className="text-cyan-400">Tutor</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              ArisTutor connects students with peer tutors for personalized academic support, all built around a shared internal credit system.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Find Tutors</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Become a Tutor</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Group Sessions</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Study Resources</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Q&A Forum</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Safety Center</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © 2023 ArisTutor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}