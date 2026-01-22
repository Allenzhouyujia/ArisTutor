// 快速 Demo 应用 - 最简单的完整示例
// 无需任何配置即可运行！

import { useState } from 'react';
import { SimplifiedSessionPage } from './pages/SimplifiedSessionPage';
import { mockStorage, mockLogin } from './lib/mockData';
import { GraduationCap } from 'lucide-react';

export default function QuickDemoApp() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(mockStorage.getUser());

  // 简单登录
  const handleQuickLogin = async () => {
    const result = await mockLogin('demo@example.com', 'password');
    if (result.success) {
      setUser(result.user);
      setCurrentPage('session');
    }
  };

  // 登出
  const handleLogout = () => {
    mockStorage.clearUser();
    setUser(null);
    setCurrentPage('landing');
  };

  // 着陆页
  if (currentPage === 'landing' && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <GraduationCap className="w-16 h-16 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              ArisTutor
            </h1>
          </div>
          
          <p className="text-xl text-gray-700 mb-12">
            实时协作白板 + 高清视频通话
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">✨ 核心功能</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">🎨</div>
                <h3 className="font-semibold mb-1">专业白板</h3>
                <p className="text-sm text-gray-600">Excalidraw 手绘风格</p>
              </div>
              <div>
                <div className="text-3xl mb-2">📹</div>
                <h3 className="font-semibold mb-1">视频通话</h3>
                <p className="text-sm text-gray-600">Jitsi 高清视频</p>
              </div>
              <div>
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">即时可用</h3>
                <p className="text-sm text-gray-600">无需任何配置</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleQuickLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-12 py-4 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all"
          >
            🚀 立即体验 Demo
          </button>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 这是演示模式，使用模拟数据，无需登录即可体验所有功能
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 课程页面
  if (currentPage === 'session' && user) {
    return (
      <SimplifiedSessionPage 
        user={user} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  // 默认：返回着陆页
  return null;
}



