"use client";

import React, { useEffect, useState } from "react";

// --- Configuration ---
// Make sure this matches your Django backend endpoint exactly.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/learn/infy/";

// --- Types ---
type TrendInfo = {
  trend10: string;
  trend30: string;
  volatility: string;
  steadiness: string;
};

type LearnData = {
  symbol: string;
  changePct: number;
  beginnerVerdict: string;
  futureScenario: string;
  whyUpNow: string;
  factors: {
    earnings: string;
    sector: string;
    global: string;
    investorActivity: string;
  };
  confidenceScore: number;
  buyingPressure: number;
  sellingPressure: number;
  ifHolding: string;
  ifNew: string;
  sectorDescription: string;
  trends: {
    infosys: TrendInfo;
    tcs: TrendInfo;
    wipro: TrendInfo;
  };
  popularReasons: string[];
};

// --- Icons ---
const Icons = {
  Logo: () => (
    <svg className="h-8 w-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
        fill="#22C55E"
      />
    </svg>
  ),
  Search: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  TrendingUp: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  TrendingDown: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
      />
    </svg>
  ),
  Stable: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Bulb: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  ),
  Verified: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  Money: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  Chart: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  Activity: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  Mic: () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  ),
};

const LearnPage: React.FC = () => {
  const [data, setData] = useState<LearnData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("🔎 Calling API_URL:", API_URL);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // If later you secure the API, add:
          // "Authorization": `Bearer ${localStorage.getItem("access")}`,
        },
      });

      console.log("✅ Response status:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Backend error body:", text);
        throw new Error(`Backend error: ${res.status} ${res.statusText}`);
      }

      const json: LearnData = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("API Error:", err);
      setError(err?.message || "Network error: could not reach backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getTrendIcon = (trend: string) => {
    if (trend.includes("Up"))
      return (
        <div className="text-green-500">
          <Icons.TrendingUp />
        </div>
      );
    if (trend.includes("Down"))
      return (
        <div className="text-red-500">
          <Icons.TrendingDown />
        </div>
      );
    return (
      <div className="text-gray-500">
        <Icons.Stable />
      </div>
    );
  };

  const getTrendColor = (trend: string) => {
    if (trend.includes("Up")) return "text-[#22C55E]";
    if (trend.includes("Down")) return "text-[#EF4444]";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-gray-500 font-medium">Analyzing market data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl border border-red-100 shadow-sm max-w-md text-center">
          <div className="p-3 bg-red-50 rounded-full text-red-500">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Unable to Load Data</h2>
          <p className="text-sm text-gray-500 break-all">
            {error ?? "Something went wrong fetching stock data."}
          </p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const d = data;

  return (
    <div className="flex min-h-screen w-full font-sans bg-[#F9FAFB] text-[#111827]">
      <main className="flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#E5E7EB] bg-white/80 px-8 backdrop-blur-sm">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <Icons.Logo />
              <h1 className="text-2xl font-bold tracking-tighter">WealthWiz</h1>
            </div>
            <nav className="flex items-center gap-6">
              <a className="text-[#4B5563] hover:text-[#111827] transition-colors" href="#">
                Dashboard
              </a>
              <a className="text-[#4B5563] hover:text-[#111827] transition-colors" href="#">
                My Readiness
              </a>
              <a className="text-[#4B5563] hover:text-[#111827] transition-colors" href="#">
                My Plan
              </a>
              <a
                className="font-semibold text-[#16A34A] relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#16A34A]"
                href="#"
              >
                Learn
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#4B5563] hover:text-[#111827]">
              <Icons.Search />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-200 to-green-400 h-10 w-10 rounded-full" />
              <p className="text-base font-medium">Hi, Aditi 👋</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-8 py-10">
          <div className="grid grid-cols-12 gap-8">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
              {/* Top Card */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{d.symbol} - Stock Understanding</h2>
                    <p className="text-sm text-[#4B5563]">
                      Your simplified guide to what's happening today.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-[#22C55E]">
                    <Icons.TrendingUp />
                    <span>
                      {d.changePct > 0 ? "+" : ""}
                      {d.changePct}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg bg-[#EAFBF0] p-4">
                    <h3 className="font-semibold text-[#166534]">Beginner Verdict</h3>
                    <p className="mt-1 text-sm text-[#4B5563]">{d.beginnerVerdict}</p>
                  </div>
                  <div className="rounded-lg bg-gray-100 p-4">
                    <h3 className="font-semibold">Future Scenario</h3>
                    <p className="mt-1 text-sm text-[#4B5563]">{d.futureScenario}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 rounded-lg border border-[#E5E7EB] p-4">
                    <h3 className="font-semibold text-[#111827]">
                      Why is this stock going up right now?
                    </h3>
                    <p className="text-sm text-[#4B5563]">{d.whyUpNow}</p>
                  </div>
                  <div className="space-y-4 rounded-lg border border-[#E5E7EB] p-4">
                    <h3 className="font-semibold text-[#111827]">
                      What factors affect this stock?
                    </h3>
                    <ul className="list-none space-y-2 text-sm text-[#4B5563]">
                      <li>
                        <strong className="text-[#111827]">Earnings:</strong> {d.factors.earnings}
                      </li>
                      <li>
                        <strong className="text-[#111827]">Sector Performance:</strong>{" "}
                        {d.factors.sector}
                      </li>
                      <li>
                        <strong className="text-[#111827]">Global Cues:</strong>{" "}
                        {d.factors.global}
                      </li>
                      <li>
                        <strong className="text-[#111827]">Investor Activity:</strong>{" "}
                        {d.factors.investorActivity}
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Sector Spotlight */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Sector Spotlight: IT Services Comparison</h2>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-[#EAFBF0] px-4 py-2 text-sm font-semibold text-[#15803d]">
                      IT
                    </button>
                  </div>
                </div>
                <p className="mb-6 max-w-3xl text-[#4B5563]">{d.sectorDescription}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(Object.keys(d.trends) as Array<keyof typeof d.trends>).map((key) => {
                    const company = d.trends[key];
                    const name = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <div
                        key={key}
                        className="space-y-3 rounded-lg border border-[#E5E7EB] p-4"
                      >
                        <h3 className="text-lg font-bold">
                          {name === "Infosys" ? "Infosys" : name.toUpperCase()}
                        </h3>
                        <div className="text-xs text-[#4B5563]">
                          <span className="font-semibold text-[#111827]">10-Day Trend: </span>
                          <span className={`font-medium ${getTrendColor(company.trend10)}`}>
                            {company.trend10}
                          </span>
                          <span className="inline-block align-middle ml-1">
                            {getTrendIcon(company.trend10)}
                          </span>
                        </div>
                        <div className="text-xs text-[#4B5563]">
                          <span className="font-semibold text-[#111827]">30-Day Trend: </span>
                          <span className={`font-medium ${getTrendColor(company.trend30)}`}>
                            {company.trend30}
                          </span>
                        </div>
                        <div className="text-xs text-[#4B5563]">
                          <span className="font-semibold text-[#111827]">Volatility: </span>
                          <span className="font-medium">{company.volatility}</span>
                        </div>
                        <div className="text-xs text-[#4B5563]">
                          <span className="font-semibold text-[#111827]">Steadiness (1-Yr): </span>
                          <span className="font-medium">{company.steadiness}</span>
                        </div>
                        <div className="my-2 h-16 w-full rounded bg-gradient-to-t from-gray-100 to-transparent" />
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Educational Modules */}
              <section>
                <h2 className="mb-4 text-xl font-bold">
                  “Why This Stock Moves” — Educational Modules
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "What are earnings?",
                      subtitle: "Learn about profit reports.",
                      icon: <Icons.Money />,
                    },
                    {
                      title: "What is volume?",
                      subtitle: "Understand trading activity.",
                      icon: <Icons.Activity />,
                    },
                    {
                      title: "What is volatility?",
                      subtitle: "Discover price swings.",
                      icon: <Icons.Chart />,
                    },
                  ].map((module, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="group flex items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm transition-all hover:border-green-300 hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#EAFBF0] text-[#16A34A]">
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <p className="text-sm text-[#4B5563]">{module.subtitle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
              {/* Confidence Meter */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold">Confidence Meter</h3>
                  <div className="flex items-center gap-2 rounded-full bg-[#EAFBF0] px-3 py-1">
                    <span className="text-[#15803d]">
                      <Icons.Verified />
                    </span>
                    <p className="font-semibold text-[#166534]">{d.confidenceScore}/100</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[#4B5563]">
                  Fairly stable for long-term beginners. Based on volatility, sector stability,
                  30-day trend, and investor activity.
                </p>
              </section>

              {/* Buy/Sell Gauge */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold mb-4">Buy/Sell Pressure Gauge</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#4B5563] mb-1">
                      <span>Buying Pressure</span>
                      <span className="text-[#111827]">{d.buyingPressure}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-[#22C55E]"
                        style={{ width: `${d.buyingPressure}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#4B5563] mb-1">
                      <span>Selling Pressure</span>
                      <span className="text-[#111827]">{d.sellingPressure}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-[#EF4444]"
                        style={{ width: `${d.sellingPressure}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* If You Own This Stock */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-base font-bold">If You Own This Stock Already</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-[#16A34A] mt-0.5">
                      <Icons.Check />
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm">If holding:</h4>
                      <p className="text-sm text-[#4B5563]">{d.ifHolding}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-[#16A34A] mt-0.5">
                      <Icons.Bulb />
                    </span>
                    <div>
                      <h4 className="font-semibold text-sm">If new:</h4>
                      <p className="text-sm text-[#4B5563]">{d.ifNew}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Simple Charts */}
              <section className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-base font-bold">
                  {d.symbol} - Simple Explainable Charts
                </h3>
                <p className="mb-4 text-sm text-[#4B5563]">
                  A simplified view of key trends for beginners.
                </p>
                <div className="space-y-5">
                  <div>
                    <p className="text-sm font-medium">Price Trend (30 days)</p>
                    <div className="mt-2 h-16 w-full bg-[#86efac]/50 rounded border border-green-200 flex items-center justify-center">
                      <Icons.TrendingUp />
                    </div>
                    <p className="mt-1 text-xs text-[#4B5563]">
                      Shows if the stock price went up or down over the last month.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Volume Trend (30 days)</p>
                    <div className="mt-2 h-16 w-full bg-gray-800 rounded flex items-end justify-center gap-1 p-2">
                      <div className="w-2 h-4 bg-gray-500 rounded-t" />
                      <div className="w-2 h-8 bg-gray-400 rounded-t" />
                      <div className="w-2 h-6 bg-gray-500 rounded-t" />
                      <div className="w-2 h-10 bg-white rounded-t" />
                      <div className="w-2 h-5 bg-gray-500 rounded-t" />
                    </div>
                    <p className="mt-1 text-xs text-[#4B5563]">
                      Shows how much the stock was traded. High bars mean more activity.
                    </p>
                  </div>
                </div>
              </section>

              {/* Popularity */}
              <section className="rounded-xl border border-[#E5E7EB] bg-[#EAFBF0] p-6 shadow-sm">
                <h3 className="mb-3 text-base font-bold text-[#166534]">
                  Why This Stock is Popular (Beginner Justification)
                </h3>
                <ul className="space-y-2">
                  {d.popularReasons.map((reason, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#15803d]">
                      <Icons.Verified />
                      {reason}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
