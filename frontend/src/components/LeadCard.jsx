import React, { useState } from 'react'
import { api } from '../services/api'
import ScoreBreakdown from './ScoreBreakdown'
import EditLead from './EditLead'
import {
  Mail,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  Trash2,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Clock3,
  DollarSign,
  Globe2,
  Users,
  Flame,
  CheckCircle2,
  CircleAlert,
  Snowflake
} from 'lucide-react'

function LeadCard({
  lead,
  onDelete,
  onUpdated,
  compact = false,
  showBreakdown = false
}) {
  const [expanded, setExpanded] = useState(false)
  const [breakdown, setBreakdown] = useState(null)
  const [loadingBreakdown, setLoadingBreakdown] = useState(false)
  const [editing, setEditing] = useState(false)

  const score = Number(lead?.score) || 0

  /* ==========================================================
     SCORE
  ========================================================== */

  const getScoreColor = (value) => {
    if (value >= 70) return 'var(--success)'
    if (value >= 50) return 'var(--primary)'
    if (value >= 25) return 'var(--warning)'
    return 'var(--danger)'
  }

  const getScoreBg = (value) => {
    if (value >= 70) return 'var(--success-light)'
    if (value >= 50) return 'var(--primary-light)'
    if (value >= 25) return 'var(--warning-light)'
    return 'var(--danger-light)'
  }

  const getScoreStatus = (value) => {
    if (value >= 70) {
      return {
        label: 'Hot Lead',
        icon: Flame,
        color: 'var(--danger)',
        background: 'var(--danger-light)'
      }
    }

    if (value >= 50) {
      return {
        label: 'Qualified',
        icon: CheckCircle2,
        color: 'var(--success)',
        background: 'var(--success-light)'
      }
    }

    if (value >= 25) {
      return {
        label: 'Warm Lead',
        icon: CircleAlert,
        color: 'var(--warning)',
        background: 'var(--warning-light)'
      }
    }

    return {
      label: 'Cold Lead',
      icon: Snowflake,
      color: 'var(--primary)',
      background: 'var(--primary-light)'
    }
  }

  /* ==========================================================
     TIMELINE
  ========================================================== */

  const getTimeline = (timeline) => {
    const map = {
      immediate: {
        label: 'Immediate',
        icon: '🔥'
      },
      '3_months': {
        label: '3 Months',
        icon: '⚡'
      },
      '6_months': {
        label: '6 Months',
        icon: '📅'
      },
      '1_year': {
        label: '1 Year',
        icon: '📆'
      },
      unknown: {
        label: 'Unknown',
        icon: '❓'
      }
    }

    return map[timeline] || map.unknown
  }

  /* ==========================================================
     SOURCE
  ========================================================== */

  const getSource = (source) => {
    const map = {
      referral: {
        label: 'Referral',
        icon: Users
      },
      linkedin: {
        label: 'LinkedIn',
        icon: BriefcaseBusiness
      },
      website: {
        label: 'Website',
        icon: Globe2
      },
      event: {
        label: 'Event',
        icon: CalendarDays
      },
      email: {
        label: 'Email',
        icon: Mail
      },
      other: {
        label: 'Other',
        icon: Globe2
      }
    }

    return map[source] || map.other
  }

  /* ==========================================================
     DATE
  ========================================================== */

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown date'

    const date = new Date(dateStr)

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date'
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /* ==========================================================
     SCORE BREAKDOWN
  ========================================================== */

  const handleShowBreakdown = async () => {
    if (breakdown) {
      setExpanded(!expanded)
      return
    }

    try {
      setLoadingBreakdown(true)

      const data = await api.getScoreBreakdown(lead.id)

      setBreakdown(data)
      setExpanded(true)
    } catch (err) {
      console.error('Failed to load breakdown:', err)
      alert('Failed to load score breakdown: ' + err.message)
    } finally {
      setLoadingBreakdown(false)
    }
  }

  /* ==========================================================
     UPDATE
  ========================================================== */

  const handleUpdated = (updatedLead) => {
    setEditing(false)

    if (onUpdated) {
      onUpdated(updatedLead)
    }
  }

  const status = getScoreStatus(score)
  const StatusIcon = status.icon
  const source = getSource(lead?.source)
  const SourceIcon = source.icon
  const timeline = getTimeline(lead?.timeline)

  /* ==========================================================
     COMPACT DASHBOARD VERSION
  ========================================================== */

  if (compact) {
    return (
      <div
        style={styles.compactCard}
        className="lead-card-compact"
      >
        <div style={styles.compactAvatar}>
          {(lead?.name || '?').charAt(0).toUpperCase()}
        </div>

        <div style={styles.compactInfo}>
          <div style={styles.compactName}>
            {lead?.name || 'Unnamed Lead'}
          </div>

          <div style={styles.compactMeta}>
            {lead?.company || 'No company'}
            {lead?.job_title ? ` • ${lead.job_title}` : ''}
          </div>
        </div>

        <div
          style={{
            ...styles.compactScore,
            color: getScoreColor(score),
            background: getScoreBg(score)
          }}
        >
          {score}
        </div>
      </div>
    )
  }

  /* ==========================================================
     MAIN CARD
  ========================================================== */

  return (
    <>
      <div
        style={styles.card}
        className="lead-card"
      >

        {/* ====================================================
            TOP SECTION
        ==================================================== */}

        <div style={styles.cardHeader}>

          <div style={styles.identitySection}>

            {/* Avatar */}
            <div
              style={{
                ...styles.avatar,
                background: getScoreBg(score),
                color: getScoreColor(score)
              }}
            >
              {(lead?.name || '?').charAt(0).toUpperCase()}
            </div>

            <div style={styles.leadInfo}>

              <div style={styles.nameRow}>

                <div style={styles.name}>
                  {lead?.name || 'Unnamed Lead'}
                </div>

                <div
                  style={{
                    ...styles.statusBadge,
                    color: status.color,
                    background: status.background
                  }}
                >
                  <StatusIcon size={13} />
                  {status.label}
                </div>

              </div>

              <div style={styles.meta}>

                {lead?.email && (
                  <span style={styles.metaItem}>
                    <Mail size={13} />
                    {lead.email}
                  </span>
                )}

                {lead?.company && (
                  <span style={styles.metaItem}>
                    <Building2 size={13} />
                    {lead.company}
                  </span>
                )}

                {lead?.job_title && (
                  <span style={styles.metaItem}>
                    <BriefcaseBusiness size={13} />
                    {lead.job_title}
                  </span>
                )}

              </div>

            </div>
          </div>

          {/* ==================================================
              SCORE
          ================================================== */}

          <div
            style={{
              ...styles.scoreCircle,
              borderColor: getScoreColor(score),
              background: getScoreBg(score)
            }}
            title={`Lead score: ${score}/100`}
          >
            <div
              style={{
                ...styles.scoreValue,
                color: getScoreColor(score)
              }}
            >
              {score}
            </div>

            <div style={styles.scoreLabel}>
              /100
            </div>
          </div>

        </div>

        {/* ====================================================
            SCORE PROGRESS
        ==================================================== */}

        <div style={styles.scoreProgressWrapper}>

          <div style={styles.scoreProgressHeader}>
            <span style={styles.scoreProgressLabel}>
              Lead Quality
            </span>

            <span
              style={{
                ...styles.scoreProgressValue,
                color: getScoreColor(score)
              }}
            >
              {score}%
            </span>
          </div>

          <div style={styles.progressTrack}>
            <div
              style={{
                ...styles.progressFill,
                width: `${Math.min(Math.max(score, 0), 100)}%`,
                background: getScoreColor(score)
              }}
            />
          </div>

        </div>

        {/* ====================================================
            INFORMATION TAGS
        ==================================================== */}

        <div style={styles.tags}>

          {/* Timeline */}
          <div style={styles.infoPill}>
            <Clock3 size={13} />
            <span>
              {timeline.icon} {timeline.label}
            </span>
          </div>

          {/* Source */}
          <div style={styles.infoPill}>
            <SourceIcon size={13} />
            <span>
              {source.label}
            </span>
          </div>

          {/* Budget */}
          {lead?.budget !== null &&
            lead?.budget !== undefined &&
            lead?.budget !== '' && (
              <div style={styles.infoPill}>
                <DollarSign size={13} />
                <span>
                  {Number(lead.budget).toLocaleString()}
                </span>
              </div>
            )}

        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div style={styles.cardFooter}>

          <div style={styles.date}>
            <CalendarDays size={13} />
            <span>
              {formatDate(lead?.created_at)}
            </span>
          </div>

          <div style={styles.actions}>

            {/* Edit */}
            {onUpdated && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={styles.actionButton}
                className="lead-action-button"
              >
                <Pencil size={14} />
                <span>Edit</span>
              </button>
            )}

            {/* Breakdown */}
            {showBreakdown && (
              <button
                type="button"
                onClick={handleShowBreakdown}
                disabled={loadingBreakdown}
                style={styles.actionButton}
                className="lead-action-button"
              >
                {loadingBreakdown ? (
                  <>
                    <span style={styles.spinner}>⏳</span>
                    <span>Loading...</span>
                  </>
                ) : expanded ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Hide Score</span>
                  </>
                ) : (
                  <>
                    <BarChart3 size={14} />
                    <span>Score Breakdown</span>
                  </>
                )}
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                style={styles.deleteButton}
                className="lead-delete-button"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}

          </div>

        </div>

        {/* ====================================================
            SCORE BREAKDOWN
        ==================================================== */}

        {expanded && breakdown && (
          <div
            style={styles.breakdownWrapper}
            className="animate-fade-in"
          >
            <div style={styles.breakdownHeader}>
              <div style={styles.breakdownTitle}>
                <BarChart3 size={16} />
                Score Breakdown
              </div>

              <button
                type="button"
                onClick={() => setExpanded(false)}
                style={styles.closeBreakdown}
              >
                <ChevronUp size={16} />
              </button>
            </div>

            <ScoreBreakdown breakdown={breakdown} />
          </div>
        )}

      </div>

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editing && (
        <EditLead
          lead={lead}
          onClose={() => setEditing(false)}
          onUpdated={handleUpdated}
        />
      )}

      {/* ======================================================
          RESPONSIVE STYLES
      ====================================================== */}

      <style>
        {`
          .lead-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
            border-color: var(--gray-200);
          }

          .lead-card-compact:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow);
          }

          .lead-action-button:hover {
            background: var(--primary-light) !important;
            color: var(--primary-dark) !important;
          }

          .lead-delete-button:hover {
            background: var(--danger-light) !important;
            color: var(--danger) !important;
          }

          .lead-action-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          @media (max-width: 700px) {
            .lead-card {
              padding: 16px !important;
            }

            .lead-card > div:first-child {
              flex-direction: column !important;
              gap: 14px !important;
            }

            .lead-card .score-circle {
              align-self: flex-start;
            }
          }

          @media (max-width: 560px) {
            .lead-card {
              padding: 14px !important;
            }

            .lead-card .lead-action-button span,
            .lead-card .lead-delete-button span {
              display: none;
            }

            .lead-card .lead-action-button,
            .lead-card .lead-delete-button {
              padding: 8px !important;
            }
          }

          @media (max-width: 450px) {
            .lead-card-compact {
              padding: 12px !important;
            }
          }
        `}
      </style>
    </>
  )
}

