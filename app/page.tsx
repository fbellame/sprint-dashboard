export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Sprint Dashboard
        </h1>
        <p className="text-lg text-gray-700">
          Welcome to the Sprint Dashboard application.
        </p>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            This is the initial setup. Story 0.1 is in progress.
          </p>
        </div>
      </div>
    </main>
  );
}
