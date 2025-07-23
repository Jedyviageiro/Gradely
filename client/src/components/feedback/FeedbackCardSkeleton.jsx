const FeedbackCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse">
    <div className="flex items-center gap-2 mb-2">
      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>

    <div className="space-y-2 mb-5">
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </div>

    <div className="flex flex-wrap gap-2 mt-auto w-full border-t border-gray-100 pt-4">
      <div className="h-5 bg-gray-200 rounded-full w-24"></div>
      <div className="h-5 bg-gray-200 rounded-full w-28"></div>
    </div>
  </div>
);

export default FeedbackCardSkeleton;