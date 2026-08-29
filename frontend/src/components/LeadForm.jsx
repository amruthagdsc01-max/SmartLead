import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Building2,
  BriefcaseBusiness,
  DollarSign,
  Clock3,
  Globe2,
  Target,
  Sparkles,
  ArrowLeft,
  Plus,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw
} from 'lucide-react'

import { api } from '../services/api'


function LeadForm() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    job_title: '',
    budget: '',
    timeline: 'unknown',
    source: 'other'
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // NEW: success toast
  const [successMessage, setSuccessMessage] = useState(null)


  // ============================================================
  // AUTO HIDE SUCCESS TOAST
  // ============================================================

  useEffect(() => {

    if (!successMessage) return

    const timer = setTimeout(() => {
      setSuccessMessage(null)
    }, 3500)

    return () => clearTimeout(timer)

  }, [successMessage])


  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Remove old error once user starts correcting the form
    if (error) {
      setError(null)
    }
  }


  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {

    if (!formData.name.trim()) {
      return 'Name is required.'
    }

    if (formData.name.trim().length < 2) {
      return 'Name must be at least 2 characters.'
    }

    if (!formData.email.trim()) {
      return 'Email is required.'
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      return 'Please enter a valid email address.'
    }

    if (
      formData.budget !== '' &&
      Number(formData.budget) < 0
    ) {
      return 'Budget cannot be negative.'
    }

    return null
  }


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setError(null)

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {

      const payload = {
        ...formData,
        budget: formData.budget
          ? parseFloat(formData.budget)
          : null
      }

      const data = await api.createLead(payload)

      // Show score result
      setResult(data)

      // NEW: show success toast
      setSuccessMessage('Lead created successfully!')

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        job_title: '',
        budget: '',
        timeline: 'unknown',
        source: 'other'
      })

    } catch (err) {

      console.error('Failed to create lead:', err)

      setError(
        err.message ||
        'Failed to create lead. Please try again.'
      )

    } finally {

      setLoading(false)

    }
  }


  // ============================================================
  // SCORE HELPERS
  // ============================================================

  const getScoreColor = (score) => {

    if (score >= 70) return 'var(--success)'
    if (score >= 50) return 'var(--primary)'
    if (score >= 25) return 'var(--warning)'

    return 'var(--danger)'
  }


  const getScoreLabel = (score) => {

    if (score >= 70) {
      return 'High Quality Lead 🔥'
    }

    if (score >= 50) {
      return 'Medium Quality Lead ⭐'
    }

    if (score >= 25) {
      return 'Low Quality Lead ⚠️'
    }

    return 'Cold Lead ❄️'
  }


  // ============================================================
  // RESET RESULT
  // ============================================================

  const handleAddAnother = () => {

    setResult(null)
    setError(null)
    setSuccessMessage(null)

    setFormData({
      name: '',
      email: '',
      company: '',
      job_title: '',
      budget: '',
      timeline: 'unknown',
      source: 'other'
    })
  }


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      <style>{responsiveStyles}</style>


      {/* ========================================================
          SUCCESS TOAST
      ======================================================== */}

      {successMessage && (

        <div
          role="status"
          aria-live="polite"
          style={styles.successToast}
        >

          <div style={styles.successToastIcon}>
            <CheckCircle2 size={20} />
          </div>


          <div style={styles.successToastContent}>

            <strong style={styles.successToastTitle}>
              Lead Created!
            </strong>

            <span style={styles.successToastText}>
              {successMessage}
            </span>

          </div>


          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            style={styles.successToastClose}
            title="Dismiss"
            aria-label="Dismiss success message"
          >
            <X size={17} />
          </button>

        </div>

      )}


      <div
        className="lead-form-page"
        style={styles.container}
      >

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className="lead-form-header"
          style={styles.header}
        >

          <div style={styles.headerMain}>

            <button
              onClick={() => navigate('/leads')}
              style={styles.backButton}
              title="Back to leads"
            >
              <ArrowLeft size={17} />
            </button>


            <div>

              <div style={styles.titleRow}>

                <div style={styles.titleIcon}>
                  <Plus size={20} />
                </div>

                <h1 style={styles.title}>
                  Add New Lead
                </h1>

              </div>


              <p style={styles.subtitle}>
                Enter lead details and get an AI-powered score
              </p>

            </div>

          </div>


          <div style={styles.aiBadge}>
            <Sparkles size={15} />
            AI Lead Scoring
          </div>

        </div>


        {/* ======================================================
            CONTENT
        ====================================================== */}

        <div
          className="lead-form-content"
          style={styles.contentGrid}
        >


          {/* ====================================================
              FORM CARD
          ==================================================== */}

          <div
            className="lead-form-card"
            style={styles.formCard}
          >

            <form onSubmit={handleSubmit}>


              {/* ------------------------------------------------
                  BASIC INFORMATION
              ------------------------------------------------ */}

              <div style={styles.section}>

                <div style={styles.sectionHeader}>

                  <div style={styles.sectionIcon}>
                    <User size={18} />
                  </div>


                  <div>

                    <h2 style={styles.sectionTitle}>
                      Basic Information
                    </h2>

                    <p style={styles.sectionDescription}>
                      Tell us who the lead is
                    </p>

                  </div>

                </div>


                <div
                  className="lead-form-grid"
                  style={styles.formGrid}
                >


                  {/* Name */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Full Name
                      <span style={styles.required}>
                        *
                      </span>
                    </label>


                    <div style={styles.inputWrapper}>

                      <User
                        size={17}
                        style={styles.inputIcon}
                      />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        placeholder="e.g., John Doe"
                        style={styles.input}
                      />

                    </div>

                  </div>


                  {/* Email */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Email Address
                      <span style={styles.required}>
                        *
                      </span>
                    </label>


                    <div style={styles.inputWrapper}>

                      <Mail
                        size={17}
                        style={styles.inputIcon}
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="e.g., john@company.com"
                        style={styles.input}
                      />

                    </div>

                  </div>


                  {/* Company */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Company
                    </label>


                    <div style={styles.inputWrapper}>

                      <Building2
                        size={17}
                        style={styles.inputIcon}
                      />

                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g., Acme Corp"
                        style={styles.input}
                      />

                    </div>

                  </div>


                  {/* Job Title */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Job Title
                    </label>


                    <div style={styles.inputWrapper}>

                      <BriefcaseBusiness
                        size={17}
                        style={styles.inputIcon}
                      />

                      <input
                        type="text"
                        name="job_title"
                        value={formData.job_title}
                        onChange={handleChange}
                        placeholder="e.g., CTO, VP Engineering"
                        style={styles.input}
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* ------------------------------------------------
                  PURCHASE INFORMATION
              ------------------------------------------------ */}

              <div style={styles.section}>

                <div style={styles.sectionHeader}>

                  <div style={styles.sectionIcon}>
                    <Target size={18} />
                  </div>


                  <div>

                    <h2 style={styles.sectionTitle}>
                      Purchase Information
                    </h2>

                    <p style={styles.sectionDescription}>
                      Help SmartLead understand the opportunity
                    </p>

                  </div>

                </div>


                <div
                  className="lead-form-grid"
                  style={styles.formGrid}
                >


                  {/* Budget */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Estimated Budget
                    </label>


                    <div style={styles.inputWrapper}>

                      <DollarSign
                        size={17}
                        style={styles.inputIcon}
                      />

                      <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        min="0"
                        placeholder="e.g., 50000"
                        style={styles.input}
                      />

                    </div>


                    <span style={styles.helperText}>
                      Enter the estimated deal value
                    </span>

                  </div>


                  {/* Timeline */}

                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Purchase Timeline
                    </label>


                    <div style={styles.inputWrapper}>

                      <Clock3
                        size={17}
                        style={styles.inputIcon}
                      />

                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        style={{
                          ...styles.input,
                          ...styles.selectInput
                        }}
                      >

                        <option value="unknown">
                          Unknown
                        </option>

                        <option value="immediate">
                          Immediate — Hot 🔥
                        </option>

                        <option value="3_months">
                          Within 3 Months
                        </option>

                        <option value="6_months">
                          Within 6 Months
                        </option>

                        <option value="1_year">
                          Within 1 Year
                        </option>

                      </select>

                    </div>

                  </div>


                  {/* Source */}

                  <div
                    className="lead-form-full-width"
                    style={{
                      ...styles.formGroup,
                      gridColumn: '1 / -1'
                    }}
                  >

                    <label style={styles.label}>
                      Lead Source
                    </label>


                    <div style={styles.inputWrapper}>

                      <Globe2
                        size={17}
                        style={styles.inputIcon}
                      />

                      <select
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        style={{
                          ...styles.input,
                          ...styles.selectInput
                        }}
                      >

                        <option value="other">
                          Other
                        </option>

                        <option value="referral">
                          Referral — Best 🌟
                        </option>

                        <option value="linkedin">
                          LinkedIn
                        </option>

                        <option value="website">
                          Website
                        </option>

                        <option value="event">
                          Event
                        </option>

                        <option value="email">
                          Email Campaign
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              </div>


              {/* ------------------------------------------------
                  AI SCORING INFO
              ------------------------------------------------ */}

              <div style={styles.scoringInfo}>

                <div style={styles.scoringIcon}>
                  <Sparkles size={20} />
                </div>


                <div>

                  <h3 style={styles.scoringTitle}>
                    How SmartLead scores this lead
                  </h3>

                  <p style={styles.scoringText}>
                    Your lead will be evaluated using the information
                    you provide, including budget, timeline, source,
                    and lead details.
                  </p>

                </div>

              </div>


              {/* ------------------------------------------------
                  ERROR
              ------------------------------------------------ */}

              {error && (

                <div
                  role="alert"
                  style={styles.errorBox}
                >

                  <div style={styles.errorIconBox}>
                    <AlertCircle size={19} />
                  </div>


                  <div style={styles.errorContent}>

                    <strong style={styles.errorTitle}>
                      Unable to create lead
                    </strong>

                    <span style={styles.errorText}>
                      {error}
                    </span>

                  </div>


                  <button
                    type="button"
                    onClick={() => setError(null)}
                    style={styles.errorClose}
                    title="Dismiss"
                  >
                    <X size={16} />
                  </button>

                </div>

              )}


              {/* ------------------------------------------------
                  FORM ACTIONS
              ------------------------------------------------ */}

              <div
                className="lead-form-actions"
                style={styles.formActions}
              >

                <button
                  type="button"
                  onClick={() => navigate('/leads')}
                  disabled={loading}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    ...(loading
                      ? styles.submitButtonDisabled
                      : {})
                  }}
                >

                  {loading ? (

                    <>
                      <span style={styles.buttonSpinner}></span>
                      Calculating Score...
                    </>

                  ) : (

                    <>
                      <Sparkles size={17} />
                      Calculate Lead Score
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>


          {/* ====================================================
              RESULT CARD
          ==================================================== */}

          {result && (

            <div
              className="lead-form-result"
              style={styles.resultCard}
            >


              <div style={styles.resultHeader}>

                <div style={styles.resultHeaderLeft}>

                  <div style={styles.successIcon}>
                    <CheckCircle2 size={20} />
                  </div>


                  <div>

                    <h2 style={styles.resultTitle}>
                      Lead Created!
                    </h2>

                    <p style={styles.resultSubtitle}>
                      Your lead has been successfully scored
                    </p>

                  </div>

                </div>


                <button
                  onClick={() => setResult(null)}
                  style={styles.closeButton}
                  title="Close result"
                >
                  <X size={18} />
                </button>

              </div>


              {/* Score */}

              <div
                className="score-section"
                style={styles.scoreSection}
              >

                <div style={styles.scoreCircle}>

                  <svg
                    viewBox="0 0 120 120"
                    style={styles.scoreSvg}
                  >

                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="var(--gray-200)"
                      strokeWidth="8"
                    />


                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke={getScoreColor(result.score)}
                      strokeWidth="8"
                      strokeDasharray={`${(result.score / 100) * 314} 314`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{
                        transition:
                          'stroke-dasharray 1s ease'
                      }}
                    />


                    <text
                      x="60"
                      y="55"
                      textAnchor="middle"
                      style={styles.scoreText}
                    >
                      {result.score}
                    </text>


                    <text
                      x="60"
                      y="75"
                      textAnchor="middle"
                      style={styles.scoreLabel}
                    >
                      / 100
                    </text>

                  </svg>

                </div>


                <div style={styles.scoreInfo}>

                  <div
                    style={{
                      ...styles.scoreBadge,
                      background:
                        getScoreColor(result.score) + '20',
                      color:
                        getScoreColor(result.score)
                    }}
                  >
                    {getScoreLabel(result.score)}
                  </div>


                  <h3 style={styles.leadName}>
                    {result.name}
                  </h3>


                  <p style={styles.scoreDesc}>

                    {result.company
                      ? `${result.name} from ${result.company}`
                      : result.name
                    } received a lead score of{' '}

                    <strong>
                      {result.score}/100
                    </strong>.

                  </p>

                </div>

              </div>


              {/* Score Interpretation */}

              <div style={styles.scoreInterpretation}>

                <div style={styles.interpretationHeader}>

                  <Sparkles size={16} />

                  <span>
                    Score Interpretation
                  </span>

                </div>


                <div style={styles.scoreBar}>

                  <div
                    style={{
                      ...styles.scoreBarFill,
                      width: `${Math.min(
                        result.score,
                        100
                      )}%`,
                      background:
                        getScoreColor(result.score)
                    }}
                  />

                </div>


                <div style={styles.scoreScale}>

                  <span>Cold</span>
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>

                </div>

              </div>


              {/* Result Actions */}

              <div
                className="lead-result-actions"
                style={styles.resultActions}
              >

                <button
                  onClick={() => navigate('/leads')}
                  style={styles.secondaryButton}
                >
                  <ClipboardList size={16} />
                  View All Leads
                </button>


                <button
                  onClick={handleAddAnother}
                  style={styles.primaryButton}
                >
                  <Plus size={16} />
                  Add Another Lead
                </button>

              </div>

            </div>

          )}

        </div>

      </div>

    </>
  )
}


// ============================================================
// RESPONSIVE CSS
// ============================================================

const responsiveStyles = `

  .lead-form-page {
    width: 100%;
    box-sizing: border-box;
  }

  .lead-form-header {
    width: 100%;
    box-sizing: border-box;
  }

  .lead-form-content {
    width: 100%;
  }

  .lead-form-grid {
    width: 100%;
  }


  @media (max-width: 800px) {

    .lead-form-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .lead-form-content {
      grid-template-columns: 1fr !important;
    }

    .lead-form-card {
      padding: 22px !important;
    }

    .lead-form-grid {
      grid-template-columns: 1fr !important;
    }

    .lead-form-full-width {
      grid-column: auto !important;
    }

    .lead-form-actions {
      flex-direction: column-reverse !important;
    }

    .lead-form-actions button {
      width: 100% !important;
    }

    .lead-result-actions {
      flex-direction: column !important;
    }

    .lead-result-actions button {
      width: 100% !important;
    }

    .lead-form-result {
      position: static !important;
    }

  }


  @media (max-width: 500px) {

    .lead-form-page {
      padding: 20px 14px !important;
    }

    .lead-form-card {
      padding: 18px !important;
    }

    .lead-form-result {
      padding: 18px !important;
    }

    .lead-form-header {
      margin-bottom: 20px !important;
    }

    .lead-form-header h1 {
      font-size: 24px !important;
    }

    .lead-form-header p {
      font-size: 13px !important;
    }

    .lead-form-card input,
    .lead-form-card select {
      font-size: 13px !important;
    }

    .lead-form-result .score-section {
      flex-direction: column !important;
      text-align: center !important;
    }

    .success-toast {
      top: 14px !important;
      right: 14px !important;
      left: 14px !important;
      width: auto !important;
      max-width: none !important;
    }

  }


  @keyframes leadFormSpin {

    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }

  }


  @keyframes leadFormFade {

    from {
      opacity: 0;
      transform: translateY(8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }

  }


  @keyframes leadFormToastIn {

    from {
      opacity: 0;
      transform: translateX(30px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }

  }

`


// ============================================================
// STYLES
// ============================================================

const styles = {


  // ==========================================================
  // PAGE
  // ==========================================================

  container: {
    maxWidth: '1050px',
    margin: '0 auto',
    padding: '32px 24px',
    boxSizing: 'border-box'
  },


  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px'
  },

  headerMain: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },

  backButton: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-600)',
    borderRadius: '10px',
    cursor: 'pointer'
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  titleIcon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: '10px'
  },

  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  subtitle: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: 'var(--gray-500)'
  },

  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 13px',
    borderRadius: '999px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 700,
    whiteSpace: 'nowrap'
  },


  // ==========================================================
  // CONTENT
  // ==========================================================

  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px'
  },


  // ==========================================================
  // FORM CARD
  // ==========================================================

  formCard: {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '30px',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--gray-100)'
  },


  // ==========================================================
  // SECTION
  // ==========================================================

  section: {
    marginBottom: '30px'
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    marginBottom: '20px'
  },

  sectionIcon: {
    width: '38px',
    height: '38px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--gray-100)',
    color: 'var(--primary)',
    borderRadius: '10px'
  },

  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  sectionDescription: {
    margin: '3px 0 0',
    fontSize: '12px',
    color: 'var(--gray-500)'
  },


  // ==========================================================
  // FORM
  // ==========================================================

  formGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap: '20px'
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  },

  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--gray-700)'
  },

  required: {
    color: 'var(--danger)',
    marginLeft: '3px'
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  inputIcon: {
    position: 'absolute',
    left: '13px',
    color: 'var(--gray-400)',
    pointerEvents: 'none',
    zIndex: 1
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '44px',
    padding: '10px 13px 10px 40px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-800)',
    fontSize: '14px',
    outline: 'none',
    transition: 'var(--transition)'
  },

  selectInput: {
    appearance: 'auto',
    cursor: 'pointer'
  },

  helperText: {
    fontSize: '11px',
    color: 'var(--gray-400)'
  },


  // ==========================================================
  // AI INFO
  // ==========================================================

  scoringInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '13px',
    padding: '16px',
    marginBottom: '22px',
    borderRadius: 'var(--radius)',
    background: 'var(--primary-light)',
    border: '1px solid var(--primary-light)'
  },

  scoringIcon: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '10px',
    background: 'var(--white)',
    color: 'var(--primary)'
  },

  scoringTitle: {
    margin: '0 0 4px',
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--gray-800)'
  },

  scoringText: {
    margin: 0,
    fontSize: '12px',
    lineHeight: 1.55,
    color: 'var(--gray-600)'
  },


  // ==========================================================
  // SUCCESS TOAST
  // ==========================================================

  successToast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 2000,
    width: '360px',
    maxWidth: 'calc(100vw - 32px)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: 'var(--white)',
    border: '1px solid var(--success-light)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    animation: 'leadFormToastIn 0.3s ease'
  },

  successToastIcon: {
    width: '38px',
    height: '38px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--success-light)',
    color: 'var(--success)',
    borderRadius: '50%'
  },

  successToastContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    flex: 1
  },

  successToastTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  successToastText: {
    fontSize: '12px',
    color: 'var(--gray-500)'
  },

  successToastClose: {
    width: '30px',
    height: '30px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'var(--gray-100)',
    color: 'var(--gray-500)',
    borderRadius: '50%',
    cursor: 'pointer'
  },


  // ==========================================================
  // ERROR
  // ==========================================================

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '13px 14px',
    marginBottom: '20px',
    borderRadius: 'var(--radius)',
    background: 'var(--danger-light)',
    border: '1px solid var(--danger-light)',
    color: 'var(--danger)'
  },

  errorIconBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1
  },

  errorTitle: {
    fontSize: '12px',
    fontWeight: 700
  },

  errorText: {
    fontSize: '12px',
    lineHeight: 1.4
  },

  errorClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    flexShrink: 0,
    border: 'none',
    background: 'transparent',
    color: 'var(--danger)',
    cursor: 'pointer',
    borderRadius: '7px'
  },


  // ==========================================================
  // FORM ACTIONS
  // ==========================================================

  formActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    paddingTop: '22px',
    borderTop: '1px solid var(--gray-100)'
  },

  cancelButton: {
    minHeight: '44px',
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-700)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer'
  },

  submitButton: {
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: 'var(--radius)',
    border: 'none',
    background: 'var(--primary)',
    color: 'var(--white)',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow)'
  },

  submitButtonDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed'
  },

  buttonSpinner: {
    width: '15px',
    height: '15px',
    border: '2px solid rgba(255,255,255,0.45)',
    borderTopColor: 'var(--white)',
    borderRadius: '50%',
    animation: 'leadFormSpin 0.8s linear infinite'
  },


  // ==========================================================
  // RESULT CARD
  // ==========================================================

  resultCard: {
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--gray-100)',
    animation: 'leadFormFade 0.3s ease'
  },

  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
    paddingBottom: '20px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--gray-100)'
  },

  resultHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px'
  },

  successIcon: {
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--success-light)',
    color: 'var(--success)',
    borderRadius: '10px'
  },

  resultTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  resultSubtitle: {
    margin: '3px 0 0',
    fontSize: '12px',
    color: 'var(--gray-500)'
  },

  closeButton: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'var(--gray-100)',
    color: 'var(--gray-500)',
    borderRadius: '50%',
    cursor: 'pointer'
  },


  // ==========================================================
  // SCORE
  // ==========================================================

  scoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '25px'
  },

  scoreCircle: {
    width: '150px',
    height: '150px',
    flexShrink: 0
  },

  scoreSvg: {
    width: '100%',
    height: '100%'
  },

  scoreText: {
    fontSize: '27px',
    fontWeight: 700,
    fill: 'var(--gray-900)'
  },

  scoreLabel: {
    fontSize: '12px',
    fill: 'var(--gray-500)'
  },

  scoreInfo: {
    flex: 1
  },

  scoreBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '7px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '10px'
  },

  leadName: {
    margin: '0 0 5px',
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  scoreDesc: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'var(--gray-600)'
  },


  // ==========================================================
  // SCORE INTERPRETATION
  // ==========================================================

  scoreInterpretation: {
    padding: '16px',
    marginBottom: '24px',
    borderRadius: 'var(--radius)',
    background: 'var(--gray-50)',
    border: '1px solid var(--gray-100)'
  },

  interpretationHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginBottom: '12px',
    color: 'var(--gray-700)',
    fontSize: '12px',
    fontWeight: 700
  },

  scoreBar: {
    width: '100%',
    height: '8px',
    overflow: 'hidden',
    background: 'var(--gray-200)',
    borderRadius: '999px'
  },

  scoreBarFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 1s ease'
  },

  scoreScale: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '7px',
    color: 'var(--gray-400)',
    fontSize: '10px'
  },


  // ==========================================================
  // RESULT ACTIONS
  // ==========================================================

  resultActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },

  secondaryButton: {
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '9px 17px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-700)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer'
  },

  primaryButton: {
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    padding: '9px 17px',
    borderRadius: 'var(--radius)',
    border: 'none',
    background: 'var(--primary)',
    color: 'var(--white)',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: 'var(--shadow)'
  }

}


export default LeadForm