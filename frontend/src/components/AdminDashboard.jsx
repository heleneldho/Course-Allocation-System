
import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [coursesFile, setCoursesFile] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/admin/system-status");
      const data = await response.json();
      setIsInitialized(data.is_initialized);
    } catch (error) { console.error(error); }
  };

  const handleFacultyRosterUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("http://127.0.0.1:8000/admin/upload-faculty-roster", { method: "POST", body: formData });
    if (response.ok) { fetchSystemStatus(); alert("Roster loaded!"); }
  };

  const handleCoursesUpload = async (e) => {
    e.preventDefault();
    if (!coursesFile) return;
    const formData = new FormData();
    formData.append("file", coursesFile);
    const response = await fetch("http://127.0.0.1:8000/admin/upload-courses", { method: "POST", body: formData });
    if (response.ok) alert("Course requirements loaded successfully!");
  };

  const handleRunAllocation = async () => {
    const response = await fetch("http://127.0.0.1:8000/admin/generate-schedule", { method: "POST" });
    const data = await response.json();
    if (response.ok) setSchedule(data.assignments);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-4">
        <div className="font-bold text-gray-400 uppercase text-xs tracking-wider">EduAlloc Admin</div>
        <nav className="space-y-2">
          <div className="p-3 bg-blue-50 text-blue-700 font-bold rounded-lg cursor-pointer">⚙️ Dashboard</div>
        </nav>
      </aside>

      <main className="flex-grow p-8 space-y-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Academic Allocation</h1>

        {/* Top Control Core Block Layout */}
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Allocation Engine v4.2</h2>
            <p className="text-xs text-gray-500 max-w-md mt-1">The engine is currently using the 'Minimize Dissatisfaction' model framework pipeline.</p>
          </div>
          <button onClick={handleRunAllocation} className="h-12 px-6 bg-black text-white font-bold text-sm rounded hover:bg-gray-900 transition-all">
            🔄 Run Allocation
          </button>
        </div>

        {/* Dual Card Import Zone Layout System (Matches Image 3/4 Mockup Exactly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!isInitialized ? (
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center bg-white">
              <div className="text-2xl mb-2">☁️</div>
              <h3 className="font-bold text-gray-800 text-sm">Upload Faculty List</h3>
              <p className="text-xs text-gray-400 mb-4">Drag and drop baseline roster spreadsheet file</p>
              <input type="file" onChange={(e) => handleFacultyRosterUpload(e.target.files[0])} className="text-xs mx-auto block" />
            </div>
          ) : (
            <div className="border border-solid border-gray-200 p-8 rounded-xl text-center bg-gray-100 opacity-75 relative">
              <div className="text-xl mb-1">🔒</div>
              <h3 className="font-bold text-gray-700 text-sm">Upload Faculty List</h3>
              <p className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 py-2 px-4 rounded-md my-2 max-w-xs mx-auto">
                ⚠️ Setup Locked: Initial setup already complete. Using live database history for metrics.
              </p>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 p-8 rounded-xl text-center bg-white">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold text-gray-800 text-sm">Course Requirements</h3>
            <p className="text-xs text-gray-400 mb-4">Import semester dynamic demands matrix</p>
            <form onSubmit={handleCoursesUpload}>
              <input type="file" onChange={(e) => setCoursesFile(e.target.files[0])} className="text-xs mx-auto block mb-2" />
              <button type="submit" className="text-xs bg-gray-200 px-3 py-1.5 rounded hover:bg-gray-300 font-semibold">Upload Demand</button>
            </form>
          </div>
        </div>

        {/* Calculated Results Table Panel Output */}
        {schedule && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Detailed Course Allocation</h3>
              
              <button 
                onClick={async () => {
                  const response = await fetch("http://127.0.0.1:8000/admin/publish-and-rollover", { method: "POST" });
                  if (response.ok) {
                    alert("Semester locked and history rolled over successfully!");
                    window.location.reload(); 
                  }
                }} 
                className="bg-black text-white px-4 py-2 text-xs font-bold rounded hover:opacity-90 transition-all shadow-sm"
              >
                Lock Schedule & Rollover History
              </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Course Code</th>
                  <th className="px-6 py-3">Assigned Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedule.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.course_code}</td>
                    <td className="px-6 py-4 text-gray-600">{item.faculty_name || item.faculty_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

