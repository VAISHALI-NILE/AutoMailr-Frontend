import React, { useState } from "react";
import "./EmailSender.css";

const EmailSender = ({ open, handleClose }) => {
  const [emailDetails, setEmailDetails] = useState({
    service: "Gmail",
    name: "John Doe",
    senderEmail: "",
    senderUsername: "",
    appPassword: "",
    smtpHost: "smtp.gmail.com",
    smtpPort: "465",
    imapHost: "imap.gmail.com",
    imapPort: "993",
  });

  const handleChange = (e) => {
    setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>Add Email Sender</p>
        <h1 className="subtitle">SMTP Settings</h1>

        <label>Service *</label>
        <select
          name="service"
          value={emailDetails.service}
          onChange={handleChange}
        >
          <option value="Gmail">Gmail</option>
          <option value="Outlook">Outlook</option>
          <option value="Yahoo">Yahoo</option>
        </select>

        {/* Two input fields in one row */}
        <div className="input-row">
          <div className="input-group">
            <label>Your Name</label>
            <input type="text" value={emailDetails.name} disabled />
          </div>
          <div className="input-group">
            <label>Sender Email Address (SMTP) *</label>
            <input
              type="email"
              name="senderEmail"
              value={emailDetails.senderEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Sender Username (SMTP) *</label>
            <input
              type="email"
              name="senderUsername"
              value={emailDetails.senderUsername}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>App Password *</label>
            <input
              type="password"
              name="appPassword"
              value={emailDetails.appPassword}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* SMTP and IMAP fields in two-column layout */}
        <div className="input-row">
          <div className="input-group">
            <label>SMTP Host (Outgoing Server)</label>
            <input type="text" value="smtp.gmail.com" disabled />
          </div>
          <div className="input-group">
            <label>SMTP Port (Outgoing Server Port) *</label>
            <input type="text" value="465" disabled />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>IMAP Host (Incoming Server)</label>
            <input type="text" value="imap.gmail.com" disabled />
          </div>
          <div className="input-group">
            <label>IMAP Port (Incoming Server Port) *</label>
            <input type="text" value="993" disabled />
          </div>
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

export default EmailSender;
