import { Link } from "react-router-dom"


function Introduction() {
    return (
        <div>
            <div className="Navbar">
                <div className="navbar-img">
                    <img width='30px' src=".\src\assets\logo-simple.svg" alt="" />
                </div>
                <div className="navbar-buttons">
                    <Link to={'/login'}>Login</Link>
                    <Link to={'/signup'}>Signup</Link>
                </div>

            </div>
            <section id="home-intro">
                <img style={{ width: '28%' }} src="./src/assets/logo-welcome.svg" alt="" />
                <p id="intro-p">
                    <strong style={{ color: 'rgb(137, 197, 247)' }}>Mindcheck</strong> is a dedicated platform designed to strengthen the connection between therapists and their patients. Here, patients can express themselves through a<strong style={{ color: 'rgb(137, 197, 247)' }}>  daily journal</strong>, reflecting on their thoughts, moods, and progress.
                </p>

                <div className="intro-section">
                    <img style={{ margin: '5px' }} width='40px' src="https://cdn-icons-png.flaticon.com/512/1292/1292906.png" alt="" />
                    <h2>Personalized Tasks & Support</h2>
                    <p>
                        Therapists can assign personalized tasks to guide and encourage each patient&apos;s progress. These tasks can be tracked by the patient, helping to build positive habits and work towards therapeutic goals between sessions.
                    </p>
                </div>

                <div className="intro-section">
                    <img style={{ margin: '5px' }} width='40px' src="https://cdn-icons-png.flaticon.com/512/1545/1545196.png" alt="" />
                    <h2>Stay on Track with Appointment Reminders</h2>
                    <p>
                        Scheduling features ensure that no session or important milestone is missed, helping patients and therapists stay aligned in their journey toward mental wellness.
                    </p>
                </div>
                <div className="intro-section">
                    <img style={{ margin: '5px' }} width='40px' src="https://cdn-icons-png.flaticon.com/512/1665/1665682.png" alt="" />
                    <h2>Progress at Your Own Pace</h2>
                    <p>
                        Mindcheck empowers patients to track their growth in a secure, supportive space. Join us and take the next step in your mental health journey with the help of your dedicated therapist.
                    </p>
                </div>
                <h2>Ready to start?</h2>

                <Link style={{ textDecoration: 'none' }} to={'/signup'}>
                    <button style={{
                        border: '1px dashed white',
                        cursor: 'pointer',
                        marginTop: '0px',
                        marginBottom: '100px'
                    }}
                        className="submit-button">Create your account </button>
                </Link>
            </section>


        </div>
    )
}

export default Introduction