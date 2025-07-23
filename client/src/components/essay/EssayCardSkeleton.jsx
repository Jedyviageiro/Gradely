const EssayCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
      </div>
    </div>
  );
};

export default EssayCardSkeleton;