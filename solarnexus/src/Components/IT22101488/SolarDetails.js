import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SolarDetails.css";

const SolarDetails = () => {
  const [solarInputs, setSolarInputs] = useState([]);
  const [editData, setEditData] = useState(null);

  // Fetch solar inputs from backend
  useEffect(() => {
    fetchSolarInputs();
  }, []);

  const fetchSolarInputs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/solarInputs");
      setSolarInputs(response.data);
      console.log("Fetched solar inputs:", response.data); // Debugging
    } catch (error) {
      console.error("Error fetching solar inputs:", error);
    }
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/solarInputs/${id}`);
        fetchSolarInputs(); // Refresh data
      } catch (error) {
        console.error("Error deleting input:", error);
      }
    }
  };

  // Handle edit operation
  const handleEdit = (input) => {
    console.log("Editing data:", input);  // Debugging
    setEditData({ ...input });
  };

  // Handle update operation
  const handleUpdate = async () => {
    if (!editData) return;
    console.log("Update button clicked, sending data:", editData);  // Debugging

    try {
      // Ensure data is being sent as number values, check if the data is correct
      const updatedData = {
        capacity: parseFloat(editData.capacity) || 0,
        hours: parseFloat(editData.hours) || 0,
        battery: parseFloat(editData.battery) || 0,
      };
      console.log("Data to send to backend:", updatedData);  // Debugging

      const response = await axios.put(
        `http://localhost:5000/api/solarInputs/${editData._id}`,
        updatedData
      );

      console.log("Update successful, response:", response); // Debugging

      setEditData(null);
      fetchSolarInputs(); // Refresh the list after updating
    } catch (error) {
      console.error("Error updating input:", error);
    }
  };

  return (
    <div className="solar-details-container">
      <h2>Solar Details (Admin Panel)</h2>
      <table>
        <thead>
          <tr>
            <th>Capacity (W)</th>
            <th>Hours</th>
            <th>Battery (Ah)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {solarInputs.map((input) => (
            <tr key={input._id}>
              <td>{input.capacity}</td>
              <td>{input.hours}</td>
              <td>{input.battery}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(input)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(input._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editData && (
        <div className="edit-form">
          <h3>Edit Solar Input</h3>
          <label>Capacity (W):</label>
          <input
            type="number"
            value={editData.capacity}
            onChange={(e) => {
              console.log("Updated value for capacity:", e.target.value); // Debugging
              setEditData({ ...editData, capacity: e.target.value });
            }}
          />
          <label>Hours:</label>
          <input
            type="number"
            value={editData.hours}
            onChange={(e) => {
              console.log("Updated value for hours:", e.target.value); // Debugging
              setEditData({ ...editData, hours: e.target.value });
            }}
          />
          <label>Battery (Ah):</label>
          <input
            type="number"
            value={editData.battery}
            onChange={(e) => {
              console.log("Updated value for battery:", e.target.value); // Debugging
              setEditData({ ...editData, battery: e.target.value });
            }}
          />
          <button className="update-btn" onClick={handleUpdate}>Update</button>
          <button className="cancel-btn" onClick={() => setEditData(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SolarDetails;
