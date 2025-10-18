import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Invoices() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE_URL}/api/admin/product-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter only delivered orders
        const deliveredOrders = response.data.data.filter(order => order.orderStatus === 'Delivered');
        setOrders(deliveredOrders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const generateInvoicePDF = async (order) => {
    try {
      setDownloading(order._id);
      
      const doc = new jsPDF();
      
      // Manually add autoTable to the doc instance
      doc.autoTable = function(options) {
        return autoTable(doc, options);
      };
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Header - Simple Black & White
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(20, 45, pageWidth - 20, 45);
      
      // Company Name
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('ZENNARA', 20, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Wellness & Beauty Solutions', 20, 30);
      
      // Invoice Title - Right Side
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pageWidth - 20, 20, { align: 'right' });
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`#${order.orderNumber}`, pageWidth - 20, 30, { align: 'right' });
      
      // Invoice Details Section
      let yPos = 55;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Invoice Date
      doc.setFont('helvetica', 'bold');
      doc.text('Invoice Date:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      doc.text(invoiceDate, 70, yPos);
      
      yPos += 8;
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Date:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const deliveryDate = new Date(order.deliveredAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      doc.text(deliveryDate, 70, yPos);
      
      // Customer & Shipping Info - Simple Boxes
      yPos += 15;
      
      // Bill To Box
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(20, yPos, 85, 45);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('BILL TO', 25, yPos + 10);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(order.userId?.fullName || 'N/A', 25, yPos + 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const email = doc.splitTextToSize(order.userId?.email || '', 75);
      doc.text(email, 25, yPos + 25);
      doc.text(order.userId?.phone || '', 25, yPos + 31);
      
      // Ship To Box
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.rect(115, yPos, 85, 45);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('SHIP TO', 120, yPos + 10);
      
      const address = order.shippingAddress;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const shipName = doc.splitTextToSize(address?.fullName || '', 75);
      doc.text(shipName, 120, yPos + 18);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const addr1 = doc.splitTextToSize(address?.addressLine1 || '', 75);
      doc.text(addr1, 120, yPos + 25);
      const cityState = doc.splitTextToSize(`${address?.city || ''}, ${address?.state || ''} ${address?.postalCode || ''}`, 75);
      doc.text(cityState, 120, yPos + 30);
      doc.text(address?.phone || '', 120, yPos + 36);
      
      // Items Table
      yPos += 55;
      const tableData = order.items?.map(item => [
        item.productName,
        item.quantity.toString(),
        `Rs. ${item.price?.toLocaleString('en-IN')}`,
        `Rs. ${item.subtotal?.toLocaleString('en-IN')}`
      ]) || [];
      
      doc.autoTable({
        startY: yPos,
        head: [['Item Description', 'Qty', 'Unit Price', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'left',
          cellPadding: 4,
          lineColor: [0, 0, 0],
          lineWidth: 0.5
        },
        bodyStyles: {
          fontSize: 9,
          cellPadding: 4,
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.1
        },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 40, halign: 'right' },
          3: { cellWidth: 40, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
      });
      
      // Totals Section - Simple
      yPos = doc.lastAutoTable.finalY + 15;
      const totalsX = pageWidth - 70;
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      doc.text('Subtotal:', totalsX, yPos);
      doc.text(`Rs. ${order.pricing?.subtotal?.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });
      
      if (order.pricing?.discount > 0) {
        yPos += 6;
        doc.text('Discount:', totalsX, yPos);
        doc.text(`-Rs. ${order.pricing.discount.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });
      }
      
      if (order.pricing?.deliveryFee > 0) {
        yPos += 6;
        doc.text('Delivery Fee:', totalsX, yPos);
        doc.text(`Rs. ${order.pricing.deliveryFee.toLocaleString('en-IN')}`, pageWidth - 20, yPos, { align: 'right' });
      }
      
      // Total - Bold
      yPos += 8;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(totalsX - 5, yPos - 3, pageWidth - 20, yPos - 3);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('TOTAL:', totalsX, yPos + 3);
      doc.text(`Rs. ${order.pricing?.total?.toLocaleString('en-IN')}`, pageWidth - 20, yPos + 3, { align: 'right' });
      
      doc.line(totalsX - 5, yPos + 6, pageWidth - 20, yPos + 6);
      
      // Footer - Simple
      const footerY = pageHeight - 30;
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100); 
      // Add page number
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page 1 of 1`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      
      // Save PDF
      doc.save(`Zennara-Invoice-${order.orderNumber}.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate invoice');
    } finally {
      setDownloading(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-400/20 to-emerald-400/20 blur-xl"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading invoices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-8">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-red-200/50 rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-800 text-center font-medium mb-4">{error}</p>
          <button 
            onClick={fetchDeliveredOrders}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50/30 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">Invoices</h1>
            </div>
            <p className="text-base text-gray-500 ml-15">Download invoices for delivered orders</p>
          </div>
          <button
            onClick={fetchDeliveredOrders}
            className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 text-gray-700 font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="group bg-gradient-to-br from-green-50 to-emerald-50/50 backdrop-blur-xl rounded-2xl shadow-sm border border-green-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-transparent rounded-full -mr-10 -mt-10"></div>
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2 relative z-10">Total Invoices</p>
          <p className="text-4xl font-bold text-green-900 relative z-10">{orders.length}</p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-green-400 to-emerald-300 rounded-full relative z-10"></div>
        </div>

        <div className="group bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">This Month</p>
          <p className="text-4xl font-bold text-gray-900">
            {orders.filter(o => {
              const orderDate = new Date(o.deliveredAt);
              const now = new Date();
              return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-gray-400 to-gray-200 rounded-full"></div>
        </div>

        <div className="group bg-gradient-to-br from-zennara-green via-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <p className="text-xs font-semibold text-white/90 uppercase tracking-wider mb-2 relative z-10">Total Revenue</p>
          <p className="text-4xl font-bold relative z-10">₹{orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0).toLocaleString('en-IN')}</p>
          <div className="mt-4 h-1 w-16 bg-white/40 rounded-full relative z-10"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/50 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-sm font-medium placeholder:text-gray-400 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Invoice #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Delivered Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-1">No invoices found</p>
                      <p className="text-sm text-gray-500">Delivered orders will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/30 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">#{order.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.userId?.fullName || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.userId?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{order.pricing?.total?.toLocaleString('en-IN') || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => generateInvoicePDF(order)}
                        disabled={downloading === order._id}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloading === order._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results count */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-green-600">{filteredOrders.length}</span> of <span className="font-semibold">{orders.length}</span> invoices
          </p>
        </div>
      )}
    </div>
  );
}
