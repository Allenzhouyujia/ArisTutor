import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, DollarSign, TrendingUp, TrendingDown, Plus, Download } from 'lucide-react';

interface WalletPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function WalletPage({ user, onNavigate, onSignOut }: WalletPageProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const transactions = [
    { id: 1, type: 'earn', amount: 15, description: 'Tutoring Session - Mathematics', date: '2026-01-03', time: '14:30' },
    { id: 2, type: 'spend', amount: -12, description: 'Session with Alex Johnson', date: '2026-01-02', time: '16:00' },
    { id: 3, type: 'earn', amount: 10, description: 'Answer Accepted in Q&A', date: '2026-01-01', time: '11:20' },
    { id: 4, type: 'purchase', amount: 50, description: 'Credit Purchase', date: '2025-12-30', time: '09:15' },
    { id: 5, type: 'spend', amount: -8, description: 'Study Notes Purchase', date: '2025-12-29', time: '15:45' },
  ];

  const creditPackages = [
    { amount: 50, price: 5, popular: false },
    { amount: 150, price: 12, popular: true, savings: '20%' },
    { amount: 300, price: 20, popular: false, savings: '33%' },
  ];

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
              <button onClick={() => onNavigate('qa')} className="text-gray-600 hover:text-blue-500">
                ❓ Q&A
              </button>
              <button onClick={() => onNavigate('notes')} className="text-gray-600 hover:text-blue-500">
                📝 Notes
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2">
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
        <h1 className="text-3xl text-gray-900 mb-6">My Wallet</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 mb-2">Current Balance</p>
              <h2 className="text-5xl">{user.credits}</h2>
              <p className="text-blue-100 mt-1">credits</p>
            </div>
            <DollarSign className="w-16 h-16 text-white opacity-50" />
          </div>
          <button
            onClick={() => setShowPurchaseModal(true)}
            className="bg-white text-blue-500 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Buy More Credits
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Earned</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl text-gray-900">235</div>
            <div className="text-sm text-gray-500">credits</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Spent</span>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-3xl text-gray-900">160</div>
            <div className="text-sm text-gray-500">credits</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">This Month</span>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl text-gray-900">+45</div>
            <div className="text-sm text-gray-500">net gain</div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl text-gray-900">Transaction History</h2>
            <button className="text-blue-500 hover:text-blue-600 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'earn'
                        ? 'bg-green-100'
                        : transaction.type === 'spend'
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : transaction.type === 'spend' ? (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.date} at {transaction.time}
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl text-gray-900 mb-2">Purchase Credits</h2>
            <p className="text-gray-600 mb-6">Choose a package to add credits to your account</p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.amount}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-colors ${
                    pkg.popular
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pkg.popular && (
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full inline-block mb-2">
                      Most Popular
                    </div>
                  )}
                  <div className="text-4xl text-gray-900 mb-2">{pkg.amount}</div>
                  <div className="text-sm text-gray-600 mb-4">credits</div>
                  <div className="text-2xl text-blue-600 mb-2">${pkg.price}</div>
                  {pkg.savings && (
                    <div className="text-sm text-green-600">Save {pkg.savings}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                💳 This is a prototype. In production, payment would be processed through a secure payment gateway.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  alert('Purchase successful! Credits added to your account.');
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
