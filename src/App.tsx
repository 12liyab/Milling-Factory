import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import MainApp from './components/MainApp';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <img
            src="/thenovus.solutions_Puzzle-icon.png"
            alt="Logo"
            className="w-20 h-20 mx-auto mb-4 animate-pulse"
          />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <MainApp /> : <Login />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
