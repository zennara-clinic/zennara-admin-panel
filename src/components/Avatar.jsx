import React from 'react';

/**
 * Avatar Component - Displays user avatar with fallback to initials
 * 
 * @param {string} src - Profile photo URL
 * @param {string} name - User's name (used for fallback initials)
 * @param {string} size - Size of avatar: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {string} className - Additional CSS classes
 * @param {boolean} showOnlineDot - Show online status indicator (default: false)
 * @param {string} shape - Avatar shape: 'circle', 'rounded' (default: 'rounded')
 */
export default function Avatar({ 
  src, 
  name = 'User', 
  size = 'md', 
  className = '', 
  showOnlineDot = false,
  shape = 'rounded'
}) {
  // Size configurations
  const sizes = {
    sm: { container: 'w-8 h-8', dot: 'w-2 h-2', text: 'text-xs', dotPosition: '-bottom-0.5 -right-0.5' },
    md: { container: 'w-12 h-12', dot: 'w-3 h-3', text: 'text-sm', dotPosition: '-bottom-0.5 -right-0.5' },
    lg: { container: 'w-16 h-16', dot: 'w-4 h-4', text: 'text-lg', dotPosition: '-bottom-1 -right-1' },
    xl: { container: 'w-20 h-20', dot: 'w-5 h-5', text: 'text-xl', dotPosition: '-bottom-1 -right-1' },
    '2xl': { container: 'w-24 h-24', dot: 'w-6 h-6', text: 'text-2xl', dotPosition: '-bottom-1.5 -right-1.5' }
  };

  const sizeConfig = sizes[size] || sizes.md;

  // Shape configurations
  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-2xl'
  };

  const shapeClass = shapeClasses[shape] || shapeClasses.rounded;

  // Get initials from name
  const getInitials = (fullName) => {
    if (!fullName || fullName.trim() === '') return 'U';
    
    const nameParts = fullName.trim().split(' ').filter(Boolean);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Generate color based on name (consistent color for same name)
  const getColorFromName = (name) => {
    const colors = [
      { bg: 'bg-blue-500', text: 'text-white' },
      { bg: 'bg-purple-500', text: 'text-white' },
      { bg: 'bg-pink-500', text: 'text-white' },
      { bg: 'bg-green-500', text: 'text-white' },
      { bg: 'bg-yellow-500', text: 'text-white' },
      { bg: 'bg-red-500', text: 'text-white' },
      { bg: 'bg-indigo-500', text: 'text-white' },
      { bg: 'bg-teal-500', text: 'text-white' },
      { bg: 'bg-orange-500', text: 'text-white' },
      { bg: 'bg-cyan-500', text: 'text-white' }
    ];
    
    // Use name to generate consistent color
    const charSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };

  const initials = getInitials(name);
  const colorScheme = getColorFromName(name);

  // Check if image exists and is valid
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const hasValidImage = src && !imageError && src.trim() !== '';

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeConfig.container} ${shapeClass} border-2 border-gray-200 shadow-sm overflow-hidden flex items-center justify-center transition-transform`}>
        {hasValidImage ? (
          <>
            {/* Show placeholder while loading */}
            {!imageLoaded && (
              <div className={`w-full h-full ${colorScheme.bg} flex items-center justify-center`}>
                <span className={`${sizeConfig.text} font-bold ${colorScheme.text}`}>
                  {initials}
                </span>
              </div>
            )}
            {/* Actual image */}
            <img
              src={src}
              alt={name}
              className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(false);
              }}
            />
          </>
        ) : (
          /* Fallback to initials */
          <div className={`w-full h-full ${colorScheme.bg} flex items-center justify-center`}>
            <span className={`${sizeConfig.text} font-bold ${colorScheme.text}`}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Online status indicator */}
      {showOnlineDot && (
        <div className={`absolute ${sizeConfig.dotPosition} ${sizeConfig.dot} bg-green-500 ${shapeClass} border-2 border-white`}></div>
      )}
    </div>
  );
}
