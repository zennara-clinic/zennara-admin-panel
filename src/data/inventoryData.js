// Real Zennara Clinic Inventory Management Data
// Based on actual clinic inventory with batch management, tax details, and pricing

export const inventoryCategories = [
  { id: 'all', name: 'All Items', count: 0 },
  { id: 'retail-products', name: 'Retail Products', count: 0 },
  { id: 'consumables', name: 'Consumables', count: 0 },
  { id: 'miscellaneous', name: 'Miscellaneous Products', count: 0 },
  { id: 'medicine', name: 'Medicine', count: 0 }
];

// Sample inventory items based on actual clinic data
export const inventoryItems = [
  {
    id: 'INV001',
    inventoryName: 'Acglicolic Liposomal Serum 30Ml',
    inventoryCategory: 'Retail products',
    code: '',
    batchMaintenance: 'Batchable',
    batchNo: '25048402',
    batchExpiryDate: 'Feb-30',
    qohBatchWise: 8,
    qohAllBatches: 8,
    batchTaxName: 'GST-18%',
    batchBuyingPrice: 1518.64,
    batchAfterTaxBuyingPrice: 1791.995,
    batchSellingPrice: 2372.88,
    batchAfterTaxSellingPrice: 2799.998,
    batchType: 'ByExpiry',
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 1518.64,
    inventoryAfterTaxBuyingPrice: 1791.995,
    inventorySellingPrice: 2372.881,
    inventoryAfterTaxSellingPrice: 2800,
    vendorName: 'Super Drug Company',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'Serum',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    orgName: 'Zennara Clinic - Jubliee Hills'
  },
  {
    id: 'INV002',
    inventoryName: 'Ahaglow Face Wash Gel',
    inventoryCategory: 'Retail products',
    code: '',
    batchMaintenance: 'Batchable',
    batchNo: 'UFT9M068',
    batchExpiryDate: 'Mar-27',
    qohBatchWise: 10,
    qohAllBatches: 10,
    batchTaxName: 'GST-18%',
    batchBuyingPrice: 383.05,
    batchAfterTaxBuyingPrice: 451.999,
    batchSellingPrice: 478.81,
    batchAfterTaxSellingPrice: 564.996,
    batchType: 'FIFO',
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 383.05,
    inventoryAfterTaxBuyingPrice: 451.999,
    inventorySellingPrice: 478.814,
    inventoryAfterTaxSellingPrice: 565.001,
    vendorName: 'Venkata sai Agencies Drugs Private Limited',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'face wash',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    orgName: 'Zennara Clinic - Jubliee Hills'
  },
  {
    id: 'INV003',
    inventoryName: 'Active 4 Skin Solution 237Ml',
    inventoryCategory: 'Consumables',
    code: '',
    batchMaintenance: 'Non Batchable',
    batchNo: '',
    batchExpiryDate: '',
    qohBatchWise: 0,
    qohAllBatches: 0,
    batchTaxName: '',
    batchBuyingPrice: 0,
    batchAfterTaxBuyingPrice: 0,
    batchSellingPrice: 0,
    batchAfterTaxSellingPrice: 0,
    batchType: 'FIFO',
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 25,
    inventoryAfterTaxBuyingPrice: 25,
    inventorySellingPrice: 25,
    inventoryAfterTaxSellingPrice: 25,
    vendorName: 'Spectra Medical',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'Hydrafacial Consumable',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    orgName: 'Zennara Clinic - Jubliee Hills'
  },
  {
    id: 'INV004',
    inventoryName: 'Advanced Balancing Day Cream',
    inventoryCategory: 'Retail products',
    code: '',
    batchMaintenance: 'Batchable',
    batchNo: 'IBC2501',
    batchExpiryDate: 'May-28',
    qohBatchWise: 9,
    qohAllBatches: 9,
    batchTaxName: 'GST-18%',
    batchBuyingPrice: 2058.114,
    batchAfterTaxBuyingPrice: 2428.575,
    batchSellingPrice: 3389.83,
    batchAfterTaxSellingPrice: 3999.999,
    batchType: 'FIFO',
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 2058.114,
    inventoryAfterTaxBuyingPrice: 2428.575,
    inventorySellingPrice: 3389.831,
    inventoryAfterTaxSellingPrice: 4000.001,
    vendorName: 'EROTAS ASSOCIATES',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'Cream',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    orgName: 'Zennara Clinic - Jubliee Hills'
  },
  {
    id: 'INV005',
    inventoryName: 'Age Element Brightening Booster',
    inventoryCategory: 'Consumables',
    code: '',
    batchMaintenance: 'Batchable',
    batchNo: '13912',
    batchExpiryDate: 'Apr-29',
    qohBatchWise: 1,
    qohAllBatches: 1,
    batchTaxName: 'GST-18%',
    batchBuyingPrice: 6991.52,
    batchAfterTaxBuyingPrice: 8249.994,
    batchSellingPrice: 6991.52,
    batchAfterTaxSellingPrice: 8249.994,
    batchType: 'FIFO',
    inventoryTax: 'GST-18%',
    inventoryBuyingPrice: 6991.52,
    inventoryAfterTaxBuyingPrice: 8249.994,
    inventorySellingPrice: 6991.52,
    inventoryAfterTaxSellingPrice: 8249.994,
    vendorName: 'Spectra Medical',
    reorderLevel: 0,
    targetLevel: 0,
    formulation: 'Facial Treatment',
    packName: '',
    packSize: 1,
    hasGenerics: 'No',
    hasProtocol: 'No',
    commissionRate: '0.00%',
    orgName: 'Zennara Clinic - Jubliee Hills'
  }
];

// Vendors list
export const vendors = [
  { id: 'VEN001', name: 'Super Drug Company', contact: '+91 9876543210', rating: 4.5 },
  { id: 'VEN002', name: 'Venkata sai Agencies Drugs Private Limited', contact: '+91 9876543211', rating: 4.3 },
  { id: 'VEN003', name: 'Spectra Medical', contact: '+91 9876543212', rating: 4.7 },
  { id: 'VEN004', name: 'EROTAS ASSOCIATES', contact: '+91 9876543213', rating: 4.6 },
  { id: 'VEN005', name: 'Blue Star Agencies', contact: '+91 9876543214', rating: 4.4 }
];

// Helper functions
export const getInventoryById = (id) => {
  return inventoryItems.find(item => item.id === id);
};

export const getInventoryByCategory = (category) => {
  if (category === 'all') return inventoryItems;
  return inventoryItems.filter(item => item.inventoryCategory.toLowerCase().includes(category));
};

export const getLowStockItems = (threshold = 10) => {
  return inventoryItems.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= threshold);
};

export const getCriticalStockItems = () => {
  return inventoryItems.filter(item => item.qohAllBatches === 0 || (item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel));
};

export const getExpiringSoonItems = () => {
  // Items expiring in next 3 months
  return inventoryItems.filter(item => {
    if (!item.batchExpiryDate) return false;
    // Simple check - you can enhance this with actual date comparison
    return item.batchExpiryDate && item.qohBatchWise > 0;
  });
};

export const inventoryStats = {
  totalItems: inventoryItems.length,
  lowStockItems: getLowStockItems().length,
  criticalItems: getCriticalStockItems().length,
  totalValue: inventoryItems.reduce((sum, item) => sum + (item.inventoryAfterTaxSellingPrice * item.qohAllBatches), 0),
  averageItemValue: inventoryItems.length > 0 
    ? inventoryItems.reduce((sum, item) => sum + item.inventoryAfterTaxSellingPrice, 0) / inventoryItems.length 
    : 0
};
