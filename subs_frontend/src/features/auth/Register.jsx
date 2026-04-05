import { useState } from "react";
import { registerUser } from "./authService";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    try {
      const res = await registerUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 shadow-md rounded w-80">
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-2"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-2"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;