import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation logic
    if (!email) {
      setError('Please enter your email.');
      emailRef.current?.focus();
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      passwordRef.current?.focus();
      return;
    }

    try {
      const response = await AuthService.login({ email, password });
      localStorage.setItem('authToken', response.data.token);
      navigate('/employee-list');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
             {/* Error Message */}
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
          <h3 className="card-title text-center mb-4">Login</h3>

   

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-center mb-3">
              <button type="submit" className="btn btn-primary px-4">
                Login
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link to="/forgot-password">Forgot Password?</Link>
            <div className="mt-2">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
