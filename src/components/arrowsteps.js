import React, { useState } from "react";
import "../styles/arrowsteps.css"; // Ensure the CSS file is imported

const ArrowSteps = ({ steps, onStepClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const handleStepClick = (step, index) => {
    if (activeIndex === index) {
      // If the same button is clicked again, reset activeIndex to null
      setActiveIndex(null);
    } else {
      // Set the clicked button as active
      setActiveIndex(index);
    }
    onStepClick(step); // Trigger the onClick event
  };

  return (
    <div className="arrow-container">
      {steps.map((step, index) => (
        <div
          key={index}
          className="arrow"
          style={{
            backgroundColor:
              activeIndex === index // Check if the step is active
                ? step.activeColor // Set active color when clicked
                : hoveredIndex === index // Set hover color when hovered
                ? step.hoverColor
                : step.color, // Default color
          }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleStepClick(step, index)}
        >
          <div className="icon-badge-container">
            <i className={`fas ${step.icon}`}></i>
            <span className="badge">
              {step.badge >= 100 ? "99+" : step.badge}
            </span>
          </div>
          <div className="label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ArrowSteps;
