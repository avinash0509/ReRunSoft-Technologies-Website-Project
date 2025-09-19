import React, { useState, useEffect, useRef } from "react";
import StudentService from "../services/StudentService";
import "./StudentForm.css"; // Import the CSS for custom styles

const StudentForm = () => {
  const [studentDetails, setStudentDetails] = useState({
    studentId: "",
    name: "",
    division: "",
    section: "",
    fees: "",
    busFacility: "no", // Default bus facility is No
  });

  const [studentsList, setStudentsList] = useState([]); // List of students
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [studentToDelete, setStudentToDelete] = useState(null); // Student to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await StudentService.getStudents();
        console.log("API Response:", response.data); // Debug: check the API response
        setStudentsList(response.data); // Update the student list
      } catch (error) {
        console.error("Error fetching students:", error);
        setErrorMessage("Failed to fetch students. Please try again.");
      }
    };
    fetchStudents();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails({
      ...studentDetails,
      [name]: value,
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === "update") {
      setShowConfirmation(true); // Show confirmation for update
    } else {
      setActionType("submit");
      setShowConfirmation(true); // Show confirmation for submit
    }
  };

  // Confirm form submission (create or update)
  const handleConfirmSubmit = async () => {
    try {
      if (actionType === "submit") {
        await StudentService.createStudent(studentDetails); // Create student
      } else if (actionType === "update") {
        await StudentService.updateStudent(studentDetails); // Update student
      }

      setShowMessage(true); // Show success message
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to submit student details. Please try again.");
      console.error("Error submitting student details:", error);
    }
    setShowConfirmation(false); // Close confirmation modal
  };

  // Handle student update button click
  const handleUpdate = (student) => {
    setStudentDetails({
      studentId: student.studentId,
      name: student.name,
      division: student.division,
      section: student.section,
      fees: student.fees,
      busFacility: student.busFacility,
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (studentId) => {
    setStudentToDelete(studentId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm student deletion
  const handleConfirmDelete = async () => {
    try {
      await StudentService.deleteStudent(studentToDelete); // Delete student
      setStudentsList(
        studentsList.filter((student) => student.studentId !== studentToDelete)
      ); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting student:", error);
      setErrorMessage("Failed to delete the student.");
    }
  };

  // Handle cancel action
  const handleCancelAction = () => {
    setShowConfirmation(false); // Hide confirmation modal if user cancels
  };

  // Handle success message close
  const handleClose = () => {
    setShowMessage(false); // Manually close success message
  };

  return (
    <div className="container mt-5">
      {/* Success Message Overlay */}
      {showMessage && (
        <div className="overlay">
          <div className="successMessage">
            <p>Student saved successfully!</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}

      {/* Confirmation Pop-up */}
      {showConfirmation && (
        <div className="overlay">
          <div className="confirmationMessage">
            {actionType === "submit" && (
              <p>Are you sure you want to submit the data?</p>
            )}
            {actionType === "update" && (
              <p>Are you sure you want to update the student details?</p>
            )}
            {actionType === "delete" && (
              <p>Are you sure you want to delete this student?</p>
            )}
            <button
              onClick={
                actionType === "submit" || actionType === "update"
                  ? handleConfirmSubmit
                  : handleConfirmDelete
              }
            >
              Yes
            </button>
            <button onClick={handleCancelAction}>No</button>
          </div>
        </div>
      )}

      {/* Student Form Container */}
      <div
        className="student-form-container border border-success p-4 mb-4"
        style={{ width: 400 }}
        ref={formRef}
      >
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update Student" : "Enter Student Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              className="form-control"
              id="studentId"
              name="studentId"
              value={studentDetails.studentId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable studentId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Student Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={studentDetails.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="division">Division</label>
            <input
              type="text"
              className="form-control"
              id="division"
              name="division"
              value={studentDetails.division}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="section">Section</label>
            <input
              type="text"
              className="form-control"
              id="section"
              name="section"
              value={studentDetails.section}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fees">Fees</label>
            <input
              type="text"
              className="form-control"
              id="fees"
              name="fees"
              value={studentDetails.fees}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bus Facility</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="busFacility"
                  value="yes"
                  checked={studentDetails.busFacility === "yes"}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="busFacility"
                  value="no"
                  checked={studentDetails.busFacility === "no"}
                  onChange={handleChange}
                />
                No
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Student List Container */}
      <div className="student-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Division</th>
              <th>Section</th>
              <th>Fees</th>
              <th>Bus Facility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentsList.length > 0 ? (
              studentsList.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.division}</td>
                  <td>{student.section}</td>
                  <td>{student.fees}</td>
                  <td>{student.busFacility}</td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleUpdate(student)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(student.studentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentForm;
