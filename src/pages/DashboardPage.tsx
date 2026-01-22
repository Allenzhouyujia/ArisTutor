import { useState, useEffect } from 'react';
import { User } from '../App';
import { supabase } from '../lib/supabase';
import { Header } from '../components/Header';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '../components/ui/dialog';
import { 
  GraduationCap, Bell, Calendar, DollarSign, Star, Video, Users, 
  HelpCircle, BookOpen, RefreshCw, Plus, X, Loader2, Clock 
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

interface Notification {
  id: string;
  type: 'session-reminder' | 'credit' | 'message' | 'general';
  title: string;
  message: string;
  timestamp: string;
  sessionId?: string;
  read: boolean;
}

interface SessionData {
  id: string;
  subject: string;
  tutorName: string;
  studentName: string;
  scheduledTime: string;
  duration: number;
  status: string;
  meetingLink?: string;
}

export function DashboardPage({ user, onNavigate, onSignOut }: DashboardPageProps) {
  const [tutors, setTutors] = useState<any[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<'student' | 'tutor'>(user.role === 'tutor' ? 'tutor' : 'student');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Create Session Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSession, setNewSession] = useState({
    subject: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    duration: '60'
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(checkUpcomingSessions, 60000);
    return () => clearInterval(interval);
  }, [user.id]);

  const loadData = async () => {
    try {
      // 1. Load Sessions from Supabase
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select(`
          *,
          student:student_id(name),
          tutor:tutor_id(name)
        `)
        .or(`student_id.eq.${user.id},tutor_id.eq.${user.id}`)
        .order('scheduled_time', { ascending: true });

      if (sessionsError) throw sessionsError;

      const formattedSessions: SessionData[] = sessionsData?.map(session => ({
        id: session.id,
        subject: session.subject,
        tutorName: session.tutor?.name || 'Unknown Tutor',
        studentName: session.student?.name || 'Unknown Student',
        scheduledTime: session.scheduled_time,
        duration: session.duration,
        status: session.status,
        meetingLink: session.meeting_link
      })) || [];

      setSessions(formattedSessions);

      // 2. Load Tutors
      const { data: tutorsData, error: tutorsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'tutor')
        .limit(3);
        
      if (!tutorsError && tutorsData) {
        setTutors(tutorsData.map(t => ({
          id: t.id,
          name: t.name,
          subjects: ['Math', 'Physics'],
          rating: 5.0,
          hourlyRate: 50
        })));
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Find a partner user
      const { data: partners } = await supabase
        .from('profiles')
        .select('id, name, role')
        .neq('id', user.id)
        .limit(1);

      const partner = partners?.[0];
      
      let studentId = user.id;
      let tutorId = user.id;

      if (partner) {
        if (user.role === 'tutor') {
          studentId = partner.id;
        } else {
          tutorId = partner.id;
        }
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${newSession.date}T${newSession.time}`);

      const { error } = await supabase
        .from('sessions')
        .insert({
          student_id: studentId,
          tutor_id: tutorId,
          subject: newSession.subject,
          scheduled_time: scheduledDateTime.toISOString(),
          duration: parseInt(newSession.duration),
          cost: 10,
          status: 'confirmed'
        });

      if (error) throw error;

      toast.success('Session created successfully!');
      setIsCreateOpen(false);
      setNewSession({
        subject: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        duration: '60'
      });
      loadData();
    } catch (error: any) {
      console.error('Error creating session:', error);
      toast.error(error.message || 'Failed to create session');
    } finally {
      setIsCreating(false);
    }
  };

  const checkUpcomingSessions = () => {
    const now = new Date();
    sessions.forEach(session => {
      const sessionTime = new Date(session.scheduledTime);
      const minutesUntil = (sessionTime.getTime() - now.getTime()) / (1000 * 60);
      
      if (minutesUntil > 0 && minutesUntil <= 5) {
        const existingNotification = notifications.find(n => n.sessionId === session.id);
        if (!existingNotification) {
          const newNotification: Notification = {
            id: `session-${session.id}`,
            type: 'session-reminder',
            title: 'Session Starting Soon!',
            message: `Your ${session.subject} session starts in ${Math.round(minutesUntil)} minutes`,
            timestamp: new Date().toISOString(),
            sessionId: session.id,
            read: false
          };
          setNotifications(prev => [newNotification, ...prev]);
          toast.info(`Session starts in ${Math.round(minutesUntil)} minutes!`);
        }
      }
    });
  };

  const canEnterMeeting = (sessionTime: string) => {
    const now = new Date();
    const session = new Date(sessionTime);
    const minutesUntil = (session.getTime() - now.getTime()) / (1000 * 60);
    return minutesUntil <= 5 && minutesUntil >= -60;
  };

  const getTimeUntilSession = (sessionTime: string) => {
    const now = new Date();
    const session = new Date(sessionTime);
    const minutesUntil = Math.round((session.getTime() - now.getTime()) / (1000 * 60));
    
    if (minutesUntil < 0) return 'In Progress';
    if (minutesUntil === 0) return 'Starting Now';
    if (minutesUntil < 60) return `in ${minutesUntil} min`;
    const hours = Math.floor(minutesUntil / 60);
    return `in ${hours}h ${minutesUntil % 60}m`;
  };

  const handleEnterMeeting = (sessionId: string) => {
    const newUrl = `/?roomId=${sessionId}`;
    window.history.pushState({}, '', newUrl);
    toast.success('Entering meeting room...');
    onNavigate('session');
  };

  const toggleMode = async () => {
    const newMode = activeMode === 'student' ? 'tutor' : 'student';
    
    try {
      // Update role in database
      const { error } = await supabase
        .from('profiles')
        .update({ role: newMode })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setActiveMode(newMode);
      user.role = newMode; // Update user object
      toast.success(`Switched to ${newMode} mode`);
    } catch (error: any) {
      console.error('Error switching mode:', error);
      toast.error('Failed to switch mode');
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onNavigate={onNavigate} 
        onSignOut={onSignOut} 
        unreadCount={unreadCount}
        onToggleNotifications={() => setShowNotifications(!showNotifications)}
        currentMode={activeMode}
        onModeChange={setActiveMode}
      />

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {notifications.length > 0 ? (
            <div>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notif.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${!notif.read ? 'bg-blue-500' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{notif.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      {notif.sessionId && (
                        <button
                          onClick={() => handleEnterMeeting(notif.sessionId!)}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Enter Meeting Room
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Welcome back, {user.name}! 👋</h1>
              <p className="text-blue-50">
                {activeMode === 'student' ? 'Ready to continue your learning journey?' : 'Ready to help students succeed?'}
              </p>
            </div>
            <button
              onClick={toggleMode}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center gap-2 text-sm md:text-base"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
              <span>Switch to {activeMode === 'student' ? 'Tutor' : 'Student'}</span>
            </button>
          </div>
        </div>

        {/* Mode Indicator */}
        <div className={`rounded-2xl p-4 shadow-sm mb-6 ${
          activeMode === 'tutor' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
            : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeMode === 'tutor' ? (
                <Users className="w-5 h-5 text-green-600" />
              ) : (
                <BookOpen className="w-5 h-5 text-purple-600" />
              )}
              <div>
                <div className="text-sm text-gray-600">Current Mode</div>
                <div className={`font-semibold ${activeMode === 'tutor' ? 'text-green-700' : 'text-purple-700'}`}>
                  {activeMode === 'tutor' ? '🎓 Tutor Mode' : '📚 Student Mode'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 ${
                activeMode === 'tutor'
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Switch to {activeMode === 'student' ? 'Tutor' : 'Student'}</span>
              <span className="sm:hidden">Switch</span>
            </button>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-900">Upcoming Sessions</h2>
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Session
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-gray-500 mt-2">Loading sessions...</p>
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 mb-2">{session.subject}</h3>
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduledTime).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className={`${canEnterMeeting(session.scheduledTime) ? 'text-green-600 font-semibold' : 'text-gray-600'}`}>
                          {getTimeUntilSession(session.scheduledTime)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {activeMode === 'student' ? `Tutor: ${session.tutorName}` : `Student: ${session.studentName}`}
                      </p>
                    </div>
                    {canEnterMeeting(session.scheduledTime) ? (
                      <button
                        onClick={() => handleEnterMeeting(session.id)}
                        className="w-full md:w-auto bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Video className="w-5 h-5" />
                        Enter Meeting
                      </button>
                    ) : (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Opens 5 min before</div>
                        <div className="text-sm text-gray-600">{session.duration} minutes</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No upcoming sessions</p>
              <button 
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Create your first session
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
              </div>
              <div className="text-2xl md:text-3xl text-gray-900 mb-1">{sessions.length}</div>
              <div className="text-xs md:text-sm text-gray-500">Sessions</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
              </div>
              <div className="text-2xl md:text-3xl text-gray-900 mb-1">{user.credits}</div>
              <div className="text-xs md:text-sm text-gray-500">Credits</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-yellow-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <Star className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
              </div>
              <div className="text-2xl md:text-3xl text-gray-900 mb-1">4.8</div>
              <div className="text-xs md:text-sm text-gray-500">Rating</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
              </div>
              <div className="text-2xl md:text-3xl text-gray-900 mb-1">{user.subjects?.length || 0}</div>
              <div className="text-xs md:text-sm text-gray-500">Subjects</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Get Academic Help */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl text-gray-900 mb-6">Get Academic Help</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onNavigate('tutor-profile')}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="bg-blue-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                  </div>
                  <h3 className="text-base md:text-lg text-gray-900 mb-1 md:mb-2">1:1 Tutoring</h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Get personalized help from verified peer tutors</p>
                </button>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-green-300 hover:bg-green-50 transition-colors text-left"
                >
                  <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                  </div>
                  <h3 className="text-base md:text-lg text-gray-900 mb-1 md:mb-2">Group Sessions</h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Join affordable group sessions</p>
                </button>

                <button
                  onClick={() => onNavigate('qa')}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-yellow-300 hover:bg-yellow-50 transition-colors text-left"
                >
                  <div className="bg-yellow-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-base md:text-lg text-gray-900 mb-1 md:mb-2">Ask a Question</h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Post questions and get answers</p>
                </button>

                <button
                  onClick={() => onNavigate('notes')}
                  className="border border-gray-200 rounded-xl p-4 md:p-6 hover:border-red-300 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="bg-red-100 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                  </div>
                  <h3 className="text-base md:text-lg text-gray-900 mb-1 md:mb-2">Study Resources</h3>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Access notes and study materials</p>
                </button>
              </div>
            </div>

            {/* Recommended Tutors */}
            {!loading && tutors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900">Recommended Tutors</h2>
                  <button onClick={() => onNavigate('tutor-profile')} className="text-blue-500 hover:text-blue-600 text-sm">
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tutors.map((tutor) => (
                    <div key={tutor.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors text-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-lg md:text-xl mx-auto mb-2 md:mb-3">
                        {tutor.name[0]}
                      </div>
                      <h3 className="text-gray-900 text-sm md:text-base mb-1">{tutor.name}</h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{tutor.subjects[0]}</p>
                      <div className="flex items-center justify-center gap-1 text-xs md:text-sm text-yellow-500">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-current" />
                        <span>{tutor.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg text-gray-900 mb-4">Learning Streak</h2>
              <div className="text-center mb-4">
                <div className="text-4xl md:text-5xl text-blue-500 mb-2">7</div>
                <div className="text-sm text-gray-600">days in a row</div>
              </div>
              <div className="flex justify-center gap-1 md:gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      {day}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors flex items-center gap-3"
                >
                  <Plus className="w-5 h-5" />
                  Create New Session
                </button>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="w-full text-left px-4 py-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-colors flex items-center gap-3"
                >
                  <DollarSign className="w-5 h-5" />
                  Add Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Session Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Create New Session</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateSession} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                required
                value={newSession.subject}
                onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Mathematics, Physics"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  required
                  value={newSession.time}
                  onChange={(e) => setNewSession({ ...newSession, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={newSession.duration}
                onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>

            <DialogFooter className="mt-6">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Session'
                )}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
