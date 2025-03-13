import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom'; // useParams to get the id, useHistory to navigate

const UpdateSolarInput = function () {
  const { id } = useParams(); // Get the id from the URL
  const history = useHistory();
  const [inputData, setInputData] = useState({
    capacity: '',
    hours: '',
    battery: '',
  });

  useEffect(function () {
    fetchSolarInput();
  }, []);

  const fetchSolarInput = async function () {
    try {
      const response = await axios.get(`http://localhost:5000/api/solarInputs/${id}`);
      setInputData(response.data);
    } catch (error) {
      console.error('Error fetching solar input:', error);
    }
  };

  const handleChange = function (e) {
    setInputData({
      ...inputData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async function () {
    try {
      await axios.put(`http://localhost:5000/api/solarInputs/${id}`, inputData);
      history.push('/'); // Redirect back to SolarDetails page
    } catch (error) {
      console.error('Error updating solar input:', error);
    }
  };

  return React.createElement(
    'div',
    { className: 'edit-form' },
    React.createElement('h3', null, 'Update Solar Input'),
    React.createElement('label', null, 'Capacity (W):'),
    React.createElement('input', {
      type: 'number',
      name: 'capacity',
      value: inputData.capacity,
      onChange: handleChange,
    }),
    React.createElement('label', null, 'Hours:'),
    React.createElement('input', {
      type: 'number',
      name: 'hours',
      value: inputData.hours,
      onChange: handleChange,
    }),
    React.createElement('label', null, 'Battery (Ah):'),
    React.createElement('input', {
      type: 'number',
      name: 'battery',
      value: inputData.battery,
      onChange: handleChange,
    }),
    React.createElement(
      'button',
      { onClick: handleUpdate },
      'Update'
    )
  );
};

export default UpdateSolarInput;
