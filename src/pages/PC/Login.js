// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        collegeEmail: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Check for existing PC user (updated to match App.js logic)
    useEffect(() => {
        const pcUserStr = localStorage.getItem("pcUser");
        const token = localStorage.getItem("token");
        
        console.log("PC User String:", pcUserStr);
        console.log("Token:", token);
        
        if (pcUserStr && token) {
            try {
                const pcUser = JSON.parse(pcUserStr);
                console.log("Parsed PC User:", pcUser);
                console.log("Role:", pcUser.role, "Status:", pcUser.status);
                
                if (pcUser.role === 'pc' && pcUser.status === 'approved') {
                    console.log("Redirecting to PC dashboard");
                    navigate("/pc/dashboard");
                } else {
                    console.log("Not redirecting - role or status check failed");
                }
            } catch (e) {
                console.log("Error parsing PC user data:", e);
                // Clear invalid data
                localStorage.removeItem("pcUser");
                localStorage.removeItem("token");
            }
        } else {
            console.log("No PC user data or token found");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const validate = () => {
        const { collegeEmail, password } = formData;
        if (!collegeEmail || !password) return "All fields are required.";
        if (!collegeEmail.includes("@")) return "Invalid email format.";
        if (password.length < 6) return "Password must be at least 6 characters.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const errorMsg = validate();
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/pc/login", {
                collegeEmail: formData.collegeEmail,
                password: formData.password,
            });

            // ✅ Store both token and user data with role information
            localStorage.setItem("token", response.data.token);
            
            // Debug: Log the API response to see the actual structure
            console.log("API Response:", response.data);
            
            // Create user object with role and status (adjust based on your API response structure)
            const pcUser = {
                ...response.data.user, // Assuming your API returns user data
                role: 'pc',
                status: 'approved' // Force approved status for now
            };
            
            // Debug: Log what we're storing
            console.log("Storing PC User:", pcUser);
            
            localStorage.setItem("pcUser", JSON.stringify(pcUser));

            // Clear any other user data that might interfere
            localStorage.removeItem("adminUser");
            localStorage.removeItem("tpoUser");
            localStorage.removeItem("user");

            navigate("/pc/dashboard");
        } catch (err) {
            const backendError = err.response?.data;
            const message =
                typeof backendError === "string"
                    ? backendError
                    : backendError?.error || "Login failed. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">PC Login</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 border border-red-300 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="collegeEmail" className="block text-sm font-medium text-gray-700">
                            College Email
                        </label>
                        <input
                            id="collegeEmail"
                            type="email"
                            name="collegeEmail"
                            value={formData.collegeEmail}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="example@college.edu"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Registration and Forgot Password Links */}
                <div className="mt-6 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <a 
                        href="/pc/register" 
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                        Register here
                    </a>
                </div>
                
                {/* Optional: Add Forgot Password link */}
                <div className="mt-2 text-sm text-center text-gray-600">
                    <a 
                        href="/pc/forgot-password" 
                        className="text-gray-500 hover:text-gray-700 hover:underline"
                    >
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;