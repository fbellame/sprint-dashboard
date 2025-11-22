
/**
 * Sprint Detail Page (Placeholder)
 *
 * This is a placeholder page for Story 1.2.
 * Full implementation will be done in a future story.
 */
export default function SprintDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // For now, just show a basic page
  // Full implementation will be in a future story
  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sprint Details
        </h1>
        <p className="text-gray-600">
          Sprint ID: {params.id}
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Full sprint detail page will be implemented in a future story.
        </p>
      </div>
    </div>
  );
}

