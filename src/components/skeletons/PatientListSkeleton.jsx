/**
 * Skeleton loader for All Patients page
 */

export default function PatientListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
              <div className="w-12 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
          <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-between items-center mb-4 animate-pulse">
        <div className="flex gap-3">
          <div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="w-40 h-4 bg-gray-200 rounded"></div>
      </div>

      {/* Patient Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                
                {/* Patient Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-5 bg-gray-200 rounded"></div>
                    <div className="w-24 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="space-y-1">
                        <div className="w-20 h-3 bg-gray-200 rounded"></div>
                        <div className="w-28 h-4 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex items-center space-x-6">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="text-center space-y-1">
                    <div className="w-8 h-6 bg-gray-200 rounded mx-auto"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                  </div>
                ))}
                <div className="flex gap-2">
                  <div className="w-20 h-9 bg-gray-200 rounded-lg"></div>
                  <div className="w-28 h-9 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
