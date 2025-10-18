/**
 * Script to generate complete inventory data from raw tab-delimited input
 * Run with: node scripts/generateInventory.js
 */

const fs = require('fs');
const path = require('path');

// Raw data from your spreadsheet (paste the complete data here)
const rawData = `YOUR_TAB_DELIMITED_DATA_HERE`;

// Product image mapping by category
const getProductImage = (productName, category) => {
  const name = productName.toLowerCase();
  
  // Map specific product types to appropriate images
  if (name.includes('serum')) return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400';
  if (name.includes('cream') || name.includes('moisturizer')) return 'https://images.unsplash.com/photo-1556228852-80c98b8e2e92?w=400';
  if (name.includes('sunscreen') || name.includes('spf')) return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400';
  if (name.includes('cleanser') || name.includes('wash') || name.includes('gel')) return 'https://images.unsplash.com/photo-1556228720-197a672e8a03?w=400';
  if (name.includes('shampoo') || name.includes('conditioner')) return 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400';
  if (name.includes('mask') || name.includes('peel')) return 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400';
  if (name.includes('filler') || name.includes('botox')) return 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400';
  if (name.includes('tablet') || name.includes('capsule') || name.includes('cap ')) return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400';
  if (name.includes('oil') || name.includes('balm')) return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400';
  if (name.includes('lotion')) return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400';
  
  // Category-based fallbacks
  if (category.toLowerCase().includes('consumable')) return 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400';
  if (category.toLowerCase().includes('medicine')) return 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400';
  
  // Default
  return 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400';
};

function parseInventoryData(rawText) {
  const lines = rawText.trim().split('\n');
  if (lines.length < 2) {
    console.error('No data to parse');
    return [];
  }

  const headers = lines[0].split('\t');
  const items = [];
  let idCounter = 1;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    if (values.length < 10 || !values[0]) continue;

    const item = {
      id: `INV${String(idCounter).padStart(5, '0')}`,
      inventoryName: values[0] || '',
      inventoryCategory: values[1] || '',
      code: values[2] || '',
      batchMaintenance: values[3] || '',
      batchNo: values[4] || '',
      batchExpiryDate: values[5] || '',
      qohBatchWise: parseFloat(values[6]) || 0,
      qohAllBatches: parseFloat(values[7]) || 0,
      batchTaxName: values[8] || '',
      batchBuyingPrice: parseFloat(values[9]) || 0,
      batchAfterTaxBuyingPrice: parseFloat(values[10]) || 0,
      batchSellingPrice: parseFloat(values[11]) || 0,
      batchAfterTaxSellingPrice: parseFloat(values[12]) || 0,
      batchType: values[13] || '',
      inventoryTax: values[14] || '',
      inventoryBuyingPrice: parseFloat(values[15]) || 0,
      inventoryAfterTaxBuyingPrice: parseFloat(values[16]) || 0,
      inventorySellingPrice: parseFloat(values[17]) || 0,
      inventoryAfterTaxSellingPrice: parseFloat(values[18]) || 0,
      vendorName: values[19] || '',
      reorderLevel: parseFloat(values[20]) || 0,
      targetLevel: parseFloat(values[21]) || 0,
      formulation: values[22] || '',
      packName: values[23] || '',
      packSize: values[24] || '',
      hasGenerics: values[25] || 'No',
      hasProtocol: values[26] || 'No',
      commissionRate: values[27] || '0.00%',
      orgName: values[28] || 'Zennara Clinic - Jubliee Hills',
      image: getProductImage(values[0], values[1])
    };

    items.push(item);
    idCounter++;
  }

  return items;
}

