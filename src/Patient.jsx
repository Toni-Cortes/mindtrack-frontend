import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TaskEntry from './TasksEntry';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function Patient() {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [entries, setEntries] = useState([]);
    const [tasks, setTasks] = useState([]); // State to hold tasks
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); // Goes back to the previous page
    };

    const fetchPatientDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/${patientId}`);
            setPatient(response.data);
            setEntries(response.data.journal?.entries || []); // Access entries within journal if available
            setTasks(response.data.toDo || []); // Access toDo tasks
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, [patientId]);

    if (!patient) return <p>Loading...</p>;

    // Separate completed and pending tasks
    const completedTasks = tasks.filter(task => task.isCompleted);
    const pendingTasks = tasks.filter(task => !task.isCompleted);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className='patient-panel'>
            <NavBar/>
            <br />
            <button onClick={goBack} className="go-back">
                ← {/* Arrow icon */}
            </button>
            <h1>{`${patient.username}'s Details`}</h1>
            <div className='patient-panels'>

                <div>
                    <h2>Entries</h2>
                    <div className='entries'>
                        {entries.map(entry => (
                            <div key={entry._id} className='entry' style={{ backgroundColor: entry.state === 'Sad' ? 'rgb(105, 66, 121)' : entry.state === 'Calm' ? 'rgb(58, 96, 117)' : entry.state === 'Angry' ? 'rgb(121, 66, 78)' : entry.state === 'Happy' ? 'yellow' : 'initial'}}>
                                {console.log(entry)} 
                                {console.log(patient.journal.visibility)}
                                <div className='entry-title'><h3>{entry.title}</h3><span>{entry.date.slice(0, 10)}</span></div>
                                <p style={{fontStyle: 'oblique'}}>{patient.journal.visibility=='private' ? 'Description Private' : entry.description}</p>
                                <p><strong>{`Mood: ${entry.state}`}</strong></p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2>Tasks</h2>
                    <button onClick={openModal}>Add Task</button> {/* Button to open modal */}
                    <div>
                        <h3>Completed Tasks</h3>
                        {completedTasks.map(task => (
                            <div className='task' key={task._id}>
                                <div style={{ backgroundColor: 'green' }}>
                                    <p>{task.title} - {task.description} (Completed)</p>
                                </div>
                            </div>
                        ))}

                        <h3>Pending Tasks</h3>
                        {pendingTasks.map(task => (
                            <div className='task' key={task._id}>
                                <div style={{ backgroundColor: 'initial' }}>
                                    <p>{task.title} - {task.description} (Pending)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Modal for adding tasks */}
                <Modal closeModal={closeModal} isModalOpen={isModalOpen}>
                    <TaskEntry fetchPatientDetails={fetchPatientDetails} />
                </Modal>

            </div>
        </div>
    );
}

export default Patient;
