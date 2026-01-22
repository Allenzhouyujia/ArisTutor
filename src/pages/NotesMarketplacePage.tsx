import { useState } from 'react';
import { User } from '../App';
import { GraduationCap, Bell, Upload, Download, Star, FileText, DollarSign } from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants/subjects';

interface NotesMarketplacePageProps {
  user: User;
  onNavigate: (page: string) => void;
  onSignOut: () => void;
}

export function NotesMarketplacePage({ user, onNavigate, onSignOut }: NotesMarketplacePageProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All');

  const notes = [
    {
      id: 1,
      title: 'Calculus II - Complete Study Guide',
      author: 'Alex Johnson',
      subject: 'Mathematics',
      price: 10,
      rating: 4.8,
      downloads: 245,
      pages: 45,
      preview: 'Comprehensive guide covering limits, derivatives, and integrals...'
    },
    {
      id: 2,
      title: 'Organic Chemistry Lab Reports',
      author: 'Emma Williams',
      subject: 'Chemistry',
      price: 8,
      rating: 4.9,
      downloads: 189,
      pages: 32,
      preview: 'Detailed lab reports with observations and conclusions...'
    },
    {
      id: 3,
      title: 'Data Structures & Algorithms Notes',
      author: 'Michael Chen',
      subject: 'Computer Science',
      price: 12,
      rating: 5.0,
      downloads: 312,
      pages: 58,
      preview: 'In-depth coverage of arrays, linked lists, trees, graphs...'
    },
    {
      id: 4,
      title: 'World War II History Summary',
      author: 'Sarah Park',
      subject: 'History',
      price: 6,
      rating: 4.7,
      downloads: 156,
      pages: 28,
      preview: 'Timeline of major events, key figures, and outcomes...'
    },
  ];

  const subjects = ['All', ...POPULAR_SUBJECTS.slice(0, 10)];
  const filteredNotes = selectedSubject === 'All'
    ? notes
    : notes.filter(n => n.subject === selectedSubject);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <span className="text-xl">
                <span className="font-semibold text-gray-900">Aris</span>
                <span className="text-cyan-400">Tutor</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => onNavigate('dashboard')} className="text-gray-600 hover:text-blue-500">
                🏠 Dashboard
              </button>
              <button onClick={() => onNavigate('tutor-profile')} className="text-gray-600 hover:text-blue-500">
                🔍 Find Tutors
              </button>
              <button onClick={() => onNavigate('session')} className="text-gray-600 hover:text-blue-500">
                📅 Sessions
              </button>
              <button onClick={() => onNavigate('qa')} className="text-gray-600 hover:text-blue-500">
                ❓ Q&A
              </button>
              <button onClick={() => onNavigate('notes')} className="text-blue-500">
                📝 Notes
              </button>
            </nav>

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Notes Marketplace</h1>
            <p className="text-gray-600">Buy and sell quality study materials</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Notes
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 mb-4">Filter by Subject</h3>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSubject === subject
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                    {note.subject}
                  </span>
                </div>
              </div>

              <h3 className="text-lg text-gray-900 mb-2">{note.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{note.preview}</p>

              <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{note.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{note.downloads}</span>
                </div>
                <div>{note.pages} pages</div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">by {note.author}</div>
                  <div className="text-lg text-blue-600 font-semibold flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {note.price} credits
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Purchase
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
            <h2 className="text-2xl text-gray-900 mb-6">Upload Study Notes</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Give your notes a descriptive title"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a subject</option>
                  {subjects.filter(s => s !== 'All').map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  placeholder="Describe what's covered in your notes"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Price (Credits)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a price for your notes"
                  min="1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PDF, DOC, DOCX (max. 10MB)</p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  📋 By uploading, you agree that your content is original and doesn't violate any copyright laws.
                  All uploads are moderated for quality.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  alert('Notes uploaded successfully! They will be available after moderation.');
                }}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
              >
                Upload Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
