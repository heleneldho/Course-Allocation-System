import React, { useState } from 'react';

export default function FacultyDashboard() {
  const [capacity, setCapacity] = useState(3);
  const [preferences, setPreferences] = useState({});

  const handleRankSelection = (courseCode, rank) => {
    setPreferences({ ...preferences, [courseCode]: rank });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/faculty/submit-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: "F1", // Hardcoded for demo presentation
          max_capacity: capacity,
          preferences: preferences
        }),
      });
      if (response.ok) alert("🎯 Preferences successfully locked into database!");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* Sidebar navigation line matching Stitch */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 space-y-6">
        <div className="font-bold text-gray-400 uppercase text-xs tracking-wider">Faculty Portal</div>
        <nav className="space-y-2">
          <div className="p-3 bg-blue-50 text-blue-700 font-bold rounded-lg cursor-pointer">📝 My Preferences</div>
          <div className="p-3 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">📅 My Schedule</div>
        </nav>
      </aside>

      {/* Main Workspace layout content */}
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-bold text-gray-900">Spring 2025 Course Allocation</h1>
        <p className="text-sm text-gray-500 mb-6">Please rank your course preferences and define your teaching capacity.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column Layout: Course Ranking List Grid */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-3 mb-2">Available Courses</h3>
            
            {[
              { code: 'CS101', title: 'Intro to Computer Science', credit: '3.0' },
              { code: 'DS302', title: 'Advanced Data Structures', credit: '4.0' },
              { code: 'ML501', title: 'Applied Machine Learning', credit: '4.0' },
              { code: 'SE220', title: 'Software Engineering Ethics', credit: '2.0' }
            ].map((course) => (
              <div key={course.code} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg bg-gray-50">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded">{course.code}</span>
                  <h4 className="font-bold text-gray-900 text-sm mt-1">{course.title}</h4>
                  <p className="text-xs text-gray-400">Credit: {course.credit}</p>
                </div>
                {/* Ranking Button Group Loop (1 to 5 selector) */}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num} type="button"
                      onClick={() => handleRankSelection(course.code, num)}
                      className={`w-8 h-8 rounded border text-xs font-bold transition-all ${
                        preferences[course.code] === num 
                          ? 'bg-black text-white border-black ring-2 ring-black/20' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column Layout: Side Cards Dashboard */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <label className="block text-sm font-bold text-gray-700 mb-2">Target Courses Per Semester</label>
              <input 
                type="number" min="1" max="5" value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full h-10 border border-gray-300 rounded px-3 outline-none focus:border-black"
              />
            </div>

            <div className="bg-black text-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold mb-2 text-sm">Submission Status</h4>
              <p className="text-xs text-gray-400 mb-4">Finalize your rankings to allow the allocation algorithm to optimize your schedule.</p>
              <button type="submit" className="w-full h-11 bg-white text-black font-bold text-xs rounded hover:bg-gray-100 transition-all">
                Submit Final Preferences
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}