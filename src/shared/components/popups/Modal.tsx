import { useEffect } from 'react';
import ReactModal from 'react-modal';
import { Card } from '../panels';
import './Modal.css';

type ModalSize = 'small' | 'medium' | 'large' | 'full';

interface ModalProps extends React.PropsWithChildren {
  header?: string;
  onHide: () => void;
  size?: ModalSize;
  visible?: boolean;
  className?: string;
}

export default function Modal({
  size = 'medium',
  className,
  ...props
}: ModalProps) {
  useEffect(() => {
    return () => {
      // Making sure that modal's class is remvoed when the component
      // is unloaded.
      document.body.classList.remove('ReactModal__Body--open');
    };
  }, []);

  return (
    <ReactModal
      className={`modal-content ${size} ${className || ''}`.trim()}
      isOpen={props.visible ?? false}
      onRequestClose={props.onHide}
      shouldCloseOnOverlayClick={false}
      overlayClassName={`modal-overlay ${className || ''}`.trim()}
      shouldCloseOnEsc
    >
      <Card className="modal-card" title={props.header} onClose={props.onHide}>
        {props.children}
      </Card>
    </ReactModal>
  );
}
