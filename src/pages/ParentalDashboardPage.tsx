import { User } from '../App';
import { GraduationCap, ArrowLeft, Shield, Clock, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ParentalDashboardPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function ParentalDashboardPage({ user, onNavigate, onSignOut }: ParentalDashboardPageProps) {
  const childActivity = {
    sessionsThisWeek: 3,
    totalHours: 4.5,
    creditsSpent: 45,
    creditsEarned: 20,
    subjects: ['Mathematics', 'Physics', 'Chemistry']
  };

  const recentSessions = [
    {
      id: 1,
      date: '2026-01-03',
      subject: 'Mathematics',
      tutor: 'Alex Johnson',
      duration: 60,
      credits: 15,
      rating: 5
    },
    {
      id: 2,
      date: '2026-01-02',
      subject: 'Physics',
      tutor: 'Emma Williams',
      duration: 45,
      credits: 12,
      rating: 5
    },
    {
      id: 3,
      date: '2026-01-01',
      subject: 'Chemistry',
      tutor: 'Michael Chen',
      duration: 90,
      credits: 18,
      rating: 4
    },
  ];

  const safetyAlerts = [
    {
      id: 1,
      type: 'info',
      message: 'All tutors are verified and background-checked',
      timestamp: '2026-01-01'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-8 h-8 text-blue-500" />
                <span className="text-xl">
                  <span className="font-semibold text-gray-900">Aris</span>
                  <span className="text-cyan-400">Tutor</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Parent Dashboard</div>
                <div className="text-gray-900">{user.name}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8" />
            <h1 className="text-3xl">Parental Dashboard</h1>
          </div>
          <p className="text-blue-50">Monitor your child's learning activity and ensure a safe experience</p>
        </div>

        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              Safety & Security
            </h2>
            <div className="space-y-3">
              {safetyAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-gray-900">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Sessions This Week</span>
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl text-gray-900">{childActivity.sessionsThisWeek}</div>
            <div className="text-sm text-gray-500">{childActivity.totalHours} hours total</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Credits Spent</span>
              <DollarSign className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl text-gray-900">{childActivity.creditsSpent}</div>
            <div className="text-sm text-gray-500">This month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Credits Earned</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl text-gray-900">{childActivity.creditsEarned}</div>
            <div className="text-sm text-gray-500">This month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Active Subjects</span>
              <GraduationCap className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl text-gray-900">{childActivity.subjects.length}</div>
            <div className="text-sm text-gray-500">Learning areas</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl text-gray-900">Recent Sessions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-gray-900">{session.subject}</h3>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        Completed
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Tutor: {session.tutor}</span>
                      <span>•</span>
                      <span>{new Date(session.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{session.duration} minutes</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg text-gray-900 mb-1">{session.credits} credits</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < session.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parental Controls */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Parental Controls</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900">Restrict Messaging</div>
                  <div className="text-sm text-gray-600">Limit direct messages with tutors</div>
                </div>
                <button className="w-12 h-7 bg-blue-500 rounded-full relative">
                  <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900">Session Approval</div>
                  <div className="text-sm text-gray-600">Require approval before booking</div>
                </div>
                <button className="w-12 h-7 bg-gray-300 rounded-full relative">
                  <div className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-900">Spending Limit</div>
                  <div className="text-sm text-gray-600">Set weekly credit limit</div>
                </div>
                <input
                  type="number"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-right"
                  placeholder="50"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl text-gray-900 mb-4">Learning Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Weekly Session Goal</span>
                  <span className="text-blue-600">3/4 sessions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Study Time Goal</span>
                  <span className="text-green-600">4.5/5 hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-700">
                  🎉 Great progress this week! Your child is on track to meet their learning goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