/* ============================================================
   STYLES
============================================================ */

const styles = {

  /* ==========================================================
     MAIN CARD
  ========================================================== */

  card: {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--gray-100)',
    transition: 'var(--transition)',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '16px',
  },

  identitySection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
    minWidth: 0,
  },

  avatar: {
    width: '44px',
    height: '44px',
    minWidth: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '17px',
    fontWeight: 700,
  },

  leadInfo: {
    flex: 1,
    minWidth: 0,
  },

  nameRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '7px',
  },

  name: {
    fontSize: '17px',
    fontWeight: 700,
    color: 'var(--gray-900)',
    lineHeight: 1.3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '11px',
    fontWeight: 700,
    padding: '4px 8px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },

  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px 12px',
    fontSize: '12px',
    color: 'var(--gray-500)',
  },

  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    minWidth: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  /* ==========================================================
     SCORE
  ========================================================== */

  scoreCircle: {
    width: '64px',
    height: '64px',
    minWidth: '64px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    lineHeight: 1,
    flexShrink: 0,
  },

  scoreValue: {
    fontSize: '20px',
    fontWeight: 800,
  },

  scoreLabel: {
    fontSize: '9px',
    color: 'var(--gray-500)',
    marginTop: '3px',
    fontWeight: 600,
  },

  scoreProgressWrapper: {
    marginBottom: '16px',
  },

  scoreProgressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },

  scoreProgressLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--gray-500)',
  },

  scoreProgressValue: {
    fontSize: '11px',
    fontWeight: 700,
  },

  progressTrack: {
    width: '100%',
    height: '6px',
    background: 'var(--gray-100)',
    borderRadius: '10px',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.4s ease',
  },

  /* ==========================================================
     TAGS
  ========================================================== */

  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px',
    marginBottom: '16px',
  },

  infoPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    fontWeight: 600,
    padding: '6px 9px',
    borderRadius: '8px',
    background: 'var(--gray-50)',
    color: 'var(--gray-600)',
    border: '1px solid var(--gray-100)',
    whiteSpace: 'nowrap',
  },

  /* ==========================================================
     FOOTER
  ========================================================== */

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '13px',
    borderTop: '1px solid var(--gray-100)',
  },

  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '11px',
    color: 'var(--gray-400)',
    minWidth: 0,
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '4px',
    flexWrap: 'wrap',
  },

  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    background: 'transparent',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--primary)',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '7px',
    transition: 'var(--transition)',
  },

  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    background: 'transparent',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--danger)',
    cursor: 'pointer',
    padding: '6px 8px',
    borderRadius: '7px',
    transition: 'var(--transition)',
  },

  spinner: {
    fontSize: '12px',
  },

  /* ==========================================================
     BREAKDOWN
  ========================================================== */

  breakdownWrapper: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px dashed var(--gray-200)',
  },

  breakdownHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },

  breakdownTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--gray-800)',
  },

  closeBreakdown: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gray-50)',
    border: '1px solid var(--gray-100)',
    borderRadius: '6px',
    color: 'var(--gray-500)',
    cursor: 'pointer',
    padding: '5px',
  },

  /* ==========================================================
     COMPACT DASHBOARD CARD
  ========================================================== */

  compactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-100)',
    transition: 'var(--transition)',
  },

  compactAvatar: {
    width: '34px',
    height: '34px',
    minWidth: '34px',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '13px',
    fontWeight: 700,
  },

  compactInfo: {
    flex: 1,
    minWidth: 0,
  },

  compactName: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--gray-800)',
    marginBottom: '3px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  compactMeta: {
    fontSize: '11px',
    color: 'var(--gray-500)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },

  compactScore: {
    fontSize: '14px',
    fontWeight: 800,
    minWidth: '38px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9px',
    flexShrink: 0,
  },
}

export default LeadCard