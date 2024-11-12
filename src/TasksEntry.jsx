import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext'; 
import { useParams } from 'react-router-dom';

function TaskEntry(props) {
    const { patientId } = useParams();
    const { token } = useContext(AuthContext); 
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleAddTask = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/therapists/${patientId}/tasks`,
                { title, description },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
            setMessage(response.data.message); 
            setTitle(''); 
            setDescription('');
            // eslint-disable-next-line react/prop-types
            props.fetchPatientDetails()

        } catch (error) {
            console.error("Error adding task:", error);
            setMessage("Error adding task. Please try again.");
        }
    };

    return (
        <div>
            <h2>Add Task for Patient</h2>
            <form onSubmit={handleAddTask}>
                <div>
                    <label htmlFor="title">Task Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Task</button>
            </form>
            {message && <p>{message}</p>} {/* Display success/error message */}
        </div>
    );
}

export default TaskEntry;
