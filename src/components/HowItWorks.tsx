export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and tell us about your academic interests and the subjects you need help with or can teach.',
    },
    {
      number: '02',
      title: 'Find Your Match',
      description: 'Browse verified tutors or post what you need help with. Our smart matching connects you with the right peers.',
    },
    {
      number: '03',
      title: 'Book a Session',
      description: 'Schedule a time that works for both of you. Sessions can be one-time or recurring based on your needs.',
    },
    {
      number: '04',
      title: 'Learn & Grow',
      description: 'Meet via video, share screens, use the whiteboard, and collaborate in real-time to achieve your goals.',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started with ArisTutor is simple and straightforward
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-xl shadow-sm h-full">
                <div className="text-6xl text-blue-100 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
