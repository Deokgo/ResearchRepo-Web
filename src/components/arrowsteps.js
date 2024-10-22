import React, { useState } from "react";
import "../styles/arrowsteps.css"; // Make sure this CSS file is created for styling

const ArrowSteps = ({ steps, onStepClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
  
    const handleMouseEnter = (index) => setHoveredIndex(index);
    const handleMouseLeave = () => setHoveredIndex(null);
  
    return (
      <div className="arrow-container">
        {steps.map((step, index) => (
          <div
            key={index}
            className="arrow"
            style={{
              backgroundColor: hoveredIndex === index ? step.hoverColor : step.color,
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => onStepClick(step)}
          >
            <div className="icon-badge-container">
              <i className={`fas ${step.icon}`}></i>
              <span className="badge">{step.badge >= 100 ? '99+' : step.badge}</span>
            </div>
            <div className="label">{step.label}</div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ArrowSteps;
