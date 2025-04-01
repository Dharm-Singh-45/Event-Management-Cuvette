import React from "react";
import "./LandingFooter.css";
import Twitter from "../../assets/twitter.png";
import Insta from "../../assets/insta.png";
import Music from "../../assets/music.png";
import Youtube from "../../assets/utube.png";
import Vector from "../../assets/vector.png";

import { useNavigate } from "react-router-dom";

const LandingFooter = () => {
  const navigate = useNavigate();
  return (
    <div className="footer-container">
      {/* Top Section: Login & Signup (Left) + Links (Right) */}
      <div className="footer-top">
        <div className="auth-buttons">
          <button className="login-button" onClick={()=>navigate('/login')}>Log in</button>
          <button className="signup-button" onClick={()=>navigate('/signup')}>Sign up free</button>
        </div>
        <div className="links-container">
          <div>
            <p>About CNNCT</p>
            <p>Blog</p>
            <p>Press</p>
            <p>Social Good</p>
            <p>Contact</p>
          </div>
          <div>
            <p>Careers</p>
            <p>Getting Started</p>
            <p>Features and How-Tos</p>
            <p>FAQs</p>
            <p>Report a Violation</p>
          </div>
          <div>
            <p>Terms and Conditions</p>
            <p>Privacy Policy</p>
            <p>Cookie Notice</p>
            <p>Trust Center</p>
          </div>
          <div className="mobile-view-btn">
          <button className="signup-btn" onClick={()=>navigate('/signup')}>Sign up free</button>
          <button className="login-btn" onClick={()=>navigate('/login')}>Login</button>
          </div>
         
        </div>
      </div>

      {/* Bottom Section: Acknowledgment (Left) + Social Links (Right) */}
      <div className="footer-bottom">
        <div className="acknowledgment">
          <p>
            We acknowledge the Traditional Custodians of the land on which our
            office stands, The Wurundjeri people of the Kulin Nation, and pay
            our respects to Elders past, present, and emerging.
          </p>
        </div>
        <div className="social-icons">
          <img src={Twitter} alt="Twitter" />
          <img src={Insta} alt="Instagram" />
          <img src={Music} alt="Music" />
          <img src={Youtube} alt="YouTube" />
          <img src={Vector} alt="Vector" />
        </div>
      </div>
    </div>
  );
};

export default LandingFooter;
