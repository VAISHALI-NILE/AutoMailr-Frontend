import React, { useState } from "react";
import "./WaitDialog.css"; // Import CSS file

const WaitDialog = ({ onClose, onSave }) => {
  const [waitTime, setWaitTime] = useState("");
  const [waitType, setWaitType] = useState("minutes");

  const handleSave = () => {
    if (waitTime) {
      onSave("wait", { waitTime, waitType }); // Pass the wait string directly
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Wait Time</h2>

        {/* Wait Time Input */}
        <div className="input-group">
          <label>Wait For:</label>
          <input
            type="number"
            min="1"
            placeholder="Enter wait time"
            value={waitTime}
            onChange={(e) => setWaitTime(e.target.value)}
          />
        </div>

        {/* Wait Type Dropdown */}
        <div className="input-group">
          <label>Wait Type:</label>
          <select
            value={waitType}
            onChange={(e) => setWaitType(e.target.value)}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSave}
            disabled={!waitTime}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitDialog;
