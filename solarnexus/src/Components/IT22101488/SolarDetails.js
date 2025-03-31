import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SolarDetails.css";

function SolarDetails() {
  const [solarInputs, setSolarInputs] = useState([]);
  const [filteredInputs, setFilteredInputs] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSolarInputs();
  }, []);

  const fetchSolarInputs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/solarInputs");
      setSolarInputs(response.data);
      setFilteredInputs(response.data); // Initialize filter
    } catch (error) {
      console.error("Error fetching solar inputs:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/solarInputs/${id}`);
        fetchSolarInputs();
      } catch (error) {
        console.error("Error deleting input:", error);
      }
    }
  };

  const handleEdit = (input) => {
    setEditData({ ...input });
  };

  const handleUpdate = async () => {
    if (!editData) return;
    try {
      const updatedData = {
        numPanels: parseInt(editData.numPanels) || 0,
        panelCapacity: parseFloat(editData.panelCapacity) || 0,
        location: editData.location || "",
      };

      await axios.put(
        `http://localhost:5000/api/solarInputs/${editData._id}`,
        updatedData
      );

      setEditData(null);
      fetchSolarInputs();
    } catch (error) {
      console.error("Error updating input:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = solarInputs.filter((item) => {
      return (
        item.location.toLowerCase().includes(term) ||
        (typeof item.weather === "string" &&
          item.weather.toLowerCase().includes(term))
      );
    });

    setFilteredInputs(filtered);
  };

  const generateCSV = () => {
    const headers = ["Number of Panels", "Panel Capacity (W)", "Total Capacity (W)", "Location", "Weather"];
    const rows = filteredInputs.map((item) => [
      item.numPanels,
      item.panelCapacity,
      item.totalCapacity,
      item.location,
      typeof item.weather === "string" ? item.weather : JSON.stringify(item.weather),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "solar_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return React.createElement(
    "div",
    { className: "solar-details-container" },
    React.createElement("h2", null, "Solar Details (Admin Panel)"),

    // Search input
    React.createElement("input", {
      type: "text",
      placeholder: "Search by location or weather...",
      value: searchTerm,
      onChange: handleSearch,
      className: "search-input"
    }),

    // Report button
    React.createElement("button", {
      className: "report-btn",
      onClick: generateCSV,
      children: "Download Report (CSV)"
    }),

    // Table
    React.createElement(
      "table",
      null,
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          ["Number of Panels", "Panel Capacity (W)", "Total Capacity (W)", "Location", "Weather", "Actions"].map((header, i) =>
            React.createElement("th", { key: i }, header)
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        filteredInputs.map((input) =>
          React.createElement(
            "tr",
            { key: input._id },
            React.createElement("td", null, input.numPanels),
            React.createElement("td", null, input.panelCapacity),
            React.createElement("td", null, input.totalCapacity),
            React.createElement("td", null, input.location),
            React.createElement(
              "td",
              null,
              typeof input.weather === "string"
                ? input.weather
                : JSON.stringify(input.weather)
            ),
            React.createElement(
              "td",
              null,
              React.createElement("button", {
                className: "edit-btn",
                onClick: () => handleEdit(input),
                children: "Edit",
              }),
              React.createElement("button", {
                className: "delete-btn",
                onClick: () => handleDelete(input._id),
                children: "Delete",
              })
            )
          )
        )
      )
    ),

    // Edit Form
    editData &&
      React.createElement(
        "div",
        { className: "edit-form" },
        React.createElement("h3", null, "Edit Solar Input"),
        React.createElement("label", null, "Number of Panels:"),
        React.createElement("input", {
          type: "number",
          value: editData.numPanels,
          onChange: (e) =>
            setEditData({ ...editData, numPanels: e.target.value }),
        }),
        React.createElement("label", null, "Panel Capacity (W):"),
        React.createElement("input", {
          type: "number",
          value: editData.panelCapacity,
          onChange: (e) =>
            setEditData({ ...editData, panelCapacity: e.target.value }),
        }),
        React.createElement("label", null, "Location:"),
        React.createElement("input", {
          type: "text",
          value: editData.location,
          onChange: (e) =>
            setEditData({ ...editData, location: e.target.value }),
        }),
        React.createElement("button", {
          className: "update-btn",
          onClick: handleUpdate,
          children: "Update",
        }),
        React.createElement("button", {
          className: "cancel-btn",
          onClick: () => setEditData(null),
          children: "Cancel",
        })
      )
  );
}

export default SolarDetails;
