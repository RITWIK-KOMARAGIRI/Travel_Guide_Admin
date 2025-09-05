import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page refresh

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (res.status === 200) {
        // Save user login to localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/mainplaces"); // redirect after login
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-md rounded-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
    