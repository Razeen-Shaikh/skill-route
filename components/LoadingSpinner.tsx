export default function LoadingSpinner() {
  return (
    <div className="flex flex-1 justify-center items-center h-full">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
