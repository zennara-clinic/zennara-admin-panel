/**
 * Unified Icon Component
 * 
 * A wrapper component for Lucide React icons that provides:
 * - Consistent sizing
 * - Standardized colors
 * - Easy-to-use API
 * 
 * @example
 * import { Icon } from '@/design-system/components/Icon';
 * 
 * // Basic usage
 * <Icon name="Calendar" />
 * 
 * // With custom size
 * <Icon name="User" size="lg" />
 * 
 * // With custom color
 * <Icon name="Check" className="text-green-600" />
 */

import * as LucideIcons from 'lucide-react';

// Icon size mapping
const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
};

// Tailwind class equivalents for sizing
const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-12 h-12',
};

export const Icon = ({ 
  name, 
  size = 'md', 
  className = '',
  ...props 
}) => {
  const IconComponent = LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React`);
    return null;
  }
  
  // Get numeric size or use default
  const iconSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;
  
  // Combine size class with custom className
  const sizeClass = typeof size === 'string' ? sizeClasses[size] : '';
  const combinedClassName = `${sizeClass} ${className}`.trim();
  
  return (
    <IconComponent 
      size={iconSize}
      className={combinedClassName}
      {...props}
    />
  );
};

// Export commonly used icons for convenience
export {
  // Navigation
  LayoutDashboard,
  Calendar,
  Users,
  Heart,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
  
  // Actions
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  X,
  Check,
  
  // Status
  CheckCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader,
  Clock,
  
  // Arrows & Chevrons
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  
  // User & People
  User,
  UserCircle,
  UserPlus,
  UserCheck,
  UserCog,
  
  // Communication
  Mail,
  Phone,
  MessageCircle,
  Bell,
  
  // Location & Places
  MapPin,
  Building2,
  Home,
  
  // Finance
  IndianRupee,
  DollarSign,
  CreditCard,
  Receipt,
  
  // Media
  Image,
  Video,
  File,
  FileText,
  
  // E-commerce
  ShoppingBag,
  ShoppingCart,
  Tag,
  
  // Medical
  Stethoscope,
  Pill,
  
  // Misc
  Star,
  Crown,
  Lock,
  LogOut,
  Copy,
  Share2,
  ExternalLink,
  Printer,
  Cake,
  Zap,
  TrendingUp,
  TrendingDown,
  
} from 'lucide-react';

export default Icon;
