// components/PreviewEditor.js
import React, { useState } from 'react';

const PreviewEditor = ({ portraitsData, organizationType }) => {
  const [data, setData] = useState(portraitsData);

  const handleNameChange = (index, newName) => {
    const updated = [...data];
    updated[index].name = newName;
    setData(updated);
  };
const grouped = data.reduce((acc, student) => {
  const group = organizationType === 'grade' ? student.grade : 'All';
  if (!acc[group]) acc[group] = [];
  acc[group].push(student);
  return acc;
}, {});

return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Preview & Edit Portraits</h2>
      {Object.entries(grouped).map(([group, students]) => (
        <div key={group} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{organizationType === 'grade' ? `Grade ${group}` : group}</h3>
          <div className="grid grid-cols-4 gap-4">
            {students.map((s, i) => (
              <div key={i} className="bg-white p-2 shadow rounded">
                <img src={s.file} alt={s.name} className="w-full h-auto mb-2" />
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => handleNameChange(data.indexOf(s), e.target.value)}
                  className="border p-1 w-full"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewEditor;
