// Zennara Products & Inventory Management Data

export const productCategories = [
  { id: 'all', name: 'All Products', count: 0 },
  { id: 'retail-products', name: 'Retail Products', count: 0 },
  { id: 'consumables', name: 'Consumables', count: 0 },
  { id: 'miscellaneous', name: 'Miscellaneous Products', count: 0 },
  { id: 'medicine', name: 'Medicine', count: 0 }
];

export const products = [
  {
    id: 'PRD001',
    name: 'Acglicolic Liposomal Serum 30Ml',
    category: 'retail-products',
    code: '',
    batchMaintenance: 'Batchable',
    batches: [
      {
        batchNo: '25048402',
        expiryDate: 'Feb-30',
        qohBatch: 8,
        taxName: 'GST-18%',
        buyingPrice: 1518.64,
        buyingPriceAfterTax: 1791.995,
        sellingPrice: 2372.88,
        sellingPriceAfterTax: 2799.998,
        batchType: 'ByExpiry'
      },
      {
        batchNo: '24254401',
        expiryDate: 'Aug-29',
        qohBatch: 0,
        taxName: 'GST-18%',
        buyingPrice: 1518.64,
        buyingPriceAfterTax: 1791.995,
        sellingPrice: 2372.88,
        sellingPriceAfterTax: 2799.998,
        batchType: 'ByExpiry'
      }
    ],
    qohAllBatches: 8,
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 1518.64,
    inventoryBuyingPriceAfterTax: 1791.995,
    inventorySellingPrice: 2372.881,
    inventorySellingPriceAfterTax: 2800,
    vendor: 'Super Drug Company',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'Serum',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    organization: 'Zennara Clinic - Jubliee Hills'
  },
  {
    id: 'PRD002',
    name: 'Vitamin C Face Wash',
    brand: 'Zennara Skincare',
    category: 'skincare',
    description: 'Brightening face wash with 15% Vitamin C. Removes impurities and evens skin tone.',
    price: 449,
    originalPrice: 599,
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'],
    stock: 89,
    lowStockThreshold: 25,
    reorderPoint: 60,
    rating: 4.7,
    reviews: 92,
    tags: ['Brightening', 'Cleansing', 'Vitamin C'],
    featured: true,
    bestSeller: true,
    inStock: true,
    supplier: 'Zennara Labs Pvt Ltd',
    sku: 'ZEN-VIT-002',
    barcode: '8901234567891',
    weight: '100ml',
    expiryDate: '2026-10-15',
    batchNumber: 'B2024-VC-002'
  },
  {
    id: 'PRD003',
    name: 'Retinol Night Cream',
    brand: 'Zennara Skincare',
    category: 'skincare',
    description: 'Advanced anti-aging night cream with 0.5% retinol. Reduces wrinkles and improves texture.',
    price: 1299,
    originalPrice: 1599,
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'],
    stock: 45,
    lowStockThreshold: 15,
    reorderPoint: 40,
    rating: 4.9,
    reviews: 178,
    tags: ['Anti-Aging', 'Night Cream', 'Retinol'],
    featured: true,
    bestSeller: true,
    inStock: true,
    supplier: 'Zennara Labs Pvt Ltd',
    sku: 'ZEN-RET-003',
    barcode: '8901234567892',
    weight: '50g',
    expiryDate: '2026-08-20',
    batchNumber: 'B2024-RT-003'
  },
  {
    id: 'PRD004',
    name: 'Collagen Boost Supplement',
    brand: 'Zennara Wellness',
    category: 'supplements',
    description: 'Premium marine collagen with Vitamin C. Supports skin elasticity and joint health. 30 servings.',
    price: 1899,
    originalPrice: 2299,
    images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400'],
    stock: 124,
    lowStockThreshold: 30,
    reorderPoint: 70,
    rating: 4.8,
    reviews: 203,
    tags: ['Collagen', 'Supplement', 'Anti-Aging'],
    featured: true,
    bestSeller: true,
    inStock: true,
    supplier: 'NutriLabs India',
    sku: 'ZEN-COL-004',
    barcode: '8901234567893',
    weight: '300g',
    expiryDate: '2027-03-15',
    batchNumber: 'B2024-CL-004'
  },
  {
    id: 'PRD005',
    name: 'Biotin Hair Growth Capsules',
    brand: 'Zennara Wellness',
    category: 'supplements',
    description: '10,000 mcg Biotin with Keratin. Promotes hair growth and strengthens nails. 60 capsules.',
    price: 899,
    originalPrice: 1199,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    stock: 67,
    lowStockThreshold: 20,
    reorderPoint: 50,
    rating: 4.6,
    reviews: 156,
    tags: ['Biotin', 'Hair Growth', 'Supplement'],
    featured: false,
    bestSeller: true,
    inStock: true,
    supplier: 'NutriLabs India',
    sku: 'ZEN-BIO-005',
    barcode: '8901234567894',
    weight: '120g',
    expiryDate: '2027-01-30',
    batchNumber: 'B2024-BT-005'
  },
  {
    id: 'PRD006',
    name: 'Sunscreen SPF 50+ PA++++',
    brand: 'Zennara Skincare',
    category: 'skincare',
    description: 'Broad spectrum sunscreen with lightweight formula. Water resistant for 80 minutes.',
    price: 599,
    originalPrice: 799,
    images: ['https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400'],
    stock: 12,
    lowStockThreshold: 25,
    reorderPoint: 60,
    rating: 4.7,
    reviews: 187,
    tags: ['Sunscreen', 'SPF', 'Protection'],
    featured: true,
    bestSeller: true,
    inStock: true,
    lowStock: true,
    supplier: 'Zennara Labs Pvt Ltd',
    sku: 'ZEN-SUN-006',
    barcode: '8901234567895',
    weight: '50ml',
    expiryDate: '2026-11-25',
    batchNumber: 'B2024-SP-006'
  },
  {
    id: 'PRD007',
    name: 'First Aid Emergency Kit',
    brand: 'Zennara MedCare',
    category: 'first-aid',
    description: 'Complete first aid kit with bandages, antiseptic, gauze, and emergency supplies. 42 pieces.',
    price: 799,
    originalPrice: 999,
    images: ['https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400'],
    stock: 56,
    lowStockThreshold: 15,
    reorderPoint: 35,
    rating: 4.8,
    reviews: 89,
    tags: ['First Aid', 'Emergency', 'Medical'],
    featured: false,
    bestSeller: false,
    inStock: true,
    supplier: 'MedSupply India',
    sku: 'ZEN-AID-007',
    barcode: '8901234567896',
    weight: '500g',
    expiryDate: '2028-12-31',
    batchNumber: 'B2024-FA-007'
  },
  {
    id: 'PRD008',
    name: 'Pain Relief Gel',
    brand: 'Zennara MedCare',
    category: 'pain-relief',
    description: 'Fast-acting topical gel for muscle and joint pain. Contains diclofenac 1%.',
    price: 349,
    originalPrice: 449,
    images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    stock: 198,
    lowStockThreshold: 40,
    reorderPoint: 100,
    rating: 4.6,
    reviews: 234,
    tags: ['Pain Relief', 'Topical', 'Muscle Pain'],
    featured: false,
    bestSeller: true,
    inStock: true,
    supplier: 'MedSupply India',
    sku: 'ZEN-PRG-008',
    barcode: '8901234567897',
    weight: '30g',
    expiryDate: '2026-09-10',
    batchNumber: 'B2024-PR-008'
  },
  {
    id: 'PRD009',
    name: 'Hand Sanitizer 500ml',
    brand: 'Zennara Personal Care',
    category: 'personal-care',
    description: '70% alcohol-based hand sanitizer with moisturizers. Kills 99.9% germs.',
    price: 199,
    originalPrice: 249,
    images: ['https://images.unsplash.com/photo-1584819150-5d4682e8b2fd?w=400'],
    stock: 5,
    lowStockThreshold: 50,
    reorderPoint: 150,
    rating: 4.5,
    reviews: 312,
    tags: ['Sanitizer', 'Hygiene', 'Personal Care'],
    featured: false,
    bestSeller: true,
    inStock: true,
    lowStock: true,
    criticalStock: true,
    supplier: 'HygieneMax Solutions',
    sku: 'ZEN-SAN-009',
    barcode: '8901234567898',
    weight: '500ml',
    expiryDate: '2026-06-30',
    batchNumber: 'B2024-HS-009'
  }
];

