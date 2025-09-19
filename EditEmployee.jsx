import React, { useState, useEffect } from "react";
import EmployeeService from "../services/EmployeeService";
import { useNavigate, useParams } from "react-router-dom";
import CustomSelect from "./Selector";
import axios from "axios";
const UpdateEmployee = () => {
  const [employee, setEmployee] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    address3: "",
    state: "",
    district: "",
    city: "",
    pincode: "",
    joiningDate: "",
    gender: "",
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
    const [technologies, setTechnologies] = useState([]); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { id } = useParams(); // Get the employee ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await EmployeeService.getEmployeeById(id);
        console.log("Fetched Employee:", response.data);  // Check the employeeId in response
        setTechnologies(response.data);  // Make sure employeeId is in the state
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    const fetchStates = async () => {
      try {
        const response = await axios.get('/api/state'); // API endpoint to fetch states
        const stateList = response.data.map((state) => ({
          value: state.stateId.toString(), // Assuming stateId is the ID in the database
          label: state.stateName, // Assuming stateName is the name of the state
        }));
        setStates(stateList); // Store states in the state
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
    fetchEmployee();
  }, [id]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (employee.state) {
        try {
          const response = await axios.get(`/api/district`); // API to fetch districts for a given state
          const districtList = response.data.map((district) => ({
            value: district.districtId.toString(), // Assuming districtId is the ID for the district
            label: district.districtName, // Assuming districtName is the name of the district
          }));
          setDistricts(districtList); // Set the district options based on the selected state
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      }
    };

    fetchDistricts();
  }, [employee.state]);

  useEffect(() => {
    const fetchCities = async () => {
      if (employee.district) {
        try {
          const response = await axios.get(`/api/city`); // API to fetch cities for a given district
          const cityList = response.data.map((city) => ({
            value: city.cityId.toString(),
            label: city.cityName,
          }));
          setCities(cityList); // Set the city options based on the selected district
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };

    fetchCities();
  }, [employee.district]); //

  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Employee ID:", employee.employeeId);  // Ensure employeeId is set
    try {
      await EmployeeService.updateEmployee(id, employee);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setEmployee({
        ...employee,
        state: value,
        district: "",
        city: "",
      });
    } else if (name === "district") {
      setEmployee({
        ...employee,
        district: value,
        city: "",
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/employee-list"); // Navigate back to employee list after closing the modal
  };

  
const handleTechnologiesChange = (selectedTechnologies) => {
  console.log("Selected Technologies:", selectedTechnologies); // Log to check if it has techId
  setEmployee({
    ...employee,
    technologies: selectedTechnologies.map((tech) => ({ techId: tech.value })),
  });
};


   
return (
    <div className="container mt-5" style={{ maxWidth: "550px" }}>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Employee ID */}
            <div className="mb-3">
           <label className="form-label">Employee ID:</label>
            <input
             type="text"
             className="form-control"
             name="employeeId"
             value={employee.employeeId}
             onChange={handleChange}
         
            />
          </div>

            {/* First Name and Last Name (Row) */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={employee.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={employee.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="mb-3">
              <label className="form-label">Address Line 1:</label>
              <input
                type="text"
                className="form-control"
                name="address1"
                value={employee.address1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address Line 2:</label>
              <input
                type="text"
                className="form-control"
                name="address2"
                value={employee.address2}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address Line 3:</label>
              <input
                type="text"
                className="form-control"
                name="address3"
                value={employee.address3}
                onChange={handleChange}
              />
            </div>

            {/* Location Details (Row) */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">State:</label>
                <select
                  className="form-control"
                  name="state"
                  value={employee.state}
                  onChange={handleChange}
                  required
                >
                     <option value="">Select State</option>
                 {states.map((state, index) => (
                 <option key={index} value={state.value}>
                  {state.label} {/* Ensure this is a string */}
                 </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">District:</label>
                <select
                  className="form-control"
                  name="district"
                  value={employee.district}
                  onChange={handleChange}
                  required
                  disabled={!employee.state}
                >
                 <option value="">Select District</option>
                {districts.map((district, index) => (
                  <option key={index} value={district.value}>
                    {district.label} {/* This should be the name of the district */}
                  </option>
                ))}
                </select>
              </div>

             <div className="col-md-4 mb-3">
                <label className="form-label">City:</label>
                <select
                  className="form-control"
                  name="city"
                  value={employee.city}
                  onChange={handleChange}
                  required
                  disabled={!employee.district}
                >
                 <option value="">Select City</option>
                {cities.map((city, index) => (
                  <option key={index} value={city.value}>
                    {city.label}
                  </option>
                ))}
                </select>
              </div>
            </div>

            {/* Pincode */}
            <div className="mb-3">
              <label className="form-label">Pincode:</label>
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={employee.pincode}
                onChange={handleChange}
                required
              />
            </div>

            {/* Joining Date */}
            <div className="d-flex justify-content-between align-items-center mb-3">
           
              <label className="form-label">Joining Date:</label>
              <div className="col-sm-4">
                <input
                  type="date"
                  className="form-control"
                  name="joiningDate"
                  value={employee.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label d-block">Gender:</label>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  className="form-check-input"
                  checked={employee.gender === "Male"}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  className="form-check-input"
                  checked={employee.gender === "Female"}
                  onChange={handleChange}
                  required
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
            </div>

                 {/* Technology Selection */}
                 <div className="mb-3">
              <CustomSelect
                technologies={technologies}  // Pass technologies to CustomSelect
                onTechnologiesChange={handleTechnologiesChange}  // Handle change
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-save me-2"></i>Update
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="successModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title" id="successModal">
                  Success!
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Employee has been successfully updated!</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary bg-info"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateEmployee;
