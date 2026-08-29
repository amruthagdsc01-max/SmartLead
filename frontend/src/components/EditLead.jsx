import React, { useEffect, useState } from 'react'
import {
  X,
  User,
  Mail,
  Building2,
  BriefcaseBusiness,
  DollarSign,
  Clock3,
  Globe2,
  Save,
  Loader2,
  AlertCircle,
  Pencil
} from 'lucide-react'

import { api } from '../services/api'

function EditLead({ lead, onClose, onUpdated }) {
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
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700)

  // ============================================================
  // RESPONSIVE CHECK
  // ============================================================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 700)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // ============================================================
  // LOAD LEAD DATA
  // ============================================================

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        company: lead.company || '',
        job_title: lead.job_title || '',
        budget: lead.budget ?? '',
        timeline: lead.timeline || 'unknown',
        source: lead.source || 'other'
      })
    }
  }, [lead])

  // ============================================================
  // HANDLE INPUT CHANGES
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts editing
    if (error) {
      setError(null)
    }
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      const updatedLead = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        job_title: formData.job_title.trim() || null,
        budget: formData.budget
          ? Number(formData.budget)
          : null,
        timeline: formData.timeline,
        source: formData.source
      }

      const result = await api.updateLead(lead.id, updatedLead)

      onUpdated(result)
      onClose()

    } catch (err) {
      setError(
        err.message || 'Failed to update lead. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // FIELD COMPONENT
  // ============================================================

  const renderField = ({
    label,
    name,
    icon: Icon,
    type = 'text',
    placeholder,
    required = false,
    children
  }) => {
    return (
      <div style={styles.field}>

        <label style={styles.label}>
          <span>
            {label}
            {required && (
              <span style={styles.required}> *</span>
            )}
          </span>
        </label>

        <div style={styles.inputWrapper}>

          <Icon
            size={18}
            strokeWidth={1.8}
            style={styles.inputIcon}
          />

          {children || (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required={required}
              minLength={name === 'name' ? 2 : undefined}
              maxLength={name === 'name' ? 100 : undefined}
              min={type === 'number' ? '0' : undefined}
              max={type === 'number' ? '10000000' : undefined}
              style={styles.input}
            />
          )}

        </div>

      </div>
    )
  }

  return (
    <div style={styles.overlay}>

      <div
        style={{
          ...styles.modal,
          width: isMobile ? 'calc(100% - 24px)' : '100%',
          padding: isMobile ? '22px 18px' : '30px'
        }}
      >

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div style={styles.header}>

          <div style={styles.headerLeft}>

            <div style={styles.headerIcon}>
              <Pencil
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <h2 style={styles.title}>
                Edit Lead
              </h2>

              <p style={styles.subtitle}>
                Update lead information and recalculate the score.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            disabled={loading}
            aria-label="Close"
          >
            <X size={24} />
          </button>

        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div style={styles.error}>

            <AlertCircle
              size={18}
              style={{ flexShrink: 0 }}
            />

            <span>{error}</span>

          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          {/* ====================================================
              BASIC INFORMATION
          ==================================================== */}

          <div style={styles.section}>

            <div style={styles.sectionHeader}>

              <div style={styles.sectionIcon}>
                <User size={19} />
              </div>

              <div>
                <h3 style={styles.sectionTitle}>
                  Basic Information
                </h3>

                <p style={styles.sectionSubtitle}>
                  Update the lead's contact information
                </p>
              </div>

            </div>

            <div
              style={{
                ...styles.grid,
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : 'repeat(2, minmax(0, 1fr))'
              }}
            >

              {renderField({
                label: 'Name',
                name: 'name',
                icon: User,
                placeholder: 'e.g., John Doe',
                required: true
              })}

              {renderField({
                label: 'Email',
                name: 'email',
                icon: Mail,
                type: 'email',
                placeholder: 'e.g., john@company.com',
                required: true
              })}

              {renderField({
                label: 'Company',
                name: 'company',
                icon: Building2,
                placeholder: 'e.g., Acme Corp'
              })}

              {renderField({
                label: 'Job Title',
                name: 'job_title',
                icon: BriefcaseBusiness,
                placeholder: 'e.g., CTO, VP Engineering'
              })}

            </div>

          </div>

          {/* ====================================================
              PURCHASE INFORMATION
          ==================================================== */}

          <div style={styles.section}>

            <div style={styles.sectionHeader}>

              <div style={styles.sectionIcon}>
                <DollarSign size={19} />
              </div>

              <div>
                <h3 style={styles.sectionTitle}>
                  Purchase Information
                </h3>

                <p style={styles.sectionSubtitle}>
                  Update opportunity details
                </p>
              </div>

            </div>

            <div
              style={{
                ...styles.grid,
                gridTemplateColumns: isMobile
                  ? '1fr'
                  : 'repeat(2, minmax(0, 1fr))'
              }}
            >

              {/* Budget */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Budget
                </label>

                <div style={styles.inputWrapper}>

                  <DollarSign
                    size={18}
                    strokeWidth={1.8}
                    style={styles.inputIcon}
                  />

                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    max="10000000"
                    placeholder="e.g., 50000"
                    style={styles.input}
                  />

                </div>

                <span style={styles.helperText}>
                  Enter the estimated deal value
                </span>

              </div>

              {/* Timeline */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Purchase Timeline
                </label>

                <div style={styles.selectWrapper}>

                  <Clock3
                    size={18}
                    strokeWidth={1.8}
                    style={styles.inputIcon}
                  />

                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="immediate">
                      Immediate
                    </option>

                    <option value="3_months">
                      3 Months
                    </option>

                    <option value="6_months">
                      6 Months
                    </option>

                    <option value="1_year">
                      1 Year
                    </option>

                    <option value="unknown">
                      Unknown
                    </option>
                  </select>

                </div>

              </div>

              {/* Source */}

              <div
                style={{
                  ...styles.field,
                  gridColumn: isMobile
                    ? 'auto'
                    : '1 / -1'
                }}
              >

                <label style={styles.label}>
                  Lead Source
                </label>

                <div style={styles.selectWrapper}>

                  <Globe2
                    size={18}
                    strokeWidth={1.8}
                    style={styles.inputIcon}
                  />

                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="website">
                      Website
                    </option>

                    <option value="referral">
                      Referral
                    </option>

                    <option value="linkedin">
                      LinkedIn
                    </option>

                    <option value="event">
                      Event
                    </option>

                    <option value="email">
                      Email
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              FOOTER
          ==================================================== */}

          <div
            style={{
              ...styles.footer,
              flexDirection: isMobile
                ? 'column-reverse'
                : 'row'
            }}
          >

            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.cancelButton,
                width: isMobile ? '100%' : 'auto'
              }}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...styles.saveButton,
                width: isMobile ? '100%' : 'auto'
              }}
              disabled={loading}
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    style={styles.spin}
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Save Changes
                </>
              )}

            </button>

          </div>

        </form>

      </div>
    </div>
  )
}

