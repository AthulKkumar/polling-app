import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import apiService from "../../api/api";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const response = await apiService.post('/auth/login', {
          email: formData.email,
          password: formData.password
        });
        
        
        login(response);
        navigate("/dashboard");
      } else {
        await apiService.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        
        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 'Authentication failed. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {!isLogin && (
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <div className="auth-input-wrapper">
            <input
              type="text"
              name="username"
              placeholder="Enter your Username"
              className="auth-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label">Email</label>
        <div className="auth-input-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="auth-field">
        <label className="auth-label">Password</label>
        <div className="auth-input-wrapper">
          <input
            type="password"
            name="password"
            placeholder="Enter your Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {isLogin && (
        <div className="auth-options">
          <div>
            {/* <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label> */}
          </div>
          <span className="auth-link">Forgot password?</span>
        </div>
      )}

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Loading..." : (isLogin ? "Sign In" : "Register")}
      </button>

      <p className="auth-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>

    </form>
  );
};

export default AuthForm;
