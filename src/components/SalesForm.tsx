import { useState, FormEvent, useEffect } from 'react';
import { Plus, Calculator } from 'lucide-react';
import { useSalesRecords, useMachineTypes } from '../hooks/useDatabase';
import { SalesRecord } from '../types';

export default function SalesForm() {
  const { addRecord } = useSalesRecords();
  const { machineTypes } = useMachineTypes();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    phoneNumber: '',
    machineType: '',
    quantity: '',
    pricePerUnit: '',
    paymentType: 'Cash' as 'Cash' | 'Mobile Money' | 'Credit',
    notes: ''
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    setTotalAmount(quantity * price);
  }, [formData.quantity, formData.pricePerUnit]);

  useEffect(() => {
    if (formData.machineType && machineTypes.length > 0) {
      const selectedMachine = machineTypes.find(m => m.name === formData.machineType);
      if (selectedMachine) {
        setFormData(prev => ({
          ...prev,
          pricePerUnit: selectedMachine.basePrice.toString()
        }));
      }
    }
  }, [formData.machineType, machineTypes]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const record: Omit<SalesRecord, 'id' | 'createdAt'> = {
        date: formData.date,
        clientName: formData.clientName,
        phoneNumber: formData.phoneNumber || undefined,
        machineType: formData.machineType,
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalAmount: totalAmount,
        paymentType: formData.paymentType,
        notes: formData.notes || undefined
      };

      await addRecord(record);

      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        phoneNumber: '',
        machineType: '',
        quantity: '',
        pricePerUnit: '',
        paymentType: 'Cash',
        notes: ''
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Failed to add record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Plus className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">New Sales Entry</h2>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          Sales record added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Name *
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Machine Type *
          </label>
          <select
            value={formData.machineType}
            onChange={(e) => setFormData({ ...formData, machineType: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Select machine type</option>
            {machineTypes.map((machine) => (
              <option key={machine.id} value={machine.name}>
                {machine.name} ({machine.unit})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity/Weight *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Unit *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount
          </label>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
            <Calculator className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-lg text-gray-800">
              ${totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Type *
          </label>
          <select
            value={formData.paymentType}
            onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as any })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="Cash">Cash</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="Credit">Credit</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <input
            type="text"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Optional remarks"
          />
        </div>

        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            {loading ? 'Adding...' : 'Add Sales Record'}
          </button>
        </div>
      </form>
    </div>
  );
}
