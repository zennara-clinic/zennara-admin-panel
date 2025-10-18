/**
 * Skeleton loader for Edit Patient page
 */

export default function EditPatientSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-40 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="w-48 h-8 bg-gray-200 rounded"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-5 bg-gray-200 rounded mb-4"></div>
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-2xl"></div>
              {/* Upload button placeholder */}
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-gray-300 rounded-full"></div>
            </div>
            <div className="w-56 h-4 bg-gray-200 rounded mt-3"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Row 1: Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Row 2: Email and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                  {i === 1 && <div className="w-40 h-3 bg-gray-200 rounded"></div>}
                </div>
              ))}
            </div>

            {/* Row 3: Date of Birth and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="w-28 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>

            {/* Row 4: Member Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-28 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <div className="w-28 h-11 bg-gray-200 rounded-xl"></div>
            <div className="w-36 h-11 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
