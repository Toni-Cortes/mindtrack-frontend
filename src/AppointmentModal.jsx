/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../src/AuthContext'; // Import your AuthContext
import './styles/Modal.css'; // Ensure you have separate CSS styles for the modal

function AppointmentModal({ closeModal, isModalOpen, patientId, currentAppointment, fetchPatientDetails }) {
    const { token } = useContext(AuthContext); // Access the token from context
    const [appointmentDetails, setAppointmentDetails] = useState({
        date: currentAppointment ? currentAppointment.dateTime.slice(0, 10) : '', // Extract date from currentAppointment
        time: currentAppointment ? currentAppointment.dateTime.slice(11, 16) : '', // Extract time
        description: currentAppointment ? currentAppointment.description : ''
    });
    const [isLoading, setIsLoading] = useState(false); // For handling submit button loading state
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission (both create and update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading to true when submitting
    
        try {
            setErrorMessage(''); // Clear any previous error message
    
            const headers = {
                Authorization: `Bearer ${token}` // Add Authorization header with Bearer token
            };
    
            const url = currentAppointment
                ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointments/${currentAppointment.id}` // PUT for update
                : `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointments`; // POST for creating
    
            const appointmentData = {
                ...appointmentDetails,
                patientId,
                dateTime: `${appointmentDetails.date}T${appointmentDetails.time}:00` // Combine date and time into a single datetime string
            };
    
            if (currentAppointment) {
                // Update the appointment
                await axios.put(url, appointmentData, { headers });
            } else {
                // Create a new appointment
                await axios.post(url, appointmentData, { headers });
            }
    
            // Fetch the updated patient details
            await fetchPatientDetails(); // This ensures that the new or updated appointment is reflected
    
            closeModal(); // Close the modal after successful submit
        } catch (error) {
            console.error('Error submitting appointment:', error);
            setErrorMessage('There was an error submitting your appointment. Please try again.'); // Show error message to user
        } finally {
            setIsLoading(false); // Reset loading state after request finishes
        }
    };

    // Optionally: if `currentAppointment` is provided, it will auto-fill
    useEffect(() => {
        if (currentAppointment) {
            setAppointmentDetails({
                date: currentAppointment.dateTime.slice(0, 10),
                time: currentAppointment.dateTime.slice(11, 16),
                description: currentAppointment.description
            });
        }
    }, [currentAppointment]);

    return (
        <div className={`appointment-modal ${isModalOpen ? 'open' : ''}`}>
            <div className="appointment-modal-content">
                {/* Close button */}
                <button className="modal-close" onClick={closeModal}>
                    &times;
                </button>

                <h2>{currentAppointment ? 'Update' : 'Schedule'} Appointment</h2>

                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message if any */}

                <form onSubmit={handleSubmit}>
                    <label>
                        {'Date '}
                        <input
                            type="date"
                            value={appointmentDetails.date}
                            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                            required
                            disabled={isLoading} // Disable fields while submitting
                        />
                    </label>
                    <label>
                        {'Time '}
                        <input
                            type="time"
                            value={appointmentDetails.time}
                            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, time: e.target.value })}
                            required
                            disabled={isLoading} // Disable fields while submitting
                        />
                    </label>
                   {/*  <label>
                       {' Description '}
                        <textarea
                            value={appointmentDetails.description}
                            onChange={(e) => setAppointmentDetails({ ...appointmentDetails, description: e.target.value })}
                            required
                            disabled={isLoading} // Disable fields while submitting
                        />
                    </label> */}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : currentAppointment ? 'Update' : 'Schedule'} Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AppointmentModal;
