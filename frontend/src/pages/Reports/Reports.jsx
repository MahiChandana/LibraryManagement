import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import Loader from '../../components/Loader/Loader';
import './Reports.css';

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportService.getReportData();
      setData(res);
    } catch (err) {
      console.error("Failed to load reports", err);
      setError("Failed to retrieve system analytical reports from API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  if (loading) {
    return <Loader message="Generating system analytics and charts..." />;
  }

  if (error || !data) {
    return (
      <div className="reports-page">
        <div className="alert alert-danger">
          <span>⚠️ {error || "Failed to load reports."}</span>
        </div>
      </div>
    );
  }

  // Categories processing for SVG chart
  const categories = Object.keys(data.categoryCounts || {});
  const catValues = Object.values(data.categoryCounts || {});
  const maxCatVal = Math.max(...catValues, 5); // Fallback to 5 to prevent division by zero

  // Monthly trends processing for SVG chart
  const months = Object.keys(data.monthlyTrends || {});
  const trendValues = Object.values(data.monthlyTrends || {});
  const maxTrendVal = Math.max(...trendValues, 5);

  return (
    <div className="reports-page">
      <div className="page-header">
        <div className="welcome-banner">
          <h1 className="page-title">Library Intelligence Desk</h1>
          <p className="page-subtitle">Historical metrics, stock breakdowns, and active records trends.</p>
        </div>
        <button className="btn btn-secondary refresh-btn" onClick={fetchReportData}>
          🔄 Regenerate Reports
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="reports-summary-grid">
        <div className="report-summary-card">
          <div className="summary-card-header">
            <span className="card-indicator primary"></span>
            <h3>Total Books</h3>
          </div>
          <p className="summary-card-value">{data.totalBooks}</p>
          <span className="summary-card-footer">Total copies registered</span>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-header">
            <span className="card-indicator success"></span>
            <h3>Available Copies</h3>
          </div>
          <p className="summary-card-value">{data.availableBooks}</p>
          <span className="summary-card-footer">Copies currently in shelf</span>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-header">
            <span className="card-indicator warning"></span>
            <h3>Borrowed Log</h3>
          </div>
          <p className="summary-card-value">{data.borrowedBooks}</p>
          <span className="summary-card-footer">Active borrows checked out</span>
        </div>

        <div className={`report-summary-card ${data.overdueBooks > 0 ? 'overdue-alert' : ''}`}>
          <div className="summary-card-header">
            <span className="card-indicator danger"></span>
            <h3>Overdue Copies</h3>
          </div>
          <p className="summary-card-value">{data.overdueBooks}</p>
          <span className="summary-card-footer">Due date has passed!</span>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-header">
            <span className="card-indicator info"></span>
            <h3>Subscribers</h3>
          </div>
          <p className="summary-card-value">{data.totalUsers}</p>
          <span className="summary-card-footer">Registered library readers</span>
        </div>

        <div className="report-summary-card">
          <div className="summary-card-header">
            <span className="card-indicator danger-light"></span>
            <h3>Saved in Wishlist</h3>
          </div>
          <p className="summary-card-value">{data.wishlistCount}</p>
          <span className="summary-card-footer">Wishlist counts by users</span>
        </div>
      </div>

      {/* Analytical Charts Section */}
      <div className="reports-charts-container">
        
        {/* Category breakdown bar chart */}
        <div className="report-chart-card card">
          <h3>Category Distribution (Unique Titles)</h3>
          {categories.length === 0 ? (
            <div className="chart-empty">No category data.</div>
          ) : (
            <div className="svg-chart-wrapper">
              <svg viewBox="0 0 500 250" width="100%" height="100%">
                {/* Horizontal Gridlines */}
                <line x1="50" y1="50" x2="480" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="1" />

                {/* Bars */}
                {categories.map((cat, idx) => {
                  const barWidth = 30;
                  const gap = (400 / categories.length);
                  const x = 70 + (idx * gap);
                  const height = (catValues[idx] / maxCatVal) * 150;
                  const y = 200 - height;
                  
                  return (
                    <g key={cat}>
                      {/* Bar Gradient */}
                      <defs>
                        <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#818cf8" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={height} 
                        fill={`url(#grad-${idx})`} 
                        rx="4"
                      />
                      {/* Count value label */}
                      <text 
                        x={x + barWidth / 2} 
                        y={y - 8} 
                        textAnchor="middle" 
                        fontSize="10" 
                        fontWeight="600" 
                        fill="#475569"
                      >
                        {catValues[idx]}
                      </text>
                      {/* Category Label */}
                      <text 
                        x={x + barWidth / 2} 
                        y="220" 
                        textAnchor="middle" 
                        fontSize="9" 
                        fontWeight="500" 
                        fill="#64748b"
                        transform={`rotate(-15, ${x + barWidth / 2}, 220)`}
                      >
                        {cat.length > 10 ? `${cat.substring(0, 10)}.` : cat}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Monthly trends area chart */}
        <div className="report-chart-card card">
          <h3>Monthly Borrowing Timeline</h3>
          {months.length === 0 ? (
            <div className="chart-empty">No transaction timeline data.</div>
          ) : (
            <div className="svg-chart-wrapper">
              <svg viewBox="0 0 500 250" width="100%" height="100%">
                {/* Horizontal Gridlines */}
                <line x1="50" y1="50" x2="480" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="125" x2="480" y2="125" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="50" y1="200" x2="480" y2="200" stroke="#cbd5e1" strokeWidth="1" />

                {/* Compute points coordinates */}
                {(() => {
                  const points = months.map((month, idx) => {
                    const gap = months.length > 1 ? (380 / (months.length - 1)) : 380;
                    const x = 70 + (idx * gap);
                    const height = (trendValues[idx] / maxTrendVal) * 150;
                    const y = 200 - height;
                    return { x, y, value: trendValues[idx], label: month };
                  });

                  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const areaPath = `${linePath} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

                  return (
                    <g>
                      {/* Area Fill */}
                      <defs>
                        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d={areaPath} fill="url(#areaGrad)" />

                      {/* Connection Line */}
                      <path d={linePath} fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />

                      {/* Vertices Dots and Labels */}
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="#ec4899" strokeWidth="3" />
                          <text 
                            x={p.x} 
                            y={p.y - 10} 
                            textAnchor="middle" 
                            fontSize="10" 
                            fontWeight="600" 
                            fill="#475569"
                          >
                            {p.value}
                          </text>
                          <text 
                            x={p.x} 
                            y="220" 
                            textAnchor="middle" 
                            fontSize="9" 
                            fontWeight="500" 
                            fill="#64748b"
                          >
                            {p.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports;
