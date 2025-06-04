import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    designation: "",
    campusId: "",
    streamId: "",
    phone: "",
    collegeEmail: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  // Fetch campuses on mount
  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/campus/all");
        if (!res.ok) throw new Error("Failed to fetch campuses");
        const data = await res.json();
        setCampuses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setFetchError("Could not load campus list.");
        setLoading(false);
      }
    };
    fetchCampuses();
  }, []);

  // Fetch streams when campus changes
  useEffect(() => {
    if (formData.campusId) {
      const fetchStreams = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/campus-stream/campus/${formData.campusId}/streams`);
          if (!res.ok) throw new Error("Failed to fetch streams");
          const data = await res.json();
          setStreams(data);
        } catch (err) {
          console.error(err);
          setStreams([]);
        }
      };
      fetchStreams();
    } else {
      setStreams([]);
    }
  }, [formData.campusId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/tpo/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const text = await res.text();
    setMessage(text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-6">
          TPO Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "idNumber", "designation", "phone", "collegeEmail"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}

          {/* Password with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Campus Dropdown */}
          {loading ? (
            <p className="text-center text-gray-500">Loading campuses...</p>
          ) : fetchError ? (
            <p className="text-center text-red-500">{fetchError}</p>
          ) : (
            <select
              name="campusId"
              value={formData.campusId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Select Campus</option>
              {campuses.map((campus) => (
                <option key={campus.campusId} value={campus.campusId}>
                  {campus.campusName}
                </option>
              ))}
            </select>
          )}

          {/* Stream Dropdown (dynamic)
          {formData.campusId && (
            <select
              name="streamId"
              value={formData.streamId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>Select Stream</option>
              {streams.map((stream) => (
                <option key={stream.streamId} value={stream.streamId}>
                  {stream.streamName} ({stream.year})
                </option>
              ))}
            </select>
          )} */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 text-center font-medium">{message}</p>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
