import './styles/Modal.css';

// eslint-disable-next-line react/prop-types
function Modal({ closeModal, children, isModalOpen }) {
  if (!isModalOpen) return null;

/*   function handleOutsideClick(e) {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal();
    }
  } */



  return (
    <div className="modal-overlay" >
      <div className="modal-content">
        <button className="modal-close" onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
