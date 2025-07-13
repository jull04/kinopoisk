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
      className={`modal__overlay ${open ? 'modal__overlay_open' : ''}`} onClick={onCancel}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__button-close"
          aria-label="Закрыть"
          onClick={onCancel}
        />
        <h3 className="modal__title">{displayTitle}</h3>
        <div className="modal__buttons">
          <button className="modal__button modal__button-confirm" onClick={onConfirm}>Да</button>
          <button className="modal__button modal__button-cancel" onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
