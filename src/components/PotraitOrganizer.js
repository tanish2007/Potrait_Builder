import React, { useState } from 'react';
import './PortraitOrganizer.css';

const PortraitOrganizer = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    console.log(`Selected: ${option}`);
  };

  return (
    <div className="portrait-organizer">
      <div className="header">
        <div className="folder-icon">
          <div className="folder-top"></div>
          <div className="folder-bottom"></div>
        </div>
        <div className="step-text">Step 2 of 4:</div>
        <h1 className="main-title">How do you want to organize your portraits?</h1>
      </div>

      <div className="options-container">
        <div className="option-card">
          <div className="icon graduation-icon">
            <div className="cap-top"></div>
            <div className="cap-bottom"></div>
          </div>
          <h3 className="option-title">By Grade</h3>
          <p className="option-description">
            Your portraits will be grouped by student grade with a separate group for teachers.
          </p>
          <button 
            className="select-button"
            onClick={() => handleSelect('By Grade')}
          >
            Select
          </button>
        </div>

        <div className="option-card">
          <div className="icon teacher-icon">
            <div className="person-head"></div>
            <div className="person-body"></div>
            <div className="clipboard"></div>
          </div>
          <h3 className="option-title">By Teacher</h3>
          <p className="option-description">
            Your portraits will be grouped by teacher and associated students.
          </p>
          <button 
            className="select-button"
            onClick={() => handleSelect('By Teacher')}
          >
            Select
          </button>
        </div>

        <div className="option-card">
          <div className="icon group-icon">
            <div className="person person-1"></div>
            <div className="person person-2"></div>
            <div className="person person-3"></div>
          </div>
          <h3 className="option-title">In One Group</h3>
          <p className="option-description">
            All of your portraits will be imported in a single group.
          </p>
          <button 
            className="select-button"
            onClick={() => handleSelect('In One Group')}
          >
            Select
          </button>
        </div>
      </div>

      <div className="note-section">
        <div className="info-icon">i</div>
        <p className="note-text">
          <strong>Note:</strong> If you choose "In One Group" or your photographer disc does not 
          include data for the grouping you select, your portraits will be uploaded into 
          a single section.
        </p>
      </div>
    </div>
  );
};

export default PortraitOrganizer;