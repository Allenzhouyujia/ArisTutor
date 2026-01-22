import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, Upload, CheckCircle, AlertCircle, Clock, FileText, ArrowLeft } from 'lucide-react';
import verificationImage from 'figma:asset/d72d7cadf191697b27be56c959042a9acea3e719.png';

interface TutorVerificationPageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

interface VerificationDocument {
  id: string;
  name: string;
  uploadedDate: string;
  status: 'verified' | 'pending' | 'unverified';
  academicLevel?: string;
  subjects?: Array<{
    course: string;
    grade: string;
    status: 'verified' | 'pending' | 'unverified';
    notes: string;
  }>;
}

export function TutorVerificationPage({ user, onNavigate, onSignOut }: TutorVerificationPageProps) {
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: '1',
      name: 'Fall 2023 Transcript - University of California',
      uploadedDate: 'Nov 15, 2023',
      status: 'verified',
      academicLevel: 'Undergraduate - Junior Year',
      subjects: [
        { course: 'MATH 241: Calculus III', grade: 'A-', status: 'verified', notes: 'Grade meets excellence threshold' },
        { course: 'CS 301: Data Structures', grade: 'A', status: 'verified', notes: 'Grade meets excellence threshold' },
        { course: 'PHYS 201: Mechanics', grade: 'B+', status: 'verified', notes: 'Grade meets proficiency threshold' },
        { course: 'ENGL 105: Technical Writing', grade: 'A', status: 'verified', notes: 'Grade meets excellence threshold' },
      ]
    },
    {
      id: '2',
      name: 'Spring 2023 Transcript - University of California',
      uploadedDate: 'June 2, 2023',
      status: 'pending',
      academicLevel: 'Undergraduate - Sophomore Year',
      subjects: [
        { course: 'MATH 215: Linear Algebra', grade: 'B+', status: 'verified', notes: 'Grade meets proficiency threshold' },
        { course: 'CS 255: Database Systems', grade: 'A-', status: 'verified', notes: 'Grade meets excellence threshold' },
        { course: 'BIO 110: Introduction to Biology', grade: 'C+', status: 'pending', notes: 'Grade under minimum threshold review' },
        { course: 'HIST 207: Modern World History', grade: 'B', status: 'unverified', notes: 'Course name unclear in document' },
      ]
    }
  ]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      alert('File uploaded! It will be reviewed within 24-48 hours.');
    }
  };

  const getStatusColor = (status: 'verified' | 'pending' | 'unverified') => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'unverified':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusIcon = (status: 'verified' | 'pending' | 'unverified') => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'unverified':
        return <AlertCircle className="w-4 h-4" />;
    }
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
        <h1 className="text-3xl text-gray-900 mb-2">Academic Verification</h1>
        <p className="text-gray-600 mb-8">Upload your academic documents to get verified and start tutoring</p>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <h2 className="text-xl text-gray-900 mb-6">Upload Academic Documents</h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <p className="text-lg text-gray-900 mb-2">Drag and drop your documents here</p>
            <p className="text-gray-600 mb-4">or</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto">
              <Upload className="w-5 h-5" />
              Browse Files
            </button>
            <p className="text-sm text-gray-500 mt-4">Supported formats: PDF, JPG, PNG (max 10MB)</p>
          </div>
        </div>

        {/* Verification Status Legend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg text-gray-900 mb-4">Verification Status Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
              <span className="text-sm text-gray-600">Meets all verification criteria</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
              </span>
              <span className="text-sm text-gray-600">Under manual review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Unverified
              </span>
              <span className="text-sm text-gray-600">Failed verification</span>
            </div>
          </div>
        </div>

        {/* Your Uploaded Documents */}
        <div className="space-y-6">
          <h2 className="text-xl text-gray-900">Your Uploaded Documents</h2>
          
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Document Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg text-gray-900 mb-1">{doc.name}</h3>
                      <p className="text-sm text-gray-600">Uploaded on {doc.uploadedDate}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                    {getStatusIcon(doc.status)}
                    {doc.status === 'verified' ? 'Verified' : doc.status === 'pending' ? 'Partially Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              {/* Academic Level */}
              {doc.academicLevel && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-600">Academic Level</span>
                      <div className="text-gray-900 mt-1">{doc.academicLevel}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor('verified')}`}>
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Verified Subjects */}
              {doc.subjects && doc.subjects.length > 0 && (
                <div className="p-6">
                  <h4 className="text-gray-900 mb-4">Verified Subjects</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-sm text-gray-600 pb-3 pr-4">Course</th>
                          <th className="text-left text-sm text-gray-600 pb-3 pr-4">Grade</th>
                          <th className="text-left text-sm text-gray-600 pb-3 pr-4">Status</th>
                          <th className="text-left text-sm text-gray-600 pb-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.subjects.map((subject, idx) => (
                          <tr key={idx} className="border-b border-gray-100 last:border-0">
                            <td className="py-3 pr-4 text-gray-900">{subject.course}</td>
                            <td className="py-3 pr-4 text-gray-900">{subject.grade}</td>
                            <td className="py-3 pr-4">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(subject.status)}`}>
                                {subject.status === 'verified' ? 'Verified' : subject.status === 'pending' ? 'Pending' : 'Unverified'}
                              </span>
                            </td>
                            <td className="py-3 text-sm text-gray-600">{subject.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <h3 className="text-lg text-gray-900 mb-2">Verification Requirements</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Upload official transcripts from your educational institution</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Grades must meet minimum thresholds: B+ or higher for excellence, B or higher for proficiency</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Documents are typically reviewed within 24-48 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>You can only tutor subjects you're verified for</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
