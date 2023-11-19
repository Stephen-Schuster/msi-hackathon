import React, { useState } from 'react';

interface CustomAlertDialogProps {
  message: string;
  open: boolean;
  onClose: () => void;
  onSnooze: () => void;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({ message, open, onClose, onSnooze }) => {
  const [fade, setFade] = useState(false);

  React.useEffect(() => {
    if (open) {
      setFade(true);
    } else if (!open && fade) {
      setFade(false);
      onClose()
    }
  }, [open, fade, onClose]);

  const handleCloseClick = () => {
    setFade(false);
    onClose()
  };
  const handleSnooze = () => {
    setFade(false);
    onSnooze()
  };

  return (
    <>
      {open && (
        <div className={`tint ${fade ? 'fade-in' : 'fade-out'}`} />
      )}
      <div className={`custom-alert ${fade ? 'slide-in' : 'slide-out'} sub_section`}>
        <div style={{textAlign:'center',padding:"20px"}}>
          <p>{message}</p>
          <button onClick={handleSnooze} style={{marginRight:"1vw"}}><p>Snooze 60s</p></button>
          <button onClick={handleCloseClick}><p>OK</p></button>
        </div>
      </div>
    </>
  );
};

export default CustomAlertDialog;
