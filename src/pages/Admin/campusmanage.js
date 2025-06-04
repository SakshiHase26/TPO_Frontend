import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin/campus';

const CampusManager = () => {
  const [campuses, setCampuses] = useState([]);
  const [campusName, setCampusName] = useState('');
  const [place, setPlace] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token"); // Get JWT from localStorage

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const fetchCampuses = () => {
    axios.get(`${API_BASE_URL}/all`, authHeaders)
      .then(res => setCampuses(res.data))
      .catch(err => console.error("Error fetching campuses", err));
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const campus = { campusName, place };

    if (editMode) {
      axios.patch(`${API_BASE_URL}/update/${editId}`, campus, authHeaders)
        .then(() => {
          fetchCampuses();
          resetForm();
        })
        .catch(err => console.error("Error updating campus", err));
    } else {
      axios.post(`${API_BASE_URL}/add`, campus, authHeaders)
        .then(() => {
          fetchCampuses();
          resetForm();
        })
        .catch(err => console.error("Error adding campus", err));
    }
  };

  const handleEdit = (campus) => {
    setCampusName(campus.campusName);
    setPlace(campus.place);
    setEditMode(true);
    setEditId(campus.campusId);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete/${id}`, authHeaders)
      .then(() => fetchCampuses())
      .catch(err => console.error("Error deleting campus", err));
  };

  const resetForm = () => {
    setCampusName('');
    setPlace('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Campus</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Campus Name"
          value={campusName}
          onChange={e => setCampusName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Place"
          value={place}
          onChange={e => setPlace(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editMode ? 'Update' : 'Add'}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-2">Campus List:</h3>
      <ul className="space-y-2">
        {campuses.map(campus => (
          <li key={campus.campusId} className="p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{campus.campusName}</strong> – {campus.place}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(campus)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(campus.campusId)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampusManager;
