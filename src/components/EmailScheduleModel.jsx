import React, { useState } from "react";
import "./EmailScheduleModal.css";

const EmailScheduleModal = ({ open, handleClose }) => {
  const [schedule, setSchedule] = useState({
    date: "",
    time: "",
    timezone: "Asia/Calcutta",
  });

  const handleChange = (e) => {
    setSchedule({ ...schedule, [e.target.name]: e.target.value });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sequence Settings</h2>

        <div className="input-group">
          <label>Launch on - Date</label>
          <input
            type="date"
            name="date"
            value={schedule.date}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={schedule.time}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Timezone</label>
          <select
            name="timezone"
            value={schedule.timezone}
            onChange={handleChange}
          >
            <option value="Asia/Calcutta">Asia/Calcutta</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>

        <div className="buttons">
          <button className="cancel" onClick={handleClose}>
            Cancel
          </button>
          <button className="next">Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmailScheduleModal;
