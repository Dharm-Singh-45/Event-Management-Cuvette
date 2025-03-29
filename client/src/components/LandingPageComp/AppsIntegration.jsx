import React from 'react';
import './AppsIntegration.css';

const AppsIntegration = ({ imgSrc, title, description }) => {
  return (
    <div className="apps-card">
      <div className="apps-card-image">
        <img src={imgSrc} alt={title} />
      </div>
      <div className="apps-card-content">
        <span className="apps-card-title">{title}</span>
        <span className="apps-card-description">{description}</span>
      </div>
    </div>
  );
}

export default AppsIntegration;
