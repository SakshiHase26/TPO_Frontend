import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PAGE_SIZE = 3;

const ManageTpos = () => {
  const [tpos, setTpos] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    collegeEmail: '',
    campus: '',
    status: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTpos = (pageNum = 0) => {
    axios
      .get('http://localhost:5000/api/auth/tpo/all', {
        params: { page: pageNum, size: PAGE_SIZE },
      })
      .then(res => {
        setTpos(res.data.content);
        setTotalPages(res.data.totalPages);
        setPage(pageNum);
      })
      .catch(() => toast.error('Failed to load TPOs'));
  };

  useEffect(() => {
    fetchTpos();
  }, []);

  /** Populate form for editing */
  const handleEdit = (tpo, idx) => {
    setFormData({
      id: tpo.id,
      name: tpo.name,
      collegeEmail: tpo.collegeEmail,
      campus: tpo.campus?.campusName || '', // Use campusName string here
      status: tpo.status,
    });
    setEditingIndex(idx);
  };

  /** PUT status update, name & campus */
  const handleUpdate = e => {
    e.preventDefault();
    const { id, name, campus, status } = formData;
    axios
      .put(`http://localhost:5000/api/auth/tpo/${id}/approve`, null, {
        params: { approved: status === 'approved' },
      })
      .then(() =>
        axios.patch(`http://localhost:5000/api/auth/tpo/${id}`, {
          name,
          campus, // send campus as string (campusName)
        })
      )
      .then(() => {
        toast.success('TPO updated');
        setEditingIndex(null);
        setFormData({ id: null, name: '', collegeEmail: '', campus: '', status: '' });
        fetchTpos(page);
      })
      .catch(() => toast.error('Update failed'));
  };

  /** DELETE TPO */
  const handleDelete = id => {
    axios
      .delete(`http://localhost:5000/api/auth/tpo/${id}`)
      .then(() => {
        toast.warn('TPO deleted');
        fetchTpos(page);
      })
      .catch(() => toast.error('Delete failed'));
  };

  /** Cancel editing */
  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ id: null, name: '', collegeEmail: '', campus: '', status: '' });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Manage TPOs</h2>

      {editingIndex !== null && (
        <form
          onSubmit={handleUpdate}
          className="space-y-3 mb-6 text-gray-700 border p-4 rounded"
        >
          <input
            name="name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={formData.collegeEmail}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
          <select
            value={formData.campus}
            onChange={e => setFormData({ ...formData, campus: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Campus</option>
            <option value="ICCS Universe">ICCS Universe</option>
            <option value="ICCS Unity">ICCS Unity</option>
            <option value="ICEM">ICEM</option>
            <option value="Indira MBA">Indira MBA</option>
          </select>
          <select
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        {tpos.length === 0 ? (
          <p className="text-gray-500">No TPOs found.</p>
        ) : (
          tpos.map((tpo, idx) => (
            <div key={tpo.id} className="border p-4 rounded mb-3 shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {tpo.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {tpo.collegeEmail}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <strong>Campus:</strong> {tpo.campus?.campusName || ''}
                  </p>
                  <p className="text-gray-600">
                    <strong>Status:</strong> {tpo.status}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(tpo, idx)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tpo.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => fetchTpos(page - 1)}
          disabled={page === 0}
          className="
            px-4 py-2 
            bg-sky-500 
            text-black 
            rounded 
            disabled:bg-sky-200 
            disabled:text-gray-500 
            disabled:cursor-not-allowed 
            transition-all 
            duration-150
          "
        >
          Previous
        </button>

        <span className="text-gray-800">
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => fetchTpos(page + 1)}
          disabled={page + 1 === totalPages}
          className="
            px-4 py-2 
            bg-sky-500 
            text-black 
            rounded 
            disabled:bg-sky-200 
            disabled:text-gray-500 
            disabled:cursor-not-allowed 
            transition-all 
            duration-150
          "
        >
          Next
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageTpos;
