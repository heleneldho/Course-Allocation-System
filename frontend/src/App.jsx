import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('admin');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dynamic Navigation Bar Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <span className="text-xl font-black text-blue-600 tracking-wider">ALLOCATOR_PRO</span>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentView('admin')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentView === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Admin View
          </button>
          <button 
            onClick={() => setCurrentView('faculty')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${currentView === 'faculty' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Faculty View
          </button>
        </div>
      </nav>

      {/* Render Selected View */}
      {currentView === 'admin' ? <AdminDashboard /> : <FacultyDashboard />}
    </div>
  );
}