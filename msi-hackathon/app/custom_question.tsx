import { question } from '@/types';
import React, { useState } from 'react';

interface CustomQuestionDialogProps {
  q: question;
  open: boolean;
  onClose1: () => void;
  onClose2: () => void;
}

const CustomQuestionDialog: React.FC<CustomQuestionDialogProps> = ({ q, open, onClose1, onClose2 }) => {
  const [fade, setFade] = useState(false);

  React.useEffect(() => {
    if (open) {
      setFade(true);
    }
    else if (!open && fade) {
      setFade(false);
      onClose1()
    }
  }, [open, fade, onClose1]);

  const handleClick = (idx:number) => {
    q.callbacks[idx]();
    onClose1()
    setFade(false);
    setTimeout(onClose2,500);
  }

  return (
    <>
      {open && (
        <div className={`tint ${fade ? 'fade-in' : 'fade-out'}`} />
      )}
      <div className={`custom-question ${fade ? 'slide-in' : 'slide-out'} sub_section`}>
          {q == undefined?<></>:
            <>
              <div style={{textAlign:'center',padding:"20px"}}>
                <p>{q.message}</p>
                {q.options.map((option,idx) => 
                  <button onClick={() => handleClick(idx)} style={{marginRight:"1vw"}}><p>{option}</p></button>
                )}
              </div>
            </>
          }
      </div>
    </>
  );
};

export default CustomQuestionDialog;
