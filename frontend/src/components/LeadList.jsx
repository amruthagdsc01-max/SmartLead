import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  X,
  RotateCcw,
  ClipboardList,
  AlertTriangle,
  SlidersHorizontal,
  Users,
  Filter,
  ArrowUpDown
} from 'lucide-react'

import { api } from '../services/api'
import LeadCard from './LeadCard'

function LeadList() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    min_score: '',
    source: '',
    sort_by: 'score',
    sort_order: 'desc'
  })

  const [search, setSearch] = useState('')

  // ============================================================
  // LOAD LEADS
  // ============================================================

  useEffect(() => {
    loadLeads()
  }, [filters])

  const loadLeads = async () => {
    try {
      setLoading(true)

      const params = {}

      if (filters.min_score) {
        params.min_score = filters.min_score
      }

      if (filters.source) {
        params.source = filters.source
      }

      params.sort_by = filters.sort_by
      params.sort_order = filters.sort_order

      const data = await api.getLeads(params)

      setLeads(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load leads:', err)
      setError(err.message || 'Something went wrong while loading leads.')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================
  // DELETE LEAD
  // ============================================================

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this lead?'
      )
    ) {
      return
    }

    try {
      await api.deleteLead(id)

      setLeads(prev =>
        prev.filter(lead => lead.id !== id)
      )
    } catch (err) {
      alert('Failed to delete: ' + err.message)
    }
  }

  // ============================================================
  // UPDATE LEAD
  // ============================================================

  const handleUpdated = (updatedLead) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === updatedLead.id
          ? updatedLead
          : lead
      )
    )
  }

  // ============================================================
  // FILTER CHANGES
  // ============================================================

  const handleFilterChange = (e) => {
    const { name, value } = e.target

    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  // ============================================================
  // FILTERED LEADS
  // ============================================================

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) {
      return leads
    }

    return leads.filter(lead =>
      lead.name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.company?.toLowerCase().includes(query) ||
      lead.job_title?.toLowerCase().includes(query)
    )
  }, [leads, search])

  // ============================================================
  // ACTIVE FILTERS
  // ============================================================

  const activeFilterCount =
    Number(Boolean(filters.min_score)) +
    Number(Boolean(filters.source)) +
    Number(search.trim() !== '')

  const hasFilters = activeFilterCount > 0

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const resetFilters = () => {
    setSearch('')

    setFilters({
      min_score: '',
      source: '',
      sort_by: 'score',
      sort_order: 'desc'
    })
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <>
        <style>{responsiveStyles}</style>

        <div style={styles.loading}>
          <div style={styles.loadingSpinner}></div>

          <h3 style={styles.loadingTitle}>
            Loading leads...
          </h3>

          <p style={styles.loadingText}>
            Fetching your latest lead data
          </p>
        </div>
      </>
    )
  }

  // ============================================================
  // ERROR STATE
  // ============================================================

  if (error) {
    return (
      <>
        <style>{responsiveStyles}</style>

        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>
            <AlertTriangle
              size={44}
              strokeWidth={1.7}
            />
          </div>

          <h2 style={styles.errorTitle}>
            Unable to load leads
          </h2>

          <p style={styles.errorMessage}>
            {error}
          </p>

          <button
            onClick={loadLeads}
            style={styles.retryButton}
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        </div>
      </>
    )
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <>
      <style>{responsiveStyles}</style>

      <div
        className="lead-list-container"
        style={styles.container}
      >

        {/* ======================================================
            PAGE HEADER
        ====================================================== */}

        <div
          className="lead-list-header"
          style={styles.header}
        >

          <div style={styles.headerLeft}>

            <div style={styles.pageIcon}>
              <Users size={22} />
            </div>

            <div>
              <div style={styles.titleRow}>
                <h1 style={styles.title}>
                  All Leads
                </h1>

                <span style={styles.countBadge}>
                  {leads.length}
                </span>
              </div>

              <p style={styles.subtitle}>
                Manage, filter and track your leads
              </p>
            </div>

          </div>

          <Link
            to="/add-lead"
            className="lead-list-add-button"
            style={styles.addButton}
          >
            <Plus size={17} />
            Add New Lead
          </Link>

        </div>


        {/* ======================================================
            SEARCH BAR
        ====================================================== */}

        <div
          className="lead-list-search"
          style={styles.searchContainer}
        >

          <Search
            size={19}
            style={styles.searchIcon}
          />

          <input
            type="text"
            placeholder="Search by name, email, company or job title..."
            value={search}
            onChange={handleSearchChange}
            className="lead-list-search-input"
            style={styles.searchInput}
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              style={styles.clearButton}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={17} />
            </button>
          )}

        </div>


        {/* ======================================================
            FILTER TOOLBAR
        ====================================================== */}

        <div
          className="lead-list-filter-bar"
          style={styles.filterBar}
        >

          <div style={styles.filterHeader}>
            <div style={styles.filterTitle}>
              <SlidersHorizontal size={17} />
              <span>Filters & Sorting</span>

              {hasFilters && (
                <span style={styles.activeBadge}>
                  {activeFilterCount} active
                </span>
              )}
            </div>
          </div>


          <div
            className="lead-list-filter-controls"
            style={styles.filterControls}
          >

            {/* Minimum Score */}

            <div
              className="lead-list-filter-group"
              style={styles.filterGroup}
            >
              <label style={styles.filterLabel}>
                Minimum Score
              </label>

              <select
                name="min_score"
                value={filters.min_score}
                onChange={handleFilterChange}
                className="lead-list-filter-select"
                style={styles.filterSelect}
              >
                <option value="">
                  All Scores
                </option>

                <option value="70">
                  70+ — High Quality
                </option>

                <option value="50">
                  50+ — Medium
                </option>

                <option value="25">
                  25+ — Low
                </option>
              </select>
            </div>


            {/* Source */}

            <div
              className="lead-list-filter-group"
              style={styles.filterGroup}
            >
              <label style={styles.filterLabel}>
                Source
              </label>

              <select
                name="source"
                value={filters.source}
                onChange={handleFilterChange}
                className="lead-list-filter-select"
                style={styles.filterSelect}
              >
                <option value="">
                  All Sources
                </option>

                <option value="referral">
                  Referral
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
                  Email
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>


            {/* Sort By */}

            <div
              className="lead-list-filter-group"
              style={styles.filterGroup}
            >
              <label style={styles.filterLabel}>
                Sort By
              </label>

              <select
                name="sort_by"
                value={filters.sort_by}
                onChange={handleFilterChange}
                className="lead-list-filter-select"
                style={styles.filterSelect}
              >
                <option value="score">
                  Lead Score
                </option>

                <option value="created_at">
                  Date Created
                </option>

                <option value="name">
                  Name
                </option>
              </select>
            </div>


            {/* Sort Order */}

            <div
              className="lead-list-filter-group"
              style={styles.filterGroup}
            >
              <label style={styles.filterLabel}>
                Order
              </label>

              <select
                name="sort_order"
                value={filters.sort_order}
                onChange={handleFilterChange}
                className="lead-list-filter-select"
                style={styles.filterSelect}
              >
                <option value="desc">
                  Highest / Newest First
                </option>

                <option value="asc">
                  Lowest / Oldest First
                </option>
              </select>
            </div>


            {/* Reset */}

            <button
              onClick={resetFilters}
              disabled={!hasFilters}
              className="lead-list-reset"
              style={{
                ...styles.resetButton,
                opacity: hasFilters ? 1 : 0.55,
                cursor: hasFilters
                  ? 'pointer'
                  : 'not-allowed'
              }}
              title={
                hasFilters
                  ? 'Reset filters'
                  : 'No active filters'
              }
            >
              <RotateCcw size={15} />
              Reset
            </button>

          </div>

        </div>


        {/* ======================================================
            RESULTS SUMMARY
        ====================================================== */}

        <div style={styles.resultsBar}>

          <div style={styles.resultsInfo}>

            <div style={styles.resultsIcon}>
              <Filter size={15} />
            </div>

            <span>
              Showing{' '}
              <strong>
                {filteredLeads.length}
              </strong>{' '}
              of{' '}
              <strong>
                {leads.length}
              </strong>{' '}
              leads
            </span>

          </div>

          {search && (
            <span style={styles.searchResult}>
              Search results for "{search}"
            </span>
          )}

        </div>


        {/* ======================================================
            LEADS
        ====================================================== */}

        {filteredLeads.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              <ClipboardList
                size={48}
                strokeWidth={1.5}
              />
            </div>

            <h3 style={styles.emptyTitle}>
              {leads.length === 0
                ? 'No leads yet'
                : 'No matching leads'}
            </h3>

            <p style={styles.emptyText}>
              {leads.length === 0
                ? 'Start building your pipeline by adding your first lead.'
                : search
                  ? 'Try a different search term or clear your search.'
                  : 'Try adjusting your filters to find more leads.'}
            </p>

            {leads.length === 0 ? (

              <Link
                to="/add-lead"
                style={styles.emptyLink}
              >
                <Plus size={16} />
                Add Your First Lead
              </Link>

            ) : (

              <button
                onClick={resetFilters}
                style={styles.emptyReset}
              >
                <RotateCcw size={15} />
                Clear Filters
              </button>

            )}

          </div>

        ) : (

          <div
            className="lead-list-grid"
            style={styles.leadsGrid}
          >

            {filteredLeads.map(lead => (

              <LeadCard
                key={lead.id}
                lead={lead}
                onDelete={() => handleDelete(lead.id)}
                onUpdated={handleUpdated}
                showBreakdown
              />

            ))}

          </div>

        )}

      </div>
    </>
  )
}


