import React from 'react'
import {
  SearchCheck,
  DollarSign,
  Clock3,
  Radio,
  BriefcaseBusiness,
  Target,
  Calculator,
  CheckCircle2
} from 'lucide-react'

function ScoreBreakdown({ breakdown }) {

  // ============================================================
  // SCORE FACTORS
  // ============================================================

  const factors = [
    {
      key: 'budget_score',
      label: 'Budget',
      description: 'Estimated purchasing budget',
      weight: 30,
      icon: DollarSign
    },
    {
      key: 'timeline_score',
      label: 'Timeline',
      description: 'How soon the lead wants to purchase',
      weight: 35,
      icon: Clock3
    },
    {
      key: 'source_score',
      label: 'Source',
      description: 'Where the lead came from',
      weight: 20,
      icon: Radio
    },
    {
      key: 'job_title_score',
      label: 'Job Title',
      description: 'Decision-making potential',
      weight: 15,
      icon: BriefcaseBusiness
    }
  ]

  // ============================================================
  // SAFE BREAKDOWN
  // ============================================================

  const safeBreakdown = breakdown || {}

  const totalScore = Number(
    safeBreakdown.total_score || 0
  )

  // ============================================================
  // SCORE COLOR
  // ============================================================

  const getScoreColor = (score) => {
    if (score >= 80) {
      return 'var(--success)'
    }

    if (score >= 60) {
      return 'var(--warning)'
    }

    return 'var(--danger)'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return 'Excellent Lead'
    }

    if (score >= 60) {
      return 'Good Lead'
    }

    if (score >= 40) {
      return 'Potential Lead'
    }

    return 'Low Priority'
  }

  return (
    <div style={styles.container}>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div style={styles.header}>

        <div style={styles.headerIcon}>
          <SearchCheck
            size={20}
            strokeWidth={2}
          />
        </div>

        <div style={styles.headerText}>

          <h4 style={styles.title}>
            Explainable AI
          </h4>

          <p style={styles.subtitle}>
            See exactly how this lead's score was calculated
          </p>

        </div>

      </div>

      {/* ========================================================
          TOTAL SCORE
      ======================================================== */}

      <div style={styles.totalCard}>

        <div style={styles.totalLeft}>

          <div
            style={{
              ...styles.scoreCircle,
              borderColor: getScoreColor(totalScore)
            }}
          >

            <span
              style={{
                ...styles.scoreNumber,
                color: getScoreColor(totalScore)
              }}
            >
              {totalScore.toFixed(1)}
            </span>

            <span style={styles.scoreOutOf}>
              /100
            </span>

          </div>

          <div>

            <div style={styles.totalHeading}>
              Overall Lead Score
            </div>

            <div
              style={{
                ...styles.scoreStatus,
                color: getScoreColor(totalScore)
              }}
            >
              <CheckCircle2 size={15} />
              {getScoreLabel(totalScore)}
            </div>

          </div>

        </div>

        <div style={styles.totalIcon}>
          <Target size={25} />
        </div>

      </div>

      {/* ========================================================
          FACTORS
      ======================================================== */}

      <div style={styles.factorHeading}>

        <div style={styles.factorHeadingLeft}>

          <Calculator size={17} />

          <span>
            Score Factors
          </span>

        </div>

        <span style={styles.factorHeadingHint}>
          Weighted contribution
        </span>

      </div>

      <div style={styles.factors}>

        {factors.map(factor => {

          const Icon = factor.icon

          const score = Number(
            safeBreakdown[factor.key] || 0
          )

          const weighted = (
            score * factor.weight / 100
          ).toFixed(1)

          const percentage = Math.min(
            Math.max(score, 0),
            100
          )

          const scoreColor = getScoreColor(score)

          return (
            <div
              key={factor.key}
              style={styles.factorCard}
            >

              {/* ------------------------------------------------
                  FACTOR HEADER
              ------------------------------------------------ */}

              <div style={styles.factorTop}>

                <div style={styles.factorIdentity}>

                  <div
                    style={{
                      ...styles.factorIcon,
                      color: scoreColor
                    }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                    />
                  </div>

                  <div>

                    <div style={styles.factorLabel}>
                      {factor.label}
                    </div>

                    <div style={styles.factorDescription}>
                      {factor.description}
                    </div>

                  </div>

                </div>

                <div
                  style={{
                    ...styles.weightBadge,
                    color: scoreColor
                  }}
                >
                  {factor.weight}% weight
                </div>

              </div>

              {/* ------------------------------------------------
                  SCORE BAR
              ------------------------------------------------ */}

              <div style={styles.barRow}>

                <div style={styles.barBackground}>

                  <div
                    style={{
                      ...styles.barFill,
                      width: `${percentage}%`,
                      background: scoreColor
                    }}
                  />

                </div>

                <span
                  style={{
                    ...styles.barValue,
                    color: scoreColor
                  }}
                >
                  {score.toFixed(1)}
                </span>

              </div>

              {/* ------------------------------------------------
                  SCORE META
              ------------------------------------------------ */}

              <div style={styles.factorMeta}>

                <span>
                  Raw score
                  <strong style={styles.metaValue}>
                    {score.toFixed(1)} pts
                  </strong>
                </span>

                <span style={styles.arrow}>
                   →
                </span>

              <span>
                Weighted
                <strong
                  style={{
                    ...styles.metaValue,
                    color: scoreColor
                  }}
                >
                  {weighted} pts
                </strong>
               </span>

            </div>

            </div>
          )
        })}

      </div>

      {/* ========================================================
          FORMULA
      ======================================================== */}

      <div style={styles.formulaSection}>

        <div style={styles.formulaHeader}>

          <div style={styles.formulaIcon}>
            <Calculator size={16} />
          </div>

          <div>

            <div style={styles.formulaTitle}>
              Score Calculation
            </div>

            <div style={styles.formulaSubtitle}>
              Each factor contributes according to its weight
            </div>

          </div>

        </div>

        <div style={styles.formulaBox}>

          <span>
            (Budget × 0.30)
          </span>

          <span style={styles.plus}>+</span>

          <span>
            (Timeline × 0.35)
          </span>

          <span style={styles.plus}>+</span>

          <span>
            (Source × 0.20)
          </span>

          <span style={styles.plus}>+</span>

          <span>
            (Job Title × 0.15)
          </span>

        </div>

        <div style={styles.finalCalculation}>

          <span>
            Final Lead Score
          </span>

          <strong
            style={{
              color: getScoreColor(totalScore)
            }}
          >
            {totalScore.toFixed(1)} / 100
          </strong>

        </div>

      </div>

    </div>
  )
}

