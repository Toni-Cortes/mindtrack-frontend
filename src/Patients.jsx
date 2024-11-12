// src/components/Patients.jsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function Patients() {
    const { user, token } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/therapists/${user.id}/patients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPatients(response.data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };

        if (user) {
            fetchPatients();
        }
    }, [user, token]);

    if (!user) {
        return <div>Please log in to access the Therapist page.</div>;
      }
    
    return (
        <div>
            <NavBar/>
            <h1 className='patients-title'>Your Patients</h1>
            <div className='patients-list'>
                {patients.map(patient => (
                    <div key={patient._id} onClick={() => navigate(`/patients/${patient._id}`)}>
                        {patient.username} {/* Or any other patient detail */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Patients;
