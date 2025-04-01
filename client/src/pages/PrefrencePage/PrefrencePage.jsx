import React, { useEffect, useState } from "react";
import "./PrefrencePage.css";
import Logo from "../../assets/logo.png";
import SideImage from "../../assets/registerPageSideImage.png";
import CategoryCard from "../../components/Prefrences/CategoryCard.jsx";
import Sales from "../../assets/Sales.png";
import Education from "../../assets/Education.png";
import Finance from "../../assets/Finance.png";
import Govt from "../../assets/Govt.png";
import Consulting from "../../assets/Consulting.png";
import Recruting from "../../assets/Recruting.png";
import Tech from "../../assets/Tech.png";
import Marketing from "../../assets/Marketing.png";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery, useUpdatePreferencesMutation } from "../../redux/userApi.js";
import { toast } from "react-toastify";


const categories = [
  { img: Sales, title: "Sales" },
  { img: Education, title: "Education" },
  { img: Finance, title: "Finance" },
  { img: Govt, title: "Govt" },
  { img: Consulting, title: "Consulting" },
  { img: Recruting, title: "Recruting" },
  { img: Tech, title: "Tech" },
  { img: Marketing, title: "Marketing" },
];

const PrefrencePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { data: userDetails, isLoading } = useGetUserDetailsQuery();

  const [updatePreferences, { isLoading: isUpdating }] = useUpdatePreferencesMutation();

  const handleContinue = async () => {
    if (!username.trim() || !selectedCategory) {
      toast.error("Please provide a username and select a category.")
  
      return;
    }

    
    // Ensure user details are available
    if (!userDetails?._id) {
   
      toast.error("User details not found. Please log in again.")
      return;
    }
    try {
      await updatePreferences({
        userId: userDetails._id,
        username,
        selectedCategory,
      }).unwrap();
      navigate("/dashboard/events"); 
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences. Please try again.")
    }
  };

  return (
    <div className="prefrences-container">
      <div className="left">
        <div className="logo">
          <img src={Logo} alt="logo" />
          <p>CNNCT</p>
        </div>
        <div className="select-prefrence">
          <b>Your Preferences</b>
          <input
            type="text"
            placeholder="Tell us your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="select-category-div">
            <span>Select one category that best describes your CNNCT:</span>
            <div className="preference-category-card">
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  category={category}
                  isSelected={selectedCategory === category.title}
                  onSelect={() => setSelectedCategory(category.title)}
                />
              ))}
            </div>
          </div>
          <button
            className="prefrence-button"
            onClick={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
      <div className="right">
        <img src={SideImage} alt="side-image" />
      </div>
    </div>
  );
};

export default PrefrencePage;
