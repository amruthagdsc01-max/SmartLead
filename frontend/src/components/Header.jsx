import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

function Header() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 700;
          font-size: 20px;
          color: var(--gray-900);
          flex-shrink: 0;
        }

        .header-logo-icon {
          font-size: 24px;
        }

        .header-logo-text {
          letter-spacing: -0.5px;
        }

        .header-logo-badge {
          background: var(--primary);
          color: var(--white);
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-nav-link {
          padding: 8px 16px;
          border-radius: var(--radius);
          text-decoration: none;
          color: var(--gray-600);
          font-size: 14px;
          font-weight: 500;
          transition: var(--transition);
          white-space: nowrap;
        }

        .header-nav-link:hover {
          background: var(--gray-50);
          color: var(--primary);
        }

        .header-nav-link.active {
          background: var(--primary-light);
          color: var(--primary);
        }

        .header-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--gray-500);
          white-space: nowrap;
        }

        .header-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          animation: pulse 2s infinite;
        }

        .header-status-text {
          font-weight: 500;
        }

        .header-menu-button {
          display: none;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: var(--gray-700);
        }

        .header-menu-button:hover {
          background: var(--gray-100);
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 900px) {
          .header-nav {
            gap: 2px;
          }

          .header-nav-link {
            padding: 8px 10px;
          }

          .header-status {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .header-container {
            height: 60px;
            padding: 0 16px;
          }

          .header-nav {
            display: none;
          }

          .header-menu-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 10px 16px 16px;
            background: var(--white);
            border-top: 1px solid var(--gray-100);
            box-shadow: var(--shadow-sm);
          }

          .mobile-menu-link {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 13px 14px;
            border-radius: 10px;
            text-decoration: none;
            color: var(--gray-700);
            font-size: 14px;
            font-weight: 500;
          }

          .mobile-menu-link:hover {
            background: var(--gray-50);
          }

          .mobile-menu-link.active {
            background: var(--primary-light);
            color: var(--primary);
          }

          .mobile-status {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 12px 14px 4px;
            margin-top: 5px;
            border-top: 1px solid var(--gray-100);
            font-size: 13px;
            color: var(--gray-500);
          }

          .mobile-status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success);
            animation: pulse 2s infinite;
          }
        }

        @media (max-width: 380px) {
          .header-container {
            padding: 0 12px;
          }

          .header-logo {
            font-size: 18px;
          }

          .header-logo-icon {
            font-size: 21px;
          }

          .header-logo-badge {
            font-size: 9px;
          }
        }
      `}</style>

      <header style={styles.header}>
        <div className="header-container">

          {/* Logo */}
          <Link
            to="/"
            className="header-logo"
            onClick={closeMenu}
          >
            <span className="header-logo-icon">
              🎯
            </span>

            <span className="header-logo-text">
              SmartLead
            </span>

            <span className="header-logo-badge">
              AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header-nav">

            <Link
              to="/"
              className={`header-nav-link ${
                isActive('/') ? 'active' : ''
              }`}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/leads"
              className={`header-nav-link ${
                isActive('/leads') ? 'active' : ''
              }`}
            >
              📋 All Leads
            </Link>

            <Link
              to="/add-lead"
              className={`header-nav-link ${
                isActive('/add-lead') ? 'active' : ''
              }`}
            >
              ➕ Add Lead
            </Link>

          </nav>

          {/* Desktop Status */}
          <div className="header-status">
            <span className="header-status-dot"></span>
            <span className="header-status-text">
              API Connected
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="header-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={
              menuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="mobile-menu">

            <Link
              to="/"
              className={`mobile-menu-link ${
                isActive('/') ? 'active' : ''
              }`}
              onClick={closeMenu}
            >
              📊 Dashboard
            </Link>

            <Link
              to="/leads"
              className={`mobile-menu-link ${
                isActive('/leads') ? 'active' : ''
              }`}
              onClick={closeMenu}
            >
              📋 All Leads
            </Link>

            <Link
              to="/add-lead"
              className={`mobile-menu-link ${
                isActive('/add-lead') ? 'active' : ''
              }`}
              onClick={closeMenu}
            >
              ➕ Add Lead
            </Link>

            <div className="mobile-status">
              <span className="mobile-status-dot"></span>

              <span>
                API Connected
              </span>
            </div>

          </div>
        )}
      </header>
    </>
  )
}

const styles = {
  header: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-100)',
    boxShadow: 'var(--shadow-sm)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
}

export default Header