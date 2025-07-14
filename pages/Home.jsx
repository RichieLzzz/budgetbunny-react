import SwitchViewButton from "../components/SwitchViewButton.jsx";
import { Link } from "react-router-dom";
import logo from "../assets/img/BBlogo.png";

// Home component displays landing page with navigation options
export default function Home() {
  return (
    <>
      {/* Theme toggle button */}
      <SwitchViewButton />

      {/* Main container centered vertically */}
      <div className="container">
        {/* App logo */}
        <img
          src={logo}
          alt="BudgetBunny Logo"
          className="logo"
          style={{ width: 200 }}
        />

        {/* App name and subtitle */}
        <h1>BudgetBunny</h1>
        <h2 className="subtitle">Your Personal Accountant</h2>

        {/* Buttons to navigate to login or register */}
        <div className="button-group">
          {/* Button to login */}
          <Link to="/login" className="btn btn-primary">
            Check&nbsp;My&nbsp;Carrots
          </Link>
          {/* Button to register */}
          <Link
            to="/register"
            className="btn btn-tertiary"
            style={{ marginTop: 8 }}
          >
            Stack&nbsp;My&nbsp;Carrots
          </Link>
        </div>
      </div>
    </>
  );
}
