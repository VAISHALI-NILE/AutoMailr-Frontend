import React, { useState, useEffect } from "react";
import "./ListSelectionModal.css";
import { useNavigate } from "react-router-dom";

const ListSelectionModal = ({ open, onClose, onInsert }) => {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [lists, setLists] = useState([]); // Initially empty
  const [newListName, setNewListName] = useState("");
  const [selectedLists, setSelectedLists] = useState([]);
  const [listsWithEmails, setListsWithEmails] = useState({});
  const [selectedEmails, setSelectedEmails] = useState([]);

  const navigate = useNavigate();

  // 🔥 Fetch lead lists from the database
  useEffect(() => {
    fetchLeadLists();
  }, []);

  const fetchLeadLists = async () => {
    try {
      const response = await fetch("http://localhost:5000/lead-lists"); // Update with backend URL
      const data = await response.json();

      if (!data || data.length === 0) {
        console.warn("No lead lists found.");
        return;
      }

      // Store list names and corresponding emails
      const listsData = data.reduce((acc, list) => {
        acc[list.name] = list.emails || []; // Ensure it's an array
        return acc;
      }, {});

      console.log("Fetched listsWithEmails:", listsData);
      setLists(Object.keys(listsData)); // Set only list names
      setListsWithEmails(listsData); // Store name-email mapping
    } catch (error) {
      console.error("Error fetching lead lists:", error);
    }
  };

  const handleSelectList = (list) => {
    if (!selectedLists.includes(list)) {
      setSelectedLists([...selectedLists, list]);
    }

    if (listsWithEmails && Object.keys(listsWithEmails).length > 0) {
      const emails = listsWithEmails[list] || [];
      setSelectedEmails((prevEmails) => [
        ...new Set([...prevEmails, ...emails]),
      ]);
    } else {
      console.error("listsWithEmails is empty or not ready:", listsWithEmails);
    }

    setSearch("");
    setShowDropdown(false);
  };

  const handleRemoveList = (list) => {
    setSelectedLists(selectedLists.filter((item) => item !== list));

    // Remove emails from the deselected list
    setSelectedEmails((prevEmails) =>
      prevEmails.filter((email) => !listsWithEmails[list]?.includes(email))
    );
  };

  const handleInsert = () => {
    console.log("Selected Lists:", selectedLists);
    console.log("Selected Emails:", selectedEmails);
    onInsert(selectedLists, selectedEmails);
  };

  return (
    open && (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Leads from List(s)</h2>
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
          </div>

          {/* Search Input with Selected Lists */}
          <div className="search-container">
            {selectedLists.map((list) => (
              <span key={list} className="selected-item">
                {list}
                <button
                  onClick={() => handleRemoveList(list)}
                  className="remove-btn"
                >
                  ✖
                </button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Search for lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="search-input"
            />
          </div>

          {/* Dropdown for List Selection */}
          {showDropdown && (
            <ul className="dropdown">
              {lists
                .filter(
                  (list) =>
                    list.toLowerCase().includes(search.toLowerCase()) &&
                    !selectedLists.includes(list)
                )
                .map((list, index) => (
                  <li key={index} onClick={() => handleSelectList(list)}>
                    {list}
                  </li>
                ))}
            </ul>
          )}

          <div className="new-list">
            <button
              className="new-list-btn"
              onClick={() => window.open("/add-new-list", "_blank")}
            >
              + New List
            </button>
            <button onClick={handleInsert}>Insert</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ListSelectionModal;
