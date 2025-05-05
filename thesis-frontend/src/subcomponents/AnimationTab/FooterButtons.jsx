const FooterButtons = ({ onBack, onViewResults }) => (
    <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <button
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg"
        onClick={onBack}
      >
        Back to Configuration
      </button>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        onClick={onViewResults}
      >
        View Results Directly
      </button>
    </div>
  );
  
  export default FooterButtons;
  