import React, { useState, useEffect, useRef } from "react";
import TechFormService from "../services/TechFormService";
import "./TechForm.css"; // Import the CSS for custom styles

const TechForm = () => {
  const [techDetails, setTechDetails] = useState({
    techId: "",
    techDescription: "",
  });

  const [techList, setTechList] = useState([]); // List of technologies
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [techToDelete, setTechToDelete] = useState(null); // Technology to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of technologies
  useEffect(() => {
    const fetchTech = async () => {
      try {
        const response = await TechFormService.getTechnologies();
        console.log("API Response:", response.data); // Debug: check the API response
        setTechList(response.data); // Update the tech list
      } catch (error) {
        console.error("Error fetching technologies:", error);
        setErrorMessage("Failed to fetch technologies. Please try again.");
      }
    };
    fetchTech();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechDetails({
      ...techDetails,
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
        await TechFormService.createTechnology(techDetails); // Create tech
      } else if (actionType === "update") {
        await TechFormService.updateTechnology(techDetails); // Update tech
      }

      setShowMessage(true); // Show success message
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to submit tech details. Please try again.");
      console.error("Error submitting tech details:", error);
    }
    setShowConfirmation(false); // Close confirmation modal
  };

  // Handle tech update button click
  const handleUpdate = (tech) => {
    setTechDetails({
      techId: tech.techId,
      techDescription: tech.techDescription,
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (techId) => {
    setTechToDelete(techId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm tech deletion
  const handleConfirmDelete = async () => {
    try {
      await TechFormService.deleteTechnology(techToDelete); // Delete tech
      setTechList(techList.filter((tech) => tech.techId !== techToDelete)); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting tech:", error);
      setErrorMessage("Failed to delete the tech.");
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
            <p>Technology saved successfully!</p>
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
            {actionType === "update" && <p>Are you sure you want to update the tech details?</p>}
            {actionType === "delete" && <p>Are you sure you want to delete this tech?</p>}
            <button onClick={actionType === "submit" || actionType === "update" ? handleConfirmSubmit : handleConfirmDelete}>
              Yes
            </button>
            <button onClick={handleCancelAction}>No</button>
          </div>
        </div>
      )}

      {/* Tech Form Container */}
      <div className="tech-form-container border border-success p-4 mb-4" style={{ width: 400 }} ref={formRef}>
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update Technology" : "Enter Tech Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="techId">Tech ID</label>
            <input
              type="text"
              className="form-control"
              id="techId"
              name="techId"
              value={techDetails.techId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable techId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="techDescription">Tech Description</label>
            <input
              type="text"
              className="form-control"
              id="techDescription"
              name="techDescription"
              value={techDetails.techDescription}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Tech List Container */}
      <div className="tech-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tech ID</th>
              <th>Tech Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {techList.length > 0 ? (
              techList.map((tech) => (
                <tr key={tech.techId}>
                  <td>{tech.techId}</td>
                  <td>{tech.techDescription}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm custom-btn-spacing"
                      onClick={() => handleUpdate(tech)} // Handle Update
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-info btn-sm custom-btn-spacing"
                      onClick={() => handleDelete(tech.techId)} // Handle Delete
                    >Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No technologies available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechForm;
