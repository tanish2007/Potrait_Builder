"use client"

import { useState, useRef } from "react"
import "./pspa-upload.css"
import { useNavigate } from "react-router-dom"

export default function PSPAUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [groupedByGrade, setGroupedByGrade] = useState({})
  const [indexFound, setIndexFound] = useState(false) // NEW
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files) => {
    const fileArray = Array.from(files)
    setUploadedFiles(fileArray)
    
    setIndexFound(false) // reset when new files are uploaded

    const indexFile = fileArray.find((file) => file.name.toLowerCase() === "index.txt")
    const imageFiles = fileArray.filter((file) => /\.(jpg|jpeg|png)$/i.test(file.name))
    
    if (!indexFile) {
      alert("index.txt not found. PSPA format requires an index.txt file.")
      return
    }

    setIndexFound(true) // ✅ index.txt found

    const text = await indexFile.text()
    const lines = text.replace(/\r\n/g, "\n").split("\n").map(line => line.trim())
    const headers = lines[0].split("\t").map(h => h.trim())
    console.log(text,headers)
    const gradeIndex = headers.findIndex((h) => h.toLowerCase().includes("grade"))
    const folderIndex = headers.findIndex(h => h.toLowerCase().replace(/\s/g, '') === "imagefolder")
    const filenameIndex = headers.findIndex(h => h.toLowerCase().replace(/\s/g, '') === "imagefilename")
    const firstNameIndex = headers.findIndex((h) => h.toLowerCase().includes("first"))
    const lastNameIndex = headers.findIndex((h) => h.toLowerCase().includes("last"))
    const teacherNameIndex = headers.findIndex((h) => h.toLowerCase().includes("teacher"))
    const homeRoomIndex = headers.findIndex((h) => h.toLowerCase().replace(/\s/g, "") === "homeroom")


    if (gradeIndex === -1 || filenameIndex === -1 || folderIndex === -1) {
      alert("index.txt is missing required columns: 'Grade', 'Image Folder', or 'Image File Name'")
      return
    }

    const gradeGroups = {}

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split("\t")
      const grade = fields[gradeIndex]?.trim() || "Unknown"
      const imageFolder = fields[folderIndex]?.trim().replace(/\\/g, "/") || ""
      const imageFileName = fields[filenameIndex]?.trim()
      const firstName = fields[firstNameIndex]?.trim() || ""
      const lastName = fields[lastNameIndex]?.trim() || ""
      const teacherName = teacherNameIndex !== -1 ? fields[teacherNameIndex]?.trim() || "Unknown" : "Unknown"
      const homeRoom = homeRoomIndex !== -1 ? fields[homeRoomIndex]?.trim() || "Unknown" : "Unknown"

     

      const expectedPath = `${imageFolder}/${imageFileName}`.toLowerCase()

      const matchedImage = imageFiles.find((img) =>
        img.webkitRelativePath.toLowerCase().endsWith(expectedPath)
      )

      if (matchedImage) {
        const student = {
          fullName: `${firstName} ${lastName}`.trim(),
          file: matchedImage,
          fileName: matchedImage.name,
          relativePath: matchedImage.webkitRelativePath,
          teacherName: teacherName,
          homeRoom: homeRoom
        }

        if (!gradeGroups[grade]) gradeGroups[grade] = []
        gradeGroups[grade].push(student)
      }
    }

    setGroupedByGrade(gradeGroups)

    if (Object.keys(gradeGroups).length === 0) {
      console.warn("No students were grouped. Check index.txt and image file names.")
    } else {
      console.log("✅ Students grouped successfully:")
      console.log(gradeGroups)
    }
  }

  // const removeFile = (index) => {
  //   setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  // }

  const handleUpload = () => {
    if (Object.keys(groupedByGrade).length === 0) return

    navigate("/3", {
      state: {
        groupedByGrade
      }
    })
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="upload-container">
      <div className="upload-header">
        <div className="upload-icon">
          <div className="folder-icon">
            <div className="folder-base"></div>
            <div className="folder-tab"></div>
            <div className="upload-arrow">↑</div>
          </div>
        </div>

        <div className="step-indicator">Step 3 of 4:</div>
        <h1 className="upload-title">Upload Your PSPA Files</h1>

        <p className="upload-description">
          Upload your PSPA format folder including `index.txt` and all portrait images in subfolders. You can drag and
          drop or click to browse a folder.
        </p>
      </div>

      <div className="upload-content">
        <div
          className={`upload-zone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            webkitdirectory="true"
            directory=""
            onChange={handleChange}
            accept=".txt,.jpg,.jpeg,.png"
            style={{ display: "none" }}
          />

          <div className="upload-zone-content">
            <div className="upload-zone-icon">📁</div>
            <div className="upload-zone-text">
              <strong>Drag and drop your PSPA folder here</strong>
              <br />
              or click to browse
            </div>
            <div className="upload-zone-formats">Must include: index.txt, JPG/PNG/JPEG images in folders</div>
          </div>
        </div>

        <div className="upload-requirements">
          <div className="requirements-header">
            <span className="info-icon">i</span>
            <strong>PSPA Format Requirements:</strong>
          </div>
          <ul className="requirements-list">
            <li>Include an <code>index.txt</code> file in root of selected folder</li>
            <li>Portrait images must match the path given in <code>Image Folder</code> and <code>Image File Name</code></li>
            <li>Images must be in JPG or PNG format</li>
           
          </ul>
        </div>

    <div className="upload-actions">
  <button
    className="upload-button"
    onClick={handleUpload}
    disabled={uploadedFiles.length === 0 || uploading || !indexFound}
  >
    {uploading
      ? "Processing Files..."
      : indexFound
        ? `Preview of ${uploadedFiles.length} File${uploadedFiles.length !== 1 ? "s" : ""}`
        : "Show Preview"}
  </button>
</div>

      </div>
    </div>
  )
}
