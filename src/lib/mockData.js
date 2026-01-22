// 模拟数据和函数 - 用于快速demo，无需配置数据库

// 模拟用户数据（使用 localStorage）
export const mockStorage = {
  // 保存用户
  saveUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  // 获取当前用户
  getUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // 保存学分
  saveCredits: (credits) => {
    const user = mockStorage.getUser();
    if (user) {
      user.credits = credits;
      mockStorage.saveUser(user);
    }
  },

  // 获取学分
  getCredits: () => {
    const user = mockStorage.getUser();
    return user ? user.credits : 0;
  },

  // 清除用户
  clearUser: () => {
    localStorage.removeItem('currentUser');
  },
};

// 模拟登录
export const mockLogin = async (email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: 'user-' + Date.now(),
        email: email,
        name: email.split('@')[0],
        credits: 100,
        role: 'student',
        onboardingComplete: true,
      };
      mockStorage.saveUser(user);
      resolve({ success: true, user });
    }, 1000);
  });
};

// 模拟注册
export const mockSignup = async (email, password, name) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: 'user-' + Date.now(),
        email: email,
        name: name || email.split('@')[0],
        credits: 100,
        role: 'student',
        onboardingComplete: true,
      };
      mockStorage.saveUser(user);
      resolve({ success: true, user });
    }, 1000);
  });
};

// 模拟购买学分
export const mockPurchaseCredits = async (amount) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentCredits = mockStorage.getCredits();
      const newCredits = currentCredits + amount;
      mockStorage.saveCredits(newCredits);
      resolve({ 
        success: true, 
        credits: amount,
        newBalance: newCredits 
      });
    }, 2000);
  });
};

// 模拟课程数据
export const mockSessions = [
  {
    id: 'session-1',
    subject: '微积分 II',
    tutorName: '李老师',
    tutorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor1',
    scheduledTime: new Date(Date.now() + 3600000).toISOString(),
    duration: 60,
    credits: 50,
    status: 'upcoming',
  },
  {
    id: 'session-2',
    subject: '线性代数',
    tutorName: '王老师',
    tutorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor2',
    scheduledTime: new Date(Date.now() + 7200000).toISOString(),
    duration: 90,
    credits: 75,
    status: 'upcoming',
  },
  {
    id: 'session-3',
    subject: '物理基础',
    tutorName: '张老师',
    tutorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor3',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    duration: 60,
    credits: 50,
    status: 'completed',
  },
];

// 模拟导师数据
export const mockTutors = [
  {
    id: 'tutor-1',
    name: '李明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor1',
    subjects: ['数学', '物理'],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 50,
    experience: '5年教学经验',
    education: '清华大学 数学系',
  },
  {
    id: 'tutor-2',
    name: '王芳',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor2',
    subjects: ['英语', '文学'],
    rating: 4.8,
    reviews: 203,
    hourlyRate: 45,
    experience: '8年教学经验',
    education: '北京大学 英语系',
  },
  {
    id: 'tutor-3',
    name: '张伟',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tutor3',
    subjects: ['化学', '生物'],
    rating: 4.7,
    reviews: 89,
    hourlyRate: 40,
    experience: '3年教学经验',
    education: '复旦大学 化学系',
  },
];

// 学分套餐
export const creditPackages = [
  { 
    credits: 100, 
    price: 10, 
    name: '基础套餐', 
    description: '适合偶尔学习',
    discount: 0 
  },
  { 
    credits: 250, 
    price: 20, 
    name: '标准套餐', 
    description: '最受欢迎',
    discount: 20 
  },
  { 
    credits: 500, 
    price: 35, 
    name: '高级套餐', 
    description: '性价比之选',
    discount: 30 
  },
  { 
    credits: 1000, 
    price: 60, 
    name: '专业套餐', 
    description: '超值优惠',
    discount: 40 
  },
];



