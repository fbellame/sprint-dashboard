import { SprintList } from '@/components/sprints/SprintList';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sprint Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage and track your sprint progress
          </p>
        </div>
        <SprintList />
      </div>
    </main>
  );
}
