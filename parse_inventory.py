#!/usr/bin/env python3
"""
Parse tab-delimited inventory data and generate JavaScript file
Usage: python3 parse_inventory.py < your_data.txt
"""

import sys
import json

# Product image mapping
def get_product_image(product_name, category):
    name = product_name.lower()
    
    if 'serum' in name:
        return 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400'
    elif any(word in name for word in ['cream', 'moisturizer']):
        return 'https://images.unsplash.com/photo-1556228852-80c98b8e2e92?w=400'
    elif any(word in name for word in ['sunscreen', 'spf']):
        return 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'
    elif any(word in name for word in ['cleanser', 'wash', 'gel']):
        return 'https://images.unsplash.com/photo-1556228720-197a672e8a03?w=400'
    elif any(word in name for word in ['shampoo', 'conditioner']):
        return 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400'
    elif any(word in name for word in ['mask', 'peel']):
        return 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400'
    elif any(word in name for word in ['filler', 'botox']):
        return 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400'
    elif any(word in name for word in ['tablet', 'capsule', 'cap ']):
        return 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'
    elif any(word in name for word in ['oil', 'balm']):
        return 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'
    elif 'lotion' in name:
        return 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'
    elif 'consumable' in category.lower():
        return 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400'
    elif 'medicine' in category.lower():
        return 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'
    else:
        return 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400'

def parse_float(value):
    try:
        return float(value) if value else 0
    except:
        return 0

def escape_js_string(s):
    return s.replace("'", "\\'").replace("\n", "\\n").replace("\r", "")

def parse_inventory():
    lines = sys.stdin.read().strip().split('\n')
    
    if len(lines) < 2:
        print("Error: No data provided", file=sys.stderr)
        return []
    
    headers = lines[0].split('\t')
    items = []
    
    for i, line in enumerate(lines[1:], 1):
        values = line.split('\t')
        if len(values) < 10 or not values[0]:
            continue
        
        # Pad values if needed
        while len(values) < 29:
            values.append('')
        
        item = {
            'id': f'INV{i:05d}',
            'inventoryName': escape_js_string(values[0]),
            'inventoryCategory': values[1],
            'code': values[2],
            'batchMaintenance': values[3],
            'batchNo': values[4],
            'batchExpiryDate': values[5],
            'qohBatchWise': parse_float(values[6]),
            'qohAllBatches': parse_float(values[7]),
            'batchTaxName': values[8],
            'batchBuyingPrice': parse_float(values[9]),
            'batchAfterTaxBuyingPrice': parse_float(values[10]),
            'batchSellingPrice': parse_float(values[11]),
            'batchAfterTaxSellingPrice': parse_float(values[12]),
            'batchType': values[13],
            'inventoryTax': values[14],
            'inventoryBuyingPrice': parse_float(values[15]),
            'inventoryAfterTaxBuyingPrice': parse_float(values[16]),
            'inventorySellingPrice': parse_float(values[17]),
            'inventoryAfterTaxSellingPrice': parse_float(values[18]),
            'vendorName': escape_js_string(values[19]),
            'reorderLevel': parse_float(values[20]),
            'targetLevel': parse_float(values[21]),
            'formulation': values[22],
            'packSize': parse_float(values[24]) if values[24] else 1,
            'hasGenerics': values[25] or 'No',
            'hasProtocol': values[26] or 'No',
            'commissionRate': values[27] or '0.00%',
            'orgName': values[28] or 'Zennara Clinic - Jubliee Hills',
            'image': get_product_image(values[0], values[1])
        }
        items.append(item)
    
    return items

