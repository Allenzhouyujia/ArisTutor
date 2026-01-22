import { useState, useEffect } from 'react';
import { User } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { GraduationCap, Bell, Video, Mic, MicOff, VideoOff, Calendar, Clock, Users } from 'lucide-react';

interface SessionPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function SessionPage({ user, onNavigate, onSignOut }: SessionPageProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inSession, setInSession] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);

  useEffect(() => {
    loadSessions();
  }, [user.id]);

  useEffect(() => {
    if (inSession) {
      const interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [inSession]);

  const loadSessions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-19aec8df/sessions/${user.id}`,
        {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (inSession) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Session Header */}
        <div className="bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white">Calculus II Session</div>
                <div className="text-gray-400 text-sm">with Alex Johnson</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white text-xl">{formatTime(sessionTimer)}</div>
              <button
                onClick={() => setInSession(false)}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                End Session
              </button>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="max-w-7xl mx-auto grid grid-cols-2 gap-4 h-full">
            {/* Main video */}
            <div className="bg-gray-800 rounded-lg relative aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p>Tutor Camera</p>
                </div>
              </div>
            </div>

            {/* Your video */}
            <div className="bg-gray-800 rounded-lg relative aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p>Your Camera</p>
                </div>
              </div>
            </div>

            {/* Whiteboard */}
            <div className="col-span-2 bg-white rounded-lg p-8 h-96">
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Interactive Whiteboard</p>
                  <p className="text-sm">Draw, type, and collaborate in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
            <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white">
              <Mic className="w-6 h-6" />
            </button>
            <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-white">
              <Video className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <button onClick={() => onNavigate('tutor-profile')} className="text-gray-600 hover:text-blue-500">
                🔍 Find Tutors
              </button>
              <button onClick={() => onNavigate('session')} className="text-blue-500">
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white">
                {user.name[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl text-gray-900 mb-6">My Sessions</h1>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-4 ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600'
                }`}
              >
                History
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : sessions.length > 0 ? (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-900 mb-2">{session.subject}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.scheduledTime).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration} minutes
                          </div>
                          <div className="flex items-center gap-1">
                            <span>💰</span>
                            {session.credits} credits
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setInSession(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Join Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No {activeTab} sessions</p>
                <button
                  onClick={() => onNavigate('tutor-profile')}
                  className="mt-4 text-blue-500 hover:text-blue-600"
                >
                  Book a session
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
