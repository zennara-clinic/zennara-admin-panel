/**
 * Skeleton loader for Patient Details page
 */

export default function PatientDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-48 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="flex gap-3">
          <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
          <div className="w-40 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Profile Card Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
            <div className="w-24 h-5 bg-gray-200 rounded"></div>
          </div>

          {/* Patient Info */}
          <div className="flex-1 space-y-6">
            {/* Name and Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-48 h-8 bg-gray-200 rounded"></div>
                <div className="w-28 h-6 bg-gray-200 rounded-full"></div>
              </div>
              <div className="w-32 h-5 bg-gray-200 rounded"></div>
            </div>

            {/* Contact Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-40 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center space-y-2">
                <div className="w-8 h-8 bg-gray-200 rounded mx-auto"></div>
                <div className="w-16 h-4 bg-gray-200 rounded mx-auto"></div>
                <div className="w-12 h-3 bg-gray-200 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4">
                <div className="w-24 h-5 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="w-48 h-5 bg-gray-200 rounded"></div>
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-6 bg-gray-200 rounded-full"></div>
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
          ))}
        </div>
      </div>
    </div>
  );
}
