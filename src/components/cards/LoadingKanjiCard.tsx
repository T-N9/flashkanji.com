const LoadingKanjiCard: React.FC = () => {

  return (
    <div className="relative">
      <div
        className={`bg-gradient-to-br from-orange-400  to-orange-700 relative font-writing-1 text-white p-5 rounded-md card min-w-[150px] border-4 lg:min-w-[200px] shadow-md !cursor-progress`}
      >
        {/* Front Side */}
        <span className="bg-gray-200 rounded text-gray-400 w-12 h-5 animate-pulse mx-auto table"></span>
        <p
          className={` text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl animate-pulse`}
        >
         ?
        </p>
      </div>
    </div>
  );
};

export default LoadingKanjiCard;
