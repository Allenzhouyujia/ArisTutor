import { useState, useEffect } from 'react';
import { User } from '../App';
import { WhiteboardCanvas } from '../components/whiteboard/WhiteboardCanvas';
import { JitsiVideo } from '../components/video/JitsiVideo';
import { GraduationCap, Bell, Calendar, Clock, Users, Maximize2, Minimize2 } from 'lucide-react';

interface SessionPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function EnhancedSessionPage({ user, onNavigate, onSignOut }: SessionPageProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inSession, setInSession] = useState(false);
  const [currentSession, setCurrentSession] = useState<any>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [showVideo, setShowVideo] = useState(true);
  const [videoExpanded, setVideoExpanded] = useState(false);

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
    // Mock data for demo
    setSessions([
      {
        id: '1',
        subject: '微积分 II',
        tutorName: 'Alex Johnson',
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
        duration: 60,
        credits: 50,
      },
      {
        id: '2',
        subject: '线性代数',
        tutorName: 'Sarah Chen',
        scheduledTime: new Date(Date.now() + 7200000).toISOString(),
        duration: 90,
        credits: 75,
      },
    ]);
    setLoading(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinSession = (session: any) => {
    setCurrentSession(session);
    setInSession(true);
    setSessionTimer(0);
  };

  const handleEndSession = () => {
    setInSession(false);
    setCurrentSession(null);
    setSessionTimer(0);
  };

  // Session interface with real whiteboard and video
  if (inSession && currentSession) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Session Header */}
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-white font-semibold">{currentSession.subject}</div>
                <div className="text-gray-400 text-sm">与 {currentSession.tutorName} 辅导</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-white text-xl font-mono">{formatTime(sessionTimer)}</div>
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                {showVideo ? '隐藏' : '显示'}视频
              </button>
              <button
                onClick={handleEndSession}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                结束课程
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Whiteboard */}
          <div className={`${showVideo ? (videoExpanded ? 'w-1/3' : 'w-2/3') : 'w-full'} transition-all`}>
            <WhiteboardCanvas roomId={currentSession.id} userId={user.id} />
          </div>

          {/* Video Call */}
          {showVideo && (
            <div className={`${videoExpanded ? 'w-2/3' : 'w-1/3'} border-l border-gray-700 bg-gray-800 flex flex-col transition-all`}>
              <div className="p-2 bg-gray-900 flex items-center justify-between border-b border-gray-700">
                <span className="text-white text-sm font-semibold">视频通话</span>
                <button
                  onClick={() => setVideoExpanded(!videoExpanded)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  {videoExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex-1">
                <JitsiVideo roomId={currentSession.id} userName={user.name} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Session list view
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
                🏠 仪表板
              </button>
              <button onClick={() => onNavigate('tutor-profile')} className="text-gray-600 hover:text-blue-500">
                🔍 找导师
              </button>
              <button onClick={() => onNavigate('session')} className="text-blue-500 font-semibold">
                📅 我的课程
              </button>
              <button onClick={() => onNavigate('qa')} className="text-gray-600 hover:text-blue-500">
                ❓ 问答
              </button>
              <button onClick={() => onNavigate('notes')} className="text-gray-600 hover:text-blue-500">
                📝 笔记
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('wallet')}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-600"
              >
                💰 {user.credits}
              </button>
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold cursor-pointer">
                {user.name[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">我的课程</h1>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'upcoming'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                即将开始
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-4 font-semibold ${
                  activeTab === 'history'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                历史记录
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
                  <div key={session.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.subject}</h3>
                        <div className="text-sm text-gray-600 mb-1">导师: {session.tutorName}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(session.scheduledTime).toLocaleDateString('zh-CN')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.duration} 分钟
                          </div>
                          <div className="flex items-center gap-1">
                            <span>💰</span>
                            {session.credits} 学分
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinSession(session)}
                        className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                      >
                        加入课程
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">暂无{activeTab === 'upcoming' ? '即将开始的' : '历史'}课程</p>
                <button
                  onClick={() => onNavigate('tutor-profile')}
                  className="mt-4 text-blue-500 hover:text-blue-600 font-semibold"
                >
                  预约课程
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}



