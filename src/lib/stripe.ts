import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!;

export const stripePromise = loadStripe(stripePublishableKey);

export const tokenPackages = [
  { tokens: 100, price: 10, name: '基础套餐', description: '适合偶尔辅导' },
  { tokens: 250, price: 20, name: '标准套餐', description: '节省20%' },
  { tokens: 500, price: 35, name: '高级套餐', description: '节省30%' },
  { tokens: 1000, price: 60, name: '专业套餐', description: '节省40%' },
];



