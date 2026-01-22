import { Pen, MousePointer, Type, Users, Image as ImageIcon, FileText, Undo, Video, Mic, MicOff, VideoOff } from 'lucide-react';

export function SessionInterfacePreview() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
            Session Interface Preview
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience seamless collaboration with our interactive whiteboard, video chat, and real-time messaging
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg text-gray-900">Session Interface Preview</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Recording
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            {/* Left - Whiteboard Area */}
            <div className="lg:col-span-2 border-r border-gray-200">
              {/* Toolbar */}
              <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
                <button className="w-10 h-10 rounded-lg bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Pen className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <MousePointer className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Type className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <FileText className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Undo className="w-5 h-5" />
                </button>
              </div>

              {/* Whiteboard */}
              <div className="bg-gray-50 p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">Interactive whiteboard activated during live sessions</p>
                  <p className="text-sm">Draw, type, share images, and collaborate in real-time</p>
                </div>
              </div>

              {/* Video Feeds */}
              <div className="grid grid-cols-2 gap-4 p-6 bg-gray-100">
                {/* You */}
                <div className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Camera Feed</p>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    You
                  </div>
                </div>

                {/* Tutor */}
                <div className="bg-gray-800 rounded-lg overflow-hidden relative aspect-video">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">Camera Feed</p>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-gray-900/80 text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    Tutor
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Chat & Controls */}
            <div className="flex flex-col">
              {/* Timer and Controls */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-500">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                        <path strokeWidth="2" d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <span className="text-xl">37:15</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-lg border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <MicOff className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 rounded-lg border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <VideoOff className="w-4 h-4" />
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
                      End
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[300px]">
                {/* Student Message */}
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 mb-1">You, 2:34 PM</div>
                  <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                    I'm struggling to understand how to solve this equation. Can you walk me through it step by step?
                  </div>
                </div>

                {/* Tutor Message */}
                <div className="flex flex-col items-start">
                  <div className="text-xs text-gray-500 mb-1">Alex Johnson, 2:36 PM</div>
                  <div className="bg-gray-200 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%]">
                    Of course! Let's break it down. First, we need to isolate the variable by moving all terms with x to the left side of the equation...
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
