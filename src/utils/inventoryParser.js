/**
 * Utility to parse batch inventory data from tab-delimited format
 * and convert it into structured inventory objects
 */

export function parseInventoryData(rawData) {
  const items = [];
  let currentId = 1;

  rawData.forEach((row) => {
    const item = {
      id: `INV${String(currentId).padStart(5, '0')}`,
      inventoryName: row['Inventory Name'] || '',
      inventoryCategory: row['Inventory Category'] || '',
      code: row['Code'] || '',
      batchMaintenance: row['Batch Maintenance'] || '',
      batchNo: row['Batch No.'] || '',
      batchExpiryDate: row['Batch Expiry Date'] || '',
      qohBatchWise: parseFloat(row['QOH - Batch Wise']) || 0,
      qohAllBatches: parseFloat(row['QOH - All Batches']) || 0,
      batchTaxName: row['Batch Tax Name'] || '',
      batchBuyingPrice: parseFloat(row['Batch Buying Price']) || 0,
      batchAfterTaxBuyingPrice: parseFloat(row['Batch (After Tax) Buying Price']) || 0,
      batchSellingPrice: parseFloat(row['Batch Selling Price']) || 0,
      batchAfterTaxSellingPrice: parseFloat(row['Batch (After Tax) Selling Price']) || 0,
      batchType: row['Batch Type'] || '',
      inventoryTax: row['Inventory Tax'] || '',
      inventoryBuyingPrice: parseFloat(row['Inventory Buying Price']) || 0,
      inventoryAfterTaxBuyingPrice: parseFloat(row['Inventory (After Tax) Buying Price']) || 0,
      inventorySellingPrice: parseFloat(row['Inventory Selling Price']) || 0,
      inventoryAfterTaxSellingPrice: parseFloat(row['Inventory (After Tax) Selling Price']) || 0,
      vendorName: row['Vendor Name'] || '',
      reorderLevel: parseFloat(row['ReOrder Level (Qty)']) || 0,
      targetLevel: parseFloat(row['Target Level (Qty)']) || 0,
      formulation: row['Formulation'] || '',
      packName: row['Pack Name'] || '',
      packSize: row['Pack Size'] || '',
      hasGenerics: row['Has Generics'] || 'No',
      hasProtocol: row['Has Protocol'] || 'No',
      commissionRate: row['Commission Rate'] || '0.00%',
      orgName: row['OrgName'] || 'Zennara Clinic - Jubliee Hills'
    };

    items.push(item);
    currentId++;
  });

  return items;
}

export function exportToJSON(items) {
  return JSON.stringify(items, null, 2);
}

export function getInventoryStats(items) {
  const stats = {
    totalItems: items.length,
    totalStock: items.reduce((sum, item) => sum + item.qohAllBatches, 0),
    totalValue: items.reduce((sum, item) => sum + (item.inventoryAfterTaxSellingPrice * item.qohAllBatches), 0),
    lowStockItems: items.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= 10).length,
    criticalItems: items.filter(item => item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel).length,
    outOfStockItems: items.filter(item => item.qohAllBatches === 0).length
  };

  return stats;
}

export function getInventoryByCategory(items) {
  const categories = {};

  items.forEach(item => {
    const category = item.inventoryCategory || 'Uncategorized';
    if (!categories[category]) {
      categories[category] = {
        name: category,
        count: 0,
        totalValue: 0,
        items: []
      };
    }
    categories[category].count++;
    categories[category].totalValue += (item.inventoryAfterTaxSellingPrice * item.qohAllBatches);
    categories[category].items.push(item);
  });

  return Object.values(categories);
}

export function getLowStockItems(items, threshold = 10) {
  return items.filter(item => 
    item.qohAllBatches > 0 && item.qohAllBatches <= threshold
  ).sort((a, b) => a.qohAllBatches - b.qohAllBatches);
}

export function getCriticalStockItems(items) {
  return items.filter(item => 
    item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel
  ).sort((a, b) => a.qohAllBatches - b.qohAllBatches);
}

export function getExpiringItems(items, monthsAhead = 3) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + monthsAhead);

  return items.filter(item => {
    if (!item.batchExpiryDate || item.qohBatchWise === 0) return false;
    
    // Parse expiry date (format: "MMM-YY" like "Feb-30")
    try {
      const [month, year] = item.batchExpiryDate.split('-');
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const expiryDate = new Date(2000 + parseInt(year), monthMap[month], 1);
      return expiryDate <= futureDate && expiryDate >= now;
    } catch (e) {
      return false;
    }
  });
}

export function getVendorSummary(items) {
  const vendors = {};

  items.forEach(item => {
    const vendorName = item.vendorName || 'No Vendor';
    if (!vendors[vendorName]) {
      vendors[vendorName] = {
        name: vendorName,
        itemCount: 0,
        totalValue: 0,
        items: []
      };
    }
    vendors[vendorName].itemCount++;
    vendors[vendorName].totalValue += (item.inventoryAfterTaxBuyingPrice * item.qohAllBatches);
    vendors[vendorName].items.push(item);
  });

  return Object.values(vendors).sort((a, b) => b.totalValue - a.totalValue);
}
