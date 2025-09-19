import React, { useState,useEffect } from "react";
import EmployeeService from "../services/EmployeeService";
import { useNavigate } from "react-router-dom";
import CustomSelect from "./Selector";
import './AddEmployee.css';
import axios from "axios";
const AddEmployee = () => {
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
    roles: [], 
    technologies: [],
    designation: "",
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [technologies, setTechnologies] = useState([]);  // To store technology options
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    setEmployee((prevState) => {
      // Create a new copy of the roles array
      const newRoles = [...prevState.roles];
      
      if (newRoles.includes(role)) {
        // If role is already selected, remove it
        newRoles.splice(newRoles.indexOf(role), 1);
      } else {
        // If role is not selected, add it
        newRoles.push(role);
      }

      return { ...prevState, roles: newRoles }; // Return the updated employee state
    });
  };


  
  useEffect(() => {
    
     // Fetch available designations when component loads
    const fetchDesignations = async () => {
      try {
        const response = await axios.get('/api/designations'); // API to fetch designations
        const designationList = response.data.map((designation) => ({
          value: designation.designationId.toString(),
          label: designation.designationName, // Assuming designationName is the name of the designation
        }));
        setDesignations(designationList); // Store designations in the state
      } catch (error) {
        console.error("Error fetching designations:", error);
      }
    };
    // Fetch available technologies when component loads
    const fetchTechnologies = async () => {
      try {
        const response = await EmployeeService.getTechnologies();
        setTechnologies(response.data); // Store technology options in state
      } catch (error) {
        console.error("Error fetching technologies:", error);
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

    fetchDesignations();
    fetchStates ();
    fetchTechnologies();
  }, []);

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
    console.log("Form Submitted");

    // Validate employee data
    if (!employee.employeeId || !employee.firstName || !employee.lastName) {
      console.error("Required fields are missing!");
      alert("Please fill out all required fields.");
      return;
    }

    // Construct the employee object
    const Employee = {
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      address1: employee.address1,
      address2: employee.address2,
      address3: employee.address3,
      state: employee.state,
      district: employee.district,
      city: employee.city,
      pincode: employee.pincode,
      joiningDate: employee.joiningDate,
      gender: employee.gender,
      admin: employee.roles.includes('Admin'),
      reporting: employee.roles.includes('Reporting'),
      supervisor: employee.roles.includes('Supervisor'),
      user: employee.roles.includes('User'),
      technologies: employee.technologies,
      designation: employee.designation,
      
    };

    try {
      // Create the employee
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Employee),
      });

      if (!response.ok) {
        throw new Error(`Failed to create employee. Status: ${response.status}`);
      }

      const employeeData = await response.json(); // Expect employeeData to include employeeId
      console.log("Employee created:", employeeData);

      if (!employeeData.employeeId) {
        throw new Error('Employee ID not returned from the employee creation API');
      }

      // Handle technologies if any selected
      const selectedTechIds = employee.technologies; // Directly using the selected technology IDs
     // const selectedTechIds = employee.selectedTechnology;
    //  console.log("Selected technology IDs:", selectedTechIds);
      
     // console.log(selectedTechIds.count())

     // selectedTechIds.length

    //  selectedTechIds.array.forEach(element => {
    //    console.log(value + index)
     // });
      
      // Only proceed if there are selected technologies
      
     if (selectedTechIds.length > 0) 
     {
      selectedTechIds.forEach(async () => {

        //alert("Selected count" + " " + techId.value );
       
        const techResponse =  await fetch('/api/emptechstack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId: employeeData.employeeId, // Pass employeeId
            //techIds: selectedTechIds, // Pass selected techIds
           techId: selectedTechIds.tech, // Pass selected techIds
          }),
        });

        if (!techResponse.ok) {
          throw new Error(`Failed to add technologies. Status: ${techResponse.status}`);
        }

     console.log("Technologies added successfully!");

      })
      

    }
      // {
      //   const techResponse = await fetch('/api/emptechstack', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       employeeId: employeeData.employeeId, // Pass employeeId
      //       //techIds: selectedTechIds, // Pass selected techIds
      //      techId: 1111111, // Pass selected techIds
      //     }),
      //   });

      //   if (!techResponse.ok) {
      //     throw new Error(`Failed to add technologies. Status: ${techResponse.status}`);
      //   }

      //   console.log("Technologies added successfully!");
      // } 
      else
      {
        console.log("No technologies selected, skipping the second API call.");
      }

         setShowSuccessModal(true); // Redirect to employee list page after success

    } 
    catch (error) 
    {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "state") {
    // Reset district and city when state changes
    setEmployee({
      ...employee,
      state: value,
      district: "",
      city: "",
    });
  } else if (name === "district") {
    // Reset city when district changes
    setEmployee({
      ...employee,
      district: value,
      city: "",
    });
  } else {
    // Update other fields normally
    setEmployee({
      ...employee,
      [name]: value,
    });
  }
};


