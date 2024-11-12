import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './Login'
import Signup from './Signup'
import Home from './Home'
import Patients from './Patients'
import Patient from './Patient'
import TherapistLogin from './TherapistLogin'
import Introduction from './Introduction'

function App() {

  return (
    <>
    <Routes>
    <Route path='/' element = {<Introduction/>}/>
      <Route path='/login' element = {<Login/>}/>
      <Route path='/therapist/login' element = {<TherapistLogin/>}/>
      <Route path='/signup' element = {<Signup/>}/>
      <Route path='/home' element = {<Home/>}/>
      <Route path="/patients" element={<Patients />} />
      <Route path="/patients/:patientId" element={<Patient />} />
    
    </Routes>
    </>
  )
}

export default App
