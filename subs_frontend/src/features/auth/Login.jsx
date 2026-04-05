import { useState } from "react";
import { loginUser } from "./authService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 border w-80">
        <h2 className="mb-4 text-xl">Login</h2>

        <input
          className="border w-full mb-2 p-2"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="border w-full mb-4 p-2"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;