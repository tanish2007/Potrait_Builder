// components/UploadConfirm.js
import React, { useEffect, useState } from 'react';

const UploadConfirm = ({ setStep, files, setPortraitsData }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parsePSPA = async () => {
      const imageFiles = {};
      let indexFile = null;

      // Separate files
      files.forEach(file => {
        if (file.name.toLowerCase().includes('index')) {
          indexFile = file;
        } else {
          imageFiles[file.name] = file;
        }
      });

      if (!indexFile) {
        alert('index.txt file not found in the folder!');
        return;
      }

      const text = await indexFile.text();
      const lines = text.trim().split('\n');

      const parsed = lines
        .map(line => line.trim().split(/,|\t/)) // support comma or tab
        .filter(parts => parts.length >= 6) // Valid lines
        .map((parts, idx) => {
          const [lastName, firstName, grade, teacher, id, imageName] = parts.map(p => p.trim());

          return {
            name: `${firstName} ${lastName}`,
            grade,
            teacher,
            id,
            file: imageFiles[imageName]
              ? URL.createObjectURL(imageFiles[imageName])
              : null,
          };
        })
        .filter(entry => entry.file !== null); // remove unmatched images

      setPortraitsData(parsed);
      setLoading(false);
    };

    parsePSPA();
  }, [files, setPortraitsData]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <h2 className="text-lg">Parsing portraits from index.txt...</h2>
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-semibold mb-4">PSPA Data Loaded</h2>
      <p className="mb-4 text-gray-600">Students have been grouped by grade.</p>
      <button
        onClick={() => setStep(3)}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
};

export default UploadConfirm;
