import { useState } from 'react';
import { UploadIcon, CheckCircleIcon, ExclamationIcon, XIcon } from './Icons';

export default function BatchImportInventory({ onImportComplete, onClose }) {
  const [file, setFile] = useState(null);
  const [importData, setImportData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [error, setError] = useState(null);

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === '\t' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setError('File must contain header and data rows');
          return;
        }

        const headers = parseCSVLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length > 1 && values[0]) {
            const item = {};
            headers.forEach((header, index) => {
              item[header] = values[index] || '';
            });
            data.push(item);
          }
        }

        setImportData(data);
      } catch (err) {
        setError('Error parsing file: ' + err.message);
      }
    };

    reader.readAsText(uploadedFile);
  };

  const processImport = () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const results = {
        total: importData.length,
        successful: importData.length,
        failed: 0,
        items: importData.map(item => ({
          name: item['Inventory Name'],
          status: 'success'
        }))
      };
      
      setImportResults(results);
      setIsProcessing(false);
    }, 2000);
  };

  const handleComplete = () => {
    if (onImportComplete) {
      onImportComplete(importData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-10 py-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Batch Import Inventory</h2>
            <p className="text-gray-500 text-base mt-1">Upload tab-delimited file with inventory data</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <XIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!importResults ? (
            <>
              {/* Upload Section */}
              <div className="mb-8">
                <label className="block mb-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-zennara-green transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".txt,.tsv,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-900 font-semibold mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Tab-delimited text file with inventory data
                    </p>
                  </div>
                </label>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                    <ExclamationIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {importData.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Data Preview ({importData.length} items)
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-2 px-3 font-bold text-gray-700">Item Name</th>
                          <th className="text-left py-2 px-3 font-bold text-gray-700">Category</th>
                          <th className="text-left py-2 px-3 font-bold text-gray-700">Batch No</th>
                          <th className="text-left py-2 px-3 font-bold text-gray-700">QOH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importData.slice(0, 10).map((item, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-2 px-3 text-gray-900">{item['Inventory Name']}</td>
                            <td className="py-2 px-3 text-gray-600">{item['Inventory Category']}</td>
                            <td className="py-2 px-3 text-gray-600">{item['Batch No.']}</td>
                            <td className="py-2 px-3 text-gray-600">{item['QOH - All Batches']}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {importData.length > 10 && (
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Showing 10 of {importData.length} items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              {importData.length > 0 && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processImport}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-zennara-green to-green-600 text-white rounded-xl font-semibold hover:shadow-md transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Import Data'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Results */}
              <div className="text-center mb-8">
                <CheckCircleIcon className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h3>
                <p className="text-gray-600">
                  Successfully imported {importResults.successful} of {importResults.total} items
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-green-600">{importResults.total}</p>
                    <p className="text-sm text-gray-600 mt-1">Total Items</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-600">{importResults.successful}</p>
                    <p className="text-sm text-gray-600 mt-1">Successful</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-400">{importResults.failed}</p>
                    <p className="text-sm text-gray-600 mt-1">Failed</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-zennara-green to-green-600 text-white rounded-xl font-semibold hover:shadow-md transition-all"
                >
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
