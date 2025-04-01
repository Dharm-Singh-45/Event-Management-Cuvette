import React, { useState } from "react";
import "./LoginPage.css";
import Logo from '../../assets/logo.png';
import SideImage from "../../assets/registerPageSideImage.png";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../redux/authApi.js";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const response =  await loginUser({ email, password }).unwrap();
      navigate('/preferences')
      localStorage.setItem("token", response.token);
        toast.success('Login successful');
  
      if (response.user.username) {
        navigate("/dashboard/events");
      } else {
        navigate("/preferences");
      }
    } catch (err) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="login-container-left">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <p>CNNCT</p>
        </div>

        <div className="outer-div">
          <div className="login-form">
            <h1>Sign in</h1>

            <form className="input-container" onSubmit={handleSubmit}>
              <div className="input-div">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <div className="button-div">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>

            <div className="signup-link">
              <p>
                Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
              </p>
            </div>
          </div>

          <div className="tandc">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="img-container">
        <img src={SideImage} alt="side-img" />
      </div>
    </div>
  );
};

export default LoginPage;
