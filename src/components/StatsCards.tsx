import { Calendar, DollarSign, Star, GraduationCap } from 'lucide-react';

export function StatsCards() {
  const stats = [
    {
      icon: Calendar,
      value: '12',
      label: 'Sessions Completed',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: DollarSign,
      value: '125',
      label: 'Credit Balance',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
    },
    {
      icon: Star,
      value: '4.8',
      label: 'Average Rating',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
    },
    {
      icon: GraduationCap,
      value: '5',
      label: 'Verified Subjects',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className={`${stat.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="text-3xl text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
