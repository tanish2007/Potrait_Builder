"use client"

import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import "./preview.css"

export default function PSPAPreviewPage() {
  const location = useLocation()
  const [gradeGroups, setGradeGroups] = useState({})

  const s3Config = {
  region: "us-east-1",
  credentials: {
    accessKeyId: "ASIASK5MCVJLRJNQIR5X",           
    secretAccessKey: "qWHaF54bLAiQ1N6HHR2mRksjfjfzCnnuFp/jB9Gr",        
    sessionToken: "IQoJb3JpZ2luX2VjEHIaCXVzLWVhc3QtMSJHMEUCIEVdoLJrxyKy9mmGudRSRu7aga0A13AH2bmSGLE/3E8oAiEA332tBCbGB9rukiP52GB4dNU+9itm/P0Y7TU4Hu2ed6Mq6QIIexAAGgwxNjA4ODUyODc1MTEiDPTtPFZHvWPSKF1iHirGApR/Ihe9dNM7rHV6kenzXxre+PtTx8JH1uZ/FMfVMz4n+tACg3K20zab380CLisEw0jbT6ymBsHSDgCk34P6zImf71B535lCtuOJmNncaRwqXHKvBWQfOOfGkA4+Xszeul2HQXefjlIdvlU9oq1fFmSNOKdYof/setgNhyA0lupGa8FjucEdKaX34Z9i/F2gYn0Pcof74FiMnEDgk7gbe3yWTJlCLSDCRbv9PfNnCmljRjHkr2VsQkM46xFOIRJMFG9zbtZ5DZj5kPW0jrD7J15Mb+lFh832p8utaGXid+1fdeHcuBWKOC70Hm5ZhFkx+d7xbNekX2jgSEDmjeQv2B8RPBLArlgob84zn7qqzYdEJ7SNzvODEv5k6GybVxlybOd7FNxQV6pwdSyMulQLA/vdLUN5G9RO7z0WodLnzkBQkT2F3StjMKSSsMMGOqcB+yQipKBwnjJDvKYmGnGkRmb5FF5z5/LzS9le4PdnHWdEa642lVERklDVottAMqg84CAX7vPg6KTVFxlxKWOZ5kJuBNVep/iZl33fElOC5zGVDZwbIPpzKZi/i6lSBPqKti3TeGZ8utTG+eqxIkSayCD5HIh7YhMkG406CeO2ZzV66jnpmDuYhxzPJ5/W3S74cHEX/uEQx+UfMtLOmtWJkdqF0dh7LeM=",  
  },
  bucketName: "pspa-potraits",       
};
function fileToWebStream(file) {
  return file.stream ? file.stream() : file;
}

const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.credentials.accessKeyId,
    secretAccessKey: s3Config.credentials.secretAccessKey,
    sessionToken: s3Config.credentials.sessionToken,
  },
})

async function uploadToBackend(file, teacher, grade) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("teacher", teacher);
  formData.append("grade", grade);

  const res = await fetch("http://localhost:4000/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload");
  }

  const result = await res.json();
  return result;
}


async function handleUpload() {
  for (const [gradeName, students] of Object.entries(gradeGroups)) {
    for (const student of students) {
      const teacherName = student.teacherName || "UnknownTeacher" // fallback
      try {
        await uploadToBackend(student.file, teacherName, gradeName)
        console.log(`Uploaded ${student.file.name} to ${teacherName}/${gradeName}/`)
      } catch (err) {
        console.error("Upload failed:", err)
      }
    }
  }

  alert("All uploads completed!")
}


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
      <button className="upload-btn" onClick={handleUpload}>Upload to S3</button>

    </div>
  )
}
