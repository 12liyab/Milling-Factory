import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSalesRecords } from '../hooks/useDatabase';
import { Key, Trash2, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const { updatePassword } = useAuth();
  const { clearAllRecords } = useSalesRecords();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await updatePassword(newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllRecords = async () => {
    const confirmed = confirm(
      'WARNING: This will permanently delete ALL sales records. This action cannot be undone. Are you absolutely sure?'
    );

    if (!confirmed) return;

    const doubleConfirm = prompt('Type "DELETE ALL" to confirm:');
    if (doubleConfirm !== 'DELETE ALL') {
      alert('Confirmation text did not match. Operation cancelled.');
      return;
    }

    try {
      await clearAllRecords();
      setMessage({ type: 'success', text: 'All records have been deleted' });
    } catch (error) {
      console.error('Error clearing records:', error);
      setMessage({ type: 'error', text: 'Failed to clear records' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-6 h-6 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
        </div>

        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter new password (min. 6 characters)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-2xl font-bold text-red-800">Danger Zone</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700 mb-2">
            <strong>Warning:</strong> The following action is irreversible and will permanently delete all sales records from the database.
          </p>
          <p className="text-sm text-red-700">
            Please ensure you have exported and backed up all important data before proceeding.
          </p>
        </div>

        <button
          onClick={handleClearAllRecords}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Records
        </button>
      </div>
    </div>
  );
}
