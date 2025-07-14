// Dashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/BBlogo.png";
import SwitchViewButton from "../components/SwitchViewButton.jsx";
import "../styles/dashboard.css";

// Dashboard component shows expense overview and tips
export default function Dashboard() {
  // State holds demo data: expenses, categories, budget plan, and a tip
  const [data, setData] = useState({
    totalExpense: 1845,
    categories: [
      { name: "Dining", percent: 35 },
      { name: "Transport", percent: 22 },
      { name: "Entertainment", percent: 14 },
    ],
    plan: { budget: 2500, spent: 1845 },
    tip: "Save first, spend later to avoid a tight month-end!",
  });

  // Function to randomize demo data on button click
  const refreshStats = () => {
    setData({
      totalExpense: Math.floor(1500 + Math.random() * 1000),
      categories: [
        { name: "Dining", percent: Math.floor(25 + Math.random() * 20) },
        { name: "Transport", percent: Math.floor(15 + Math.random() * 15) },
        { name: "Entertainment", percent: Math.floor(10 + Math.random() * 20) },
      ],
      plan: {
        budget: 2500,
        spent: Math.floor(1200 + Math.random() * 1200),
      },
      tip: []
      [Math.floor(Math.random() * 3)],
    });
  };

  // Calculate how much of the budget has been used (max 100%)
  const planPercent = Math.min(
    100,
    Math.round((data.plan.spent / data.plan.budget) * 100)
  );

  return (
    <>
      {/* Theme toggle button at top-right */}
      <SwitchViewButton />

      {/* Main wrapper for dashboard content */}
      <div className="dashboard-wrapper">
        <div className="dashboard-container">

          {/* Header with logo and title */}
          <header className="db-header">
            <div className="header-content">
              <img src={logo} alt="BudgetBunny Logo" className="logo" />
              <h1>Dashboard</h1>
            </div>
          </header>

          {/* Grid for stats cards (2x2) */}
          <div className="dashboard">
            {/* Monthly Expense card */}
            <div className="card stat">
              <h2>Monthly Expense</h2>
              <p className="big">${data.totalExpense}</p>
            </div>

            {/* Expense Breakdown card */}
            <div className="card stat">
              <h2>Expense Breakdown</h2>
              <ul className="category-list">
                {data.categories.map((c) => (
                  <li key={c.name}>
                    {c.name} — {c.percent}%
                  </li>
                ))}
              </ul>
            </div>

            {/* Monthly Plan card */}
            <div className="card stat">
              <h2>Monthly Plan</h2>
              <p>
                Spent ${data.plan.spent} / Budget ${data.plan.budget}
              </p>
              <p>{planPercent}%</p>
            </div>

            {/* Tips card */}
            <div className="card stat">
              <h2>Tips</h2>
              <p style={{ textAlign: "center", lineHeight: 1.4 }}>{data.tip}</p>
            </div>
          </div>

          {/* Buttons to refresh stats or go to voice input */}
          <div className="action-buttons">
            <button className="btn add-expense" onClick={refreshStats}>
              Input Expense
            </button>
            <Link to="/" className="btn voice-input">
              Voice Input
            </Link>
          </div>

          {/* Footer with version information */}
          <footer className="bb-footer">v0.0.3 · © 2025 BudgetBunny</footer>
        </div>
      </div>
    </>
  );
}
