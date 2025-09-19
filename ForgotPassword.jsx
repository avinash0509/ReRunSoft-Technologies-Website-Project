import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Refs for focusing
  const emailRef = useRef();
  const newPasswordRef = useRef();
  const retypePasswordRef = useRef();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation checks
    if (!email) {
      setError('Please enter your email.');
      if (emailRef.current) emailRef.current.focus();
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password.');
      if (newPasswordRef.current) newPasswordRef.current.focus();
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        'Password must be at least 8 characters and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      );
      if (newPasswordRef.current) newPasswordRef.current.focus();
      return;
    }

    if (!retypePassword) {
      setError('Please retype your new password.');
      if (retypePasswordRef.current) retypePasswordRef.current.focus();
      return;
    }

    if (newPassword !== retypePassword) {
      setError('Passwords do not match.');
      if (retypePasswordRef.current) retypePasswordRef.current.focus();
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        email,
        newPassword,
      });

      setMessage('Password has been successfully reset.');
      setEmail('');
      setNewPassword('');
      setRetypePassword('');
    } catch (err) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
       {message && <div className="alert alert-success">{message}</div>}
          {error && (
            <div
              className="alert alert-danger"
              style={{
                marginLeft: 1,
                width: '100%',
                maxWidth: '100%',
                fontSize: '15px',
              }}
            >
              {error}
            </div>
          )}
      <div className="card shadow">
        <div className="card-body" style={{ backgroundColor: 'lightblue' }}>
          <h3 className="text-center mb-4">Reset Password</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                ref={emailRef}
                className="form-control"
                value={email}
                onChange={(e) => {setEmail(e.target.value)
                  setError('');
                }}
              />
            </div>

            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                ref={newPasswordRef}
                className="form-control"
                value={newPassword}
                onChange={(e) =>{ setNewPassword(e.target.value)
                  setError('');
                }}
              />
            </div>

            <div className="mb-3">
              <label>Retype New Password</label>
              <input
                type="password"
                ref={retypePasswordRef}
                className="form-control"
                value={retypePassword}
                onChange={(e) => {setRetypePassword(e.target.value)
                  setError('');
                }}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-warning">
                Reset Password
              </button>
              <Link to="/" className="btn btn-primary" style={{ margin: 20 }}>
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
