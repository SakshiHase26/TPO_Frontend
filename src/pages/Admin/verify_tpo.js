import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyTpos = () => {
  const [tpos, setTpos] = useState([]);

  // 1) Fetch only PENDING TPOs on mount
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/tpo/pending') // ✅ Make sure this endpoint returns only pending TPOs
      .then((res) => {
        setTpos(res.data || []);
      })
      .catch(() => {
        toast.error('Failed to fetch TPOs');
      });
  }, []);

  // 2) Approve or Reject a TPO
  const updateStatus = (id, approved) => {
    axios
      .put(`http://localhost:5000/api/auth/tpo/${id}/approve?approved=${approved}`)
      .then(() => {
        // ✅ Remove from local list after status update
        setTpos((prev) => prev.filter((tpo) => tpo.id !== id));
        toast.success(`TPO ${approved ? 'approved' : 'rejected'} successfully`);
      })
      .catch(() => {
        toast.error('Operation failed');
      });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-500">
        Admin Panel – Approve TPOs
      </h2>

      {tpos.length === 0 ? (
        <p className="text-center text-gray-500">No TPOs Pending Approval.</p>
      ) : (
        tpos.map((tpo) => (
          <div key={tpo.id} className="border p-4 mb-4 rounded-md text-gray-500">
            <p>
              <strong>Name:</strong> {tpo.name}
            </p>
            <p>
              <strong>Email:</strong> {tpo.collegeEmail}
            </p>
            <p>
              <strong>Campus:</strong> {tpo.campus?.campusName || 'N/A'}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="ml-2 text-yellow-600">{tpo.status}</span>
            </p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={() => updateStatus(tpo.id, true)}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Approve
              </button>
              <button
                onClick={() => updateStatus(tpo.id, false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}

      <p className="text-center text-gray-500 mt-6">
        Total Pending TPOs: {tpos.length}
      </p>
    </div>
  );
};

export default VerifyTpos;
