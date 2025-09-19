import React, { useState } from "react";
import "./SalaryPage.css";

const SalaryForm = () => {
  const [formData, setFormData] = useState({
    month: "",
    year: "",
    employeeName: "",
    salaryAmount: "",
    overtimeDays: "",
    overtimeRate: "",
    leaveTaken: "",
    leaveDeductionAmount: "",
    bonus: "",
    deductions: "",
    totalSalary: 0,
    totalOvertimeAmount: 0,
    totalLeaveDeduction: 0,
    totalPaidSalary: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { salaryAmount, bonus, deductions, overtimeDays, overtimeRate, leaveTaken,  leaveDeductionAmount, } = formData;
    const totalOvertimeAmount = parseFloat(overtimeDays || 0) * parseFloat(overtimeRate || 0);
    const totalLeaveDeduction = parseFloat(leaveTaken || 0) * parseFloat(leaveDeductionAmount || 0);
    const totalSalary = (
      parseFloat(salaryAmount) +
      parseFloat(bonus || 0) -
      parseFloat(deductions || 0)+
      totalOvertimeAmount-
      totalLeaveDeduction
    ).toFixed(2);

        // Calculate total paid salary (after deductions and overtime)
        const totalPaidSalary = (
          parseFloat(salaryAmount) +
          parseFloat(bonus || 0) -
          parseFloat(deductions || 0) +
          totalOvertimeAmount -
          totalLeaveDeduction
        ).toFixed(2);

    setFormData({
      ...formData,
      totalSalary,
      totalOvertimeAmount,
      totalLeaveDeduction,
      totalPaidSalary,
    });
  };

    // Function to format amounts in Indian Rupees
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    }; 

  // Month options for dropdown
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  // Year options for dropdown (only 2024 and 2025)
  const years = ["2024", "2025"];

  return (
    <div className="form-container" style={{width: 450}}>

      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="month">Month:</label>
          <select
            id="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Select Month</option>
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>

          <label htmlFor="year">Year:</label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            {years.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          </div>

        <div className="form-group">
          <label htmlFor="employeeName">Employee Name:</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salaryAmount">Salary Amount:</label>
          <input
            type="text"
            id="salaryAmount"
            name="salaryAmount"
            value={formData.salaryAmount}
            onChange={handleChange}
            required
          />
        </div>

        
        <div className="form-group">
          <label htmlFor="overtimeDays">Overtime Days:</label>
          <input
            type="text"
            id="overtimeDays"
            name="overtimeDays"
            value={formData.overtimeDays}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="overtimeRate">Overtime Rate:</label>
          <input
            type="text"
            id="overtimeRate"
            name="overtimeRate"
            value={formData.overtimeRate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaveTaken">Leave Taken (Days):</label>
          <input
            type="text"
            id="leaveTaken"
            name="leaveTaken"
            value={formData.leaveTaken}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="leaveDeductionAmount">Leave Deduction Amount per Day:</label>
          <input
            type="number"
            id="leaveDeductionAmount"
            name="leaveDeductionAmount"
            value={formData.leaveDeductionAmount}
            onChange={handleChange}
          />
        </div>


        <div className="form-group">
          <label htmlFor="bonus">Bonus:</label>
          <input
            type="number"
            id="bonus"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deductions">Deductions:</label>
          <input
            type="number"
            id="deductions"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Calculate Total Salary</button>
      </form>

      {formData.totalSalary > 0 && (
        <div className="total-salary">
         <h2>
            Total Salary for {formData.month} {formData.year}:{" "}
            {formatCurrency(formData.totalSalary)}
          </h2>
          <h3>
            Overtime Amount: {formatCurrency(formData.totalOvertimeAmount)}
          </h3>
          <h3>
            Leave Deduction: {formatCurrency(formData.totalLeaveDeduction)}
          </h3>
          <h3>
            Total Paid Salary: {formatCurrency(formData.totalPaidSalary)}
          </h3>
        </div>
      )}
    </div>
  );
};



export default SalaryForm;
