// Reusable Skeleton Loading Components

export const SkeletonBox = ({ className = "", height = "h-4", width = "w-full" }) => (
  <div className={`${height} ${width} bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
);

export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 ${className}`}>
    <div className="space-y-4">
      <SkeletonBox height="h-6" width="w-3/4" />
      <SkeletonBox height="h-4" width="w-full" />
      <SkeletonBox height="h-4" width="w-5/6" />
      <div className="flex gap-2 mt-4">
        <SkeletonBox height="h-8" width="w-20" />
        <SkeletonBox height="h-8" width="w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonServiceCard = () => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    {/* Image skeleton */}
    <div className="w-full h-64 bg-gray-200"></div>
    
    {/* Content skeleton */}
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <SkeletonBox height="h-6" width="w-20" className="rounded-full" />
        <SkeletonBox height="h-6" width="w-20" className="rounded-full" />
      </div>
      <SkeletonBox height="h-7" width="w-4/5" />
      <SkeletonBox height="h-4" width="w-full" />
      <SkeletonBox height="h-4" width="w-3/4" />
      <div className="flex items-center justify-between pt-4">
        <SkeletonBox height="h-8" width="w-24" />
        <SkeletonBox height="h-10" width="w-32" />
      </div>
    </div>
  </div>
);

export const SkeletonStatCard = () => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
    <SkeletonBox height="h-4" width="w-24" className="mb-3" />
    <SkeletonBox height="h-10" width="w-16" className="mb-2" />
    <SkeletonBox height="h-3" width="w-20" />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 5 }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
    {/* Table header */}
    <div className="p-6 border-b border-gray-100">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <SkeletonBox key={i} height="h-5" width="w-24" />
        ))}
      </div>
    </div>
    
    {/* Table rows */}
    <div className="divide-y divide-gray-100">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="p-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, colIndex) => (
              <SkeletonBox key={colIndex} height="h-4" width="w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="space-y-8">
    {/* Basic Information Section */}
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
      <SkeletonBox height="h-7" width="w-48" className="mb-6" />
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <SkeletonBox height="h-4" width="w-32" className="mb-2" />
            <SkeletonBox height="h-12" width="w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Additional Section */}
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
      <SkeletonBox height="h-7" width="w-40" className="mb-6" />
      <div className="space-y-4">
        <SkeletonBox height="h-64" width="w-full" />
      </div>
    </div>
  </div>
);

export const SkeletonCategoryCard = () => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
    <div className="flex items-center gap-4">
      <SkeletonBox height="h-14" width="w-14" className="rounded-xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBox height="h-6" width="w-48" />
        <SkeletonBox height="h-4" width="w-32" />
      </div>
      <div className="flex gap-2">
        <SkeletonBox height="h-9" width="w-20" />
        <SkeletonBox height="h-9" width="w-20" />
        <SkeletonBox height="h-9" width="w-20" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6, component: Component = SkeletonServiceCard }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <Component key={i} />
    ))}
  </div>
);

export const SkeletonList = ({ count = 5, component: Component = SkeletonCategoryCard }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <Component key={i} />
    ))}
  </div>
);
