

import { useState, useEffect } from "react"
import "./edit.css"
// supabaseClient.js
import { supabase } from "./supabaseClient"

export const uploadImageToS3 = async (file, student) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("grade", student.grade);
  formData.append("teacher", student.teacher_name);
  formData.append("homeRoom", student.home_room);

  const res = await fetch("http://localhost:4000/upload-to-s3", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to upload to S3");
  }

  return data.url; // S3 image URL
};



export default function EditPSPAPage() {
  const [volumeNames, setVolumeNames] = useState([])
  const [teacherNames, setTeacherNames] = useState([])
  const [grades, setGrades] = useState([])
  const [homerooms, setHomerooms] = useState([])
  const [allStudents, setAllStudents] = useState([])

  const [selectedVolume, setSelectedVolume] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedHomeroom, setSelectedHomeroom] = useState("")

  const [filteredStudents, setFilteredStudents] = useState([])
  const [editingStudent, setEditingStudent] = useState(null)
  const [classDisplayName, setClassDisplayName] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Fetch all student data from Supabase once
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("schoolname_index").select("*")
      if (error) {
        console.error("Error fetching students:", error)
        return
      }

      setAllStudents(data)

      // Extract and set unique dropdown values
      const uniqueVolumes = [...new Set(data.map((s) => s.volume_name))].sort()
      const uniqueTeachers = [...new Set(data.map((s) => s.teacher_name))].sort()
      const uniqueGrades = [...new Set(data.map((s) => s.grade))].sort()
      const uniqueHomerooms = [...new Set(data.map((s) => s.home_room))].sort()

      setVolumeNames(uniqueVolumes)
      setTeacherNames(uniqueTeachers)
      setGrades(uniqueGrades)
      setHomerooms(uniqueHomerooms)
    }

    fetchData()
  }, [])
  // Update Grades and Homerooms when Teacher is selected
