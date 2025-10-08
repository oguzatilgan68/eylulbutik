export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-50">
      <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-pink-500 rounded-full"></div>
    </div>
  );
}
