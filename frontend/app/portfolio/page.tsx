"use client";

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Plus, Bell, User, 
  TrendingUp, TrendingDown, HelpCircle, Lightbulb 
} from 'lucide-react';

// --- Mock Data for Charts ---
const wealthPathData = [
  { month: 'Jan', value: 25000 },
  { month: 'Feb', value: 25500 },
  { month: 'Mar', value: 24800 },
  { month: 'Apr', value: 26200 },
  { month: 'May', value: 27500 },
  { month: 'Jun', value: 28200 },
];

const allocationData = [
  { name: 'Tech', value: 67, color: '#3B82F6' },    // Blue
  { name: 'Banking', value: 20, color: '#F59E0B' }, // Yellow
  { name: 'FMCG', value: 13, color: '#EF4444' },    // Red
];

const holdingsData = [
  { 
    id: 1, 
    symbol: 'TCS', 
    risk: 'Stable', 
    riskColor: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-500',
    qty: 10, 
    avgPrice: 3200, 
    currPrice: 3270, 
    pl: 700, 
    ret: 4.8, 
    isPositive: true 
  },
  { 
    id: 2, 
    symbol: 'RELIANCE', 
    risk: 'Stable', 
    riskColor: 'bg-green-100 text-green-700',
    dotColor: 'bg-green-500',
    qty: 5, 
    avgPrice: 2400, 
    currPrice: 2550, 
    pl: 750, 
    ret: 6.25, 
    isPositive: true 
  },
  { 
    id: 3, 
    symbol: 'INFY', 
    risk: 'Moderate', 
    riskColor: 'bg-yellow-100 text-yellow-700',
    dotColor: 'bg-yellow-500',
    qty: 15, 
    avgPrice: 1400, 
    currPrice: 1350, 
    pl: -750, 
    ret: -5.35, 
    isPositive: false 
  },
];

export default function PortfolioDashboard() {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* --- Navbar (Simple Version) --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">WealthWiz</span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
          <a href="#" className="hover:text-green-600 transition">Dashboard</a>
          <a href="#" className="text-green-600">My Portfolio</a>
          <a href="#" className="hover:text-green-600 transition">Learn</a>
          <a href="#" className="hover:text-green-600 transition">Settings</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <Bell size={20} className="text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
            <User size={20} className="text-orange-500" />
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
            <p className="text-gray-500 mt-1">Track your growth and learn as you invest.</p>
          </div>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all active:scale-95">
            <Plus size={20} />
            Add New Holding
          </button>
        </div>

        {/* --- Summary Cards Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Invested */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-1">Total Invested</p>
            <h3 className="text-2xl font-bold text-gray-900">₹25,000</h3>
          </div>

          {/* Card 2: Current Value */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-1">Current Value</p>
            <h3 className="text-2xl font-bold text-gray-900">₹28,200</h3>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-semibold cursor-pointer hover:underline">
              View Goal Progress <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Card 3: Total P/L */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-1">Total P/L</p>
            <h3 className="text-2xl font-bold text-green-600">+₹3,200</h3>
            <p className="text-gray-400 text-xs mt-2 italic">
              "Feeling good today! Your portfolio is on a steady climb."
            </p>
          </div>

          {/* Card 4: Overall Return */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium mb-1">Overall Return</p>
            <h3 className="text-2xl font-bold text-green-600">+12.8%</h3>
          </div>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Chart: Wealth Path (Line Chart) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Your Wealth Path</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">"What If" Overlay</span>
                <div 
                  className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${showOverlay ? 'bg-green-500 justify-end' : 'justify-start'}`}
                  onClick={() => setShowOverlay(!showOverlay)}
                >
                  <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md"></div>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wealthPathData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Chart: Asset Allocation (Donut Chart) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-2">
               <h2 className="text-lg font-bold text-gray-800">Asset Allocation</h2>
            </div>
            
            <div className="w-full h-52 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    verticalAlign="middle" 
                    align="right" 
                    layout="vertical"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', color: '#6B7280' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text (Total %) */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                {/* Optional center text if needed */}
              </div>
            </div>

            <div className="mt-4 bg-gray-50 p-3 rounded-lg text-center w-full">
              <p className="text-xs text-gray-600 leading-relaxed">
                Your portfolio is heavily skewed towards <span className="font-bold text-blue-500">Tech (67%)</span>. 
                To diversify, explore Banking or FMCG sectors.
              </p>
              <button className="text-green-600 text-xs font-semibold mt-2 hover:underline">
                Learn about Diversification
              </button>
            </div>
          </div>
        </div>

        {/* --- Holdings List --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Holdings</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Risk Level</th>
                  <th className="p-4 font-medium">Quantity</th>
                  <th className="p-4 font-medium">Avg. Price</th>
                  <th className="p-4 font-medium">Current Price</th>
                  <th className="p-4 font-medium">P/L</th>
                  <th className="p-4 font-medium">Return %</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {holdingsData.map((stock) => (
                  <tr key={stock.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                      {stock.symbol}
                      <HelpCircle size={14} className="text-gray-300 cursor-help" />
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stock.riskColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stock.dotColor}`}></span>
                        {stock.risk}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{stock.qty}</td>
                    <td className="p-4 text-gray-600">₹{stock.avgPrice.toLocaleString()}</td>
                    <td className="p-4 text-gray-900 font-medium">₹{stock.currPrice.toLocaleString()}</td>
                    <td className={`p-4 font-bold ${stock.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                      {stock.isPositive ? '+' : ''}₹{Math.abs(stock.pl).toLocaleString()}
                    </td>
                    <td className={`p-4 font-bold ${stock.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                      {stock.isPositive ? '+' : ''}{stock.ret}%
                    </td>
                    <td className="p-4">
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowUpRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Bottom Insights Card --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-4 items-start mb-10">
          <div className="p-3 bg-green-100 rounded-full shrink-0">
             <Lightbulb className="text-green-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Beginner's Insights</h3>
            <p className="text-gray-400 text-xs mb-3">AI-powered analysis to help you learn and grow.</p>
            
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-xl">
                 <h4 className="font-bold text-gray-800 text-sm mb-1">Your Portfolio's Market Mood</h4>
                 <p className="text-sm text-gray-600">Cautiously Optimistic. Your stable holdings in large-cap stocks provide a good foundation against recent market volatility.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                 <h4 className="font-bold text-gray-800 text-sm mb-1">What to Watch This Week</h4>
                 <p className="text-sm text-gray-600">Keep an eye on the IT sector as major earnings are expected next week. This could impact your TCS and INFY holdings.</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}