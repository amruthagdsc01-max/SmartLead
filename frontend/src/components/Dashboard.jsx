import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Star,
  Target,
  Flame,
  DollarSign,
  Globe2,
  Clock3,
  Trophy,
  ClipboardList,
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

import { api } from '../services/api'

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLeads()
  }, [])

  async function loadLeads() {
    try {
      setLoading(true)
      setError('')

      const data = await api.getLeads()
      setLeads(data || [])
    } catch (err) {
      console.error(err)
      setError('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  const totalLeads = leads.length

  const qualifiedLeads = leads.filter(
    lead =>
      lead.status?.toLowerCase() === 'qualified' ||
      Number(lead.score) >= 70
  ).length

  const hotLeads = leads.filter(
    lead => Number(lead.score) >= 80
  ).length

  const averageScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce(
            (sum, lead) => sum + (Number(lead.score) || 0),
            0
          ) / totalLeads
        )
      : 0

  const totalValue = leads.reduce(
    (sum, lead) => sum + (Number(lead.value) || 0),
    0
  )

  const chartData = [
    {
      name: 'Total',
      value: totalLeads
    },
    {
      name: 'Qualified',
      value: qualifiedLeads
    },
    {
      name: 'Hot',
      value: hotLeads
    }
  ]

  const statCards = [
    {
      title: 'Total Leads',
      value: totalLeads,
      icon: <Users size={21} />,
      background: '#eef2ff',
      color: '#4f46e5'
    },
    {
      title: 'Qualified Leads',
      value: qualifiedLeads,
      icon: <Target size={21} />,
      background: '#ecfdf5',
      color: '#059669'
    },
    {
      title: 'Hot Leads',
      value: hotLeads,
      icon: <Flame size={21} />,
      background: '#fff7ed',
      color: '#ea580c'
    },
    {
      title: 'Average Score',
      value: averageScore,
      icon: <Star size={21} />,
      background: '#fefce8',
      color: '#ca8a04'
    },
    {
      title: 'Pipeline Value',
      value: `₹${totalValue.toLocaleString('en-IN')}`,
      icon: <DollarSign size={21} />,
      background: '#f0fdf4',
      color: '#16a34a'
    }
  ]

  return (
    <>
      <style>{`
        .dashboard-page {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .dashboard-title {
          margin: 0;
          font-size: 32px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .dashboard-subtitle {
          margin: 7px 0 0;
          color: var(--text-muted);
          font-size: 15px;
        }

        .dashboard-primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 17px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          color: #fff;
          background: var(--primary);
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .dashboard-primary-button:hover {
          transform: translateY(-1px);
          opacity: 0.94;
        }

        .dashboard-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 16px;
          margin-bottom: 20px;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 24px;
        }

        .dashboard-stat-card {
          padding: 22px;
          border-radius: var(--radius-lg);
          transition: all 0.25s ease;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: var(--shadow-sm);
          cursor: default;
          background: #fff;
          min-width: 0;
        }

        .dashboard-stat-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          border-radius: 10px;
        }

        .dashboard-stat-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .dashboard-stat-value {
          font-size: 29px;
          font-weight: 750;
          letter-spacing: -0.5px;
          margin-bottom: 5px;
          overflow-wrap: anywhere;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 22px;
          margin-bottom: 22px;
        }

        .dashboard-card {
          background: #fff;
          border-radius: var(--radius-lg);
          padding: 24px;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: var(--shadow-sm);
          min-width: 0;
        }

        .dashboard-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .dashboard-card-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .dashboard-card-subtitle {
          margin: 6px 0 0;
          color: var(--text-muted);
          font-size: 13px;
        }

        .dashboard-chart {
          width: 100%;
          height: 300px;
        }

        .dashboard-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .dashboard-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 10px;
          text-decoration: none;
          color: inherit;
          background: #f8fafc;
          transition: all 0.2s ease;
          min-width: 0;
        }

        .dashboard-action:hover {
          background: #eef2ff;
          transform: translateX(2px);
        }

        .dashboard-action-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #eef2ff;
          color: #4f46e5;
        }

        .dashboard-action-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
          gap: 3px;
        }

        .dashboard-action-content strong {
          font-size: 14px;
        }

        .dashboard-action-content span {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .dashboard-bottom {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .dashboard-mini-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          border-radius: var(--radius-lg);
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: var(--shadow-sm);
        }

        .dashboard-mini-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: #f1f5f9;
          color: #475569;
        }

        .dashboard-mini-label {
          font-size: 13px;
          color: var(--text-muted);
          margin-bottom: 3px;
        }

        .dashboard-mini-value {
          font-size: 23px;
          font-weight: 700;
        }

        /* Tablet */
        @media (max-width: 1100px) {
          .dashboard-page {
            padding: 26px;
          }

          .dashboard-stats {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }

        /* Small tablet */
        @media (max-width: 768px) {
          .dashboard-page {
            padding: 22px;
          }

          .dashboard-header {
            align-items: flex-start;
          }

          .dashboard-title {
            font-size: 28px;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .dashboard-stat-card {
            padding: 18px;
          }

          .dashboard-stat-value {
            font-size: 26px;
          }

          .dashboard-card {
            padding: 20px;
          }

          .dashboard-chart {
            height: 280px;
          }

          .dashboard-bottom {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }

        /* Mobile */
        @media (max-width: 560px) {
          .dashboard-page {
            padding: 16px;
          }

          .dashboard-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            margin-bottom: 22px;
          }

          .dashboard-title {
            font-size: 25px;
          }

          .dashboard-subtitle {
            font-size: 14px;
            line-height: 1.5;
          }

          .dashboard-primary-button {
            width: 100%;
          }

          .dashboard-stats {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 18px;
          }

          .dashboard-stat-card {
            padding: 18px;
          }

          .dashboard-stat-icon {
            margin-bottom: 12px;
          }

          .dashboard-stat-value {
            font-size: 25px;
          }

          .dashboard-content {
            gap: 16px;
            margin-bottom: 16px;
          }

          .dashboard-card {
            padding: 18px;
          }

          .dashboard-card-header {
            margin-bottom: 14px;
          }

          .dashboard-card-title {
            font-size: 17px;
          }

          .dashboard-chart {
            height: 250px;
          }

          .dashboard-action {
            padding: 12px;
          }

          .dashboard-action-content span {
            font-size: 11px;
          }

          .dashboard-bottom {
            gap: 12px;
          }

          .dashboard-mini-card {
            padding: 17px;
          }
        }

        /* Very small phones */
        @media (max-width: 380px) {
          .dashboard-page {
            padding: 12px;
          }

          .dashboard-card {
            padding: 15px;
          }

          .dashboard-chart {
            height: 220px;
          }

          .dashboard-action-icon {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
          }
        }
      `}</style>

      <div className="dashboard-page">

        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Overview of your sales leads and pipeline performance.
            </p>
          </div>

          <Link
            to="/add-lead"
            className="dashboard-primary-button"
          >
            <Plus size={18} />
            Add Lead
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="dashboard-error">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Statistic Cards */}
        <div className="dashboard-stats">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="dashboard-stat-card"
              onMouseEnter={e => {
                e.currentTarget.style.transform =
                  'translateY(-3px)'
                e.currentTarget.style.boxShadow =
                  'var(--shadow-md)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform =
                  'translateY(0)'
                e.currentTarget.style.boxShadow =
                  'var(--shadow-sm)'
              }}
            >
              <div
                className="dashboard-stat-icon"
                style={{
                  background: card.background,
                  color: card.color
                }}
              >
                {card.icon}
              </div>

              <div className="dashboard-stat-label">
                {card.title}
              </div>

              <div className="dashboard-stat-value">
                {loading ? '—' : card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="dashboard-content">

          {/* Chart */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">
                  <BarChart3 size={20} />
                  Lead Overview
                </h2>

                <p className="dashboard-card-subtitle">
                  Current lead distribution
                </p>
              </div>
            </div>

            <div className="dashboard-chart">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" />

                  <YAxis allowDecimals={false} />

                  <Tooltip cursor={false} />

                  <Bar
                    dataKey="value"
                    fill="#4f46e5"
                    fillOpacity={1}
                    stroke="#4f46e5"
                    strokeWidth={0}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">
                  <ClipboardList size={20} />
                  Quick Actions
                </h2>

                <p className="dashboard-card-subtitle">
                  Manage your leads quickly
                </p>
              </div>
            </div>

            <div className="dashboard-actions">

              <Link
                to="/leads"
                className="dashboard-action"
              >
                <div className="dashboard-action-icon">
                  <Users size={18} />
                </div>

                <div className="dashboard-action-content">
                  <strong>View All Leads</strong>
                  <span>
                    Browse your complete lead list
                  </span>
                </div>

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/add-lead"
                className="dashboard-action"
              >
                <div className="dashboard-action-icon">
                  <Plus size={18} />
                </div>

                <div className="dashboard-action-content">
                  <strong>Add New Lead</strong>
                  <span>
                    Create a new sales opportunity
                  </span>
                </div>

                <ArrowRight size={18} />
              </Link>

              <Link
                to="/leads"
                className="dashboard-action"
              >
                <div className="dashboard-action-icon">
                  <Trophy size={18} />
                </div>

                <div className="dashboard-action-content">
                  <strong>Top Leads</strong>
                  <span>
                    Focus on your highest scoring leads
                  </span>
                </div>

                <ArrowRight size={18} />
              </Link>

            </div>
          </div>
        </div>

        {/* Performance Cards */}
        <div className="dashboard-bottom">

          <div className="dashboard-mini-card">
            <div className="dashboard-mini-icon">
              <Globe2 size={20} />
            </div>

            <div>
              <div className="dashboard-mini-label">
                Active Pipeline
              </div>

              <div className="dashboard-mini-value">
                {loading ? '—' : totalLeads}
              </div>
            </div>
          </div>

          <div className="dashboard-mini-card">
            <div className="dashboard-mini-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <div className="dashboard-mini-label">
                Average Score
              </div>

              <div className="dashboard-mini-value">
                {loading ? '—' : averageScore}
              </div>
            </div>
          </div>

          <div className="dashboard-mini-card">
            <div className="dashboard-mini-icon">
              <Trophy size={20} />
            </div>

            <div>
              <div className="dashboard-mini-label">
                Hot Opportunities
              </div>

              <div className="dashboard-mini-value">
                {loading ? '—' : hotLeads}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}