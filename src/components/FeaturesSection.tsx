import { BookOpen, Video, MessageCircle, Award, Clock, Shield } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert Tutoring',
      description: 'Connect with verified peer tutors who excel in their subjects and are ready to help you succeed.',
    },
    {
      icon: Video,
      title: 'Live Sessions',
      description: 'Engage in real-time video sessions with screen sharing and interactive whiteboards.',
    },
    {
      icon: MessageCircle,
      title: 'Q&A Community',
      description: 'Get quick answers from the community or ask your tutor questions between sessions.',
    },
    {
      icon: Award,
      title: 'Earn Credits',
      description: 'Share your knowledge as a tutor and earn credits that you can use for your own learning.',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Book sessions that fit your schedule. Available 24/7 with tutors across different time zones.',
    },
    {
      icon: Shield,
      title: 'Verified Tutors',
      description: 'All tutors are verified students with proven expertise in their subject areas.',
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
            Why Choose ArisTutor?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform designed to make peer-to-peer learning accessible, 
            effective, and rewarding for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
