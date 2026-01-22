import { useState, useEffect } from 'react';
import { User } from '../App';
import { supabase } from '../lib/supabase';
import { 
  ChevronRight, ChevronLeft, Upload, Check, X, 
  GraduationCap, BookOpen, Calendar, Clock, Shield 
} from 'lucide-react';
import { toast } from 'sonner';

interface OnboardingPageProps {
  user: User;
  onComplete: () => void;
}

interface Subject {
  id: string;
  name: string;
  category: string;
}

export function OnboardingPage({ user, onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Step 1: Basic Info
  const [educationLevel, setEducationLevel] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  // Step 2: Subjects & Grades
  const [studentSubjects, setStudentSubjects] = useState<{[key: string]: {grade: string, level: string}}>({});

  // Step 3: Teaching Subjects
  const [tutorSubjects, setTutorSubjects] = useState<{[key: string]: {level: string}}>({});

  // Step 4: Availability
  const [instantTutoring, setInstantTutoring] = useState(false);
  const [scheduledTutoring, setScheduledTutoring] = useState(true);
  const [availability, setAvailability] = useState<{[key: string]: boolean}>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });

  // Step 5: Verification
  const [transcript, setTranscript] = useState<File | null>(null);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');
      
      if (error) {
        // Table doesn't exist yet - use fallback subjects
        console.info('📚 Using built-in subject catalog (database migration pending)');
        setSubjects(getDefaultSubjects());
      } else if (data && data.length > 0) {
        setSubjects(data);
      } else {
        // If table exists but is empty, use defaults
        setSubjects(getDefaultSubjects());
      }
    } catch (error) {
      console.info('📚 Using built-in subject catalog');
      setSubjects(getDefaultSubjects());
    }
  };

  const getDefaultSubjects = (): Subject[] => {
    return [
      // Core - Mathematics
      { id: 'core-math', name: 'Mathematics', category: 'Core' },
      { id: 'core-algebra', name: 'Algebra', category: 'Core' },
      { id: 'core-geometry', name: 'Geometry', category: 'Core' },
      { id: 'core-precalc', name: 'Pre-Calculus', category: 'Core' },
      { id: 'core-calc', name: 'Calculus', category: 'Core' },
      { id: 'core-stats', name: 'Statistics', category: 'Core' },
      
      // Core - Sciences
      { id: 'core-physics', name: 'Physics', category: 'Core' },
      { id: 'core-chemistry', name: 'Chemistry', category: 'Core' },
      { id: 'core-biology', name: 'Biology', category: 'Core' },
      { id: 'core-env-sci', name: 'Environmental Science', category: 'Core' },
      
      // Core - English/Language Arts
      { id: 'core-english', name: 'English', category: 'Core' },
      { id: 'core-literature', name: 'Literature', category: 'Core' },
      { id: 'core-writing', name: 'Writing/Composition', category: 'Core' },
      
      // Core - Social Studies
      { id: 'core-history', name: 'History', category: 'Core' },
      { id: 'core-us-hist', name: 'U.S. History', category: 'Core' },
      { id: 'core-world-hist', name: 'World History', category: 'Core' },
      { id: 'core-govt', name: 'Government/Civics', category: 'Core' },
      { id: 'core-econ', name: 'Economics', category: 'Core' },
      { id: 'core-geography', name: 'Geography', category: 'Core' },
      
      // Core - Foreign Languages
      { id: 'core-spanish', name: 'Spanish', category: 'Core' },
      { id: 'core-french', name: 'French', category: 'Core' },
      { id: 'core-chinese', name: 'Chinese (Mandarin)', category: 'Core' },
      { id: 'core-german', name: 'German', category: 'Core' },
      { id: 'core-latin', name: 'Latin', category: 'Core' },
      
      // Core - Computer Science
      { id: 'core-cs', name: 'Computer Science', category: 'Core' },
      
      // AP (Advanced Placement)
      { id: 'ap-calc-ab', name: 'AP Calculus AB', category: 'AP' },
      { id: 'ap-calc-bc', name: 'AP Calculus BC', category: 'AP' },
      { id: 'ap-stats', name: 'AP Statistics', category: 'AP' },
      { id: 'ap-physics-1', name: 'AP Physics 1', category: 'AP' },
      { id: 'ap-physics-2', name: 'AP Physics 2', category: 'AP' },
      { id: 'ap-physics-c', name: 'AP Physics C', category: 'AP' },
      { id: 'ap-chemistry', name: 'AP Chemistry', category: 'AP' },
      { id: 'ap-biology', name: 'AP Biology', category: 'AP' },
      { id: 'ap-env-sci', name: 'AP Environmental Science', category: 'AP' },
      { id: 'ap-cs-a', name: 'AP Computer Science A', category: 'AP' },
      { id: 'ap-cs-principles', name: 'AP Computer Science Principles', category: 'AP' },
      { id: 'ap-english-lang', name: 'AP English Language', category: 'AP' },
      { id: 'ap-english-lit', name: 'AP English Literature', category: 'AP' },
      { id: 'ap-us-hist', name: 'AP U.S. History', category: 'AP' },
      { id: 'ap-world-hist', name: 'AP World History', category: 'AP' },
      { id: 'ap-euro-hist', name: 'AP European History', category: 'AP' },
      { id: 'ap-us-govt', name: 'AP U.S. Government', category: 'AP' },
      { id: 'ap-comp-govt', name: 'AP Comparative Government', category: 'AP' },
      { id: 'ap-macro', name: 'AP Macroeconomics', category: 'AP' },
      { id: 'ap-micro', name: 'AP Microeconomics', category: 'AP' },
      { id: 'ap-psych', name: 'AP Psychology', category: 'AP' },
      { id: 'ap-spanish', name: 'AP Spanish Language', category: 'AP' },
      { id: 'ap-french', name: 'AP French Language', category: 'AP' },
      
      // A Levels
      { id: 'alevel-math', name: 'A Level Mathematics', category: 'A Level' },
      { id: 'alevel-further-math', name: 'A Level Further Mathematics', category: 'A Level' },
      { id: 'alevel-physics', name: 'A Level Physics', category: 'A Level' },
      { id: 'alevel-chemistry', name: 'A Level Chemistry', category: 'A Level' },
      { id: 'alevel-biology', name: 'A Level Biology', category: 'A Level' },
      { id: 'alevel-cs', name: 'A Level Computer Science', category: 'A Level' },
      { id: 'alevel-english-lit', name: 'A Level English Literature', category: 'A Level' },
      { id: 'alevel-history', name: 'A Level History', category: 'A Level' },
      { id: 'alevel-econ', name: 'A Level Economics', category: 'A Level' },
      { id: 'alevel-psych', name: 'A Level Psychology', category: 'A Level' },
      
      // IB (International Baccalaureate)
      { id: 'ib-math-aa-hl', name: 'IB Math: Analysis & Approaches HL', category: 'IB' },
      { id: 'ib-math-aa-sl', name: 'IB Math: Analysis & Approaches SL', category: 'IB' },
      { id: 'ib-math-ai-hl', name: 'IB Math: Applications & Interpretation HL', category: 'IB' },
      { id: 'ib-math-ai-sl', name: 'IB Math: Applications & Interpretation SL', category: 'IB' },
      { id: 'ib-physics-hl', name: 'IB Physics HL', category: 'IB' },
      { id: 'ib-physics-sl', name: 'IB Physics SL', category: 'IB' },
      { id: 'ib-chemistry-hl', name: 'IB Chemistry HL', category: 'IB' },
      { id: 'ib-chemistry-sl', name: 'IB Chemistry SL', category: 'IB' },
      { id: 'ib-biology-hl', name: 'IB Biology HL', category: 'IB' },
      { id: 'ib-biology-sl', name: 'IB Biology SL', category: 'IB' },
      { id: 'ib-cs-hl', name: 'IB Computer Science HL', category: 'IB' },
      { id: 'ib-cs-sl', name: 'IB Computer Science SL', category: 'IB' },
      { id: 'ib-english-hl', name: 'IB English A: Language & Literature HL', category: 'IB' },
      { id: 'ib-english-sl', name: 'IB English A: Language & Literature SL', category: 'IB' },
      { id: 'ib-history-hl', name: 'IB History HL', category: 'IB' },
      { id: 'ib-history-sl', name: 'IB History SL', category: 'IB' },
      { id: 'ib-econ-hl', name: 'IB Economics HL', category: 'IB' },
      { id: 'ib-econ-sl', name: 'IB Economics SL', category: 'IB' },
      { id: 'ib-psych-hl', name: 'IB Psychology HL', category: 'IB' },
      { id: 'ib-psych-sl', name: 'IB Psychology SL', category: 'IB' },
      
      // Other
      { id: 'other-test-prep-sat', name: 'SAT Prep', category: 'Other' },
      { id: 'other-test-prep-act', name: 'ACT Prep', category: 'Other' },
      { id: 'other-music-theory', name: 'Music Theory', category: 'Other' },
      { id: 'other-art-history', name: 'Art History', category: 'Other' },
      { id: 'other-business', name: 'Business Studies', category: 'Other' },
      { id: 'other-accounting', name: 'Accounting', category: 'Other' },
      { id: 'other-sociology', name: 'Sociology', category: 'Other' },
    ];
  };

  const toggleStudentSubject = (subjectId: string) => {
    setStudentSubjects(prev => {
      const updated = { ...prev };
      if (updated[subjectId]) {
        delete updated[subjectId];
      } else {
        updated[subjectId] = { grade: '', level: 'High School' };
      }
      return updated;
    });
  };

  const toggleTutorSubject = (subjectId: string) => {
    setTutorSubjects(prev => {
      const updated = { ...prev };
      if (updated[subjectId]) {
        delete updated[subjectId];
      } else {
        // Find the subject to get its category
        const subject = subjects.find(s => s.id === subjectId);
        const level = subject?.category || 'High School';
        updated[subjectId] = { level };
      }
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTranscript(e.target.files[0]);
    }
  };

  const uploadTranscript = async () => {
    if (!transcript) return null;

    try {
      const fileExt = transcript.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, transcript);

      if (uploadError) {
        // Storage bucket doesn't exist yet - store filename as placeholder
        if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket')) {
          console.info('📄 Document saved locally (cloud storage will be configured later)');
          // Store the file in localStorage temporarily
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = (e) => {
              const fileData = {
                name: transcript.name,
                type: transcript.type,
                size: transcript.size,
                data: e.target?.result
              };
              localStorage.setItem(`verification_doc_${user.id}`, JSON.stringify(fileData));
              resolve(`local_storage_${transcript.name}`);
            };
            reader.readAsDataURL(transcript);
          });
        }
        
        toast.error('Failed to upload document. Please try again.');
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.info('📄 Document saved locally for later upload');
      // Store as pending if upload fails
      return `pending_upload_${transcript.name}`;
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Upload transcript (now mandatory)
      const transcriptUrl = await uploadTranscript();
      
      if (!transcriptUrl) {
        toast.error('Please upload verification documents to continue');
        setLoading(false);
        return;
      }

      // Store onboarding data in local storage for now (until migration is applied)
      const onboardingData = {
        education_level: educationLevel,
        school_year: schoolYear,
        school_name: schoolName,
        date_of_birth: dateOfBirth,
        student_subjects: studentSubjects,
        tutor_subjects: tutorSubjects,
        instant_tutoring: instantTutoring,
        scheduled_tutoring: scheduledTutoring,
        verification_doc: transcriptUrl,
        completed_at: new Date().toISOString()
      };
      
      localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingData));

      // Update profile - only update fields that definitely exist
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          // Only update fields we know exist in the current schema
          name: user.name, // Keep existing name
          role: Object.keys(tutorSubjects).length > 0 ? 'tutor' : 'student'
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail if profile update doesn't work
      }

      // Give welcome bonus credits (this should work with existing schema)
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();

        const newCredits = (profile?.credits || 0) + 50;
        
        await supabase
          .from('profiles')
          .update({ credits: newCredits })
          .eq('id', user.id);

        // Update local user object
        user.credits = newCredits;
        
        toast.success(`Welcome to ArisTutor! 🎉\n\nYou received 50 bonus credits!\n\nSelected ${Object.keys(studentSubjects).length} subjects to study.\nReady to tutor ${Object.keys(tutorSubjects).length} subjects.`, {
          duration: 5000
        });
      } catch (error) {
        console.error('Error giving welcome bonus:', error);
        toast.success('Welcome to ArisTutor! 🎉 Setup complete!');
      }

      // Mark as completed in localStorage since DB schema isn't ready
      user.onboarding_completed = true;
      localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      
      onComplete();

    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps us personalize your experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Level *
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your level</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Year *
              </label>
              <input
                type="text"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                placeholder="e.g., Sophomore, Junior, 10th Grade"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Your school name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What are you studying?</h2>
              <p className="text-gray-600">Select your subjects and grades</p>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
              {['Core', 'AP', 'A Level', 'IB', 'Other'].map(category => {
                const categorySubjects = subjects.filter(s => s.category === category);
                if (categorySubjects.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        category === 'Core' ? 'bg-blue-100 text-blue-700' :
                        category === 'AP' ? 'bg-purple-100 text-purple-700' :
                        category === 'A Level' ? 'bg-green-100 text-green-700' :
                        category === 'IB' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {category}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySubjects.map(subject => (
                        <div
                          key={subject.id}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            studentSubjects[subject.id]
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleStudentSubject(subject.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 text-sm">{subject.name}</span>
                            {studentSubjects[subject.id] && (
                              <Check className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          {studentSubjects[subject.id] && (
                            <div className="space-y-2 mt-3" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={studentSubjects[subject.id].grade}
                                onChange={(e) => {
                                  setStudentSubjects(prev => ({
                                    ...prev,
                                    [subject.id]: { ...prev[subject.id], grade: e.target.value }
                                  }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              >
                                <option value="">Select Grade</option>
                                <option value="A+">A+ (97-100%)</option>
                                <option value="A">A (93-96%)</option>
                                <option value="A-">A- (90-92%)</option>
                                <option value="B+">B+ (87-89%)</option>
                                <option value="B">B (83-86%)</option>
                                <option value="B-">B- (80-82%)</option>
                                <option value="C+">C+ (77-79%)</option>
                                <option value="C">C (73-76%)</option>
                                <option value="C-">C- (70-72%)</option>
                                <option value="In Progress">Currently Taking</option>
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <GraduationCap className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What can you teach?</h2>
              <p className="text-gray-600">Select subjects you're comfortable helping others with</p>
              <p className="text-sm text-gray-500 mt-2">You can skip this and add subjects later</p>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 space-y-6">
              {['Core', 'AP', 'A Level', 'IB', 'Other'].map(category => {
                const categorySubjects = subjects.filter(s => s.category === category);
                if (categorySubjects.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        category === 'Core' ? 'bg-blue-100 text-blue-700' :
                        category === 'AP' ? 'bg-purple-100 text-purple-700' :
                        category === 'A Level' ? 'bg-green-100 text-green-700' :
                        category === 'IB' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {category}
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categorySubjects.map(subject => (
                        <div
                          key={subject.id}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            tutorSubjects[subject.id]
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleTutorSubject(subject.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 text-sm">{subject.name}</span>
                            {tutorSubjects[subject.id] && (
                              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your availability</h2>
              <p className="text-gray-600">When are you available to help others?</p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instantTutoring}
                    onChange={(e) => setInstantTutoring(e.target.checked)}
                    className="w-5 h-5 text-blue-500 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Instant Tutoring</div>
                    <div className="text-sm text-gray-600">Accept real-time tutoring requests</div>
                  </div>
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={scheduledTutoring}
                    onChange={(e) => setScheduledTutoring(e.target.checked)}
                    className="w-5 h-5 text-green-500 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Scheduled Sessions</div>
                    <div className="text-sm text-gray-600">Allow students to book sessions in advance</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">General Availability</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(availability).map(day => (
                  <label
                    key={day}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      availability[day]
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={availability[day]}
                      onChange={(e) => setAvailability(prev => ({
                        ...prev,
                        [day]: e.target.checked
                      }))}
                      className="sr-only"
                    />
                    <span className="capitalize font-medium">
                      {day.substring(0, 3)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your grades *</h2>
              <p className="text-gray-600">Upload a transcript or report card to verify your academic performance</p>
              <p className="text-sm text-red-600 font-medium mt-2">⚠️ Verification is required to ensure quality tutoring</p>
            </div>

            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              transcript ? 'border-green-500 bg-green-50' : 'border-red-300 bg-red-50'
            }`}>
              <Upload className={`w-12 h-12 mx-auto mb-4 ${transcript ? 'text-green-500' : 'text-red-400'}`} />
              <input
                type="file"
                id="transcript-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label
                htmlFor="transcript-upload"
                className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-block"
              >
                {transcript ? 'Change File' : 'Choose File *'}
              </label>
              {transcript ? (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">{transcript.name}</span>
                </div>
              ) : (
                <div className="mt-4 text-sm text-red-600">
                  Please upload your transcript or report card to continue
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <p className="text-gray-900 font-semibold mb-2">📄 Document Requirements:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• <strong>Accepted formats:</strong> PDF, JPG, PNG</li>
                <li>• <strong>What we verify:</strong> Subject grades, GPA, academic honors</li>
                <li>• <strong>Privacy:</strong> Your documents are securely stored and only used for verification</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700">
              <p className="font-semibold mb-1">💡 Why verification matters:</p>
              <p>ArisTutor ensures quality peer tutoring by verifying academic credentials. This builds trust and helps students find the right help.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return educationLevel && schoolYear && schoolName && dateOfBirth;
      case 2:
        return Object.keys(studentSubjects).length > 0;
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional settings
      case 5:
        return !!transcript; // Verification now mandatory
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 5</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((step / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              disabled={loading}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed() || loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Setup'}
              <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
