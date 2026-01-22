import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, CreditCard, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, tokenPackages } from '../lib/stripe';

interface WalletPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

function CheckoutForm({ selectedPackage, onSuccess }: { selectedPackage: any; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // In production, you would call your backend API to create payment intent
      // For demo purposes, we'll simulate success
      setTimeout(() => {
        alert(`成功购买 ${selectedPackage.tokens} 学分！`);
        onSuccess();
        setLoading(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || '支付失败');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">购买套餐</div>
        <div className="text-2xl font-bold text-gray-900">{selectedPackage.name}</div>
        <div className="text-lg text-blue-600 mt-2">¥{selectedPackage.price}</div>
      </div>

      {/* In production, uncomment this for real Stripe payment */}
      {/* <PaymentElement /> */}
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          💡 演示模式：点击支付按钮将模拟成功购买
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '处理中...' : `支付 ¥${selectedPackage.price}`}
      </button>
    </form>
  );
}

export function EnhancedWalletPage({ user, onNavigate, onSignOut }: WalletPageProps) {
  const [selectedPackage, setSelectedPackage] = useState(tokenPackages[0]);
  const [showPurchase, setShowPurchase] = useState(false);
  const [transactions] = useState([
    { id: 1, type: 'purchase', amount: 100, date: '2024-01-15', description: '购买学分' },
    { id: 2, type: 'spend', amount: -50, date: '2024-01-14', description: '微积分辅导课程' },
    { id: 3, type: 'spend', amount: -30, date: '2024-01-13', description: '物理辅导课程' },
  ]);

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
              <button onClick={() => onNavigate('session')} className="text-gray-600 hover:text-blue-500">
                📅 我的课程
              </button>
              <button onClick={() => onNavigate('wallet')} className="text-blue-500 font-semibold">
                💰 钱包
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
                💰 {user.credits}
              </div>
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold">
                {user.name[0]}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">我的钱包</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="text-white/80">当前余额</div>
              <CreditCard className="w-8 h-8" />
            </div>
            <div className="text-5xl font-bold mb-4">{user.credits}</div>
            <div className="text-white/80">学分</div>
            <button
              onClick={() => setShowPurchase(!showPurchase)}
              className="mt-6 w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              购买学分
            </button>
          </div>

          {/* Purchase Section */}
          {showPurchase ? (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">选择套餐</h2>
              <div className="space-y-3 mb-6">
                {tokenPackages.map((pkg) => (
                  <button
                    key={pkg.tokens}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedPackage.tokens === pkg.tokens
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-600">{pkg.description}</div>
                        <div className="text-sm text-gray-500 mt-1">{pkg.tokens} 学分</div>
                      </div>
                      <div className="text-xl font-bold text-blue-600">¥{pkg.price}</div>
                    </div>
                  </button>
                ))}
              </div>

              <Elements
                stripe={stripePromise}
                options={{
                  mode: 'payment',
                  amount: selectedPackage.price * 100,
                  currency: 'cny',
                }}
              >
                <CheckoutForm 
                  selectedPackage={selectedPackage} 
                  onSuccess={() => setShowPurchase(false)}
                />
              </Elements>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">交易记录</h2>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'purchase' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {tx.type === 'purchase' ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{tx.description}</div>
                        <div className="text-sm text-gray-500">{tx.date}</div>
                      </div>
                    </div>
                    <div className={`font-semibold ${
                      tx.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}



