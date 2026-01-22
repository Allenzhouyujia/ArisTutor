import { useState, useEffect } from 'react';
import { User } from '../App';
import { mockTutors } from '../lib/mockData';
import { GraduationCap, Bell, Star, CheckCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants/subjects';
import { toast } from 'sonner';

interface TutorProfilePageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function TutorProfilePage({ user, onNavigate, onSignOut }: TutorProfilePageProps) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    scheduledTime: '',
    duration: 60,
    subject: '',
  });

  useEffect(() => {
    loadTutors();
  }, []);

  const loadTutors = async () => {
    try {
      // 使用模拟数据
      setTutors(mockTutors.map(t => ({ ...t, verified: true, available: Math.random() > 0.3 })));
    } catch (error) {
      console.error('Error loading tutors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = (tutor: any) => {
    setSelectedTutor(tutor);
    setShowBookingModal(true);
  };

  const subjects = ['All', ...POPULAR_SUBJECTS.slice(0, 10)];

  const filteredTutors = selectedSubject === 'All'
    ? tutors
    : tutors.filter(t => t.subjects.includes(selectedSubject));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-xl">
                <span className="font-semibold text-gray-900">Aris</span>
                <span className="text-cyan-400">Tutor</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-blue-500">
                🏠 Dashboard
              </button>
              <button onClick={() => onNavigate('tutor-profile')} className="text-blue-500">
                🔍 Find Tutors
              </button>
              <button onClick={() => onNavigate('session')} className="text-gray-600 hover:text-blue-500">
                📅 Sessions
              </button>
              <button onClick={() => onNavigate('qa')} className="text-gray-600 hover:text-blue-500">
                ❓ Q&A
              </button>
              <button onClick={() => onNavigate('notes')} className="text-gray-600 hover:text-blue-500">
                📝 Notes
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('wallet')}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
                💰 {user.credits}
              </button>
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white cursor-pointer">
                {user.name[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-2">Find Your Perfect Tutor</h1>
        <p className="text-gray-600 mb-6">Connect with verified peer tutors ready to help you succeed</p>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 mb-4">Filter by Subject</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Tutors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl flex-shrink-0">
                    {tutor.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{tutor.name}</h3>
                      {tutor.verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(tutor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="text-gray-600 ml-1">({tutor.rating})</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Subjects:</div>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.slice(0, 3).map((subject: string) => (
                      <span key={subject} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className={tutor.available ? 'text-green-600' : 'text-gray-600'}>
                      {tutor.available ? 'Available Now' : 'Busy'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">{tutor.hourlyRate}</span>
                    <span className="text-sm text-gray-600">/hr</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookSession(tutor)}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredTutors.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <p>No tutors found for this subject.</p>
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl text-gray-900 mb-4">Book a Session</h2>
            <p className="text-gray-600 mb-6">with {selectedTutor.name}</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Select Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingData.scheduledTime}
                  onChange={(e) => setBookingData({ ...bookingData, scheduledTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Duration</label>
                <select 
                  value={bookingData.duration}
                  onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <select 
                  value={bookingData.subject}
                  onChange={(e) => setBookingData({ ...bookingData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedTutor.subjects.map((subject: string) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Cost:</span>
                  <span className="text-blue-600 font-semibold">
                    {Math.ceil((bookingData.duration / 60) * selectedTutor.hourlyRate)} credits
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Your Balance:</span>
                  <span className={user.credits >= selectedTutor.hourlyRate ? 'text-green-600' : 'text-red-600'}>
                    {user.credits} credits
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!bookingData.scheduledTime) {
                    toast.error('Please select a date and time');
                    return;
                  }

                  const sessionCost = Math.ceil((bookingData.duration / 60) * selectedTutor.hourlyRate);
                  
                  if (user.credits < sessionCost) {
                    toast.error('Insufficient credits');
                    return;
                  }

                  // 模拟预订成功
                  toast.success('Session booked successfully!');
                  setShowBookingModal(false);
                  setTimeout(() => {
                    onNavigate('session');
                  }, 1000);
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                disabled={user.credits < Math.ceil((bookingData.duration / 60) * selectedTutor.hourlyRate)}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}