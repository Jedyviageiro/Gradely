const EssayListItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200 animate-pulse">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded-full w-20"></div>
        <div className="h-8 bg-gray-200 rounded-lg w-24"></div>
      </div>
    </div>
  );
};

export default EssayListItemSkeleton;