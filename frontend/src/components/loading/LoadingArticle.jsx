
function LoadingArticle() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-6"></div>

    <div className="h-2 bg-gray-300 rounded-md w-full mb-4"></div>
    <div className="h-2 bg-gray-300 rounded-md w-full mb-4"></div>
    <div className="h-2 bg-gray-300 rounded-md w-1/4 mb-[10%]"></div>
    <div className="h-3 bg-gray-300 rounded-md w-1/3 mb-4"></div>
    <div className="h-3 bg-gray-300 rounded-md w-1/3 mb-4"></div>
    <div className="flex justify-between items-center mt-2">
      <div className="h-4 bg-gray-300 rounded-md w-1/5"></div>
      <div className="h-4 bg-gray-300 rounded-md w-1/5"></div>
    </div>
  </div>
  );
}

export default LoadingArticle;
