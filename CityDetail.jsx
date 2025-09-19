import React, { useState, useEffect, useRef } from "react";
import CityService from "../services/CityService"; // Assuming you have a service file for cities
import DistrictService from "../services/DistrictService"; // Assuming you have a service file for districts

import "./StateDetails.css"; // Import the CSS for custom styles

const CityForm = () => {
  const [cityDetails, setCityDetails] = useState({
    cityId: "",
    cityName: "",
    districtId: "", // Use districtId instead of districtName
  });

  const [districts, setDistricts] = useState([]); // List of districts
  const [citiesList, setCitiesList] = useState([]); // List of cities
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false); // Success overlay
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation pop-up
  const [actionType, setActionType] = useState(""); // Track action type (submit, update, delete)
  const [cityToDelete, setCityToDelete] = useState(null); // City to delete

  // Ref to scroll to the form
  const formRef = useRef(null);

  // Fetch the list of cities and districts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities();
        setCitiesList(response.data); // Update the city list
      } catch (error) {
        console.error("Error fetching cities:", error);
        setErrorMessage("Failed to fetch cities. Please try again.");
      }
    };

    const fetchDistricts = async () => {
      try {
        const response = await DistrictService.getDistricts(); // Fetch districts
        setDistricts(response.data); // Set districts list
      } catch (error) {
        console.error("Error fetching districts:", error);
        setErrorMessage("Failed to fetch districts. Please try again.");
      }
    };

    fetchCities();
    fetchDistricts();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCityDetails({
      ...cityDetails,
      [name]: value,
    });
  };

  // Handle form submit (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation to ensure all fields are filled
    if (!cityDetails.cityName || !cityDetails.districtId) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

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
        await CityService.createCity(cityDetails);
      } else if (actionType === "update") {
        await CityService.updateCity(cityDetails);
      }

      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("Error submitting city details:", error);
      if (error.response) {
        setErrorMessage(
          `Error: ${error.response.data.message || error.response.statusText}`
        );
      } else {
        setErrorMessage("Network error or unexpected error occurred.");
      }
    }
    setShowConfirmation(false);
  };

  // Handle city update button click
  const handleUpdate = (city) => {
    setCityDetails({
      cityId: city.cityId,
      cityName: city.cityName,
      districtId: city.districtId, // Use districtId here
    });
    setActionType("update"); // Set action type to update
    // Scroll to the update form
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Handle delete button click
  const handleDelete = (cityId) => {
    setCityToDelete(cityId);
    setActionType("delete");
    setShowConfirmation(true); // Show confirmation for delete
  };

  // Confirm city deletion
  const handleConfirmDelete = async () => {
    try {
      await CityService.deleteCity(cityToDelete); // Delete city
      setCitiesList(citiesList.filter((city) => city.cityId !== cityToDelete)); // Update list
      setShowConfirmation(false); // Close confirmation modal
    } catch (error) {
      console.error("Error deleting city:", error);
      setErrorMessage("Failed to delete the city.");
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
            <p>City saved successfully!</p>
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
              <p>Are you sure you want to update the city details?</p>
            )}
            {actionType === "delete" && (
              <p>Are you sure you want to delete this city?</p>
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

      {/* City Form Container */}
      <div
        className="state-form-container border border-success p-4 mb-4"
        style={{ width: 400 }}
        ref={formRef}
      >
        <h2 className="text-center mb-4">
          {actionType === "update" ? "Update City" : "Enter City Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="cityId">City ID</label>
            <input
              type="text"
              className="form-control"
              id="cityId"
              name="cityId"
              value={cityDetails.cityId}
              onChange={handleChange}
              required
              disabled={actionType === "update"} // Disable cityId input during update
            />
          </div>

          <div className="form-group">
            <label htmlFor="cityName">City Name</label>
            <input
              type="text"
              className="form-control"
              id="cityName"
              name="cityName"
              value={cityDetails.cityName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="districtId">District</label>
            <select
              className="form-control custom-dropdown"
              id="districtId"
              name="districtId"
              value={cityDetails.districtId}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district.districtId} value={district.districtId}>
                  {district.districtName}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block mt-3">
            {actionType === "update" ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* City List Container */}
      <div className="state-list-container mt-5">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>City ID</th>
              <th>City Name</th>
              <th>District Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {citiesList.length > 0 ? (
              citiesList.map((city) => (
                <tr key={city.cityId}>
                  <td>{city.cityId}</td>
                  <td>{city.cityName}</td>
                  <td>{city.districtId}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm custom-btn-spacing"
                      onClick={() => handleUpdate(city)} // Handle Update
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-info btn-sm custom-btn-spacing"
                      onClick={() => handleDelete(city.cityId)} // Handle Delete
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No cities available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CityForm;
