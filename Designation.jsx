import React, { useState, useEffect, useRef } from "react";
import DesignationFormService from "../services/DesignationFormService"; // Make sure to create a service for designations
import "./DesignationForm.css"; // Import the CSS for custom styles

const DesignationForm = () => {
  const [designationDetails, setDesignationDetails] = useState({
    designationId: "",
    designationName: "",
  });

  const [designationList, setDesignationList] = useState([]); // List of designations
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [designationToDelete, setDesignationToDelete] = useState(null); // Designation to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of designations
  useEffect(() => {
    const fetchDesignations = async () => {
      try {
        const response = await DesignationFormService.getDesignations();
        console.log("API Response:", response.data); // Debug: check the API response
        setDesignationList(response.data); // Update the designation list
      } catch (error) {
        console.error("Error fetching designations:", error);
        setErrorMessage("Failed to fetch designations. Please try again.");
      }
    };
    fetchDesignations();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDesignationDetails({
      ...designationDetails,
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
        await DesignationFormService.createDesignation(designationDetails); // Create designation
      } else if (actionType === "update") {
        await DesignationFormService.updateDesignation(designationDetails); // Update designation
      }

      setShowMessage(true); // Show success message
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to submit designation details. Please try again.");
      console.error("Error submitting designation details:", error);
    }
    setShowConfirmation(false); // Close confirmation modal
  };

  // Handle designation update button click
  const handleUpdate = (designation) => {
    setDesignationDetails({
      designationId: designation.designationId,
      designationName: designation.designationName,
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (designationId) => {
    setDesignationToDelete(designationId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm designation deletion
  const handleConfirmDelete = async () => {
    try {
      await DesignationFormService.deleteDesignation(designationToDelete); // Delete designation
      setDesignationList(designationList.filter((designation) => designation.designationId !== designationToDelete)); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting designation:", error);
      setErrorMessage("Failed to delete the designation.");
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
            <p>Designation saved successfully!</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
            {actionType === "submit" && <p>Are you sure you want to submit the data?</p>}
            {actionType === "update" && <p>Are you sure you want to update the designation details?</p>}
            {actionType === "delete" && <p>Are you sure you want to delete this designation?</p>}
            <button onClick={actionType === "submit" || actionType === "update" ? handleConfirmSubmit : handleConfirmDelete}>
              Yes
            </button>
            <button onClick={handleCancelAction}>No</button>
          </div>
        </div>
      )}

      {/* Designation Form Container */}
      <div className="designation-form-container border border-success p-4 mb-4" style={{ width: 400 }} ref={formRef}>
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update Designation" : "Enter Design Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="designationId">Designation ID</label>
            <input
              type="text"
              className="form-control"
              id="designationId"
              name="designationId"
              value={designationDetails.designationId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable designationId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="designationName">Designation Name</label>
            <input
              type="text"
              className="form-control"
              id="designationName"
              name="designationName"
              value={designationDetails.designationName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Designation List Container */}
      <div className="designation-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Designation ID</th>
              <th>Designation Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {designationList.length > 0 ? (
              designationList.map((designation) => (
                <tr key={designation.designationId}>
                  <td>{designation.designationId}</td>
                  <td>{designation.designationName}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm custom-btn-spacing"
                      onClick={() => handleUpdate(designation)} // Handle Update
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-info btn-sm custom-btn-spacing"
                      onClick={() => handleDelete(designation.designationId)} // Handle Delete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No designations available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DesignationForm;
