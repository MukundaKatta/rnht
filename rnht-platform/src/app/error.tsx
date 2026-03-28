"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl">🙏</span>
      <h2 className="mt-6 font-heading text-2xl font-bold text-gray-900">
        Something went wrong
      </h2>
      <p className="mt-3 max-w-md text-gray-600">
        We apologize for the inconvenience. Please try again or contact the temple for assistance.
      </p>
      <button
        onClick={reset}
        className="btn-primary mt-8"
      >
        Try Again
      </button>
    </div>
  );
}
