import { ClockIcon } from '../components/Icons';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="text-center px-6 py-12">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-zennara-green/10 to-emerald-100 rounded-3xl flex items-center justify-center shadow-lg">
            <ClockIcon className="w-12 h-12 text-zennara-green" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          We're Working On It
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          This feature will be updated soon. We're working hard to bring you something amazing!
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center px-6 py-3 bg-amber-50 border-2 border-amber-200 rounded-full">
          <div className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-sm font-semibold text-amber-700">Under Development</span>
        </div>
      </div>
    </div>
  );
}
