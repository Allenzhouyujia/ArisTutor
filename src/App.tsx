import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';
import { SimplifiedSessionPage } from './pages/SimplifiedSessionPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TutorProfilePage } from './pages/TutorProfilePage';
import { WalletPage } from './pages/WalletPage';
import { QAPage } from './pages/QAPage';
import { NotesMarketplacePage } from './pages/NotesMarketplacePage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';

export type UserRole = 'student' | 'tutor' | 'parent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  credits: number;
  subjects?: string[];
  onboarding_completed?: boolean;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查 URL 是否有 roomId（用于直接进入会议室）
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    if (roomId) {
      // 如果 URL 有 roomId，设置为 session 页面
      setCurrentPage('session');
    }

    // 检查当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setLoading(false);
        // 如果有 roomId 但未登录，跳转到登录页
        if (roomId) {
          setCurrentPage('auth');
        }
      }
    });

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
      } else {
        setUser(null);
        // 如果 URL 有 roomId，保持在 auth 页面
        const currentRoomId = new URLSearchParams(window.location.search).get('roomId');
        setCurrentPage(currentRoomId ? 'auth' : 'landing');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        // Check localStorage for onboarding completion (fallback if DB field doesn't exist)
        const localOnboardingComplete = localStorage.getItem(`onboarding_completed_${data.id}`) === 'true';
        const onboardingComplete = data.onboarding_completed || localOnboardingComplete;
        
        setUser({
          id: data.id,
          email: data.email || email,
          role: data.role as UserRole,
          name: data.name || email.split('@')[0],
          credits: data.credits || 0,
          onboarding_completed: onboardingComplete,
        });
        
        // Check onboarding status first
        if (!onboardingComplete) {
          setCurrentPage('onboarding');
        } else {
          // 登录后检查是否有 roomId，有则进入会议室
          const urlParams = new URLSearchParams(window.location.search);
          const roomId = urlParams.get('roomId');
          if (roomId) {
            setCurrentPage('session');
          } else if (currentPage === 'landing' || currentPage === 'auth') {
            setCurrentPage('dashboard');
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleOnboardingComplete = async () => {
    // Refresh user profile
    if (user) {
      await fetchProfile(user.id, user.email);
    }
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    // 未登录时显示登录页或首页
    if (!user) {
      if (currentPage === 'auth') {
        return <AuthPage onNavigate={setCurrentPage} />;
      }
      return <LandingPage onNavigate={setCurrentPage} />;
    }

    // Check if user needs onboarding
    if (!user.onboarding_completed && currentPage !== 'onboarding') {
      return <OnboardingPage user={user} onComplete={handleOnboardingComplete} />;
    }

    // 已登录用户的路由
    switch (currentPage) {
      case 'onboarding':
        return <OnboardingPage user={user} onComplete={handleOnboardingComplete} />;
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      case 'tutor-profile':
        return <TutorProfilePage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      case 'session':
        return <SimplifiedSessionPage user={user} onNavigate={setCurrentPage} />;
      case 'wallet':
        return <WalletPage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      case 'qa':
        return <QAPage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      case 'notes':
        return <NotesMarketplacePage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
      default:
        return <DashboardPage user={user} onNavigate={setCurrentPage} onSignOut={handleSignOut} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-50">{renderPage()}</div>
    </>
  );
}