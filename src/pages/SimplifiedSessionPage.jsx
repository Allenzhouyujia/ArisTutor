// 简化版课程页面 - Agora 视频 + Excalidraw 白板 (响应式优化版)
import { useState, useEffect } from 'react';
import { SimpleWhiteboard } from '../components/simple/SimpleWhiteboard';
import { AgoraVideo } from '../components/agora/AgoraVideo';
import { GraduationCap, X, Copy, Check, Share2, Video, VideoOff } from 'lucide-react';

export function SimplifiedSessionPage({ user, onNavigate }) {
  const [showVideo, setShowVideo] = useState(true);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // 移动端优化：视频窗口状态 'minimized' | 'split' | 'fullscreen'
  const [videoLayout, setVideoLayout] = useState('split');

  // 从URL获取房间ID
  const getRoomId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId') || `room-${Date.now()}`;
    if (!urlParams.get('roomId')) {
      window.history.replaceState({}, '', `?roomId=${roomId}`);
    }
    return roomId;
  };

  const [roomId] = useState(getRoomId());

  // 模拟课程数据
  const session = {
    id: roomId,
    subject: '数学辅导',
    tutorName: '李老师',
  };

  const shareLink = window.location.href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* 顶部工具栏 - 响应式优化 */}
      <div className="bg-white border-b px-3 md:px-6 py-2 md:py-3 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-2 md:gap-3">
          <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          <div className="flex flex-col">
            <h1 className="font-semibold text-gray-900 text-sm md:text-base">{session.subject}</h1>
            <span className="text-xs text-gray-500 hidden md:inline">导师: {session.tutorName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-xs md:text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
            {Math.floor(sessionTimer / 60)}:{(sessionTimer % 60).toString().padStart(2, '0')}
          </div>
          
          <button
            onClick={() => {
              setShowShareModal(true);
              copyLink();
            }}
            className="p-2 md:px-4 md:py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-1 md:gap-2"
            title="分享房间"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">{linkCopied ? '已复制' : '邀请'}</span>
          </button>
          
          <button
            onClick={() => setShowVideo(!showVideo)}
            className={`p-2 md:px-4 md:py-2 text-sm rounded-lg transition-colors flex items-center gap-1 md:gap-2 ${
              showVideo ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {showVideo ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden md:inline">{showVideo ? '隐藏视频' : '显示视频'}</span>
          </button>
          
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 md:px-4 md:py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-1 md:gap-2"
          >
            <X className="w-4 h-4" />
            <span className="hidden md:inline">结束</span>
          </button>
        </div>
      </div>

      {/* 主要内容区域 - 响应式布局 */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* 白板区域 - 总是占据主要空间 */}
        <div className="flex-1 h-full relative z-0">
          <SimpleWhiteboard roomId={session.id} />
        </div>

        {/* 视频区域 - 桌面端右侧栏，移动端浮动或分屏 */}
        {showVideo && (
          <div 
            className={`
              transition-all duration-300 ease-in-out bg-gray-900 border-l border-gray-800
              ${/* 桌面端样式 */ ''}
              md:relative md:w-80 md:h-full md:border-l
              ${/* 移动端样式 - 底部固定高度 */ ''}
              absolute bottom-0 left-0 right-0 h-48 md:h-auto z-10 border-t md:border-t-0 shadow-xl
            `}
          >
            <div className="h-full w-full relative">
              {/* 移动端调整大小手柄（可选） */}
              <div className="md:hidden absolute -top-4 left-0 right-0 h-4 flex justify-center items-center cursor-ns-resize">
                 <div className="w-12 h-1 bg-gray-300 rounded-full opacity-50"></div>
              </div>
              
              <AgoraVideo 
                roomId={session.id} 
                userName={user?.name || '学生'}
                onLeave={() => onNavigate('dashboard')}
              />
            </div>
          </div>
        )}
      </div>

      {/* 分享模态框 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">邀请他人加入</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              发送此链接给学生或老师，对方打开即可直接加入房间。
            </p>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm truncate"
              />
              <button
                onClick={copyLink}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 text-sm font-medium"
              >
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {linkCopied ? '复制成功' : '复制'}
              </button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 space-y-1">
              <p>📱 <strong>手机测试提示：</strong></p>
              <p>请使用 Localtunnel 生成的链接 (https://....loca.lt) 以确保摄像头可用。</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
