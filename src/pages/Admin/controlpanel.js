import React, { useState, useEffect } from 'react';

const ControlPanel = () => {
  const [settings, setSettings] = useState({
    allowRegistrations: true,
    freezeEdits: false,
  });
  const [loading, setLoading] = useState(true);

  // 1) Load settings from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then(data => {
        setSettings({
          allowRegistrations: data.allowRegistrations,
          freezeEdits: data.freezeEdits,
        });
      })
      .catch(err => {
        console.error(err);
        // optionally show an error toast
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSetting = (key) => {
    // 2) Optimistic UI update
    const newValue = !settings[key];
    const previous = settings[key];
    setSettings(s => ({ ...s, [key]: newValue }));

    // 3) Persist to backend
    fetch('http://localhost:5000/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        allowRegistrations:
          key === 'allowRegistrations'
            ? newValue
            : settings.allowRegistrations,
        freezeEdits:
          key === 'freezeEdits'
            ? newValue
            : settings.freezeEdits,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save settings');
        return res.json();
      })
      .then(data => {
        // sync with server response
        setSettings({
          allowRegistrations: data.allowRegistrations,
          freezeEdits: data.freezeEdits,
        });
      })
      .catch(err => {
        console.error(err);
        // rollback
        setSettings(s => ({ ...s, [key]: previous }));
      });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading settings…</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700">⚙️ Control Panel</h2>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-800">Allow Registrations</span>
        <button
          onClick={() => toggleSetting('allowRegistrations')}
          className={`px-4 py-1 rounded text-white ${
            settings.allowRegistrations ? 'bg-green-600' : 'bg-red-500'
          }`}
        >
          {settings.allowRegistrations ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-gray-800">Freeze All Student Edits</span>
        <button
          onClick={() => toggleSetting('freezeEdits')}
          className={`px-4 py-1 rounded text-white ${
            settings.freezeEdits ? 'bg-red-600' : 'bg-green-500'
          }`}
        >
          {settings.freezeEdits ? 'Frozen' : 'Active'}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
