import { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useMachineTypes } from '../hooks/useDatabase';
import { MachineType } from '../types';

export default function MachineManagement() {
  const { machineTypes, addMachineType, updateMachineType, deleteMachineType } = useMachineTypes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newMachine, setNewMachine] = useState({
    name: '',
    basePrice: '',
    unit: 'kg'
  });

  const [editData, setEditData] = useState<Partial<MachineType>>({});

  const handleAddMachine = async () => {
    if (!newMachine.name || !newMachine.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await addMachineType({
        name: newMachine.name,
        basePrice: parseFloat(newMachine.basePrice),
        unit: newMachine.unit
      });

      setNewMachine({ name: '', basePrice: '', unit: 'kg' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding machine:', error);
      alert('Failed to add machine type');
    }
  };

  const handleEditMachine = async (id: string) => {
    if (!editData.name || !editData.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await updateMachineType(id, {
        name: editData.name,
        basePrice: editData.basePrice,
        unit: editData.unit
      });

      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Error updating machine:', error);
      alert('Failed to update machine type');
    }
  };

  const handleDeleteMachine = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteMachineType(id);
      } catch (error) {
        console.error('Error deleting machine:', error);
        alert('Failed to delete machine type');
      }
    }
  };

  const startEdit = (machine: MachineType) => {
    setEditingId(machine.id);
    setEditData({
      name: machine.name,
      basePrice: machine.basePrice,
      unit: machine.unit
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Machine Type Management</h2>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Machine Type
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Add New Machine Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machine Name *
              </label>
              <input
                type="text"
                value={newMachine.name}
                onChange={(e) => setNewMachine({ ...newMachine, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Rice Mill"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={newMachine.basePrice}
                onChange={(e) => setNewMachine({ ...newMachine, basePrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                value={newMachine.unit}
                onChange={(e) => setNewMachine({ ...newMachine, unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="kg">kg</option>
                <option value="bowl">bowl</option>
                <option value="bag">bag</option>
                <option value="unit">unit</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddMachine}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewMachine({ name: '', basePrice: '', unit: 'kg' });
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Machine Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {machineTypes.map((machine) => (
              <tr key={machine.id} className="hover:bg-gray-50">
                {editingId === machine.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="0.01"
                        value={editData.basePrice}
                        onChange={(e) => setEditData({ ...editData, basePrice: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editData.unit}
                        onChange={(e) => setEditData({ ...editData, unit: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="kg">kg</option>
                        <option value="bowl">bowl</option>
                        <option value="bag">bag</option>
                        <option value="unit">unit</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditMachine(machine.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {machine.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${machine.basePrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {machine.unit}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(machine)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMachine(machine.id, machine.name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
