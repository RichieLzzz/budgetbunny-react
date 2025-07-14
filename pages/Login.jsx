import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/BBlogo.png";
import SwitchViewButton from "../components/SwitchViewButton.jsx";

// Login component handles user sign-in
export default function Login() {
  const navigate = useNavigate();

  // Prevent form reload and navigate to dashboard
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <>
      {/* Theme toggle button at top-right */}
      <SwitchViewButton />

      {/* Centered login form container */}
      <div className="container">
        <div className="card">
          {/* Logo at top of form */}
          <img src={logo} alt="BudgetBunny Logo" className="logo" />
          <h1>Login</h1>

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <input id="email" type="email" placeholder="Email" required />
            <input id="password" type="password" placeholder="Password" required />

            {/* Sign In button */}
            <button type="submit" className="btn btn-primary">
              Sign In
            </button>
          </form>

          {/* Link to registration page */}
          <p style={{ marginTop: 24 }}>
            Don’t have an account?{' '}
            <Link to="/register" style={{ color: "purple" }}>
              Sign up
            </Link>
          </p>

          {/* Back to home button */}
          <Link to="/" className="btn back-home-btn" style={{ marginTop: 32 }}>
            ← Back Home
          </Link>
        </div>
      </div>
    </>
  );
}
