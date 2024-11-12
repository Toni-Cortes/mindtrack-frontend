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

  useEffect(() => {
    async function fetchTherapist() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/therapists`);
        const therapistUsernames = res.data.map(therapist => therapist.username);
        
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
        Welcome {user.username} to your board, here you can check your messages, pending tasks and write your Journal, where you can keep track of your days and thoughts.
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
