import { useNavigate } from "react-router-dom"
import "./PortraitImporter.css"

const PortraitImporter = () => {

  const navigate= useNavigate()
  const handleSelectFolder = () => {
    // Handle folder selection logic here\

    console.log("Select folder clicked")
    navigate("/2")
  }

  return (
    <div className="portrait-importer">
      <header className="header">
        <h1 className="title">Portrait Importer</h1>
      </header>

      <main className="main-content">
        <div className="illustration-container">
          <div className="folder-icon">
            <div className="folder-base"></div>
            <div className="folder-tab"></div>
            <div className="portrait-preview">
              <div className="portrait-image"></div>
            </div>
          </div>
         
        </div>

        <div className="step-indicator">Step 1 of 4:</div>
        <h2 className="main-heading">Select the Folder Containing Your Portraits</h2>

        <p className="description">
          To automatically add the names and details to your portraits your portrait "disk" must be in the standard PSPA
          format ("Professional School Photographers of America"):
        </p>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">
              <span className="chevron">▷</span>
              <span className="number">Step 1</span>
            </div>
            <div className="step-description">
              Confirm the disk is in your computer or you've copied them to your computer from the cloud (dropbox,
              Google Drive etc.).
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">
              <span className="chevron">▷</span>
              <span className="number">Step 2</span>
            </div>
            <div className="step-description">Select main or "root" folder containing all of the portrait folders.</div>
          </div>
        </div>

        <div className="note-section">
          <div className="info-icon">
            <span className="info-symbol">i</span>
          </div>
          <div className="note-text">
            <strong>Note:</strong> If the names don't automatically load on the next steps this is most likely because
            your portraits do not contain an "index.txt" file or it is not properly formatted. Contact Treering support
            to help you with your portraits.
          </div>
        </div>

        <button className="select-folder-btn" onClick={handleSelectFolder}>
          Select Folder
        </button>
      </main>
    </div>
  )
}

export default PortraitImporter
