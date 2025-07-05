// components/WelcomePage.js
import React from 'react';

const WelcomePage = ({ setStep, setFiles }) => {
  const handleFolderSelect = (event) => {
    const fileList = Array.from(event.target.files);
    setFiles(fileList);
    setStep(2);
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Upload Class Portraits</h1>
      <p className="mb-4">Select your PSPA-standard portrait folder to begin the upload process.</p>
      <input type="file" webkitdirectory="true" directory="true" multiple onChange={handleFolderSelect} />
    </div>
  );
};

export default WelcomePage;