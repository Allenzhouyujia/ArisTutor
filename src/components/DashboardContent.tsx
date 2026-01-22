import { Video, Users, HelpCircle, BookOpen, CheckCircle } from 'lucide-react';

export function DashboardContent() {
  const helpOptions = [
    {
      icon: Video,
      title: '1:1 Tutoring',
      description: 'Get personalized help from verified peer tutors in any subject.',
      buttonText: 'Find a Tutor',
      buttonColor: 'bg-blue-500 hover:bg-blue-600 text-white',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      icon: Users,
      title: 'Group Sessions',
      description: 'Join affordable group sessions with other students learning the same topics.',
      buttonText: 'Browse Sessions',
      buttonColor: 'bg-green-600 hover:bg-green-700 text-white',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: HelpCircle,
      title: 'Ask a Question',
      description: 'Post specific questions and get answers from knowledgeable peers.',
      buttonText: 'Ask Now',
      buttonColor: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
    },
    {
      icon: BookOpen,
      title: 'Study Resources',
      description: 'Access notes, guides, and study materials shared by top students.',
      buttonText: 'Browse Resources',
      buttonColor: 'bg-red-500 hover:bg-red-600 text-white',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-500',
    },
  ];

  const upcomingSessions = [
    {
      time: 'Today, 3:00 PM',
      title: 'Calculus II Help',
      tutor: 'Alex Johnson',
      tutorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      status: 'Scheduled',
      action: 'Join',
    },
    {
      time: 'Tomorrow, 5:30 PM',
      title: 'Chemistry Review',
      tutor: 'Emma Williams',
      tutorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      status: 'Scheduled',
      action: 'View',
    },
  ];

  const learningStreak = {
    currentStreak: 7,
    days: [
      { day: 'Mon', active: true },
      { day: 'Tue', active: true },
      { day: 'Wed', active: true },
      { day: 'Thu', active: true },
      { day: 'Fri', active: true },
      { day: 'Sat', active: true },
      { day: 'Sun', active: true },
    ],
  };

  const recommendedTutors = [
    {
      name: 'Alex Johnson',
      subjects: 'Calculus, Linear Algebra',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      verified: true,
      available: 'Available Now',
      availableColor: 'text-green-600',
      availableDot: 'bg-green-600',
      credits: 15,
    },
    {
      name: 'Emma Williams',
      subjects: 'Chemistry, Biology',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      verified: true,
      available: 'Available Tomorrow',
      availableColor: 'text-gray-600',
      availableDot: 'bg-gray-400',
      credits: 12,
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Left Column - Get Academic Help */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl text-gray-900 mb-6">Get Academic Help</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {helpOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${option.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${option.iconColor}`} />
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{option.description}</p>
                    <button className={`${option.buttonColor} px-6 py-2 rounded-lg text-sm transition-colors`}>
                      {option.buttonText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Tutors */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-gray-900">Recommended Tutors</h2>
            <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">View All</a>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {recommendedTutors.map((tutor, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <img src={tutor.image} alt={tutor.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900">{tutor.name}</h3>
                      {tutor.verified && (
                        <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{tutor.subjects}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(tutor.rating) ? 'text-yellow-400' : i < tutor.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          {i < Math.floor(tutor.rating) ? '⭐' : i === Math.floor(tutor.rating) && tutor.rating % 1 !== 0 ? '⭐' : '☆'}
                        </span>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({tutor.rating.toFixed(1)})</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tutor.availableDot}`} />
                    <span className={`text-sm ${tutor.availableColor}`}>{tutor.available}</span>
                  </div>
                  <span className="text-blue-600">
                    <span className="text-lg">{tutor.credits}</span>
                    <span className="text-sm"> credits/hour</span>
                  </span>
                </div>
                
                <button className="w-full border-2 border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Upcoming Sessions & Learning Streak */}
      <div className="space-y-6">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-gray-900">Upcoming Sessions</h2>
            <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">View All</a>
          </div>
          <div className="space-y-3">
            {upcomingSessions.map((session, index) => (
              <div key={index}>
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm mb-3">
                  {session.time}
                </div>
                <div className="flex items-start gap-3 mb-3">
                  <img src={session.tutorImage} alt={session.tutor} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="text-gray-900 text-sm">{session.title}</h3>
                    <p className="text-gray-600 text-xs">with {session.tutor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded">
                    {session.status}
                  </span>
                  <button className="border border-blue-500 text-blue-500 text-xs px-4 py-1 rounded hover:bg-blue-50 transition-colors">
                    {session.action}
                  </button>
                </div>
                {index < upcomingSessions.length - 1 && <div className="mt-3" />}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg text-gray-900 mb-4">Learning Streak</h2>
          <div className="text-center mb-4">
            <div className="text-5xl text-blue-500 mb-2">{learningStreak.currentStreak}</div>
            <div className="text-sm text-gray-600">days in a row</div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {learningStreak.days.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs ${
                  day.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {index === 0 ? 'M' : index === 1 ? 'T' : index === 2 ? 'W' : index === 3 ? 'T' : index === 4 ? 'F' : index === 5 ? 'S' : 'S'}
                </div>
                <div className="text-xs text-gray-600 mt-1">{day.day}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">Keep it up! You're building great study habits.</p>
        </div>
      </div>
    </div>
  );
}