// ================================================================
// STYLES
// ================================================================

const styles = {

  container: {
    padding: '4px',
    width: '100%',
    boxSizing: 'border-box'
  },

  // ============================================================
  // HEADER
  // ============================================================

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '18px'
  },

  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '11px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  headerText: {
    minWidth: 0
  },

  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 750,
    color: 'var(--gray-900)'
  },

  subtitle: {
    margin: '3px 0 0',
    fontSize: '13px',
    color: 'var(--gray-500)',
    lineHeight: 1.4
  },

  // ============================================================
  // TOTAL SCORE
  // ============================================================

  totalCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px',
    marginBottom: '22px',
    borderRadius: '14px',
    background: 'var(--gray-50)',
    border: '1px solid var(--gray-100)'
  },

  totalLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },

  scoreCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: 'var(--white)',
    flexShrink: 0
  },

  scoreNumber: {
    fontSize: '19px',
    fontWeight: 750,
    lineHeight: 1
  },

  scoreOutOf: {
    fontSize: '10px',
    color: 'var(--gray-500)',
    marginTop: '3px'
  },

  totalHeading: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--gray-800)',
    marginBottom: '5px'
  },

  scoreStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: 650
  },

  totalIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: 'var(--white)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--gray-100)'
  },

  // ============================================================
  // FACTOR HEADING
  // ============================================================

  factorHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },

  factorHeadingLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--gray-800)'
  },

  factorHeadingHint: {
    fontSize: '11px',
    color: 'var(--gray-400)'
  },

  // ============================================================
  // FACTORS
  // ============================================================

  factors: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  factorCard: {
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid var(--gray-100)',
    background: 'var(--white)'
  },

  factorTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },

  factorIdentity: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0
  },

  factorIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '9px',
    background: 'var(--gray-50)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  factorLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--gray-800)'
  },

  factorDescription: {
    marginTop: '2px',
    fontSize: '11px',
    color: 'var(--gray-400)'
  },

  weightBadge: {
    fontSize: '11px',
    fontWeight: 650,
    background: 'var(--gray-50)',
    padding: '5px 8px',
    borderRadius: '6px',
    whiteSpace: 'nowrap'
  },

  // ============================================================
  // SCORE BAR
  // ============================================================

  barRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  barBackground: {
    flex: 1,
    height: '8px',
    background: 'var(--gray-100)',
    borderRadius: '10px',
    overflow: 'hidden'
  },

  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.6s ease-out'
  },

  barValue: {
    minWidth: '42px',
    textAlign: 'right',
    fontSize: '12px',
    fontWeight: 700
  },

  // ============================================================
  // META
  // ============================================================

  factorMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '9px',
    fontSize: '11px',
    color: 'var(--gray-500)'
  },
  
  metaValue: {
  marginLeft: '4px',
  fontWeight: 700
  },

  arrow: {
    color: 'var(--gray-300)',
    fontWeight: 700
  },

  // ============================================================
  // FORMULA
  // ============================================================

  formulaSection: {
    marginTop: '20px',
    paddingTop: '18px',
    borderTop: '1px solid var(--gray-100)'
  },

  formulaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '12px'
  },

  formulaIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--gray-50)',
    color: 'var(--gray-600)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  formulaTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--gray-800)'
  },

  formulaSubtitle: {
    marginTop: '2px',
    fontSize: '11px',
    color: 'var(--gray-400)'
  },

  formulaBox: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '6px',
    padding: '11px 12px',
    borderRadius: '9px',
    background: 'var(--gray-50)',
    border: '1px solid var(--gray-100)',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: 'var(--gray-600)',
    lineHeight: 1.6
  },

  plus: {
    color: 'var(--gray-400)',
    fontWeight: 700
  },

  finalCalculation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    padding: '10px 12px',
    borderRadius: '9px',
    background: 'var(--white)',
    border: '1px solid var(--gray-100)',
    fontSize: '12px',
    color: 'var(--gray-600)'
  }
}

export default ScoreBreakdown