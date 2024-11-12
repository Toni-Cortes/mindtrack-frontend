import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import Modal from './Modal';
import JournalEntry from './JournalEntry';



function Journal() {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchEntries() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/journals/entries/${user.username}`
      );
      setEntries(response.data.entries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  }

  function closeModal() {
    setIsModalOpen(false)
    setSelectedEntry(null)
  }

  function openModal() {
    setIsModalOpen(true)
  }


  useEffect(() => {
    if (user) fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isModalOpen]);


  function handleEntryClick(entry) {
    setSelectedEntry(entry);
  }


  async function handleDelete(entryId) {
    try {
      await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/entries/${entryId}`);
      setSelectedEntry(null)
      fetchEntries()

    } catch (error) {
      console.error("Error deleting entry:", error);
    }


  }

  function openEditModal(entry) {
    setSelectedEntry(entry)
    openModal();


  }



  return (
    <div className='Journal'>
      <h2>Journal</h2>
      {selectedEntry ? (
        <div>
          <h3 style={{ color: 'rgb(103, 184, 231' }}>{selectedEntry.title}</h3>
          <p>{selectedEntry.description}</p>
          <div className="entry-buttons">
            <div>
              <button onClick={() => handleDelete(selectedEntry._id)}>Delete Entry</button>
              <button onClick={() => openEditModal(selectedEntry)}>Edit Entry</button>
            </div>
            <button onClick={() => setSelectedEntry(null)}>Back to All Entries</button>
          </div>
        </div>
      ) : (

        <div>
          <div className='entry-list'>
            {entries.map(entry => (
              <div className='each-entry' key={entry._id} onClick={() => handleEntryClick(entry)}>
                <span>
                  <strong>{entry.title}</strong>
                </span>
                <span>
                  {entry.date.slice(0, 10)}
                </span>
              </div>
            ))}
          </div>
          <button className="add-entry-button" onClick={() => { setIsModalOpen(true) }}>Add Entry</button>
        </div>
      )}


      <Modal closeModal={closeModal} openModal={openModal} isModalOpen={isModalOpen}>
        <JournalEntry fetchEntries={fetchEntries} entry={selectedEntry} closeModal={closeModal}></JournalEntry>
      </Modal>

    </div>
  );
}

export default Journal;
