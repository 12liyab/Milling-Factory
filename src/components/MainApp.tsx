import { useState } from 'react';
import Header from './Header';
import Dashboard from './Dashboard';
import SalesForm from './SalesForm';
import SalesTable from './SalesTable';
import MachineManagement from './MachineManagement';
import Settings from './Settings';
import { BarChart3, Plus, List, Settings as SettingsIcon, Cog } from 'lucide-react';

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <div className="container mx-auto px-4 py-6">
        <nav className="bg-white rounded-xl shadow-md p-2 mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 'dashboard'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentPage('entry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 'entry'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            New Sale
          </button>

          <button
            onClick={() => setCurrentPage('records')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 'records'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <List className="w-4 h-4" />
            All Records
          </button>

          <button
            onClick={() => setCurrentPage('machines')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              currentPage === 'machines'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Cog className="w-4 h-4" />
            Machines
          </button>
        </nav>

        <main>
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'entry' && <SalesForm />}
          {currentPage === 'records' && <SalesTable />}
          {currentPage === 'machines' && <MachineManagement />}
          {currentPage === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}