export const suppliers = [
  {
    id: 'SUP001',
    name: 'Zennara Labs Pvt Ltd',
    contact: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh@zennaralabs.com',
    address: 'Plot 45, Pharmaceutical Park, Hyderabad - 500032',
    products: ['PRD001', 'PRD002', 'PRD003', 'PRD006'],
    rating: 4.9,
    deliveryTime: '3-5 days'
  },
  {
    id: 'SUP002',
    name: 'NutriLabs India',
    contact: 'Priya Sharma',
    phone: '+91 9876543211',
    email: 'priya@nutrilabs.in',
    address: 'Building 12, Industrial Estate, Mumbai - 400001',
    products: ['PRD004', 'PRD005'],
    rating: 4.7,
    deliveryTime: '5-7 days'
  },
  {
    id: 'SUP003',
    name: 'MedSupply India',
    contact: 'Amit Patel',
    phone: '+91 9876543212',
    email: 'amit@medsupply.in',
    address: 'Sector 8, Medical Hub, Pune - 411001',
    products: ['PRD007', 'PRD008'],
    rating: 4.8,
    deliveryTime: '2-4 days'
  },
  {
    id: 'SUP004',
    name: 'HygieneMax Solutions',
    contact: 'Sneha Reddy',
    phone: '+91 9876543213',
    email: 'sneha@hygienemax.com',
    address: 'Zone 3, Trading Center, Bangalore - 560001',
    products: ['PRD009'],
    rating: 4.6,
    deliveryTime: '4-6 days'
  }
];

