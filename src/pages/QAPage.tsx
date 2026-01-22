import { useState, useEffect } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, Plus, MessageCircle, TrendingUp, CheckCircle } from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants/subjects';
import { toast } from 'sonner';

interface QAPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function QAPage({ user, onNavigate, onSignOut }: QAPageProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', subject: '', bounty: 0 });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      // 模拟问答数据
      const mockQuestions = [
        {
          id: '1',
          title: '如何理解微积分中的极限概念？',
          content: '我在学习微积分时，对极限的定义感到困惑，能否解释一下？',
          subject: 'Mathematics',
          bounty: 10,
          status: 'open',
          answers: [{ id: 1 }, { id: 2 }],
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Python中的装饰器是什么？',
          content: '我听说装饰器是Python的高级特性，但不太理解它的用途。',
          subject: 'Computer Science',
          bounty: 15,
          status: 'closed',
          answers: [{ id: 1 }],
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          title: '有机化学中的亲核取代反应',
          content: 'SN1和SN2反应的区别是什么？',
          subject: 'Chemistry',
          bounty: 5,
          status: 'open',
          answers: [],
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      setQuestions(mockQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    try {
      // 模拟发布问题
      const newQ = {
        id: `q-${Date.now()}`,
        ...newQuestion,
        status: 'open',
        answers: [],
        createdAt: new Date().toISOString(),
      };
      setQuestions([newQ, ...questions]);
      setShowAskModal(false);
      setNewQuestion({ title: '', content: '', subject: '', bounty: 0 });
      toast.success('问题发布成功！');
    } catch (error) {
      console.error('Error posting question:', error);
      toast.error('发布失败');
    }
  };

  const subjects = ['All', ...POPULAR_SUBJECTS.slice(0, 10)];
  const filteredQuestions = selectedSubject === 'All'
    ? questions
    : questions.filter(q => q.subject === selectedSubject);

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
              <button onClick={() => onNavigate('session')} className="text-gray-600 hover:text-blue-500">
                📅 Sessions
              </button>
              <button onClick={() => onNavigate('qa')} className="text-blue-500">
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Q&A Community</h1>
            <p className="text-gray-600">Ask questions and help others learn</p>
          </div>
          <button
            onClick={() => setShowAskModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ask Question
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
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

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div key={question.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {question.subject}
                      </span>
                      {question.bounty > 0 && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                          💰 {question.bounty} credits
                        </span>
                      )}
                      {question.status === 'closed' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Solved
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{question.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{question.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {question.answers?.length || 0} answers
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {Math.floor(Math.random() * 50)} views
                      </div>
                      <div>{new Date(question.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No questions found</p>
              <button
                onClick={() => setShowAskModal(true)}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Be the first to ask
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Ask a Question</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What's your question?"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <select
                  value={newQuestion.subject}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  {subjects.filter(s => s !== 'All').map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Question Details</label>
                <textarea
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Provide more details about your question..."
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Credit Bounty (Optional)</label>
                <input
                  type="number"
                  value={newQuestion.bounty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, bounty: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Offer credits for the best answer"
                  min="0"
                  max={user.credits}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your balance: {user.credits} credits
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowAskModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                disabled={!newQuestion.title || !newQuestion.content || !newQuestion.subject}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
