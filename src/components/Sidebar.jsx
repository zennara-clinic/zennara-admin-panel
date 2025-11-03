import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Heart,
  Package,
  MapPin,
  Mail,
  Star,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Upload,
  ClipboardList
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Bookings',
    icon: Calendar,
    path: '/bookings',
    submenu: [
      { title: 'All Bookings', path: '/bookings' },
      { title: 'Pending Confirmations', path: '/bookings/pending' },
      { title: "Today's Schedule", path: '/bookings/today' },
    ],
  },
  {
    title: 'Patients',
    icon: Users,
    path: '/patients',
    submenu: [
      { title: 'All Patients', path: '/patients/all' },
      { title: 'Patient Forms', path: '/patients/forms' },
      { title: 'Medical Records', path: '/patients/records' },
    ],
  },
  {
    title: 'Consultations',
    icon: Heart,
    path: '/consultations',
    submenu: [
      { title: 'Services List', path: '/consultations/services' },
      { title: 'Categories', path: '/consultations/categories' },
      { title: 'Packages', path: '/consultations/packages' },
      { title: 'Assign Packages', path: '/consultations/assign-packages' },
    ],
  },
  {
    title: 'Media',
    icon: Upload,
    path: '/media',
    submenu: [
      { title: 'Uploads', path: '/media/uploads' },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    path: '/products',
        submenu: [
      { title: 'All Products', path: '/products' },
      { title: 'Brands', path: '/brands' },
      { title: 'Formulations', path: '/formulations' },
      { title: 'Coupons', path: '/coupons' },
    ],
  },
  {
    title: 'Orders',
    icon: ClipboardList,
    path: '/orders',
    submenu: [
      { title: 'All Orders', path: '/orders' },
      { title: 'Pending Orders', path: '/orders/pending' },
      { title: 'Invoices', path: '/invoices' },
      { title: 'Cancelled', path: '/orders/cancelled' },
      { title: 'Returned', path: '/orders/returned' },
    ],
  },
  {
    title: 'Inventory',
    icon: Package,
    path: '/inventory',
    submenu: [
      { title: 'All Inventory', path: '/inventory' },
      { title: 'Vendors', path: '/inventory/vendors' },
    ],
  },
  {
    title: 'Locations',
    icon: MapPin,
    path: '/locations',
    submenu: [
      { title: 'Clinic Branches', path: '/locations/branches' },
    ],
  },
  {
    title: 'Communications',
    icon: Mail,
    path: '/communications',
  },
  {
    title: 'Reviews',
    icon: Star,
    path: '/reviews',
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    submenu: [
      { title: 'Financial & Revenue', path: '/analytics/financial' },
      { title: 'Patient & Customer', path: '/analytics/patients' },
      { title: 'Appointment & Booking', path: '/analytics/appointments' },
      { title: 'Services', path: '/analytics/services' },
      { title: 'Inventory & Product', path: '/analytics/inventory' },
      { title: 'Orders & Sales', path: '/analytics/orders' },
      { title: 'Package & Membership', path: '/analytics/packages' },
      { title: 'Payment & Invoicing', path: '/analytics/payments' },
      { title: 'App & Digital Engagement', path: '/analytics/engagement' },
      { title: 'Comparison & Trend', path: '/analytics/trends' },
      { title: 'Goals & Targets', path: '/analytics/goals' },
      { title: 'Location-Based Insights', path: '/analytics/locations' },
      { title: 'Performance Rankings', path: '/analytics/rankings' },
      { title: 'Quick Stats Summary', path: '/analytics/summary' },
    ],
  },
];

function NavItem({ item }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = item.icon;
  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

  const handleClick = (e) => {
    if (item.submenu) {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="mb-1">
      <Link
        to={item.path}
        onClick={handleClick}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 group ${
          isActive
            ? 'bg-gradient-to-r from-zennara-green to-emerald-600 text-white shadow-md shadow-zennara-green/20'
            : 'hover:bg-gray-50 text-gray-700'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-white'
          }`}>
            <IconComponent size={16} className={`${isActive ? 'text-white' : 'text-gray-600 group-hover:text-zennara-green'}`} />
          </div>
          <span className="font-semibold text-sm">{item.title}</span>
        </div>
        {item.submenu && (
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-white' : 'text-gray-400'}`}
          />
        )}
      </Link>

      {/* Submenu */}
      {item.submenu && isOpen && (
        <div className="mt-1.5 ml-3 space-y-1 animate-slide-in">
          <div className="border-l-2 border-gray-200 pl-3 space-y-0.5">
            {item.submenu.map((subitem, idx) => (
              <Link
                key={subitem.path}
                to={subitem.path}
                className="group/sub flex items-center space-x-2 px-2 py-1.5 text-xs text-gray-600 hover:text-white hover:bg-zennara-green rounded-md transition-all duration-200 font-medium"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded bg-gray-100 group-hover/sub:bg-white/20 text-[10px] font-bold text-gray-400 group-hover/sub:text-white transition-all">
                  {idx + 1}
                </div>
                <span className="flex-1 text-xs">{subitem.title}</span>
                <ArrowRight size={12} className="opacity-0 group-hover/sub:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-72 fixed top-0 left-0 bg-white border-r border-gray-200 overflow-y-auto z-40 h-screen">
      {/* Navigation */}
      <nav className="space-y-1 py-4 px-4">
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            item={item}
          />
        ))}
      </nav>
    </aside>
  );
}
