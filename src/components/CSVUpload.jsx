import React, { useState } from "react";
import "./CSVUpload.css";
import Papa from "papaparse";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CSVUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState("csv");
  const [csvData, setCsvData] = useState([]);
  const navigate = useNavigate();
  const [formattedData, setFormattedData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      handleUpload(file);
    } else {
      alert("Please select a valid CSV file.");
      setSelectedFile(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      handleUpload(file);
    } else {
      alert("Only CSV files are allowed.");
      setSelectedFile(null);
    }
  };

  const handleUpload = (file) => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    Papa.parse(file, {
      complete: (result) => {
        const rawData = result.data;
        const processedData = rawData.slice(1).map((row) => ({
          firstName: row[0] || "",
          lastName: row[1] || "",
          email: row[2] || "",
          phone: row[3] || "",
          company: row[4] || "",
          linkedin: row[5] || "",
        }));
        setFormattedData(processedData);
        console.log("Parsed CSV Data:", formattedData);
        setCsvData(formattedData);
      },
      header: false,
    });

    alert("File uploaded successfully!");
  };

  const handleNext = () => {
    if (formattedData.length > 0) {
      navigate("/mapper", { state: { formattedData } });
    } else {
      alert("Please upload a CSV file first.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Add your leads</h2>
      <p>
        Either upload a CSV file or use a public Google Sheets link to import
        leads.
      </p>

      {/* Upload Type Selector */}
      <div className="upload-options">
        <label>
          <input
            type="radio"
            name="uploadType"
            value="csv"
            checked={uploadType === "csv"}
            onChange={() => setUploadType("csv")}
          />
          Upload via CSV
        </label>
      </div>

      {/* Drag and Drop Area */}
      <div
        className="drop-area"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv"
          id="fileInput"
          hidden
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" className="upload-box">
          <FaCloudUploadAlt size={40} />
          <p>Drag 'n' Drop a file here, or click to select file</p>
        </label>
      </div>

      {selectedFile && <p className="file-name">{selectedFile.name}</p>}

      {/* Buttons */}
      <div className="buttons">
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!selectedFile}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CSVUpload;
