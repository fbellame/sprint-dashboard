import { CreateSprintForm } from '@/components/sprints/CreateSprintForm';

export default function NewSprintPage() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Create New Sprint
        </h1>
        <CreateSprintForm />
      </div>
    </div>
  );
}
