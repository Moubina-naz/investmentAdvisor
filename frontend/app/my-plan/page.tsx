"use client";
import ChatWidget from "./ChatWidget";
import React, { useState } from 'react';
import { 
  Lightbulb, Calendar, Wallet, Target, Ban, 
  CheckCircle, AlertCircle, TrendingDown, BookOpen, 
  MessageCircle, ArrowRight, Plus, RefreshCw, Scale 
} from 'lucide-react';

export default function MyPlanPage() {
  const [activeTab, setActiveTab] = useState('My Plan');

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 pb-20">
      
      {/* --- Navbar (Matches Image 1) --- */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Simple WealthWiz Icon Placeholder */}
              <svg viewBox="0 0 24 24" className="text-green-500 w-8 h-8" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5 10 5 10-5-5-2.5-5 2.5z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">WealthWiz</span>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['Dashboard', 'My Readiness', 'My Plan', 'Learn', 'My Portfolio'].map((item) => (
              <a
                key={item}
                href="#"
                onClick={() => setActiveTab(item)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  activeTab === item 
                    ? 'text-gray-900 font-bold' // Active state
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Right: Profile Pill */}
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-full cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Hi, Aditi</span>
                <span className="text-lg">👋</span>
             </div>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Plan</h1>
            <p className="text-green-600 mt-1 font-medium">Your personalized roadmap to financial freedom.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            <Calendar size={16} className="text-green-600" />
            Strategy for <span className="text-green-600 font-bold">October</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (Main Plan) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. This Month's Action Plan */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Lightbulb size={24} fill="currentColor" className="opacity-20" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">This Month's Action Plan</h2>
                  <p className="text-gray-500 text-xs">Based on your readiness score & market conditions.</p>
                </div>
                <div className="ml-auto flex gap-2">
                   {/* Status Pills */}
                   <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded uppercase">✅ Add</span>
                   <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded uppercase">⚖️ Hold</span>
                   <span className="px-2 py-1 bg-red-50 text-red-700 text-[10px] font-bold rounded uppercase">🚫 Avoid</span>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Invest Total */}
                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex flex-col justify-between h-32">
                  <div className="p-2 bg-green-100 w-fit rounded-full text-green-600 mb-2">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Invest Total</p>
                    <p className="text-2xl font-bold text-gray-900">₹5,000</p>
                  </div>
                </div>

                {/* Focus On */}
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-between h-32">
                  <div className="p-2 bg-blue-100 w-fit rounded-full text-blue-600 mb-2">
                    <Target size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Focus On</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">Large-cap IT</p>
                    <p className="text-[10px] text-gray-500">+ Nifty 50 Index Fund</p>
                  </div>
                </div>

                {/* Avoid */}
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 flex flex-col justify-between h-32">
                  <div className="p-2 bg-red-100 w-fit rounded-full text-red-600 mb-2">
                    <Ban size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-800 uppercase tracking-wide">Avoid</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">Adding INFY</p>
                    <p className="text-[10px] text-gray-500">Overweight in portfolio</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Goals & Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="text-green-600"><Target size={20} /></div>
                    <h2 className="text-lg font-bold text-gray-900">Goals & Timeline</h2>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Primary Goal</span>
               </div>

               <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <div className="flex-1 w-full">
                     <div className="flex justify-between mb-2">
                        <span className="font-bold text-gray-700">Build ₹1L Portfolio</span>
                        <span className="font-bold text-green-600 text-xl">45%</span>
                     </div>
                     {/* Progress Bar */}
                     <div className="h-3 bg-gray-100 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full w-[45%]"></div>
                     </div>
                     <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                        <span>Start</span>
                        <span>Target: 3 Years</span>
                     </div>
                  </div>

                  <div className="flex gap-8 border-l border-gray-100 pl-8">
                     <div>
                        <p className="text-xs text-gray-400 font-medium">SIP Required</p>
                        <p className="text-lg font-bold text-gray-900">₹2,500<span className="text-xs font-normal text-gray-400">/mo</span></p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-400 font-medium">Current Status</p>
                        <div className="flex items-center gap-1 text-green-600 font-bold">
                           <CheckCircle size={16} /> On Track
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 3. Portfolio Allocation Plan */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Portfolio Allocation Plan</h2>
                  <p className="text-gray-500 text-xs mt-1">Adjust your buy orders to match these targets for optimal balance.</p>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="text-xs text-green-700 font-bold uppercase tracking-wide border-b border-gray-50">
                       <th className="py-3 pl-2">Bucket</th>
                       <th className="py-3 text-center">Current</th>
                       <th className="py-3 text-center">Target</th>
                       <th className="py-3 text-right pr-2">Action</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {/* Row 1 */}
                     <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                       <td className="py-4 pl-2">
                         <p className="font-bold text-gray-900">Large-cap IT</p>
                         <p className="text-xs text-green-600">Stable Growth</p>
                       </td>
                       <td className="py-4 text-center font-medium text-gray-600">25%</td>
                       <td className="py-4 text-center font-bold text-gray-900">35%</td>
                       <td className="py-4 text-right pr-2">
                         <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition flex items-center gap-1 ml-auto">
                           Buy More <TrendingDown size={12} className="rotate-180" />
                         </button>
                       </td>
                     </tr>
                     {/* Row 2 */}
                     <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                       <td className="py-4 pl-2">
                         <p className="font-bold text-gray-900">Nifty 50 Index</p>
                         <p className="text-xs text-green-600">Core Foundation</p>
                       </td>
                       <td className="py-4 text-center font-medium text-gray-600">10%</td>
                       <td className="py-4 text-center font-bold text-gray-900">20%</td>
                       <td className="py-4 text-right pr-2">
                         <button className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition flex items-center gap-1 ml-auto">
                           Start SIP <Plus size={12} />
                         </button>
                       </td>
                     </tr>
                     {/* Row 3 */}
                     <tr className="hover:bg-gray-50/50">
                       <td className="py-4 pl-2">
                         <p className="font-bold text-gray-900">Mid-cap Pharma</p>
                         <p className="text-xs text-green-600">Aggressive</p>
                       </td>
                       <td className="py-4 text-center font-medium text-gray-600">30%</td>
                       <td className="py-4 text-center font-bold text-gray-900">25%</td>
                       <td className="py-4 text-right pr-2">
                         <button className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition flex items-center gap-1 ml-auto">
                           Stop Adding <Ban size={12} />
                         </button>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>

            {/* 4. Suggested Next Moves */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                 <h2 className="text-lg font-bold text-gray-900">Suggested Next Moves</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Move 1 */}
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer relative">
                    <div className="w-5 h-5 rounded border border-gray-300 absolute top-5 right-5"></div>
                    <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-3">
                       <Wallet size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">Add ₹1,000</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Buy Reliance Industries units directly in your demat.</p>
                 </div>

                 {/* Move 2 */}
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer relative">
                    <div className="w-5 h-5 rounded border border-gray-300 absolute top-5 right-5"></div>
                    <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-3">
                       <RefreshCw size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">Start SIP</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Setup ₹500 monthly SIP in Nifty 50 Index Fund.</p>
                 </div>

                 {/* Move 3 */}
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer relative">
                    <div className="w-5 h-5 rounded border border-gray-300 absolute top-5 right-5"></div>
                    <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center text-green-600 mb-3">
                       <Scale size={20} />
                    </div>
                    <h3 className="font-bold text-gray-900">Rebalance</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ensure no single stock exceeds 30% of portfolio.</p>
                 </div>
              </div>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Sidebar) --- */}
          <div className="space-y-6">
            
            {/* 1. Safety Guardrails (Dark Card) */}
            <div className="bg-[#0F291E] rounded-3xl p-6 text-white shadow-lg">
               <div className="flex items-center gap-2 mb-4 border-b border-green-800 pb-4">
                  <div className="text-green-400"><CheckCircle size={20} /></div>
                  <h3 className="font-bold text-lg">Safety Guardrails</h3>
               </div>
               <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                     <div className="mt-1 text-green-400 shrink-0"><CheckCircle size={14} fill="currentColor" className="text-[#0F291E]" /></div>
                     <span className="text-gray-300 leading-relaxed">
                        <span className="text-white font-bold">Max 25-30%</span> allocation in a single stock.
                     </span>
                  </li>
                  <li className="flex gap-3">
                     <div className="mt-1 text-green-400 shrink-0"><CheckCircle size={14} fill="currentColor" className="text-[#0F291E]" /></div>
                     <span className="text-gray-300 leading-relaxed">
                        Keep <span className="text-white font-bold">3-6 months</span> expenses in safe assets.
                     </span>
                  </li>
                  <li className="flex gap-3">
                     <div className="mt-1 text-red-400 shrink-0"><Ban size={14} /></div>
                     <span className="text-gray-300 leading-relaxed">
                        No leveraged products / F&O.
                     </span>
                  </li>
               </ul>
            </div>

            {/* 2. If This Happens... */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               <div className="flex items-center gap-2 mb-4 text-green-700">
                  <div className="text-green-600"><RefreshCw size={18} /></div>
                  <h3 className="font-bold">If This Happens...</h3>
               </div>
               
               <div className="space-y-4">
                  {/* Scenario 1 */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                     <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase mb-1">
                        <TrendingDown size={14} /> Market Falls 10%
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Don't panic. Stick to SIPs. Consider adding lump sum if you have cash.
                     </p>
                  </div>
                  
                  {/* Scenario 2 */}
                  <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                     <div className="flex items-center gap-2 text-yellow-800 font-bold text-xs uppercase mb-1">
                        <Wallet size={14} /> Extra ₹5,000 Bonus
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed">
                        Top up Emergency Fund first. Then allocate 70% to Index Fund.
                     </p>
                  </div>
               </div>
            </div>

            {/* 3. Did You Know? */}
            <div className="bg-green-50 rounded-3xl p-6 border border-green-100 relative overflow-hidden">
               <div className="flex items-center gap-2 mb-2 text-green-800">
                  <div className="text-green-600"><BookOpen size={18} /></div>
                  <h3 className="font-bold text-sm">Did you know?</h3>
               </div>
               <p className="text-xs text-green-700 leading-relaxed mb-3 relative z-10">
                  Consistent investing beats timing the market 9 out of 10 times over a 10-year period.
               </p>
               <a href="#" className="text-xs font-bold text-green-600 flex items-center gap-1 hover:gap-2 transition-all relative z-10">
                  Read Article <ArrowRight size={12} />
               </a>
               {/* Decorative Icon */}
               <BookOpen size={80} className="absolute -bottom-4 -right-4 text-green-100 opacity-50 rotate-12" />
            </div>

          </div>

        </div>
        

      </main>
      <ChatWidget />
    </div>
  );
}