useEffect(() => {
  if (selectedTeacher) {
    const filteredByTeacher = allStudents.filter((s) => s.teacher_name === selectedTeacher)

    const teacherGrades = [...new Set(filteredByTeacher.map((s) => s.grade))].sort()
    const teacherHomerooms = [...new Set(filteredByTeacher.map((s) => s.home_room))].sort()

    setGrades(teacherGrades)
    setHomerooms(teacherHomerooms)

    // Clear previously selected grade/homeroom if not valid anymore
    if (!teacherGrades.includes(selectedGrade)) setSelectedGrade("")
    if (!teacherHomerooms.includes(selectedHomeroom)) setSelectedHomeroom("")
  } else {
    setGrades([])
    setHomerooms([])
    setSelectedGrade("")
    setSelectedHomeroom("")
  }
}, [selectedTeacher, allStudents])


  useEffect(() => {
    if (selectedVolume && selectedTeacher && selectedGrade && selectedHomeroom) {
      const filtered = allStudents.filter(
        (student) =>
          student.volume_name === selectedVolume &&
          student.teacher_name === selectedTeacher &&
          student.grade === selectedGrade &&
          student.home_room === selectedHomeroom,
      )
      setFilteredStudents(filtered)
      generateClassDisplayName()
    } else {
      setFilteredStudents([])
      setClassDisplayName("")
    }
  }, [selectedVolume, selectedTeacher, selectedGrade, selectedHomeroom, allStudents])

  const generateClassDisplayName = () => {
    setClassDisplayName(`${selectedTeacher} - Grade ${selectedGrade} - Room ${selectedHomeroom}`)
  }

  const handleEditStudent = (student) => {
    setEditingStudent({ ...student })
  }

 const handleSaveStudent = async () => {
  if (!editingStudent) return;

  try {
    setSaving(true);

    let pictureUrl = editingStudent.picture;
    const oldPictureUrl = editingStudent.picture;

    // ✅ Upload new image if selected
    if (editingStudent.pictureFile) {
      pictureUrl = await uploadImageToS3(editingStudent.pictureFile, editingStudent);
    }

    // ✅ Update student row (no insert)
    const { error } = await supabase
      .from("schoolname_index")
      .update({
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        image_file_name: editingStudent.pictureFile?.name || editingStudent.image_file_name,
        picture: pictureUrl,
      })
      .eq("id", editingStudent.id);

    if (error) {
      throw new Error("Failed to update student data");
    }
    console.log("Deleting from S3:", oldPictureUrl);

    if (editingStudent.pictureFile && oldPictureUrl && oldPictureUrl !== pictureUrl) {
      await fetch("http://localhost:4000/delete-from-s3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ s3Url: oldPictureUrl }),
      });
    }

    const updatedStudents = filteredStudents.map((student) =>
      student.id === editingStudent.id
        ? { ...editingStudent, picture: pictureUrl, pictureFile: undefined }
        : student
    );
    const fetchData = async () => {
      const { data, error } = await supabase.from("schoolname_index").select("*")
      if (error) {
        console.error("Error fetching students:", error)
        return
      }

      setAllStudents(data)

      // Extract and set unique dropdown values
      const uniqueVolumes = [...new Set(data.map((s) => s.volume_name))].sort()
      const uniqueTeachers = [...new Set(data.map((s) => s.teacher_name))].sort()
      const uniqueGrades = [...new Set(data.map((s) => s.grade))].sort()
      const uniqueHomerooms = [...new Set(data.map((s) => s.home_room))].sort()

      setVolumeNames(uniqueVolumes)
      setTeacherNames(uniqueTeachers)
      setGrades(uniqueGrades)
      setHomerooms(uniqueHomerooms)
    }

    fetchData()

    setFilteredStudents(updatedStudents);
    setEditingStudent(null);
    alert("Student data saved successfully!");
  } catch (error) {
    console.error("Error saving student:", error);
    alert("Error saving student data");
  } finally {
    setSaving(false);
  }
};
const handleDeleteStudent = async (studentId) => {
  const student = filteredStudents.find((s) => s.id === studentId);
  if (!student) return;

  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    const res = await fetch("http://localhost:4000/delete-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId,
        s3Url: student.picture,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete student");
    }

    // Update UI after successful deletion
    const updatedStudents = filteredStudents.filter((s) => s.id !== studentId);
    setFilteredStudents(updatedStudents);
    setAllStudents((prev) => prev.filter((s) => s.id !== studentId));
    alert("Student deleted successfully!");
  } catch (err) {
    console.error("Error deleting student:", err);
    alert("Error deleting student");
  }
};


  

  const handleAddNewStudent = async () => {
    const newStudent = {
      id: Date.now(), // Generate temporary ID
      volume_name: selectedVolume,
      teacher_name: selectedTeacher,
      grade: selectedGrade,
      homeroom: selectedHomeroom,
      folder_number: "",
      first_name: "",
      last_name: "",
      image_file_name: "",
      picture: "/placeholder.svg?height=40&width=40&text=New",
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add to local state (in real app, this would insert into Supabase)
      setFilteredStudents([...filteredStudents, newStudent])
      setEditingStudent(newStudent)
      alert("New student added!")
    } catch (error) {
      console.error("Error adding new student:", error)
      alert("Error adding new student")
    }
  }


  const handleBulkSave = async () => {
    try {
      setLoading(true)
      // Simulate bulk save operation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("All changes saved successfully!")
    } catch (error) {
      alert("Error saving changes")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToHome = () => {

  }

  return (
    <div className="edit-pspa-page">
      <div className="page-header">
        <button className="back-button" onClick={handleBackToHome}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 5l-5 5 5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Home
        </button>
        <h1 className="page-title">Edit PSPA</h1>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Volume Name</label>
            <select
              value={selectedVolume}
              onChange={(e) => setSelectedVolume(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Volume</option>
              {volumeNames.map((volume) => (
                <option key={volume} value={volume}>
                  {volume}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Teacher Name</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Teacher</option>
              {teacherNames.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Grade</label>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="filter-select">
              <option value="">Select Grade</option>
              {grades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Homeroom</label>
            <select
              value={selectedHomeroom}
              onChange={(e) => setSelectedHomeroom(e.target.value)}
              className="filter-select"
            >
              <option value="">Select Homeroom</option>
              {homerooms.map((homeroom) => (
                <option key={homeroom} value={homeroom}>
                  Room {homeroom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {classDisplayName && (
          <div className="class-display">
            <p>
              <strong>Printer Friendly Name for Class:</strong> {classDisplayName}
            </p>
          </div>
        )}

        {/* <div className="action-buttons">
          <button className="action-btn move-btn" onClick={handleMoveClass}>
            Move Class
          </button>
          <button className="action-btn add-btn" onClick={handleAddNewStudent}>
            Add New
          </button>
          <button className="action-btn delete-btn" onClick={() => alert("Delete class functionality")}>
            Delete
          </button>
          <button className="action-btn merge-btn" onClick={handleMergeSplitPhoto}>
            Merge Split Photo
          </button>
        </div> */}
      </div>

      {filteredStudents.length > 0 && (
        <div className="data-section">
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Folder</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Photo</th>
                  <th>Photo Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      {/* {editingStudent?.id === student.id ? (
                        <input
                          type="text"
                          value={editingStudent.volume_name || ""}
                          onChange={(e) => setEditingStudent({ ...editingStudent, volume_name: e.target.value })}
                          className="edit-input"
                          placeholder="Folder #"
                        />
                      ) : (
                        student.volume_name || ""
                      )} */}
                      {student.volume_name || ""}

                    </td>
                    <td>
                      {editingStudent?.id === student.id ? (
                        <input
                          type="text"
                          value={editingStudent.first_name || ""}
                          onChange={(e) => setEditingStudent({ ...editingStudent, first_name: e.target.value })}
                          className="edit-input"
                          placeholder="First Name"
                        />
                      ) : (
                        student.first_name || ""
                      )}
                    </td>
                    <td>
                      {editingStudent?.id === student.id ? (
                        <input
                          type="text"
                          value={editingStudent.last_name || ""}
                          onChange={(e) => setEditingStudent({ ...editingStudent, last_name: e.target.value })}
                          className="edit-input"
                          placeholder="Last Name"
                        />
                      ) : (
                        student.last_name || ""
                      )}
                    </td>
                    {/* <td>
                      <div className="photo-cell">
                        {student.picture ? (
                          <img
                            src={student.picture || "/placeholder.svg"}
                            alt="Student"
                            className="student-photo"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=40&width=40&text=No+Photo"
                            }}
                          />
                        ) : (
                          <div className="photo-placeholder">📷</div>
                        )}
                      </div>
                    </td> */}
                    {/* <td>
  <div className="photo-cell">
    {editingStudent?.id === student.id ? (
      <>
        <img
          src={editingStudent.picture || "/placeholder.svg"}
          alt="Student"
          className="student-photo"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=40&width=40&text=No+Photo"
          }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0]
            if (!file) return
            try {
              const publicUrl = await uploadImageToSupabase(file, student.id)
              setEditingStudent((prev) => ({ ...prev, picture: publicUrl }))
              alert("Photo uploaded successfully!")
            } catch (err) {
              console.error(err)
              alert("Error uploading photo")
            }
          }}
        />
      </>
    ) : student.picture ? (
      <img
        src={student.picture}
        alt="Student"
        className="student-photo"
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=40&width=40&text=No+Photo"
        }}
      />
    ) : (
      <div className="photo-placeholder">📷</div>
    )}
  </div>
</td> */}

<td>
  <div className="photo-cell">
    {editingStudent?.id === student.id ? (
      <>
        <img
          src={editingStudent.picture || "/placeholder.svg"}
          alt="Student"
          className="student-photo"
          onError={(e) => {
            e.target.src = "/placeholder.svg?height=40&width=40&text=No+Photo"
          }}
        />
      <div className="custom-file-upload">
  <label htmlFor={`file-upload-${student.id}`} className="upload-btn">
    📤 Upload Photo
  </label>
  <input
    id={`file-upload-${student.id}`}
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      const tempUrl = URL.createObjectURL(file);

      setEditingStudent((prev) => ({
        ...prev,
        pictureFile: file,
        picture: tempUrl,
      }));
    }}
    style={{ display: "none" }} // Hide native file input
  />
</div>


      </>
    ) : student.picture ? (
      <img
        src={student.picture}
        alt="Student"
        className="student-photo"
        onError={(e) => {
          e.target.src = "/placeholder.svg?height=40&width=40&text=No+Photo"
        }}
      />
    ) : (
      <div className="photo-placeholder">📷</div>
    )}
  </div>
</td>

                    <td>
                      {/* {editingStudent?.id === student.id ? (
                        <input
                          type="text"
                          value={editingStudent.image_file_name || ""}
                          onChange={(e) => setEditingStudent({ ...editingStudent, image_file_name: e.target.value })}
                          className="edit-input"
                          placeholder="Photo Name"
                        />
                      ) : (
                        student.image_file_name || ""
                      )} */}
                      {student.image_file_name || ""}

                    </td>
                    <td>
                      <div className="row-actions">
                        {editingStudent?.id === student.id ? (
                          <>
                            <button className="save-btn" onClick={handleSaveStudent} disabled={saving}>
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button className="cancel-btn" onClick={() => setEditingStudent(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="edit-btn" onClick={() => handleEditStudent(student)}>
                              Edit
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteStudent(student.id)}>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div className="save-section">
            <button className="main-save-btn" onClick={handleBulkSave} disabled={loading}>
              {loading ? "Saving All Changes..." : "Save All Changes"}
            </button>
          </div> */}

          {/* <div className="info-section">
            <p className="info-text">
              <strong>Info:</strong> Crop photos to 6x2 x 762 size for optimal display
            </p>
          </div> */}
        </div>
      )}

      {selectedVolume && selectedTeacher && selectedGrade && selectedHomeroom && filteredStudents.length === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📋</div>
          <h3>No Students Found</h3>
          <p>No students found for the selected criteria.</p>
          <button className="action-btn add-btn" onClick={handleAddNewStudent}>
            Add First Student
          </button>
        </div>
      )}

      {(!selectedVolume || !selectedTeacher || !selectedGrade || !selectedHomeroom) && (
        <div className="selection-prompt">
          <div className="prompt-icon">🎯</div>
          <h3>Select All Filters</h3>
          <p>Please select Volume Name, Teacher Name, Grade, and Homeroom to view student data.</p>
        </div>
      )}
    </div>
  )
}
