export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-semibold text-text-primary">Loading NutriGenius...</h2>
        <p className="text-text-secondary">Preparing your personalized nutrition experience</p>
      </div>
    </div>
  );
}
