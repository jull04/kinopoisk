import { useEffect, useState } from 'react';
import './ConfirmModal.css';

type ConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
};

const ConfirmModal = ({ open, onConfirm, onCancel, title }: ConfirmModalProps) => {
  const [displayTitle, setDisplayTitle] = useState(title);

  useEffect(() => {
    if (open) {
      setDisplayTitle(title);
    }
  }, [open, title]);

  return (
    <div
      className={`modal-overlay ${open ? 'open' : ''}`}
    >
      <div className="modal">
        <button
          type="button"
          className="popup__close"
          aria-label="Закрыть"
          onClick={onCancel}
        />
        <h3 className="modal-title">{displayTitle}</h3>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Да</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
