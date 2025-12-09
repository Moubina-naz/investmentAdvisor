"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function ReadinessPage() {
  // Mock financial snapshot data
  const incomeExpenseData = [
    { month: "Jan", income: 60000, expenses: 40000 },
    { month: "Feb", income: 62000, expenses: 42000 },
    { month: "Mar", income: 61000, expenses: 43000 },
    { month: "Apr", income: 64000, expenses: 45000 },
    { month: "May", income: 66000, expenses: 46000 },
    { month: "Jun", income: 68000, expenses: 47000 },
  ];

  // Mock donut (expense distribution)
  const expenseData = [
    { name: "Rent", value: 40 },
    { name: "Food", value: 25 },
    { name: "Transport", value: 15 },
    { name: "Shopping", value: 10 },
    { name: "Other", value: 10 },
  ];

  const COLORS = ["#009879", "#00BFA6", "#4FD1C5", "#81E6D9", "#A7F3D0"];

  const [lifeEvent, setLifeEvent] = useState("Plan a wedding");
  const [cost, setCost] = useState("250000");

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">My Financial Readiness</h1>

      {/* READINESS SCORE CARD */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-700 font-medium">Your Readiness Score</p>
            <div className="flex items-end gap-2 mt-2">
              <p className="text-5xl font-bold text-[#009879]">78</p>
              <p className="text-xl text-gray-500">/ 100</p>
            </div>
            <span className="mt-3 inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Strong Foundation
            </span>
            <p className="text-gray-600 mt-3 max-w-md">
              Your financial base is solid. A few adjustments can increase your
              stability and prepare you for long-term investing.
            </p>
          </div>

          <div className="flex flex-col justify-between text-sm text-gray-700">
            <p>
              <span className="font-semibold text-green-700">●</span> Emergency
              Fund: <strong>4.5 / 6 months</strong> complete
            </p>
            <p>
              <span className="font-semibold text-green-700">●</span> Debt Load:{" "}
              <strong>Low</strong>
            </p>
            <p>
              <span className="font-semibold text-green-700">●</span> Income
              Stability: <strong>High</strong>
            </p>
            <p className="text-green-700 font-medium mt-1">
              Your score improved +4 this month. Good progress.
            </p>
          </div>
        </div>
      </div>

      {/* SNAPSHOT + DONUT + PROFILE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* INCOME VS EXPENSE LINE CHART */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="font-medium mb-3">Financial Snapshot</h3>
          <p className="text-sm text-gray-500 mb-2">
            Income vs. Expenses (6 months)
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#009879"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#FF8042"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Your expenses are stable and within a healthy range.
          </p>
        </div>

        {/* EXPENSE DISTRIBUTION DONUT */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="font-medium mb-3">Expense Distribution</h3>
          <p className="text-sm text-gray-500 mb-2">Where your money goes</p>
          <div className="h-48 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {expenseData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Discretionary spend has decreased 3% — great discipline.
          </p>
        </div>

        {/* PROFILE ACCURACY */}
        <div className="bg-white rounded-xl shadow-sm p-6 border">
          <h3 className="font-medium mb-3">Profile Accuracy</h3>
          <div className="flex justify-center mt-4">
            <div className="h-24 w-24 rounded-full border-4 border-[#009879] flex items-center justify-center">
              <p className="text-2xl font-semibold text-[#009879]">92%</p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Accurate profile → better readiness scoring & tailored guidance.
          </p>
          <button className="mt-4 w-full bg-[#009879] text-white py-2 rounded-lg font-medium hover:opacity-90">
            Update Details
          </button>
        </div>
      </div>

      {/* PERSONALIZED NEXT STEPS */}
      <h2 className="text-xl font-semibold mb-4">Personalized Next Steps</h2>

      <div className="space-y-4 mb-10">
        {/* CARD 1 */}
        <div className="bg-white p-5 border rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Reduce High-Interest Debt First</h3>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              High-interest debt like credit cards can significantly slow your
              financial progress. Prioritizing payoff can save you thousands.
            </p>
          </div>
          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50">
            Simulate Payoff
          </button>
        </div>

        {/* CARD 2 */}
        <div className="bg-white p-5 border rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Strengthen Your Emergency Buffer</h3>
            <p className="text-gray-600 text-sm mt-1 max-w-xl">
              Consider redirecting a portion of savings (e.g., ₹5,000/month) to
              reach your 6-month goal faster.
            </p>
          </div>
          <button className="border px-4 py-2 rounded-lg hover:bg-gray-50">
            Adjust Savings Plan
          </button>
        </div>
      </div>

      {/* LIFE EVENT SIMULATOR */}
      <div className="bg-white border rounded-xl shadow-sm p-6 mb-10">
        <h2 className="text-xl font-semibold text-center mb-1">
          How Life Events Affect Your Readiness
        </h2>
        <p className="text-center text-gray-600 mb-6">
          We’ll instantly recalculate your score based on your event.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <select
            value={lifeEvent}
            onChange={(e) => setLifeEvent(e.target.value)}
            className="border rounded-lg p-2 w-full md:w-1/3"
          >
            <option>Plan a wedding</option>
            <option>Buy a car</option>
            <option>Buy a home</option>
            <option>Start a business</option>
          </select>

          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="border rounded-lg p-2 w-full md:w-1/3"
            placeholder="Estimated Cost"
          />

          <button className="bg-[#009879] text-white px-6 py-2 rounded-lg hover:opacity-90">
            Simulate Impact
          </button>
        </div>
      </div>

      {/* ADVISOR INSIGHT */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-medium text-green-900 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Advisor Insight for You
        </h3>
        <p className="text-gray-700 mt-2">
          Market volatility is moderate this week. Based on your current
          readiness and financial stability, your long-term investment plan
          remains on track. No major changes recommended.
        </p>
      </div>
    </div>
  );
}
