import React, { useState, useEffect } from "react";
import "./ColdEmailModel.css";
import EmailTemplateForm from "./EmailTemplateForm";
import { useNavigate } from "react-router-dom";

const ColdEmailModal = ({ onClose, onInsert }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [mailTemplate, setMailTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch email templates from backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("http://localhost:5000/email-templates");
        if (!response.ok) {
          throw new Error("Failed to fetch email templates.");
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleInsert = () => {
    const template = templates.find((t) => t.name === selectedTemplate);
    console.log(template);
    if (!template) return;

    onInsert("email", {
      name: template.name,
      subject: template.subject,
      content: template.content,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Cold Email</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {!mailTemplate ? (
          <>
            <p>Send an email to a lead.</p>
            <label>Email Template</label>

            {/* Error Message */}
            {error && <p className="error">{error}</p>}

            <div className="dropdown-container">
              {/* Dropdown for Email Templates */}
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  {loading
                    ? "Loading templates..."
                    : "Select an Email Template"}
                </option>
                {templates.map((template) => (
                  <option key={template._id} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>

              <button
                className="new-template-btn"
                onClick={() => setMailTemplate(true)}
              >
                New Template +
              </button>

              <button
                className="new-template-btn"
                onClick={handleInsert}
                disabled={!selectedTemplate}
              >
                Insert
              </button>
            </div>
          </>
        ) : (
          <EmailTemplateForm onClose={() => setMailTemplate(false)} />
        )}
      </div>
    </div>
  );
};

export default ColdEmailModal;
