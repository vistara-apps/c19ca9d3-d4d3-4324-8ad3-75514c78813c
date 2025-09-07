'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            Oops! Something went wrong
          </h2>
          <p className="text-text-secondary">
            We encountered an error while loading your nutrition dashboard. Don't worry, your data is safe!
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-surface/60 text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-surface/80 transition-all duration-200 border border-white/10"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
