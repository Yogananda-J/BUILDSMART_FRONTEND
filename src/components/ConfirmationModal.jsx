import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaTrash, FaCheck, FaTimes, FaSignOutAlt, FaQuestionCircle } from 'react-icons/fa';

const iconMap = {
  danger: <FaTrash size={32} className="text-danger" />,
  success: <FaCheck size={32} className="text-success" />,
  warning: <FaExclamationTriangle size={32} className="text-warning" />,
  logout: <FaSignOutAlt size={32} className="text-warning" />,
  default: <FaQuestionCircle size={32} className="text-primary" />,
};

const variantButton = {
  danger: 'danger',
  success: 'success',
  warning: 'warning',
  logout: 'warning',
  default: 'primary',
};

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop={isLoading ? 'static' : true}
      keyboard={!isLoading}
      className="confirmation-modal"
    >
      <Modal.Header closeButton={!isLoading} className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <div className="mb-3">{iconMap[variant] || iconMap.default}</div>
        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 d-flex gap-2 justify-content-center">
        <Button
          variant="light"
          onClick={onHide}
          disabled={isLoading}
          className="px-4 fw-semibold"
          style={{ minWidth: 100 }}
        >
          {cancelText}
        </Button>
        <Button
          variant={variantButton[variant] || 'primary'}
          onClick={onConfirm}
          disabled={isLoading}
          className="px-4 fw-semibold d-flex align-items-center justify-content-center gap-2"
          style={{ minWidth: 120 }}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
