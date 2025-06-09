// src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        collegeEmail: "",
        password: "",
        confirmPassword: "",
        phone: "",
        tpoId: 1,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const { name, collegeEmail, phone, password, confirmPassword } = formData;
        if (!name || !collegeEmail || !phone || !password || !confirmPassword) {
            return "All fields are required";
        }
        if (!collegeEmail.includes("@")) {
            return "Invalid email format";
        }
        if (password.length < 6) {
            return "Password must be at least 6 characters";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errorMsg = validate();
        if (errorMsg) {
            setError(errorMsg);
            return;
        }

        setLoading(true);
        setError("");
        try {
            await axios.post("http://localhost:5000/api/pc/register", {
                name: formData.name,
                collegeEmail: formData.collegeEmail,
                password: formData.password,
                phone: formData.phone,
                tpoId: formData.tpoId,
            });
            navigate("/pc/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full space-y-6"
            >
                <h2 className="text-3xl font-bold text-center text-gray-900">PC Registration</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="email"
                    name="collegeEmail"
                    placeholder="College Email"
                    value={formData.collegeEmail}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <input
                    type="number"
                    name="tpoId"
                    placeholder="TPO ID"
                    value={formData.tpoId}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={1}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
