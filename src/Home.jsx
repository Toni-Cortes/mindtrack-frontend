import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import TaskList from './TaskList';
import Journal from './Journal';
import NavBar from './NavBar';
import './styles/Home.css';
import axios from 'axios';

function Home() {
  const { user } = useContext(AuthContext);
  const [isPatient, setIsPatient] = useState(true);
  const [therapistName, setTherapistName] = useState('');
  const [lastEntryDate, setLastEntryDate] = useState(null);
  const [appointment, setAppointment] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    async function fetchPatientDetails() {
      try {
        if (user) {
          const res = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/patients/${user.id}`
          );
          const { patient, lastEntryDate } = res.data;

          setTherapistName(patient.therapist.username);
          setLastEntryDate(lastEntryDate);
        }
      } catch (err) {
        console.error('Error fetching patient details:', err);
      }
    }

    async function getAppointment(){
      try{
        const headers = {
          Authorization: `Bearer ${token}`,}

        const appointmentResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/appointments/${user.id}/next`, { headers });
        setAppointment(appointmentResponse.data || null);
        console.log(appointmentResponse)
      }catch(error){
        console.error("Error fetching patient appointment:", error);
      }
    }

    fetchPatientDetails();
    getAppointment();
  }, [user]);

  useEffect(() => {
    async function fetchTherapist() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/therapists`);
        const therapistUsernames = res.data.map((therapist) => therapist.username);

        // Check if the user is a therapist
        if (therapistUsernames.includes(user.username)) {
          setIsPatient(false);
        }
      } catch (err) {
        console.log('Error fetching therapists:', err);
      }
    }

    if (user) {
      fetchTherapist();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to access the Home page.</div>;
  } else if (!isPatient) {
    return <div>Patients only</div>;
  }

  return (
    <div>
      <NavBar />
      <h1 className="home-title">{user.username}&apos;s board</h1>
      <p className="description" style={{ margin: 'auto', textAlign: 'center', maxWidth: '500px' }}>
        Welcome {user.username} to your board. Here you can check your messages, pending tasks, and
        write your Journal, where you can keep track of your days and thoughts.
      </p>
      <p className="description" style={{ margin: 'auto', textAlign: 'center', maxWidth: '500px' }}>
        <strong>Therapist:</strong> {therapistName || 'N/A'}
      </p>
      <p className="description" style={{ margin: 'auto', textAlign: 'center', maxWidth: '500px' }}>
        <strong>Last Journal Entry:</strong>{' '}
        {lastEntryDate ? new Date(lastEntryDate).toLocaleString() : 'No entries yet'}
      </p>
      <p className="description" style={{ margin: 'auto', textAlign: 'center', maxWidth: '500px' }}>
        <strong>Next Appointment:</strong>{' '}
        {appointment ? new Date(appointment.dateTime).toLocaleString() : 'No appointments scheduled'}
      </p>

      <div className="home-container">
        <div className="home-screen">
          <TaskList />
        </div>
        <div className="home-screen">
          <Journal />
        </div>
      </div>
    </div>
  );
}

export default Home;
