import React, { useEffect, useState } from "react";
import EmployeeService from "../services/EmployeeService";
import { useNavigate, Link } from "react-router-dom";
import { Toast, ToastContainer } from "react-bootstrap"; // Import React-Bootstrap Toast component
import './EmployeeList.css'; // Import the CSS file for styling

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showToast, setShowToast] = useState(false); // State to control the toast visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const response = await EmployeeService.getEmployees();
    setEmployees(response.data);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this employee?");
    if (isConfirmed) {
      await EmployeeService.deleteEmployee(id);
      fetchEmployees();
      setShowToast(true); // Show toast after delete
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between mb-3 ">
        <h2>Emp Details</h2>
        <button
          className="btn"

          onClick={() => navigate("/add-employee")}
        >
          Add New Emp
        </button>
      </div>

      <div className="card shadow-sm   table table-hover table-striped table-bordered">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-striped  table-bordered">
              <thead>
                <tr>
                  <th>Emp Id</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Address1</th>
                  <th>Address2</th>
                  <th>Address3</th>
                  <th>State</th>
                  <th>District</th>
                  <th>City</th>
                  <th>Pincode</th>
                  <th>Joining Date</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.employeeId}</td>
                    <td>{employee.firstName}</td>
                    <td>{employee.lastName}</td>
                    <td>{employee.address1}</td>
                    <td>{employee.address2}</td>
                    <td>{employee.address3}</td>
                    <td>{employee.state}</td>
                    <td>{employee.district}</td>
                    <td>{employee.city}</td>
                    <td>{employee.pincode}</td>
                    <td>{employee.joiningDate}</td>
                    <td>{employee.gender}</td>
                    <td className="d-flex justify-content-between">
                      <Link
                        to={`/update-employee/${employee.id}`}
                        className="btn btn-info btn-sm m-1"
                      >
                        Update
                      </Link>
                      <button
                        className="btn btn-danger btn-sm m-1"
                        onClick={() => handleDelete(employee.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Toast notification for delete success */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Body>Delete Successful!</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default EmployeeList;