const handleCloseModal = () => {
  setShowSuccessModal(false);
  navigate("/employee-list");  // Redirect to employee list page after closing the modal
};

  // Handle the technologies selected by the CustomSelect component
  const handleTechnologiesChange = (selectedTechnologies) => {
    console.log("Selected Technologies:", selectedTechnologies); // Check if technologies are selected correctly
  
    // Ensure the 'techId' (value) is passed correctly
    setEmployee({
      ...employee,
      technologies: selectedTechnologies.map((tech) => tech.value), // Ensure techId is passed correctly
    });
  };



  return (
    <div className="container mt-5" style={{maxWidth: "550px",}}>
      {/* Form Header */}
     

      {/* Form Card */}
      <div className="card shadow " >
        <div className="card-body"> 
          
          <form onSubmit={handleSubmit}>
            {/* Employee ID */}
            <div className="mb-3">
              <label className="form-label">Employee ID: *</label>
              <input
                type="text"
                className="form-control"
                name="employeeId"
                value={employee.employeeId}
                onChange={handleChange}
                required
              />
            </div>

            {/* First Name and Last Name (Row) */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name: *</label>
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
                <label className="form-label">Last Name: *</label>
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
              <label className="form-label">Address Line 1: *</label>
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
              <div className="col-md-4 mb-3 ">
                <label className="form-label">State:</label>
                <select
                  className="form-control custom-dropdown"
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
              <label className="form-label">Pincode: *</label>
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
                value={(employee.joiningDate)}
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


            {/* Roles Selection */}
            <div className="container mt-4 mb-4">
  <div className="sm-5">
  <label className="form-label">Roles:</label>
  </div>
  <div className="form-check form-check-inline ml-4">
    <input
      className="form-check-input checkbox-style"
      type="checkbox"
      id="inlineCheckbox1"
      value="option1"
      checked={employee.roles.includes('Admin')} // Example for checked state
      onChange={() => handleRoleChange('Admin')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox1">
      Admin
    </label>
  </div>

  <div className="form-check form-check-inline">
    <input
      className="form-check-input checkbox-style"
      type="checkbox"
      id="inlineCheckbox2"
      value="option2"
      checked={employee.roles.includes('Reporting')}
      onChange={() => handleRoleChange('Reporting')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox2">
      Reporting
    </label>
  </div>

  <div className="form-check form-check-inline">
    <input
      className="form-check-input checkbox-style"
      type="checkbox"
      id="inlineCheckbox3"
      value="option3"
      checked={employee.roles.includes('Supervisor')}
      onChange={() => handleRoleChange('Supervisor')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">
      Supervisor
    </label>
  </div>

  <div className="form-check form-check-inline">
    <input
      className="form-check-input checkbox-style"
      type="checkbox"
      id="inlineCheckbox4"
      value="option4"
      checked={employee.roles.includes('User')}
      onChange={() => handleRoleChange('User')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox4">
      User
    </label>
  </div>
</div>


                   {/* Designation Dropdown */}
            <div className="mb-3" >
              <label className="form-label">Designation:</label>
              <select
                className="form-control"
                name="designation"
                value={employee.designation}
                onChange={handleChange}
                required
              >
                <option value="">Select Designation</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation.value}>
                    {designation.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Technology Selection */}
            <div className="mb-3">
            <label className="form-label">Technologies:</label>
            <CustomSelect technologies={technologies} onSelectionChange={handleTechnologiesChange} />
            </div>
            {/* Submit Button */}
            <div className="text-center">

              <button type="submit" className="btn btn-primary px-4 ">
                <i className="bi bi-save me-2"></i>Save
              </button>
            </div>
          </form>
        </div>
      </div>
      
       {/* Success Modal */}
       {showSuccessModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-labelledby="successModal" aria-hidden="true">
          <div className="modal-dialog modal-sm" role="document">
            <div className="modal-content">
              <div className="modal-header  bg-primary text-white" >
                <h5 className="modal-title" id="successModal">Success!</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>  
              <div className="modal-body">
                <p>Employee has been successfully added!</p>
              </div>
              <div className="modal-footer ">
                <button type="button" className="btn btn-secondary bg-info" onClick={handleCloseModal}>
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

export default AddEmployee;