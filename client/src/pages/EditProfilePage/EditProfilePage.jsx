import React, { useEffect, useState } from "react";
import "./EditProfilePage.css";
import { useUpdateProfileMutation, useGetUserDetailsQuery } from "../../redux/userApi.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const { data: user, isLoading } = useGetUserDetailsQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await updateProfile(formData).unwrap();
      toast.success(response.message);
      navigate("/login");
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error(error?.data.message)
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-heading">
        <h2>Profile</h2>
        <span>Manage Settings for your profile</span>
      </div>
      <div className="edit-container">
        <h3 className="edit-profile">Edit Profile</h3>
        <hr className="default-hr" />

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>First name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />

          <label>Last name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}  />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          <div className="button-container">
            <button type="submit">Update</button>
          </div>
        </form>
         
      </div>
    </div>
  );
};

export default EditProfilePage;
