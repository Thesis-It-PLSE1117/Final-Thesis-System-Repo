const Controls = ({ isPlaying, handlePlayPause, handleReset, progress, cloudlets }) => (
  <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
    <div className="flex flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center">
      <button 
        className={`px-4 sm:px-5 md:px-6 py-2 rounded-lg flex items-center justify-center text-sm sm:text-base transition-colors duration-200 ${
          isPlaying 
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } min-w-[80px] sm:min-w-[90px]`}
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <>
            <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play
          </>
        )}
      </button>
      <button 
        className="bg-gray-200 text-gray-700 px-4 sm:px-5 md:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-gray-300 transition-colors duration-200 min-w-[80px] sm:min-w-[90px] flex items-center justify-center"
        onClick={handleReset}
      >
        <svg className="w-4 h-4 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        Reset
      </button>
    </div>
    
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
      <div className="w-full sm:w-48 md:w-56 lg:w-64 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
        {Math.round(progress)}% ({Math.floor(cloudlets * progress / 100)}/{cloudlets} tasks)
      </span>
    </div>
  </div>
);

export default Controls;