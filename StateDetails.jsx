import React, { useState, useEffect, useRef } from "react";
import StateService from "../services/StateService";
import "./StateDetails.css"; // Import the CSS for custom styles

const StateForm = () => {
  const [stateDetails, setStateDetails] = useState({
    stateId: "",
    stateName: "",
  });

  const [statesList, setStatesList] = useState([]); // List of states
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [stateToDelete, setStateToDelete] = useState(null); // State to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await StateService.getStates();
        console.log("API Response:", response.data); // Debug: check the API response
        setStatesList(response.data); // Update the state list
      } catch (error) {
        console.error("Error fetching states:", error);
        setErrorMessage("Failed to fetch states. Please try again.");
      }
    };
    fetchStates();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStateDetails({
      ...stateDetails,
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
        await StateService.createState(stateDetails); // Create state
      } else if (actionType === "update") {
        await StateService.updateState(stateDetails); // Update state
      }

      setShowMessage(true); // Show success message
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload(); // Reload the page after 3 seconds
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      setErrorMessage("Failed to submit state details. Please try again.");
      console.error("Error submitting state details:", error);
    }
    setShowConfirmation(false); // Close confirmation modal
  };

  // Handle state update button click
  const handleUpdate = (state) => {
    setStateDetails({
      stateId: state.stateId,
      stateName: state.stateName,
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (stateId) => {
    setStateToDelete(stateId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm state deletion
  const handleConfirmDelete = async () => {
    try {
      await StateService.deleteState(stateToDelete); // Delete state
      setStatesList(
        statesList.filter((state) => state.stateId !== stateToDelete)
      ); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting state:", error);
      setErrorMessage("Failed to delete the state.");
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
            <p>State saved successfully!</p>
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
              <p>Are you sure you want to update the state details?</p>
            )}
            {actionType === "delete" && (
              <p>Are you sure you want to delete this state?</p>
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

      {/* State Form Container */}
      <div
        className="state-form-container border border-success p-4 mb-4"
        style={{ width: 400 }}
        ref={formRef}
      >
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update State" : "Enter State Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="stateId">State ID</label>
            <input
              type="text"
              className="form-control"
              id="stateId"
              name="stateId"
              value={stateDetails.stateId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable stateId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="stateName">State Name</label>
            <input
              type="text"
              className="form-control"
              id="stateName"
              name="stateName"
              value={stateDetails.stateName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* State List Container */}
      <div className="state-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>State ID</th>
              <th>State Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statesList.length > 0 ? (
              statesList.map((state) => (
                <tr key={state.stateId}>
                  <td>{state.stateId}</td>
                  <td>{state.stateName}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm custom-btn-spacing"
                      onClick={() => handleUpdate(state)} // Handle Update
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-info btn-sm custom-btn-spacing"
                      onClick={() => handleDelete(state.stateId)} // Handle Delete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No states available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StateForm;
