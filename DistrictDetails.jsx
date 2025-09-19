import React, { useState, useEffect, useRef } from "react";
import DistrictService from "../services/DistrictService";
import "./StateDetails.css"; // Import the CSS for custom styles
import axios from "axios";

const DistrictForm = () => {
  const [districtDetails, setDistrictDetails] = useState({
    districtId: "",
    districtName: "",
    stateId: "",  // Change from stateName to stateId
  });

  const [states, setStates] = useState([]); 
  const [districtsList, setDistrictsList] = useState([]); // List of districts
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [districtToDelete, setDistrictToDelete] = useState(null); // District to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of districts and states
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await DistrictService.getDistricts();
        setDistrictsList(response.data); // Update the district list
      } catch (error) {
        console.error("Error fetching districts:", error);
        setErrorMessage("Failed to fetch districts. Please try again.");
      }
    };

    const fetchStates = async () => {
      try {
        const response = await axios.get('/api/state'); // API endpoint to fetch states
        const stateList = response.data.map((state) => ({
          value: state.stateId.toString(), // Save the stateId
          label: state.stateName, // Label to display
        }));
        setStates(stateList); // Store states in the state
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
    fetchDistricts();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDistrictDetails({
      ...districtDetails,
      [name]: value, // Update the state when form fields change
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
        await DistrictService.createDistrict(districtDetails); // Create district
      } else if (actionType === "update") {
        await DistrictService.updateDistrict(districtDetails); // Update district
      }

      setShowMessage(true); // Show success message
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to submit district details. Please try again.");
      console.error("Error submitting district details:", error);
    }
    setShowConfirmation(false); // Close confirmation modal
  };

  // Handle district update button click
  const handleUpdate = (district) => {
    setDistrictDetails({
      districtId: district.districtId,
      districtName: district.districtName,
      stateId: district.stateId, // Use stateId here
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (districtId) => {
    setDistrictToDelete(districtId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm district deletion
  const handleConfirmDelete = async () => {
    try {
      await DistrictService.deleteDistrict(districtToDelete); // Delete district
      setDistrictsList(districtsList.filter((district) => district.districtId !== districtToDelete)); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting district:", error);
      setErrorMessage("Failed to delete the district.");
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
            <p>District saved successfully!</p>
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
            {actionType === "update" && <p>Are you sure you want to update the district details?</p>}
            {actionType === "delete" && <p>Are you sure you want to delete this district?</p>}
            <button onClick={actionType === "submit" || actionType === "update" ? handleConfirmSubmit : handleConfirmDelete}>
              Yes
            </button>
            <button onClick={handleCancelAction}>No</button>
          </div>
        </div>
      )}

      {/* District Form Container */}
      <div className="state-form-container border border-success p-4 mb-4" style={{ width: 400 }} ref={formRef}>
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update District" : "Enter District Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="districtId">District ID</label>
            <input
              type="text"
              className="form-control"
              id="districtId"
              name="districtId"
              value={districtDetails.districtId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable districtId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="districtName">District Name</label>
            <input
              type="text"
              className="form-control"
              id="districtName"
              name="districtName"
              value={districtDetails.districtName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stateName">State Name</label>
            <select
              className="form-control custom-dropdown"
              id="stateName"
              name="stateId"  // Use stateId here
              value={districtDetails.stateId}  // Bind to stateId
              onChange={handleChange}
            >
              <option value="">Select State</option>
              {states.map((state, index) => (
                <option key={index} value={state.value}>
                  {state.label} {/* Display state name */}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* District List Container */}
      <div className="state-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>District ID</th>
              <th>District Name</th>
              <th>State Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {districtsList.length > 0 ? (
              districtsList.map((district) => (
                <tr key={district.districtId}>
                  <td>{district.districtId}</td>
                  <td>{district.districtName}</td>
                  <td>{district.stateId}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm custom-btn-spacing"
                      onClick={() => handleUpdate(district)} // Handle Update
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-info btn-sm custom-btn-spacing"
                      onClick={() => handleDelete(district.districtId)} // Handle Delete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No districts available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistrictForm;
