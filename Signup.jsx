import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';


const Signup = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Input references
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers/symbols in firstname and lastname
    if ((name === 'firstname' || name === 'lastname')) {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        setError(`${name === 'firstname' ? 'First name' : 'Last name'} must only contain letters`);
        return;
      }
    }

    setUser({ ...user, [name]: value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!user.firstname) {
      setError('Please enter your first name.');
      firstNameRef.current?.focus();
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(user.firstname)) {
      setError('First name must only contain letters');
      firstNameRef.current?.focus();
      return;
    }

    if (!user.lastname) {
      setError('Please enter your last name.');
      lastNameRef.current?.focus();
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(user.lastname)) {
      setError('Last name must only contain letters');
      lastNameRef.current?.focus();
      return;
    }

    if (!user.email) {
      setError('Please enter your email.');
      emailRef.current?.focus();
      return;
    }

    if (!user.password) {
      setError('Please enter a password.');
      passwordRef.current?.focus();
      return;
    }

    if (!validatePassword(user.password)) {
      setError(
        'Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      );
      passwordRef.current?.focus();
      return;
    }

    if (!user.confirmPassword) {
      setError('Please confirm your password.');
      confirmPasswordRef.current?.focus();
      return;
    }

    if (user.password !== user.confirmPassword) {
      setError('Passwords do not match.');
      confirmPasswordRef.current?.focus();
      return;
    }

    try {
      await axios.post('/api/auth/signup', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password
      });
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
        {/* Validation Messages */}
      {message && (
        <div
          className="alert alert-success text-center"
          style={{
            marginLeft: 1,
            width: '100%',
            maxWidth: '100%',
            fontSize: '15px',
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className="alert alert-danger text-center"
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
          <h3 className="text-center mb-4">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                className="form-control"
                ref={firstNameRef}
                value={user.firstname}
                onChange={handleChange}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text');
                  if (!/^[A-Za-z\s]*$/.test(paste)) {
                    e.preventDefault();
                    setError('Only letters are allowed in names');
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                className="form-control"
                ref={lastNameRef}
                value={user.lastname}
                onChange={handleChange}
                onPaste={(e) => {
                  const paste = e.clipboardData.getData('text');
                  if (!/^[A-Za-z\s]*$/.test(paste)) {
                    e.preventDefault();
                    setError('Only letters are allowed in names');
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                ref={emailRef}
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                ref={passwordRef}
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                ref={confirmPasswordRef}
                value={user.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-success">
                Register
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

export default Signup;
