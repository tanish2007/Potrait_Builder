

import { useNavigate } from "react-router-dom"
import "./home.css"

export default function NavigationPage() {
    const navigate=useNavigate()
 
  const handleEditRedirect = () => {
    navigate("/edit")
  }

  const handleImportRedirect = () => {
    navigate("/1")
  }

  return (
    <div className="navigation-page">
      <div className="container">
        <div className="header-section">
          <h1 className="page-title">PSPA File Manager</h1>
          <p className="page-subtitle">Choose an action to get started</p>
        </div>

        <div className="buttons-container">
          <button className="nav-button edit-button" onClick={handleEditRedirect}>
            <div className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="button-content">
              <h3 className="button-title">Edit Pages</h3>
              <p className="button-description">Modify and organize existing PSPA files</p>
            </div>
            <div className="button-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15l5-5-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          <button className="nav-button import-button" onClick={handleImportRedirect}>
            <div className="button-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14,2 14,8 20,8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="18"
                  x2="12"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="9,15 12,12 15,15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="button-content">
              <h3 className="button-title">Import Pages</h3>
              <p className="button-description">Upload and process new PSPA files</p>
            </div>
            <div className="button-arrow">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15l5-5-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>

        <div className="footer-section">
          <p className="footer-text">Select an option above to continue</p>
        </div>
      </div>
    </div>
  )
}
