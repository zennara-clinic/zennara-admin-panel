// Patient Orders Data - Orders placed from mobile app

export const orderStatuses = [
  { id: 'pending', name: 'Pending', color: 'yellow', icon: '' },
  { id: 'confirmed', name: 'Confirmed', color: 'blue', icon: '' },
  { id: 'processing', name: 'Processing', color: 'purple', icon: '' },
  { id: 'packed', name: 'Packed', color: 'indigo', icon: '' },
  { id: 'shipped', name: 'Shipped', color: 'orange', icon: '' },
  { id: 'out-for-delivery', name: 'Out for Delivery', color: 'cyan', icon: '' },
  { id: 'delivered', name: 'Delivered', color: 'green', icon: '' },
  { id: 'cancelled', name: 'Cancelled', color: 'red', icon: '' }
];

export const patientOrders = [
  {
    id: 'ORD2025001',
    orderNumber: '#ZEN1001',
    patient: {
      id: 'PAT000021',
      name: 'Khushnoor',
      phone: '9014325546',
      email: 'thekhushnoor@gmail.com',
      image: 'https://i.pravatar.cc/150?img=12',
      memberType: 'Premium Zen Member'
    },
    orderDate: 'Oct 15, 2025 2:30 PM',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    items: [
      { productId: 'PRD001', name: 'Hyaluronic Acid Serum', quantity: 2, price: 699, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200' },
      { productId: 'PRD006', name: 'Sunscreen SPF 50+', quantity: 1, price: 599, image: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=200' }
    ],
    subtotal: 1997,
    discount: 200,
    deliveryCharges: 0,
    tax: 180,
    total: 1977,
    deliveryAddress: {
      line1: 'Flat 401, Sapphire Residency',
      line2: 'Road No 36, Jubilee Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      phone: '9014325546'
    },
    trackingNumber: 'ZEN1234567890',
    estimatedDelivery: 'Oct 18, 2025',
    statusHistory: [
      { status: 'pending', timestamp: 'Oct 15, 2:30 PM', note: 'Order placed' },
      { status: 'confirmed', timestamp: 'Oct 15, 2:45 PM', note: 'Order confirmed by admin' }
    ],
    notes: 'Please deliver between 10 AM - 6 PM',
    orderedFrom: 'Mobile App'
  },
  {
    id: 'ORD2025002',
    orderNumber: '#ZEN1002',
    patient: {
      id: 'PAT000001',
      name: 'Priya Sharma',
      phone: '+91 9876543211',
      email: 'priya.sharma@email.com',
      image: 'https://i.pravatar.cc/150?img=47',
      memberType: 'Regular Member'
    },
    orderDate: 'Oct 15, 2025 11:20 AM',
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    items: [
      { productId: 'PRD004', name: 'Collagen Boost Supplement', quantity: 1, price: 1899, image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=200' }
    ],
    subtotal: 1899,
    discount: 0,
    deliveryCharges: 50,
    tax: 171,
    total: 2120,
    deliveryAddress: {
      line1: 'H.No 12-45/3',
      line2: 'Kondapur, KPHB',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500084',
      phone: '+91 9876543211'
    },
    trackingNumber: 'ZEN1234567891',
    estimatedDelivery: 'Oct 16, 2025',
    statusHistory: [
      { status: 'pending', timestamp: 'Oct 15, 11:20 AM', note: 'Order placed' },
      { status: 'confirmed', timestamp: 'Oct 15, 11:35 AM', note: 'Order confirmed' },
      { status: 'processing', timestamp: 'Oct 15, 2:00 PM', note: 'Processing started' },
      { status: 'packed', timestamp: 'Oct 15, 4:30 PM', note: 'Order packed' },
      { status: 'shipped', timestamp: 'Oct 15, 6:00 PM', note: 'Shipped via Blue Dart' }
    ],
    notes: '',
    orderedFrom: 'Mobile App'
  },
  {
    id: 'ORD2025003',
    orderNumber: '#ZEN1003',
    patient: {
      id: 'PAT000005',
      name: 'Amit Patel',
      phone: '+91 9876543212',
      email: 'amit.patel@email.com',
      image: 'https://i.pravatar.cc/150?img=33',
      memberType: 'Premium Zen Member'
    },
    orderDate: 'Oct 16, 2025 9:15 AM',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'COD',
    items: [
      { productId: 'PRD002', name: 'Vitamin C Face Wash', quantity: 1, price: 449, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200' },
      { productId: 'PRD003', name: 'Retinol Night Cream', quantity: 1, price: 1299, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200' }
    ],
    subtotal: 1748,
    discount: 175,
    deliveryCharges: 0,
    tax: 141,
    total: 1714,
    deliveryAddress: {
      line1: 'Villa 23, Green Valley',
      line2: 'Financial District',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      phone: '+91 9876543212'
    },
    trackingNumber: null,
    estimatedDelivery: 'Oct 19, 2025',
    statusHistory: [
      { status: 'pending', timestamp: 'Oct 16, 9:15 AM', note: 'Order placed - COD' }
    ],
    notes: 'Call before delivery',
    orderedFrom: 'Mobile App'
  },
  {
    id: 'ORD2025004',
    orderNumber: '#ZEN1004',
    patient: {
      id: 'PAT000008',
      name: 'Sneha Reddy',
      phone: '+91 9876543213',
      email: 'sneha.reddy@email.com',
      image: 'https://i.pravatar.cc/150?img=45',
      memberType: 'VIP Member'
    },
    orderDate: 'Oct 14, 2025 5:40 PM',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    items: [
      { productId: 'PRD001', name: 'Hyaluronic Acid Serum', quantity: 3, price: 699, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200' },
      { productId: 'PRD005', name: 'Biotin Hair Growth Capsules', quantity: 2, price: 899, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200' }
    ],
    subtotal: 3895,
    discount: 390,
    deliveryCharges: 0,
    tax: 315,
    total: 3820,
    deliveryAddress: {
      line1: 'Apartment 5B, Skyline Towers',
      line2: 'Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      phone: '+91 9876543213'
    },
    trackingNumber: 'ZEN1234567892',
    estimatedDelivery: 'Oct 15, 2025',
    deliveredDate: 'Oct 15, 2025 3:20 PM',
    statusHistory: [
      { status: 'pending', timestamp: 'Oct 14, 5:40 PM', note: 'Order placed' },
      { status: 'confirmed', timestamp: 'Oct 14, 5:55 PM', note: 'Order confirmed' },
      { status: 'processing', timestamp: 'Oct 14, 7:00 PM', note: 'Processing started' },
      { status: 'packed', timestamp: 'Oct 15, 10:00 AM', note: 'Order packed' },
      { status: 'shipped', timestamp: 'Oct 15, 11:30 AM', note: 'Shipped' },
      { status: 'out-for-delivery', timestamp: 'Oct 15, 2:00 PM', note: 'Out for delivery' },
      { status: 'delivered', timestamp: 'Oct 15, 3:20 PM', note: 'Delivered successfully' }
    ],
    notes: '',
    orderedFrom: 'Mobile App',
    rating: 5,
    feedback: 'Great products! Fast delivery.'
  }
];

// Helper Functions
export const getOrderById = (id) => {
  return patientOrders.find(order => order.id === id);
};

export const getOrdersByStatus = (status) => {
  if (status === 'all') return patientOrders;
  return patientOrders.filter(order => order.status === status);
};

export const getOrdersByPatient = (patientId) => {
  return patientOrders.filter(order => order.patient.id === patientId);
};

export const getPendingOrders = () => {
  return patientOrders.filter(order => order.status === 'pending');
};

export const getStatusColor = (statusId) => {
  const status = orderStatuses.find(s => s.id === statusId);
  return status ? status.color : 'gray';
};

export const getNextStatus = (currentStatus) => {
  const statusFlow = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out-for-delivery', 'delivered'];
  const currentIndex = statusFlow.indexOf(currentStatus);
  if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
    return statusFlow[currentIndex + 1];
  }
  return null;
};

export const orderStats = {
  totalOrders: patientOrders.length,
  pendingOrders: patientOrders.filter(o => o.status === 'pending').length,
  confirmedOrders: patientOrders.filter(o => o.status === 'confirmed').length,
  shippedOrders: patientOrders.filter(o => o.status === 'shipped').length,
  deliveredOrders: patientOrders.filter(o => o.status === 'delivered').length,
  totalRevenue: patientOrders.reduce((sum, o) => sum + o.total, 0),
  averageOrderValue: patientOrders.length > 0 ? patientOrders.reduce((sum, o) => sum + o.total, 0) / patientOrders.length : 0
};
