import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TaskEntry from './TasksEntry';
import Modal from './Modal';
import NavBar from './NavBar';
import AppointmentModal from './AppointmentModal';
import { AuthContext } from './AuthContext'; // Assuming you have an AuthContext

function Patient() {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [entries, setEntries] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [appointment, setAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    const navigate = useNavigate();
    const { token } = useContext(AuthContext); // Get token from context

    const goBack = () => {
        navigate(-1);
    };

    const fetchPatientDetails = async () => {
        try {
            // Add the Authorization header with the token
            const headers = {
                Authorization: `Bearer ${token}`, // Assuming you store token as 'token' in your context
            };

            // Fetch the patient details first
            const patientResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/${patientId}`, { headers });
            const patientData = patientResponse.data.patient;
            setPatient(patientData);
            setEntries(patientData.journal?.entries || []);
            setTasks(patientData.toDo || []);

            // Fetch the patient's next appointment
            const appointmentResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointments/${patientId}/next`, { headers });
            setAppointment(appointmentResponse.data || null); // Set the appointment if exists
        } catch (error) {
            console.error("Error fetching patient details:", error);
        }
    };

    useEffect(() => {
        fetchPatientDetails();
    }, [patientId, token]); // Re-run if token changes

    function openAppointmentModal() {
        setIsAppointmentModalOpen(true);
    }

    function closeAppointmentModal() {
        setIsAppointmentModalOpen(false);
    }

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    if (!patient) return <p>Loading...</p>;

    return (
        <div className='patient-panel'>
            <NavBar />
            <br />
            <button onClick={goBack} className="go-back">←</button>
            <h1>{`${patient.username}'s Details`}</h1>
            <div className='patient-panels'>
                <div>
                    <h2>Entries</h2>
                    <div className='entries'>
                        {entries.map(entry => (
                            <div key={entry._id} className='entry' style={{
                                backgroundColor: entry.state === 'Sad' ? 'rgb(105, 66, 121)' :
                                    entry.state === 'Calm' ? 'rgb(58, 96, 117)' :
                                        entry.state === 'Angry' ? 'rgb(121, 66, 78)' :
                                            entry.state === 'Happy' ? 'rgb(122, 101, 40)' : 'initial'
                            }}>
                                <div className='entry-title'>
                                    <h3>{entry.title}</h3>
                                    <span>{entry.date.slice(0, 10)}</span>
                                </div>
                                <p style={{ fontStyle: 'oblique' }}>
                                    {patient.journal?.visibility === 'private' ? 'Description Private' : entry.description}
                                </p>
                                <p><strong>{`Mood: ${entry.state}`}</strong></p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2>Tasks</h2>
                    <button onClick={openModal}>Add Task</button>
                    <div>
                        <h3>Completed Tasks</h3>
                        {tasks.filter(task => task.isCompleted).map(task => (
                            <div className='task' key={task._id}>
                                <div style={{ backgroundColor: 'green' }}>
                                    <p>{task.title} - {task.description} (Completed)</p>
                                </div>
                            </div>
                        ))}
                        <h3>Pending Tasks</h3>
                        {tasks.filter(task => !task.isCompleted).map(task => (
                            <div className='task' key={task._id}>
                                <div style={{ backgroundColor: 'initial' }}>
                                    <p>{task.title} - {task.description} (Pending)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2>Appointment</h2>
                    {appointment ? (
                        <>
                            <p><strong>Next Appointment:</strong> {new Date(appointment.dateTime).toLocaleString()}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>
                            <button onClick={openAppointmentModal}>Update Appointment</button>
                        </>
                    ) : (
                        <>
                            <p>No Appointment scheduled with {patient.username}</p>
                            <button onClick={openAppointmentModal}>Schedule Appointment</button>
                        </>
                    )}
                </div>

                <Modal closeModal={closeModal} isModalOpen={isModalOpen}>
                    <TaskEntry fetchPatientDetails={fetchPatientDetails} />
                </Modal>

                <AppointmentModal
                    closeModal={closeAppointmentModal}
                    isModalOpen={isAppointmentModalOpen}
                    fetchPatientDetails={fetchPatientDetails}
                    patientId={patientId}
                    currentAppointment={appointment}
                />
            </div>
        </div>
    );
}

export default Patient;
