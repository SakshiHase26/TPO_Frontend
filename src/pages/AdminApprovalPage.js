import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminApproval = () => {
  const [tpos, setTpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null); // Holds TPO ID while processing

  const fetchTpos = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/admin/all-tpos')
      .then(res => setTpos(res.data))
      .catch(err => console.error('Failed to fetch TPOs:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTpos();
  }, []);

  const handleApproval = (id, approved) => {
    setActionInProgress(id);
    axios.put(`http://localhost:5000/api/auth/tpo/${id}/approve?approved=${approved}`)
      .then(() => {
        alert(`TPO has been ${approved ? 'approved' : 'rejected'}`);
        fetchTpos();
      })
      .catch(err => {
        console.error('Operation failed', err);
        alert('Operation failed');
      })
      .finally(() => setActionInProgress(null));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-center">TPO Approval Management</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading TPOs...</p>
      ) : tpos.length === 0 ? (
        <p className="text-center">No TPOs found.</p>
      ) : (
        <ul className="space-y-4">
          {tpos.map(tpo => (
            <li key={tpo.id} className="p-4 border rounded shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-bold">{tpo.name}</p>
                  <p className="text-sm text-gray-600">{tpo.collegeEmail}</p>
                  <p className="text-sm">Status: {tpo.approved ? '✅ Approved' : '❌ Not Approved'}</p>
                </div>

                <div className="space-x-2">
                  {!tpo.approved && (
                    <>
                      <button
                        onClick={() => handleApproval(tpo.id, true)}
                        disabled={actionInProgress === tpo.id}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        {actionInProgress === tpo.id ? 'Processing...' : 'Approve'}
                      </button>

                      <button
                        onClick={() => handleApproval(tpo.id, false)}
                        disabled={actionInProgress === tpo.id}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                      >
                        {actionInProgress === tpo.id ? 'Processing...' : 'Reject'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminApproval;
