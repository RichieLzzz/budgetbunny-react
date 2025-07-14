import SwitchViewButton from "../components/SwitchViewButton.jsx";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/BBlogo.png";

// Register component handles new user sign-up
export default function Register() {
  const navigate = useNavigate();

  // Local state for registration form inputs
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  // Update form state on input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submission with basic password match validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }
    // TODO: Add registration logic (API call or storage)
    console.log("User registered:", form);
    navigate("/dashboard");
  };

  return (
    <div className="container">
      {/* Theme toggle button */}
      <SwitchViewButton />
      <div className="card">
        {/* App logo at the top */}
        <img src={logo} alt="BudgetBunny Logo" className="logo" />
        <h1>Create Your Account</h1>

        {/* Registration form with name, email, password, and confirm fields */}
        <form onSubmit={handleSubmit}>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={handleChange}
            required
          />
          {/* Submit button to create account */}
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>

        {/* Link to sign-in page for existing users */}
        <p className="small">
          Already have an account?{' '}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </p>

        {/* Link back to home page */}
        <Link to="/" className="btn btn-secondary">
          ← Back Home
        </Link>
      </div>

      {/* Footer with version info */}
      <footer className="bb-footer">v0.0.3 · © 2025 BudgetBunny</footer>
    </div>
  );
}