import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NameYourList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mappedColumns = location.state?.mappedColumns || [];
  const [listName, setListName] = useState("");

  const handleAddLeads = async (leads) => {
    if (!listName.trim()) {
      alert("Please enter a name for your list.");
      return;
    }

    let addedLeads = [];

    // Step 1: Add each lead one by one
    for (const lead of leads) {
      const leadData = {
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        business: lead.company,
        listName: listName,
      };

      try {
        const response = await fetch("http://localhost:5000/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData),
        });

        if (response.ok) {
          const savedLead = await response.json();
          addedLeads.push(savedLead); // Store successfully added leads
        } else {
          console.error("Failed to add lead:", leadData);
        }
      } catch (error) {
        console.error("Error adding lead:", error);
      }
    }

    // Step 2: Add the entire lead list
    try {
      const listResponse = await fetch("http://localhost:5000/lead-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName, leads: addedLeads }),
      });

      if (listResponse.ok) {
        alert("All leads and list saved successfully!");
        navigate("/");
      } else {
        console.error("Failed to save lead list.");
      }
    } catch (error) {
      console.error("Error saving lead list:", error);
    }
  };

  return (
    <div className="container">
      <h2>Name your list</h2>
      <input
        type="text"
        placeholder="Enter a name for your list"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <div className="button-container">
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="next-btn"
          onClick={() => handleAddLeads(mappedColumns)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NameYourList;
