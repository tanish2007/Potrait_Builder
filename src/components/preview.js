"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "./preview.css"

export default function PSPAPreviewPage() {
  const location = useLocation()
  const [gradeGroups, setGradeGroups] = useState({})

  useEffect(() => {
    const data = location.state?.groupedByGrade
    if (data) {
      setGradeGroups(data)
    } else {
      console.warn("No grouped data received.")
    }
  }, [location.state])

  const StatusIcon = ({ uploading }) => (
    <div className={`status-icon ${uploading ? "uploading" : "waiting"}`}>
      {uploading ? (
        <div className="spinner"></div>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="#F59E0B" strokeWidth="2" />
          <path d="M8 4v4l3 3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  )

  const GradeCard = ({ gradeName, students, isUploading, uploadedCount, totalCount }) => (
    <div className="grade-card">
      <div className="photo-section">
        <div className="photo-grid">
          {students.slice(0, 3).map((s, i) => (
            <img key={i} src={URL.createObjectURL(s.file)} alt={s.fullName} className="preview-thumb" />
          ))}
        </div>
       {students.length > 3 && (
  <div className="photo-count-badge">+{students.length - 3}</div>
)}

      </div>

      <div className="status-section">
        <StatusIcon uploading={isUploading} />
        <span className="status-text">
          Status: {isUploading ? `Uploading ${uploadedCount} of ${totalCount} photos...` : "Waiting to upload..."}
        </span>
      </div>

      <div className="grade-input-section">
        <label className="grade-label">Grade Name</label>
        <input type="text" className="grade-input" value={gradeName} readOnly />
      </div>
    </div>
  )

  return (
    <div className="upload-page">
      <div className="header-section">
        <div className="step-icon">
          <div className="icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h1 className="step-title">Step 3 of 4:</h1>
        <p className="upload-status">
          Uploading {Object.values(gradeGroups).reduce((acc, g) => acc + (g.length || 0), 0)} total photos...
        </p>
      </div>

      <div className="grades-grid">
        {Object.entries(gradeGroups).map(([gradeName, students], index) => (
          <GradeCard
            key={index}
            gradeName={gradeName}
            students={students}
            isUploading={index === 0}
            uploadedCount={11}
            totalCount={students.length}
          />
        ))}
      </div>
    </div>
  )
}
