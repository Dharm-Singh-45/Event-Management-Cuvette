import React from "react";
import './TestimonialCard.css';

const TestimonialCard = () => {
    return (
      <div className="testimonial-card">
        <div className="testimonial-title">Amazing tool! Saved me months</div>
        <div className="testimonial-text">
          This is a placeholder for your testimonials and what your client has to say.
          Put them here and make sure it's 100% true and meaningful.
        </div>
        <div className="testimonial-footer">
          <div className="circle"></div>
          <div>
            <span className="testimonial-name">John Master</span>
            <span className="testimonial-position">Director, Spark.com</span>
          </div>
        </div>
      </div>
    );
};

export default TestimonialCard;
