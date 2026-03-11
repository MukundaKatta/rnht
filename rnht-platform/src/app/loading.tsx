export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-temple-red" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
