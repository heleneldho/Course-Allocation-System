import React, { useState } from 'react';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Panel Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold shadow-md shadow-blue-200">
              🎓
            </div>
            <div>
              <h2 className="font-bold text-slate-800 leading-none">Faculty Portal</h2>
              <span className="text-xs text-slate-400">ACADEMIC MANAGEMENT</span>
            </div>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
              📊 Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              📖 Courses
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              👥 Faculty
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              🔀 Allocation
            </button>
          </nav>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            ⚙️ Preferences
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            📅 My Schedule
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col">
        {/* Top Operational Menu Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-slate-800">EduAlloc Admin</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600">🔔</button>
            <button className="p-2 text-slate-400 hover:text-slate-600">⚙️</button>
            <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              Publish
            </button>
          </div>
        </header>

        {/* Dynamic Inner Component Workspace Layout */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-7xl w-full mx-auto">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold text-slate-900">Academic Allocation</h2>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Live
              </span>
            </div>
            <p className="text-sm text-slate-500">Manage constraints and initiate the allocation engine for Semester 2, 2026.</p>
          </div>

          {/* Engine Metric Metrics Panels Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Core Allocation Run Panel Block */}
            <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="space-y-4 flex-1 pr-6">
                <div>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Engine Status</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">Allocation Engine v4.2</h3>
                  <p className="text-sm text-slate-500 mt-1">The engine is currently using the 'Minimize Dissatisfatisfaction' optimization framework model pipeline configuration matrix details.</p>
                </div>
                <button className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-md shadow-slate-200 flex items-center gap-2">
                  🔄 Run Allocation
                </button>
              </div>
              <div className="w-32 h-32 bg-slate-50 rounded-xl flex items-center justify-between text-5xl p-6 border border-slate-100 opacity-60">🤖</div>
            </div>

            {/* Quick Summary Counts Stack */}
            <div className="space-y-4">
              {[
                { title: "Total Faculty", count: "142", icon: "👥" },
                { title: "Total Courses", count: "88", icon: "📖" },
                { title: "Total Slots Needed", count: "256", icon: "🏛️" }
              ].map((card, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-slate-50 p-2 rounded-lg border border-slate-100">{card.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-slate-400">{card.title}</p>
                      <h4 className="text-xl font-bold text-slate-800 leading-none mt-0.5">{card.count}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Drop and Roster Upload Component Drag & Drop Areas */}
          <div className="grid grid-cols-2 gap-6">
            <div className="border-2 border-dashed border-slate-200 bg-white hover:border-blue-400 transition-colors rounded-xl p-8 flex flex-col items-center text-center justify-center cursor-pointer group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">☁️</span>
              <h4 className="text-sm font-semibold text-slate-800">Upload Faculty List</h4>
              <p className="text-xs text-slate-400 mt-1">Drag and drop baseline roster spreadsheet files (.xlsx or .csv)</p>
            </div>
            
            <div className="border-2 border-dashed border-slate-200 bg-white hover:border-blue-400 transition-colors rounded-xl p-8 flex flex-col items-center text-center justify-center cursor-pointer group">
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📄</span>
              <h4 className="text-sm font-semibold text-slate-800">Course Requirements</h4>
              <p className="text-xs text-slate-400 mt-1">Import semester dynamic demands capability constraint matrix datasets</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}