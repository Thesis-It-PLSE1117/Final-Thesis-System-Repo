const Controls = ({ isPlaying, handlePlayPause, handleReset, progress, cloudlets }) => (
    <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        className={`px-6 py-2 rounded-lg flex items-center ${
          isPlaying ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'
        }`}
        onClick={handlePlayPause}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button 
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
        onClick={handleReset}
      >
        Reset
      </button>
      <div className="w-full sm:w-64 bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="text-sm text-gray-600">
        {Math.round(progress)}% ({Math.floor(cloudlets * progress / 100)}/{cloudlets} tasks)
      </span>
    </div>
  );
  
  export default Controls;
  