import { StateManagementTest } from '@/components/common/StateManagementTest';

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
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Story 0.4: State Management Setup is complete.
            </p>
          </div>
          <StateManagementTest />
        </div>
      </div>
    </main>
  );
}