export const purchaseOrders = [
  {
    id: 'PO2025001',
    supplier: 'Zennara Labs Pvt Ltd',
    orderDate: 'Oct 10, 2025',
    expectedDelivery: 'Oct 15, 2025',
    status: 'Pending',
    items: [
      { productId: 'PRD001', productName: 'Hyaluronic Acid Serum', quantity: 200, unitPrice: 350, total: 70000 },
      { productId: 'PRD006', productName: 'Sunscreen SPF 50+', quantity: 150, unitPrice: 300, total: 45000 }
    ],
    totalAmount: 115000,
    paymentStatus: 'Pending'
  },
  {
    id: 'PO2025002',
    supplier: 'HygieneMax Solutions',
    orderDate: 'Oct 12, 2025',
    expectedDelivery: 'Oct 18, 2025',
    status: 'Approved',
    items: [
      { productId: 'PRD009', productName: 'Hand Sanitizer 500ml', quantity: 500, unitPrice: 100, total: 50000 }
    ],
    totalAmount: 50000,
    paymentStatus: 'Paid'
  }
];

// Helper Functions
export const getProductById = (id) => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category) => {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
};

export const getLowStockProducts = () => {
  return products.filter(p => p.stock <= p.lowStockThreshold);
};

export const getCriticalStockProducts = () => {
  return products.filter(p => p.stock <= (p.lowStockThreshold / 2));
};

export const getSupplierById = (id) => {
  return suppliers.find(s => s.id === id);
};

export const getSupplierByName = (name) => {
  return suppliers.find(s => s.name === name);
};

export const productStats = {
  totalProducts: products.length,
  totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  lowStockCount: getLowStockProducts().length,
  criticalStockCount: getCriticalStockProducts().length,
  totalStock: products.reduce((sum, p) => sum + p.stock, 0),
  bestSellers: products.filter(p => p.bestSeller).length
};