// ============================================================
// RESPONSIVE STYLES
// ============================================================

const responsiveStyles = `

  .lead-list-container {
    width: 100%;
    box-sizing: border-box;
  }

  .lead-list-header {
    width: 100%;
  }

  .lead-list-search-input {
    box-sizing: border-box;
  }

  .lead-list-filter-bar {
    width: 100%;
    box-sizing: border-box;
  }

  .lead-list-filter-controls {
    width: 100%;
  }

  .lead-list-filter-select {
    box-sizing: border-box;
  }

  .lead-list-reset {
    justify-content: center;
  }

  @media (max-width: 1000px) {

    .lead-list-filter-controls {
      display: grid !important;
      grid-template-columns:
        repeat(2, minmax(0, 1fr)) !important;
    }

    .lead-list-filter-group {
      min-width: 0 !important;
      width: 100%;
    }

    .lead-list-filter-select {
      width: 100%;
    }

    .lead-list-reset {
      width: 100%;
    }
  }

  @media (max-width: 700px) {

    .lead-list-container {
      padding: 24px 16px !important;
    }

    .lead-list-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }

    .lead-list-add-button {
      width: 100%;
      box-sizing: border-box;
    }

    .lead-list-filter-controls {
      grid-template-columns: 1fr !important;
    }

    .lead-list-filter-group {
      width: 100%;
    }

    .lead-list-filter-select {
      width: 100%;
      min-height: 44px;
    }

    .lead-list-search-input {
      font-size: 13px !important;
      padding: 13px 42px !important;
    }

    .lead-list-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 420px) {

    .lead-list-container {
      padding: 18px 12px !important;
    }

    .lead-list-filter-bar {
      padding: 14px !important;
    }
  }

  @keyframes leadListSpin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`


