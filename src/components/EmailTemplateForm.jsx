import React, { useState } from "react";
import "./EmailTemplateForm.css";

const EmailTemplateForm = ({ onClose, saveTemp }) => {
  const [templateName, setTemplateName] = useState("");
  const [subjectLine, setSubjectLine] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to save the template
  const handleSaveTemp = async () => {
    if (!templateName || !subjectLine || !emailContent) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/email-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: templateName,
          subject: subjectLine,
          content: emailContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save template.");
      }

      const data = await response.json();
      console.log("Template Saved:", data);
      saveTemp(templateName); // Call parent function if needed
      onClose(); // Close modal after saving
    } catch (err) {
      console.error(err);
      setError("Failed to save template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-template-container">
      <div className="form-header">
        <h2>Email Template</h2>
        <button className="close-template-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form-group">
        <label>Template Name *</label>
        <input
          type="text"
          placeholder="Enter Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Subject Line *</label>
        <input
          type="text"
          placeholder="Enter Subject Line"
          value={subjectLine}
          onChange={(e) => setSubjectLine(e.target.value)}
        />
      </div>

      <div className="email-editor">
        <textarea
          placeholder="Write your email content here..."
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </div>

      <div className="bottom-buttons">
        <button
          className="save-btn"
          onClick={handleSaveTemp}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Email Template"}
        </button>
      </div>
    </div>
  );
};

export default EmailTemplateForm;
