export function TutorModeSection() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Tutor Mode</h2>
          <p className="text-gray-500 text-sm">Switch to help others with their studies</p>
        </div>
        <button 
          className="w-12 h-7 bg-gray-300 rounded-full relative transition-colors hover:bg-gray-400"
          aria-label="Toggle tutor mode"
        >
          <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full shadow-sm" />
        </button>
      </div>
    </div>
  );
}
