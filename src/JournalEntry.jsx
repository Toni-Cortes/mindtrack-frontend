import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// eslint-disable-next-line react/prop-types
function JournalEntry({ entry = null, closeModal, fetchEntries }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState(entry ? entry.title : '');
  const [description, setDescription] = useState(entry ? entry.description : '');
  const [likes, setLikes] = useState(entry ? entry.likes : '');
  const [dislikes, setDislikes] = useState(entry ? entry.dislikes : '');
  const [state, setState] = useState(entry ? entry.state : '');
  const [diet, setDiet] = useState(entry ? entry.diet : '');

  // Initialize fields if an entry is passed for editing
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setDescription(entry.description);
      setLikes(entry.likes);
      setDislikes(entry.dislikes);
      setState(entry.state);
      setDiet(entry.diet);
    }
  }, [entry]);

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (!user || !user.username) return;

    const newEntry = {
      username: user.username,
      title,
      description,
      likes,
      dislikes,
      state,
      diet,
    };

    try {
      if (entry) {
        // Update an existing entry
        await axios.put(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/entries/${entry._id}`,
          newEntry
        );
      } else {
        // Create a new entry
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/entries/entry`,
          newEntry,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      fetchEntries();
      closeModal();
      
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      <h2 className="entry-title">{entry ? 'Edit Entry' : 'Write about your day'}</h2>
      <div>
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="likes">
        <div>
          <label>Likes</label>
          <input type="text" value={likes} onChange={(e) => setLikes(e.target.value)} />
        </div>
        <div>
          <label>Dislikes</label>
          <input type="text" value={dislikes} onChange={(e) => setDislikes(e.target.value)} />
        </div>
      </div>
      <div>
        <label>Mood/State</label>
        <div className="mood-buttons">
          {["Happy", "Sad", "Angry", "Calm"].map((mood) => (
            <button
              type="button"
              key={mood}
              className={`mood-button ${state === mood ? "selected" : ""}`}
              onClick={() => setState(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label>Diet</label>
        <input type="text" value={diet} onChange={(e) => setDiet(e.target.value)} />
      </div>
      <button className="submit-button" type="submit">{entry ? 'Update Entry' : 'Submit Entry'}</button>
    </form>
  );
}

export default JournalEntry;
