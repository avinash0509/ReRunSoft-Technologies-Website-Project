import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Selector.css'; // Assume you have custom CSS for this component

const CustomSelect = ({ onSelectionChange = () => {} }) => {
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [selectedOnRight, setSelectedOnRight] = useState(null); // Track selected technology on the right

  

  // Fetch technologies from the backend
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await axios.get('/api/techs');
        const techList = response.data.map((tech) => ({
          value: tech.techId.toString(),
          label: tech.techDescription,
        }));
        setTechnologies(techList);
      } catch (error) {
        console.error('Error fetching technologies:', error);
      }
    };

    fetchTechnologies();
  }, []);

  // Handle technology selection (single selection for the left side)
  const handleTechnologyClick = (techValue) => {
    setSelectedTechnology(techValue);
  };

  // Handle moving technology to the right box
  const handleMoveTechnologyForward = () => {
    if (selectedTechnology && !selectedTechnologies.includes(selectedTechnology)) {
      const newSelectedTechnologies = [...selectedTechnologies, selectedTechnology];
      setSelectedTechnologies(newSelectedTechnologies);
      setSelectedTechnology(''); // Clear selected technology on the left

      // Check if onSelectionChange is a function before calling it
      if (typeof onSelectionChange === 'function') {
        onSelectionChange(newSelectedTechnologies);
      } else {
        console.error('onSelectionChange is not a function');
      }
    }
  };

  // Handle moving technology from right box back to the left
  const handleMoveTechnologyBack = () => {
    if (selectedOnRight !== null) {
      const newSelectedTechnologies = selectedTechnologies.filter((tech) => tech !== selectedOnRight);
      setSelectedTechnologies(newSelectedTechnologies);
      setSelectedOnRight(null); // Clear the selected technology on the right

      // Notify the parent component of the updated selection
      if (typeof onSelectionChange === 'function') {
        onSelectionChange(newSelectedTechnologies);
      } else {
        console.error('onSelectionChange is not a function');
      }
    }
  };

  // Count the number of selected technologies using forEach loop
  // const countSelectedTechnologies = () => {
  //   let count = 0;
  //   selectedTechnologies.forEach(() => {
  //     count++;
  //   });
    
  //   return count; // Return the count
    
  // }; 

  //const countSelectedTechnologies = () => selectedTechnologies.length;

  return (
    <div className="custom-select-container">
      <div className="select-boxes">
        {/* Left Box: Technology Listbox (Single Selection) */}
        <div className="select-box">
          <label htmlFor="technology">Select Technology</label>
          <ul id="technology-list" className="listbox">
            {technologies.map((tech) => (
              <li
                key={tech.value}
                
                onClick={() => handleTechnologyClick(tech.value)}
                className={selectedTechnology === tech.value ? 'selected' : ''}
              >
                
                {tech.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Arrow for moving technology */}
        <div className="arrow-container">
          <button type="button" onClick={handleMoveTechnologyForward}>
            &gt;
          </button>
          <button type="button" onClick={handleMoveTechnologyBack}>
            &lt;
          </button>
        </div>

        {/* Right Box: Selected Technologies */}
        <div className="select-box">
          <label htmlFor="selected-technology">Selected Technologies</label>
          <ul id="selected-technology-list" className="listbox">
            {selectedTechnologies.map((techValue) => (
              <li
                key={techValue}
                onClick={() => setSelectedOnRight(techValue)} // Select item on the right
                className={selectedOnRight === techValue ? 'selected' : ''}
              >
               
                {technologies.find((t) => t.value === techValue)?.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
{/* 
      <div>
        <h5>Number of selected technologies: {countSelectedTechnologies()}</h5>
      </div> */}

      {/* Optional: Message when technology is already selected */}
      {selectedTechnology && selectedTechnologies.includes(selectedTechnology) && (
        <div className="info-message">This technology is already selected.</div>
      )}
    </div>
  );
};

export default CustomSelect;
