import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow">
        <h1 className="text-xl font-bold">SubTrack</h1>

        <div className="space-x-4">
          <Link to="/login" className="text-gray-700">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-24 px-6">
        <h1 className="text-5xl font-bold mb-6">
          Subscription Billing Made Simple
        </h1>

        <p className="text-gray-600 max-w-xl mb-8">
          Manage plans, automate billing, and track revenue with a powerful SaaS dashboard.
        </p>

        <Link
          to="/register"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Start Free Trial
        </Link>
      </div>
    </div>
  );
};

export default Landing;