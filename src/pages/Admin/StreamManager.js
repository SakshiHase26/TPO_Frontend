import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/stream';

const StreamManager = () => {
  const [streams, setStreams] = useState([]);
  const [streamName, setStreamName] = useState('');
  const [year, setYear] = useState('');
  const [campusId, setCampusId] = useState('');
  const [campuses, setCampuses] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchStreams = () => {
    axios.get(`${API_BASE_URL}/all`)
      .then(res => setStreams(res.data))
      .catch(err => console.error('Error fetching streams', err));
  };

  const fetchCampuses = () => {
    axios.get('http://localhost:5000/api/admin/campus/all')
      .then(res => setCampuses(res.data))
      .catch(err => console.error('Error fetching campuses', err));
  };

  useEffect(() => {
    fetchStreams();
    fetchCampuses();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
   const stream = { streamName, year, campus: { campusId: Number(campusId) } };


    if (editMode) {
      axios.patch(`${API_BASE_URL}/update/${editId}`, stream)
        .then(() => {
          fetchStreams();
          resetForm();
        })
        .catch(err => console.error('Error updating stream', err));
    } else {
      axios.post(`${API_BASE_URL}/add`, stream)
        .then(() => {
          fetchStreams();
          resetForm();
        })
        .catch(err => console.error('Error adding stream', err));
    }
  };

  const handleEdit = (stream) => {
    setStreamName(stream.streamName);
    setYear(stream.year);
    setCampusId(stream.campus?.campusId || '');
    setEditMode(true);
    setEditId(stream.streamId);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE_URL}/delete/${id}`)
      .then(() => fetchStreams())
      .catch(err => console.error('Error deleting stream', err));
  };

  const resetForm = () => {
    setStreamName('');
    setYear('');
    setCampusId('');
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Stream</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Stream Name"
          value={streamName}
          onChange={(e) => setStreamName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={campusId}
          onChange={(e) => setCampusId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Campus</option>
          {campuses.map(campus => (
            <option key={campus.campusId} value={campus.campusId}>
              {campus.campusName}
            </option>
          ))}
        </select>
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

      <h3 className="text-xl font-semibold mb-2">Stream List:</h3>
      <ul className="space-y-2">
        {streams.map((stream) => (
          <li key={stream.streamId} className="p-2 border rounded flex justify-between items-center">
            <div>
              <strong>{stream.streamName}</strong> – {stream.year} – {stream.campus?.campusName}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(stream)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(stream.streamId)}
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

export default StreamManager;
