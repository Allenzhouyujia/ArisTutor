import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, ArrowLeft, Info, ChevronRight } from 'lucide-react';
import scheduleImage from 'figma:asset/838012eded4fc4232f68c827edaae4764ebaa071.png';

interface TutorSchedulePageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

interface TimeSlot {
  day: string;
  time: string;
  selected: boolean;
}

export function TutorSchedulePage({ user, onNavigate, onSignOut }: TutorSchedulePageProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [recurringSchedule, setRecurringSchedule] = useState(true);
  const [customDays, setCustomDays] = useState<string[]>(['Mon', 'Wed']);
  const [customTimeFrom, setCustomTimeFrom] = useState('2:00 PM');
  const [customTimeTo, setCustomTimeTo] = useState('5:00 PM');

  // Generate time slots from 6:00 AM to 7:30 PM in 30-minute increments
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 19; hour++) {
      for (let minute of [0, 30]) {
        if (hour === 19 && minute === 30) break; // Stop at 7:30 PM
        const time = `${hour}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Sample selected slots for demonstration
  const [selectedSlots, setSelectedSlots] = useState<{ [key: string]: string[] }>({
    Monday: ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],
    Tuesday: ['18:00', '18:30', '19:00'],
    Wednesday: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
    Thursday: ['15:00', '15:30', '16:00', '16:30', '17:00'],
    Friday: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
    Saturday: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
    Sunday: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const toggleSlot = (day: string, time: string) => {
    setSelectedSlots(prev => {
      const daySlots = prev[day] || [];
      const isSelected = daySlots.includes(time);
      
      return {
        ...prev,
        [day]: isSelected
          ? daySlots.filter(t => t !== time)
          : [...daySlots, time].sort()
      };
    });
  };

  const isSlotSelected = (day: string, time: string) => {
    return selectedSlots[day]?.includes(time) || false;
  };

  const presets = [
    { id: 'mornings', label: 'Mornings (6am-12pm)', icon: '☀️' },
    { id: 'afternoons', label: 'Afternoons (12pm-5pm)', icon: '🌤️' },
    { id: 'evenings', label: 'Evenings (5pm-10pm)', icon: '🌙' },
  ];

  const toggleCustomDay = (day: string) => {
    setCustomDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const calculateTotalHours = () => {
    let total = 0;
    Object.values(selectedSlots).forEach(slots => {
      total += slots.length * 0.5; // Each slot is 30 minutes
    });
    return total.toFixed(1);
  };

  const getAvailabilitySummary = () => {
    const summary: string[] = [];
    days.forEach(day => {
      const slots = selectedSlots[day];
      if (slots && slots.length > 0) {
        const startTime = formatTime(slots[0]);
        const endTime = formatTime(slots[slots.length - 1]);
        const hours = (slots.length * 0.5).toFixed(1);
        summary.push(`${day}: ${startTime} - ${endTime} (${hours} hours)`);
      }
    });
    return summary;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                <GraduationCap className="w-8 h-8 text-blue-500" />
                <span className="text-xl">
                  <span className="font-semibold text-gray-900">Aris</span>
                  <span className="text-cyan-400">Tutor</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('wallet')}
                className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
              >
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
        <h1 className="text-3xl text-gray-900 mb-2">Set Your Availability</h1>
        <p className="text-gray-600 mb-8">Select your available time slots so students can book sessions with you</p>

        {/* Quick Preset Options */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg text-gray-900">Quick Preset Options</h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset.id)}
                className={`p-4 border-2 rounded-xl transition-colors text-left ${
                  selectedPreset === preset.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{preset.icon}</div>
                <div className="text-gray-900">{preset.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Availability Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-gray-900">Weekly Availability</h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Days Header */}
              <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="bg-white p-3"></div>
                {days.map((day) => (
                  <div key={day} className="bg-gray-50 p-3 text-center">
                    <div className="text-sm text-gray-900">{day}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-8 gap-px bg-gray-200 max-h-[500px] overflow-y-auto">
                {timeSlots.map((time) => (
                  <>
                    <div key={`time-${time}`} className="bg-white p-2 text-right sticky left-0 z-10">
                      <div className="text-xs text-gray-600">{formatTime(time)}</div>
                    </div>
                    {days.map((day) => (
                      <div
                        key={`${day}-${time}`}
                        onClick={() => toggleSlot(day, time)}
                        className={`cursor-pointer p-2 transition-colors ${
                          isSlotSelected(day, time)
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      />
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Schedule Toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={recurringSchedule}
              onChange={(e) => setRecurringSchedule(e.target.checked)}
              className="w-5 h-5 text-blue-500 rounded"
            />
            <div>
              <div className="text-gray-900">Make this my recurring weekly schedule</div>
              <div className="text-sm text-gray-600">This schedule will repeat every week</div>
            </div>
            <Info className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Custom Time Range */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg text-gray-900">Add Custom Time Range</h2>
            <Info className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Select Days:</label>
              <div className="flex gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleCustomDay(day)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      customDays.includes(day)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">From:</label>
                <select
                  value={customTimeFrom}
                  onChange={(e) => setCustomTimeFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>6:00 AM</option>
                  <option>9:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>5:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">To:</label>
                <select
                  value={customTimeTo}
                  onChange={(e) => setCustomTimeTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>5:00 PM</option>
                  <option>8:00 PM</option>
                  <option>10:00 PM</option>
                </select>
              </div>
            </div>

            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Availability Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg text-gray-900">Availability Summary</h2>
          </div>
          <div className="space-y-2">
            {getAvailabilitySummary().map((line, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <span className="text-gray-600">•</span>
                <span className="text-gray-900">{line}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-gray-600">Total available hours per week: <span className="text-gray-900 font-semibold">{calculateTotalHours()} hours</span></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Expertise
          </button>
          <button
            onClick={() => {
              alert('Schedule saved successfully!');
              onNavigate('tutor-verification');
            }}
            className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            Continue to Verification
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
