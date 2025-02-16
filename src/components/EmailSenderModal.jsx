import React, { useState } from "react";
import "./EmailSenderModal.css";

const EmailSenderModal = ({ open, handleClose, handleSave }) => {
  const [sequenceName, setSequenceName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Sequence Settings</h2>
        <div className="input-group">
          <label>Enter a name for the sequence</label>
          <input
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Enter Sender Email</label>
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Enter sender email password</label>
          <input
            type="password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
          />
        </div>

        <div className="buttons">
          <button className="cancel" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="next"
            onClick={() => handleSave(sequenceName, senderEmail, emailPassword)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSenderModal;
