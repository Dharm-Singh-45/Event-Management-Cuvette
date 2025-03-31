import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpUserMutation } from "../../redux/authApi";
import "./RegisterPage.css";
import Logo from "../../assets/logo.png";
import SideImage from "../../assets/registerPageSideImage.png";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [signupUser, { isLoading, error }] = useSignUpUserMutation();
  
  // State for form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await signupUser({
        firstName: formData.firstName,
        lastName:formData.lastName,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      toast.success("Account created successfully!");
      navigate('/login')
    } catch (err) {
      console.error("Signup Error:", err);
      toast.error(err?.data?.message || "Signup failed!"); 
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-container-left">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <p>CNNCT</p>
        </div>
        <div className="outer-div">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-header">
              <p>Create an account</p>
              <Link to="/login" className="signin-link">Sign in instead</Link>
            </div>
            <div className="input-container">
              <div className="input-div">
                <label>First Name</label>
                <input type="text" name="firstName" onChange={handleChange} required />
                
                <label>Last Name</label>
                <input type="text" name="lastName" onChange={handleChange} required />
                
                <label>Email</label>
                <input type="email" name="email" onChange={handleChange} required />
                
                <label>Password</label>
                <input type="password" name="password" onChange={handleChange} required />
                
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" onChange={handleChange} required />
                
                <div className="checkbox-container">
                  <input type="checkbox" id="agreetc" required />
                  <p>By creating an account, I agree to the Terms of Use and Privacy Policy</p>
                </div>
              </div>
              <div className="button-div">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create an account"}
                </button>
              </div>
            </div>
          </form>
          <div className="tandc">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </div>
        </div>
      </div>
      <div className="img-container">
        <img src={SideImage} alt="side-img" />
      </div>
    </div>
  );
};

export default RegisterPage;
