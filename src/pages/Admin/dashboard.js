import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalStudents: 0,
    placedStudents: 0,
    nonPlacedStudents: 0,
    totalTpos: 0,
    pendingTpos: 0,
    approvedTpos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/dashboard/summary')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        setSummary({
          totalStudents: data.totalStudents ?? 0,
          placedStudents: data.placedStudents ?? 0,
          nonPlacedStudents: data.nonPlacedStudents ?? 0,
          totalTpos: data.totalTpos ?? 0,
          pendingTpos: data.pendingTpos ?? 0,
          approvedTpos: data.approvedTpos ?? 0,
        });
      })
      .catch(err => {
        console.error('Dashboard load error:', err);
        setError('Failed to load dashboard data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const card = (title, value, description, colorClass) => (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <div className="mt-4">
        {loading
          ? <div className="animate-pulse h-10 w-20 bg-gray-200 rounded" />
          : <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
        }
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {card('Total Students', summary.totalStudents, 'Total students enrolled', 'text-indigo-600')}
        {card('Placed Students', summary.placedStudents, 'Placed students of 2026 batch', 'text-green-600')}
        {card('Non‑Placed Students', summary.nonPlacedStudents, 'Non‑placed students of 2026 batch', 'text-blue-600')}
        {card('Total TPOs', summary.totalTpos, 'Total Training & Placement Officers', 'text-red-600')}
        {card('Approved TPOs', summary.approvedTpos, 'TPOs whose applications were approved', 'text-teal-600')}
        {card('Pending TPOs', summary.pendingTpos, 'Pending TPO applications', 'text-yellow-600')}
      </div>
    </div>
  );
};

export default Dashboard;
