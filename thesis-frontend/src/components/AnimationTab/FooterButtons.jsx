const FooterButtons = ({ onBack, onViewResults }) => (
  <div className="mt-4 sm:mt-6 lg:mt-8 px-4 sm:px-0">
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
      <button
        className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 order-2 sm:order-1"
        onClick={onBack}
      >
        <span className="sm:hidden">Back</span>
        <span className="hidden sm:inline">Back to Configuration</span>
      </button>
      <button
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 order-1 sm:order-2"
        onClick={onViewResults}
      >
        <span className="sm:hidden">View Results</span>
        <span className="hidden sm:inline">View Results Directly</span>
      </button>
    </div>
  </div>
);

export default FooterButtons;