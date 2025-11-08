import { useState, useMemo } from 'react';
import { useSalesRecords } from '../hooks/useDatabase';
import { Search, Download, Printer, Edit2, Trash2, FileText, FileSpreadsheet, FileDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV, printRecords } from '../utils/exportUtils';
import { SalesRecord } from '../types';

export default function SalesTable() {
  const { records, updateRecord, deleteRecord } = useSalesRecords();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SalesRecord>>({});
  const recordsPerPage = 10;

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch =
        record.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.machineType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.phoneNumber && record.phoneNumber.includes(searchTerm));

      const matchesDateFrom = !dateFrom || record.date >= dateFrom;
      const matchesDateTo = !dateTo || record.date <= dateTo;
      const matchesPayment = paymentFilter === 'all' || record.paymentType === paymentFilter;

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesPayment;
    });
  }, [records, searchTerm, dateFrom, dateTo, paymentFilter]);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleDelete = async (id: string, clientName: string) => {
    if (confirm(`Are you sure you want to delete the record for ${clientName}?`)) {
      try {
        await deleteRecord(id);
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  const startEdit = (record: SalesRecord) => {
    setEditingId(record.id);
    setEditData({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEdit = async (id: string) => {
    if (!editData.clientName || !editData.quantity || !editData.pricePerUnit) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const totalAmount = (editData.quantity || 0) * (editData.pricePerUnit || 0);
      await updateRecord(id, {
        ...editData,
        totalAmount
      });
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Failed to update record');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Records</h2>

        <div className="flex gap-2">
          <button
            onClick={() => exportToPDF(filteredRecords)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => exportToExcel(filteredRecords)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => exportToCSV(filteredRecords)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2"
            title="Export to CSV"
          >
            <FileDown className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => printRecords(filteredRecords)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition flex items-center gap-2"
            title="Print"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, machine, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From Date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To Date"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">All Payment Types</option>
          <option value="Cash">Cash</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="Credit">Credit</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  {editingId === record.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData.clientName}
                          onChange={(e) => setEditData({ ...editData, clientName: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData.phoneNumber || ''}
                          onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData.machineType}
                          onChange={(e) => setEditData({ ...editData, machineType: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={editData.quantity}
                          onChange={(e) => setEditData({ ...editData, quantity: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={editData.pricePerUnit}
                          onChange={(e) => setEditData({ ...editData, pricePerUnit: parseFloat(e.target.value) })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        ${((editData.quantity || 0) * (editData.pricePerUnit || 0)).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editData.paymentType}
                          onChange={(e) => setEditData({ ...editData, paymentType: e.target.value as any })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Mobile Money">Mobile Money</option>
                          <option value="Credit">Credit</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData.notes || ''}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(record.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Save"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-gray-600 hover:text-gray-800"
                            title="Cancel"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{record.clientName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.phoneNumber || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.machineType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.quantity.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">${record.pricePerUnit.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">${record.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          record.paymentType === 'Cash' ? 'bg-green-100 text-green-800' :
                          record.paymentType === 'Mobile Money' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {record.paymentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{record.notes || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(record)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(record.id, record.clientName)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700">
            Showing {((currentPage - 1) * recordsPerPage) + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