function generateJavaScriptFile(items) {
  let output = `// Complete Zennara Clinic Inventory - All ${items.length} Items
// Auto-generated on ${new Date().toISOString()}
// Each item includes product images from Unsplash

export const fullInventory = [\n`;

  items.forEach((item, index) => {
    output += `  {
    id: '${item.id}',
    inventoryName: '${item.inventoryName.replace(/'/g, "\\'")}',
    inventoryCategory: '${item.inventoryCategory}',
    code: '${item.code}',
    batchMaintenance: '${item.batchMaintenance}',
    batchNo: '${item.batchNo}',
    batchExpiryDate: '${item.batchExpiryDate}',
    qohBatchWise: ${item.qohBatchWise},
    qohAllBatches: ${item.qohAllBatches},
    batchTaxName: '${item.batchTaxName}',
    batchBuyingPrice: ${item.batchBuyingPrice},
    batchAfterTaxBuyingPrice: ${item.batchAfterTaxBuyingPrice},
    batchSellingPrice: ${item.batchSellingPrice},
    batchAfterTaxSellingPrice: ${item.batchAfterTaxSellingPrice},
    batchType: '${item.batchType}',
    inventoryTax: '${item.inventoryTax}',
    inventoryBuyingPrice: ${item.inventoryBuyingPrice},
    inventoryAfterTaxBuyingPrice: ${item.inventoryAfterTaxBuyingPrice},
    inventorySellingPrice: ${item.inventorySellingPrice},
    inventoryAfterTaxSellingPrice: ${item.inventoryAfterTaxSellingPrice},
    vendorName: '${item.vendorName.replace(/'/g, "\\'")}',
    reorderLevel: ${item.reorderLevel},
    targetLevel: ${item.targetLevel},
    formulation: '${item.formulation}',
    packSize: ${item.packSize || 1},
    hasGenerics: '${item.hasGenerics}',
    hasProtocol: '${item.hasProtocol}',
    commissionRate: '${item.commissionRate}',
    orgName: '${item.orgName}',
    image: '${item.image}'
  }${index < items.length - 1 ? ',' : ''}\n`;
  });

  output += `];

export const inventoryCategories = [
  { id: 'all', name: 'All Items', count: ${items.length} },
  { id: 'retail-products', name: 'Retail Products', count: ${items.filter(i => i.inventoryCategory === 'Retail products').length} },
  { id: 'consumables', name: 'Consumables', count: ${items.filter(i => i.inventoryCategory === 'Consumables').length} },
  { id: 'miscellaneous', name: 'Miscellaneous Products', count: ${items.filter(i => i.inventoryCategory.includes('Miscellaneous')).length} },
  { id: 'medicine', name: 'Medicine', count: ${items.filter(i => i.inventoryCategory === 'Medicine').length} }
];

export const getInventoryStats = () => {
  return {
    totalItems: fullInventory.length,
    lowStockItems: fullInventory.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= 20).length,
    criticalItems: fullInventory.filter(item => item.qohAllBatches === 0 || (item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel)).length,
    totalValue: fullInventory.reduce((sum, item) => sum + (item.inventoryAfterTaxSellingPrice * item.qohAllBatches), 0),
    averageItemValue: fullInventory.length > 0 ? fullInventory.reduce((sum, item) => sum + item.inventoryAfterTaxSellingPrice, 0) / fullInventory.length : 0
  };
};

export const getInventoryById = (id) => fullInventory.find(item => item.id === id);
export const getInventoryByCategory = (category) => {
  if (category === 'all') return fullInventory;
  return fullInventory.filter(item => item.inventoryCategory.toLowerCase().includes(category));
};
export const getLowStockItems = (threshold = 20) => fullInventory.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= threshold);
export const getCriticalStockItems = () => fullInventory.filter(item => item.qohAllBatches === 0 || (item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel));
`;

  return output;
}

// Main execution
console.log('🚀 Starting inventory data generation...');
console.log('📝 Note: Replace YOUR_TAB_DELIMITED_DATA_HERE with actual data');
console.log('');
console.log('✅ Script ready! To use:');
console.log('   1. Replace rawData variable with your tab-delimited data');
console.log('   2. Run: node scripts/generateInventory.js');
console.log('   3. Output will be generated in src/data/fullInventoryData.js');

// Uncomment these lines after adding your data:
// const items = parseInventoryData(rawData);
// const jsCode = generateJavaScriptFile(items);
// const outputPath = path.join(__dirname, '../src/data/fullInventoryData.js');
// fs.writeFileSync(outputPath, jsCode, 'utf8');
// console.log(`✅ Generated ${items.length} inventory items!`);
// console.log(`📁 Output: ${outputPath}`);
