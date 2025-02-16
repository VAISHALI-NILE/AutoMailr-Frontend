import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CsvMapper.css";

const CsvMapper = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const location = useLocation();
  const csvData = location.state?.formattedData || [];

  useEffect(() => {
    if (csvData.length > 0) {
      // Extract column names dynamically from CSV data
      const firstRow = csvData[0];
      const extractedColumns = Object.keys(firstRow).map((key) => ({
        columnName: key,
        dataPreview: firstRow[key] || "N/A",
        checked: !!firstRow[key], // Check if value exists
        variable: key, // Set default variable value to column name
      }));
      setColumns(extractedColumns);
    }
  }, [csvData]);

  const handleFinalStep = () => {};

  return (
    <div className="container">
      <h2>Map Columns to Variables</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Column from CSV</th>
              <th>Data Preview</th>
              <th>Mapped</th>
              <th>Variable</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, index) => (
              <tr key={index}>
                <td>{col.columnName}</td>
                <td>{col.dataPreview}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={col.checked}
                    disabled // Always disabled, as its value is set based on data existence
                  />
                </td>
                <td>
                  <select
                    value={col.variable}
                    onChange={(e) =>
                      setColumns((prev) =>
                        prev.map((item, i) =>
                          i === index
                            ? { ...item, variable: e.target.value }
                            : item
                        )
                      )
                    }
                  >
                    <option value={col.columnName}>{col.columnName}</option>
                    <option value="First Name">First Name</option>
                    <option value="Last Name">Last Name</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Company Name">Company Name</option>
                    <option value="LinkedIn Profile">LinkedIn Profile</option>
                    <option value="Skip Column">Skip Column</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-container">
        <button className="cancel-btn" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button
          className="next-btn"
          onClick={() => {
            navigate("/final-step", { state: { mappedColumns: csvData } });
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CsvMapper;
