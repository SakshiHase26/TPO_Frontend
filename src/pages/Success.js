import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-green-700 mb-4">Registered Successfully!</h1>
        <p className="text-gray-600 mb-6">Waiting for admin approval. You can login after approval.</p>
        <Link to="/login">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