def generate_js_file(items):
    output = f"""// Complete Zennara Clinic Inventory - All {len(items)} Items
// Auto-generated from inventory data
// Each item includes product images

export const fullInventory = [
"""
    
    for i, item in enumerate(items):
        output += f"""  {{
    id: '{item['id']}',
    inventoryName: '{item['inventoryName']}',
    inventoryCategory: '{item['inventoryCategory']}',
    code: '{item['code']}',
    batchMaintenance: '{item['batchMaintenance']}',
    batchNo: '{item['batchNo']}',
    batchExpiryDate: '{item['batchExpiryDate']}',
    qohBatchWise: {item['qohBatchWise']},
    qohAllBatches: {item['qohAllBatches']},
    batchTaxName: '{item['batchTaxName']}',
    batchBuyingPrice: {item['batchBuyingPrice']},
    batchAfterTaxBuyingPrice: {item['batchAfterTaxBuyingPrice']},
    batchSellingPrice: {item['batchSellingPrice']},
    batchAfterTaxSellingPrice: {item['batchAfterTaxSellingPrice']},
    batchType: '{item['batchType']}',
    inventoryTax: '{item['inventoryTax']}',
    inventoryBuyingPrice: {item['inventoryBuyingPrice']},
    inventoryAfterTaxBuyingPrice: {item['inventoryAfterTaxBuyingPrice']},
    inventorySellingPrice: {item['inventorySellingPrice']},
    inventoryAfterTaxSellingPrice: {item['inventoryAfterTaxSellingPrice']},
    vendorName: '{item['vendorName']}',
    reorderLevel: {item['reorderLevel']},
    targetLevel: {item['targetLevel']},
    formulation: '{item['formulation']}',
    packSize: {item['packSize']},
    hasGenerics: '{item['hasGenerics']}',
    hasProtocol: '{item['hasProtocol']}',
    commissionRate: '{item['commissionRate']}',
    orgName: '{item['orgName']}',
    image: '{item['image']}'
  }}{',' if i < len(items) - 1 else ''}
"""
    
    # Calculate category counts
    retail_count = sum(1 for item in items if item['inventoryCategory'] == 'Retail products')
    consumables_count = sum(1 for item in items if item['inventoryCategory'] == 'Consumables')
    misc_count = sum(1 for item in items if 'Miscellaneous' in item['inventoryCategory'])
    medicine_count = sum(1 for item in items if item['inventoryCategory'] == 'Medicine')
    
    output += f"""];

export const inventoryCategories = [
  {{ id: 'all', name: 'All Items', count: {len(items)} }},
  {{ id: 'retail-products', name: 'Retail Products', count: {retail_count} }},
  {{ id: 'consumables', name: 'Consumables', count: {consumables_count} }},
  {{ id: 'miscellaneous', name: 'Miscellaneous Products', count: {misc_count} }},
  {{ id: 'medicine', name: 'Medicine', count: {medicine_count} }}
];

export const getInventoryStats = () => {{
  return {{
    totalItems: fullInventory.length,
    lowStockItems: fullInventory.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= 20).length,
    criticalItems: fullInventory.filter(item => item.qohAllBatches === 0 || (item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel)).length,
    totalValue: fullInventory.reduce((sum, item) => sum + (item.inventoryAfterTaxSellingPrice * item.qohAllBatches), 0),
    averageItemValue: fullInventory.length > 0 ? fullInventory.reduce((sum, item) => sum + item.inventoryAfterTaxSellingPrice, 0) / fullInventory.length : 0
  }};
}};

export const getInventoryById = (id) => fullInventory.find(item => item.id === id);
export const getInventoryByCategory = (category) => {{
  if (category === 'all') return fullInventory;
  return fullInventory.filter(item => item.inventoryCategory.toLowerCase().includes(category));
}};
export const getLowStockItems = (threshold = 20) => fullInventory.filter(item => item.qohAllBatches > 0 && item.qohAllBatches <= threshold);
export const getCriticalStockItems = () => fullInventory.filter(item => item.qohAllBatches === 0 || (item.reorderLevel > 0 && item.qohAllBatches <= item.reorderLevel));
"""
    
    return output

if __name__ == '__main__':
    print('📝 Parsing inventory data...', file=sys.stderr)
    items = parse_inventory()
    print(f'✅ Parsed {len(items)} items', file=sys.stderr)
    
    js_code = generate_js_file(items)
    print(js_code)
    
    print(f'\n✅ Success! Generated {len(items)} inventory items with images', file=sys.stderr)
    print('💡 Save output to: src/data/fullInventoryData.js', file=sys.stderr)