// ============================================================
// STYLES
// ============================================================

const styles = {

  container: {
    maxWidth: '1200px',
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
    marginBottom: '24px'
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0
  },

  pageIcon: {
    width: '46px',
    height: '46px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    borderRadius: '12px'
  },

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--gray-900)',
    margin: 0
  },

  countBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '26px',
    height: '24px',
    padding: '0 7px',
    borderRadius: '999px',
    background: 'var(--gray-100)',
    color: 'var(--gray-700)',
    fontSize: '12px',
    fontWeight: 700
  },

  subtitle: {
    fontSize: '14px',
    color: 'var(--gray-500)',
    margin: '4px 0 0'
  },

  addButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'var(--primary)',
    color: 'var(--white)',
    padding: '12px 22px',
    borderRadius: 'var(--radius)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'var(--transition)',
    boxShadow: 'var(--shadow)',
    whiteSpace: 'nowrap'
  },


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
    width: '100%'
  },

  searchIcon: {
    position: 'absolute',
    left: '15px',
    color: 'var(--gray-400)',
    pointerEvents: 'none'
  },

  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '14px 46px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-800)',
    fontSize: '14px',
    outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    transition: 'var(--transition)'
  },

  clearButton: {
    position: 'absolute',
    right: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'var(--gray-100)',
    color: 'var(--gray-500)',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    padding: 0
  },


  // ==========================================================
  // FILTER BAR
  // ==========================================================

  filterBar: {
    marginBottom: '20px',
    padding: '18px 20px',
    background: 'var(--white)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--gray-100)'
  },

  filterHeader: {
    marginBottom: '15px'
  },

  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--gray-700)',
    fontSize: '14px',
    fontWeight: 700
  },

  activeBadge: {
    marginLeft: '4px',
    padding: '3px 8px',
    borderRadius: '999px',
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontSize: '11px',
    fontWeight: 700
  },

  filterControls: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '14px',
    flexWrap: 'wrap'
  },

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: '155px',
    flex: '1 1 155px'
  },

  filterLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--gray-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },

  filterSelect: {
    width: '100%',
    minHeight: '40px',
    padding: '8px 11px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    fontSize: '13px',
    color: 'var(--gray-700)',
    cursor: 'pointer',
    outline: 'none'
  },

  resetButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    minHeight: '40px',
    padding: '8px 15px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)',
    background: 'var(--white)',
    color: 'var(--gray-700)',
    fontSize: '13px',
    fontWeight: 600
  },


  // ==========================================================
  // RESULTS
  // ==========================================================

  resultsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '16px',
    minHeight: '28px',
    flexWrap: 'wrap'
  },

  resultsInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--gray-500)',
    fontSize: '13px'
  },

  resultsIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'var(--gray-100)',
    color: 'var(--gray-500)'
  },

  searchResult: {
    fontSize: '12px',
    color: 'var(--gray-500)',
    fontStyle: 'italic'
  },


  // ==========================================================
  // LEAD GRID
  // ==========================================================

  leadsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
    gap: '20px'
  },


  // ==========================================================
  // EMPTY STATE
  // ==========================================================

  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow)',
    border: '1px solid var(--gray-100)'
  },

  emptyIcon: {
    width: '76px',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
    background: 'var(--gray-100)',
    color: 'var(--gray-400)',
    marginBottom: '18px'
  },

  emptyTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--gray-700)',
    margin: '0 0 8px'
  },

  emptyText: {
    maxWidth: '480px',
    fontSize: '14px',
    lineHeight: 1.6,
    color: 'var(--gray-500)',
    margin: '0 0 20px'
  },

  emptyLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'var(--primary)',
    color: 'var(--white)',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '13px',
    padding: '10px 18px',
    borderRadius: 'var(--radius)'
  },

  emptyReset: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: 'var(--white)',
    color: 'var(--primary)',
    fontWeight: 600,
    fontSize: '13px',
    padding: '10px 18px',
    border: '1px solid var(--primary)',
    borderRadius: 'var(--radius)',
    cursor: 'pointer'
  },


  // ==========================================================
  // LOADING
  // ==========================================================

  loading: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px'
  },

  loadingSpinner: {
    width: '36px',
    height: '36px',
    border: '4px solid var(--gray-200)',
    borderTop: '4px solid var(--primary)',
    borderRadius: '50%',
    animation: 'leadListSpin 1s linear infinite',
    marginBottom: '18px'
  },

  loadingTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: 'var(--gray-800)',
    margin: '0 0 6px'
  },

  loadingText: {
    fontSize: '13px',
    color: 'var(--gray-500)',
    margin: 0
  },


  // ==========================================================
  // ERROR
  // ==========================================================

  errorContainer: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 20px'
  },

  errorIcon: {
    width: '76px',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20px',
    background: 'var(--danger-light)',
    color: 'var(--danger)',
    marginBottom: '18px'
  },

  errorTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--gray-800)',
    margin: '0 0 8px'
  },

  errorMessage: {
    maxWidth: '500px',
    fontSize: '14px',
    color: 'var(--danger)',
    margin: '0 0 20px',
    lineHeight: 1.5
  },

  retryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 'var(--radius)',
    background: 'var(--primary)',
    color: 'var(--white)',
    fontWeight: 600,
    cursor: 'pointer'
  }
}

export default LeadList