// ================================================================
// STYLES
// ================================================================

const styles = {

  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15, 23, 42, 0.58)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    zIndex: 1000
  },

  modal: {
    maxWidth: '760px',
    maxHeight: '92vh',
    overflowY: 'auto',
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.22)',
    boxSizing: 'border-box'
  },

  // --------------------------------------------------------------
  // HEADER
  // --------------------------------------------------------------

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px'
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '13px'
  },

  headerIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },

  title: {
    margin: 0,
    fontSize: '25px',
    fontWeight: 750,
    color: 'var(--gray-900)',
    lineHeight: 1.2
  },

  subtitle: {
    margin: '6px 0 0',
    fontSize: '14px',
    lineHeight: 1.5,
    color: 'var(--gray-500)'
  },

  closeButton: {
    width: '38px',
    height: '38px',
    border: 'none',
    borderRadius: '10px',
    background: 'transparent',
    color: 'var(--gray-500)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },

  // --------------------------------------------------------------
  // ERROR
  // --------------------------------------------------------------

  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    marginBottom: '22px',
    borderRadius: '10px',
    background: 'var(--danger-light)',
    color: 'var(--danger)',
    fontSize: '14px',
    fontWeight: 500,
    border: '1px solid rgba(234, 0, 30, 0.12)'
  },

  // --------------------------------------------------------------
  // SECTIONS
  // --------------------------------------------------------------

  section: {
    padding: '22px',
    marginBottom: '20px',
    border: '1px solid var(--gray-100)',
    borderRadius: '14px',
    background: 'var(--gray-50)'
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '22px'
  },

  sectionIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'var(--white)',
    color: 'var(--primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--gray-100)',
    flexShrink: 0
  },

  sectionTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--gray-900)'
  },

  sectionSubtitle: {
    margin: '3px 0 0',
    fontSize: '13px',
    color: 'var(--gray-500)'
  },

  grid: {
    display: 'grid',
    gap: '18px'
  },

  // --------------------------------------------------------------
  // FIELDS
  // --------------------------------------------------------------

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  },

  label: {
    fontSize: '13px',
    fontWeight: 650,
    color: 'var(--gray-700)'
  },

  required: {
    color: 'var(--danger)'
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },

  selectWrapper: {
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
    height: '46px',
    padding: '0 13px 0 42px',
    borderRadius: '10px',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-800)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },

  select: {
    width: '100%',
    boxSizing: 'border-box',
    height: '46px',
    padding: '0 38px 0 42px',
    borderRadius: '10px',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-800)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'auto'
  },

  helperText: {
    fontSize: '12px',
    color: 'var(--gray-500)'
  },

  // --------------------------------------------------------------
  // FOOTER
  // --------------------------------------------------------------

  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid var(--gray-100)'
  },

  cancelButton: {
    minHeight: '44px',
    padding: '0 20px',
    borderRadius: '10px',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-700)',
    fontSize: '14px',
    fontWeight: 650,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },

  saveButton: {
    minHeight: '44px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'var(--primary)',
    color: 'var(--white)',
    fontSize: '14px',
    fontWeight: 650,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 3px 8px rgba(1, 118, 211, 0.2)',
    transition: 'all 0.2s ease'
  },

  spin: {
    animation: 'spin 1s linear infinite'
  }
}

export default EditLead