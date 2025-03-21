import React, { useState } from 'react';
import {
    Container, Typography, TextField, MenuItem,
    FormControl, FormLabel, RadioGroup, FormControlLabel,
    Radio, Button, Box, Rating
} from '@mui/material';

const Feedback = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        serviceQuality: '',
        value: '',
        experience: '',
        rating: 0,
        sharePublicly: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRating = (event, newValue) => {
        setFormData({ ...formData, rating: newValue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return React.createElement(
        Container,
        { maxWidth: 'md', sx: { mt: 4, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 2 } },
        React.createElement(Typography, { variant: 'h4', fontWeight: 'bold', gutterBottom: true }, 'Feedback'),
        React.createElement(
            'form',
            { onSubmit: handleSubmit },
            React.createElement(TextField, {
                fullWidth: true,
                label: 'Name',
                name: 'name',
                variant: 'outlined',
                margin: 'normal',
                onChange: handleChange,
                required: true,
            }),
            React.createElement(TextField, {
                fullWidth: true,
                label: 'Email',
                name: 'email',
                type: 'email',
                variant: 'outlined',
                margin: 'normal',
                onChange: handleChange,
                required: true,
            }),
            React.createElement(Typography, { variant: 'h6', sx: { mt: 3 } }, 'Overall Satisfaction'),
            React.createElement(FormControl, { fullWidth: true, margin: 'normal' },
                React.createElement(TextField, {
                    select: true,
                    label: 'Overall Service Quality',
                    name: 'serviceQuality',
                    value: formData.serviceQuality,
                    onChange: handleChange,
                    children: [
                        React.createElement(MenuItem, { value: '' }, 'Select'),
                        React.createElement(MenuItem, { value: 'Very Satisfied' }, 'Very Satisfied'),
                        React.createElement(MenuItem, { value: 'Satisfied' }, 'Satisfied'),
                        React.createElement(MenuItem, { value: 'Not Satisfied' }, 'Not Satisfied')
                    ]
                })
            ),
            React.createElement(FormControl, { fullWidth: true, margin: 'normal' },
                React.createElement(TextField, {
                    select: true,
                    label: 'Value',
                    name: 'value',
                    value: formData.value,
                    onChange: handleChange,
                    children: [
                        React.createElement(MenuItem, { value: '' }, 'Select'),
                        React.createElement(MenuItem, { value: 'Very Satisfied' }, 'Very Satisfied'),
                        React.createElement(MenuItem, { value: 'Satisfied' }, 'Satisfied'),
                        React.createElement(MenuItem, { value: 'Not Satisfied' }, 'Not Satisfied')
                    ]
                })
            ),
            React.createElement(FormControl, { fullWidth: true, margin: 'normal' },
                React.createElement(TextField, {
                    select: true,
                    label: 'Overall Experience',
                    name: 'experience',
                    value: formData.experience,
                    onChange: handleChange,
                    children: [
                        React.createElement(MenuItem, { value: '' }, 'Select'),
                        React.createElement(MenuItem, { value: 'Very Satisfied' }, 'Very Satisfied'),
                        React.createElement(MenuItem, { value: 'Satisfied' }, 'Satisfied'),
                        React.createElement(MenuItem, { value: 'Not Satisfied' }, 'Not Satisfied')
                    ]
                })
            ),
            React.createElement(Box, { sx: { mt: 3 } },
                React.createElement(Typography, { variant: 'h6' }, 'Rate Us'),
                React.createElement(Rating, {
                    name: 'rating',
                    value: formData.rating,
                    onChange: handleRating,
                    precision: 1,
                    size: 'large'
                })
            ),
            React.createElement(FormControl, { component: 'fieldset', sx: { mt: 3 } },
                React.createElement(FormLabel, { component: 'legend' }, 'Would you like to share this publicly?'),
                React.createElement(RadioGroup, {
                    row: true,
                    name: 'sharePublicly',
                    value: formData.sharePublicly,
                    onChange: handleChange
                },
                    React.createElement(FormControlLabel, { value: 'true', control: React.createElement(Radio, {}), label: 'Yes' }),
                    React.createElement(FormControlLabel, { value: 'false', control: React.createElement(Radio, {}), label: 'No' })
                )
            ),
            React.createElement(Button, {
                type: 'submit',
                variant: 'contained',
                color: 'primary',
                size: 'large',
                sx: { mt: 4, display: 'block', mx: 'auto' }
            }, 'Submit Feedback')
        )
    );
};

export default Feedback;
