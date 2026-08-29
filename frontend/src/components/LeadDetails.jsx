import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Building2,
  Briefcase,
  User,
  Target,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react'

import { api } from '../services/api'
import ScoreBreakdown from './ScoreBreakdown'

function LeadDetails() {
  const { id } = useParams()

  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadLead()
  }, [id])

  const loadLead = async () => {
    try {
      setLoading(true)
      const data = await api.getLead(id)
      setLead(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={styles.center}>Loading lead...</div>
  }

  if (error) {
    return (
      <div style={styles.center}>
        <AlertTriangle size={40} />
        <p>{error}</p>
        <Link to="/leads">Back to Leads</Link>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Link to="/leads" style={styles.back}>
        <ArrowLeft size={18} />
        Back to Leads
      </Link>

      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{lead.name}</h1>
            <p style={styles.subtitle}>
              {lead.company} • {lead.job_title}
            </p>
          </div>

          <div style={styles.score}>
            Score {lead.score}
          </div>
        </div>

        <div style={styles.grid}>
          <Info icon={<Mail size={18} />} label="Email" value={lead.email} />
          <Info icon={<Building2 size={18} />} label="Company" value={lead.company} />
          <Info icon={<Briefcase size={18} />} label="Job Title" value={lead.job_title} />
          <Info icon={<Target size={18} />} label="Source" value={lead.source} />
          <Info icon={<DollarSign size={18} />} label="Value" value={`₹${Number(lead.value || 0).toLocaleString('en-IN')}`} />
          <Info icon={<Calendar size={18} />} label="Created" value={lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '—'} />
        </div>
      </div>

      <div style={styles.breakdown}>
        <ScoreBreakdown leadId={lead.id} />
      </div>
    </div>
  )
}

function Info({ icon, label, value }) {
  return (
    <div style={styles.info}>
      {icon}
      <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.value}>{value || '—'}</div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '32px'
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: 'var(--primary)',
    marginBottom: '20px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: 'var(--shadow-sm)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '28px'
  },
  title: {
    margin: 0,
    fontSize: '30px'
  },
  subtitle: {
    color: 'var(--text-muted)'
  },
  score: {
    padding: '10px 16px',
    borderRadius: '10px',
    background: '#eef2ff',
    color: '#4f46e5',
    fontWeight: 700
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '22px'
  },
  info: {
    display: 'flex',
    gap: '12px'
  },
  label: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  value: {
    fontWeight: 600,
    marginTop: '4px'
  },
  breakdown: {
    marginTop: '24px'
  },
  center: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
}

export default LeadDetails