import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('登录成功！');
      // 登录成功不需要手动跳转，App.tsx 中的监听器会处理
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || '登录失败');
      toast.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'student', // 默认为学生
          },
        },
      });

      if (error) throw error;
      
      toast.success('注册成功！正在登录...');
      // 注册成功后通常会自动登录，或者需要确认邮件
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || '注册失败');
      toast.error(error.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-400 to-cyan-400 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <button
          onClick={() => onNavigate('landing')}
          className="text-white hover:text-blue-100 mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="w-10 h-10 text-blue-500" />
            <span className="text-2xl">
              <span className="font-semibold text-gray-900">Aris</span>
              <span className="text-cyan-400">Tutor</span>
            </span>
          </div>

          <h1 className="text-3xl text-gray-900 text-center mb-2">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 text-center mb-8">
            {isSignIn
              ? 'Sign in to continue your learning journey'
              : 'Join thousands of students learning together'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={isSignIn ? handleSignIn : handleSignUp}>
            {!isSignIn && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError('');
              }}
              className="text-blue-500 hover:text-blue-600"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
