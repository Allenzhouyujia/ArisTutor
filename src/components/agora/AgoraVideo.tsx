// Agora 视频通话组件 - 修复版
import { useEffect, useRef, useState, useCallback } from 'react';
import AgoraRTC, { 
  IAgoraRTCClient, 
  ICameraVideoTrack, 
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser 
} from 'agora-rtc-sdk-ng';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, RefreshCw } from 'lucide-react';

// Agora App ID from environment variables
const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID || "6d789757c5bb42bab9dbb833fc4f895c";

// 设置日志级别
AgoraRTC.setLogLevel(1); // 0: DEBUG, 1: INFO, 2: WARNING, 3: ERROR, 4: NONE

interface AgoraVideoProps {
  roomId: string;
  userName?: string;
  onLeave?: () => void;
}

export function AgoraVideo({ roomId, userName = "用户", onLeave }: AgoraVideoProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>('DISCONNECTED');

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const isLeavingRef = useRef(false); // 防止重复清理
  const hasJoinedRef = useRef(false); // 防止重复加入

  // 清理房间名
  const channelName = `aristutor${roomId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20)}`;

  // 初始化并加入频道
  useEffect(() => {
    // 防止重复初始化
    if (hasJoinedRef.current) return;
    hasJoinedRef.current = true;

    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    // 监听连接状态
    client.on('connection-state-change', (curState, prevState) => {
      console.log('Connection state:', prevState, '->', curState);
      setConnectionState(curState);
      
      // 只有在非主动离开时才处理断开
      if (curState === 'DISCONNECTED' && !isLeavingRef.current) {
        console.log('Unexpected disconnection, will try to reconnect...');
      }
    });

    // 监听远程用户发布
    client.on('user-published', async (user, mediaType) => {
      console.log('User published:', user.uid, mediaType);
      try {
        await client.subscribe(user, mediaType);
        
        if (mediaType === 'video') {
          setRemoteUsers(prev => {
            if (prev.find(u => u.uid === user.uid)) return prev;
            return [...prev, user];
          });
          // 延迟播放视频，确保 DOM 已更新
          setTimeout(() => {
            const container = document.getElementById(`remote-${user.uid}`);
            if (container && user.videoTrack) {
              user.videoTrack.play(container);
            }
          }, 100);
        }
        
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      } catch (err) {
        console.error('Subscribe error:', err);
      }
    });

    client.on('user-unpublished', (user, mediaType) => {
      console.log('User unpublished:', user.uid, mediaType);
      if (mediaType === 'video') {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      }
    });

    client.on('user-left', (user) => {
      console.log('User left:', user.uid);
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    // 加入频道
    async function joinChannel() {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Joining channel:', channelName);

        // 加入频道（测试模式不需要 token）
        await client.join(AGORA_APP_ID, channelName, null, null);
        console.log('Joined channel successfully');

        // 创建本地音视频轨道（分开创建，更好的错误处理）
        let audioTrack: IMicrophoneAudioTrack | null = null;
        let videoTrack: ICameraVideoTrack | null = null;

        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          console.log('Audio track created');
        } catch (audioErr) {
          console.warn('Failed to create audio track:', audioErr);
        }

        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: '720p_2',
          });
          console.log('Video track created');
        } catch (videoErr) {
          console.warn('Failed to create video track:', videoErr);
        }

        localAudioTrackRef.current = audioTrack;
        localVideoTrackRef.current = videoTrack;

        // 播放本地视频
        if (videoTrack && localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
          console.log('Local video playing');
        }

        // 发布本地轨道
        const tracksToPublish = [audioTrack, videoTrack].filter(Boolean) as (IMicrophoneAudioTrack | ICameraVideoTrack)[];
        if (tracksToPublish.length > 0) {
          await client.publish(tracksToPublish);
          console.log('Tracks published:', tracksToPublish.length);
        }

        setIsJoined(true);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Join channel error:', err);
        setError(err.message || '连接失败，请检查网络或刷新页面');
        setIsLoading(false);
      }
    }

    joinChannel();

    // 清理函数 - 只在组件真正卸载时执行
    return () => {
      if (isLeavingRef.current) return; // 已经在离开中
      isLeavingRef.current = true;
      
      console.log('Cleaning up...');
      localAudioTrackRef.current?.close();
      localVideoTrackRef.current?.close();
      client.leave().catch(console.error);
    };
  }, []); // 空依赖数组，只运行一次

  // 播放本地视频（确保 ref 准备好后）
  useEffect(() => {
    if (localVideoTrackRef.current && localVideoRef.current && isJoined && !isVideoOff) {
      localVideoTrackRef.current.play(localVideoRef.current);
    }
  }, [isJoined, isVideoOff]);

  // 切换麦克风
  const toggleMute = useCallback(async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // 切换摄像头
  const toggleVideo = useCallback(async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  }, [isVideoOff]);

  // 离开（只有用户主动点击才调用）
  const handleLeave = useCallback(async () => {
    isLeavingRef.current = true;
    localAudioTrackRef.current?.close();
    localVideoTrackRef.current?.close();
    await clientRef.current?.leave();
    if (onLeave) onLeave();
  }, [onLeave]);

  // 重新连接
  const handleReconnect = useCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">正在连接 Agora 视频...</p>
          <p className="text-gray-400 text-sm mt-2">房间: {channelName}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">连接失败</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={handleReconnect}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            重新连接
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-900 flex flex-col relative">
      {/* 连接状态 */}
      <div className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1 ${
        connectionState === 'CONNECTED' ? 'bg-green-500' : 'bg-yellow-500'
      }`}>
        <Users className="w-3 h-3" />
        {remoteUsers.length + 1} 人在线
      </div>

      {/* 视频网格 */}
      <div className="flex-1 p-2 grid gap-2" style={{
        gridTemplateColumns: remoteUsers.length === 0 ? '1fr' : 'repeat(2, 1fr)',
      }}>
        {/* 本地视频 */}
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div 
            ref={localVideoRef} 
            className="w-full h-full"
            style={{ minHeight: '200px' }}
          />
          {isVideoOff && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {userName?.charAt(0) || '我'}
              </div>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
            {userName} (你)
          </div>
        </div>

        {/* 远程用户 */}
        {remoteUsers.map(user => (
          <div key={user.uid} className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div 
              id={`remote-${user.uid}`}
              className="w-full h-full"
              style={{ minHeight: '200px' }}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
              用户 {user.uid}
            </div>
          </div>
        ))}

        {/* 等待提示 */}
        {remoteUsers.length === 0 && (
          <div className="bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>等待其他人加入...</p>
              <p className="text-xs mt-1">分享房间链接给对方</p>
            </div>
          </div>
        )}
      </div>

      {/* 控制栏 */}
      <div className="p-4 flex justify-center gap-4">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80 transition-opacity`}
          title={isMuted ? '取消静音' : '静音'}
        >
          {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} hover:opacity-80 transition-opacity`}
          title={isVideoOff ? '开启摄像头' : '关闭摄像头'}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
        </button>
        
        <button
          onClick={handleLeave}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          title="离开会议"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
