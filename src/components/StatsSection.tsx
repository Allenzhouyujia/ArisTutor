export function StatsSection() {
  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '5,000+', label: 'Verified Tutors' },
    { value: '50,000+', label: 'Sessions Completed' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl text-blue-500 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
