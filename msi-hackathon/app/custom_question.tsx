import { question } from '@/types';
import React, { useState } from 'react';

interface CustomQuestionDialogProps {
  q: question;
  open: boolean;
  setQuestionFadingOut: Function;
  questions: question[];
  setQuestions: Function;
}

const CustomQuestionDialog: React.FC<CustomQuestionDialogProps> = ({ q, open, setQuestionFadingOut, questions, setQuestions }) => {
  const [fade, setFade] = useState(false);

  React.useEffect(() => {
    if (open) {
      setFade(true);
    }
  }, [open]);

  const handleClick = (idx:number) => {
    q.callbacks[idx]();
    setFade(false);
    setQuestionFadingOut(true);
    setTimeout(()=>{
      console.log(questions);
      setQuestionFadingOut(false);
      if(questions.length > 1) {
        let new_questions = questions.slice(1);
        console.log(new_questions)
        setQuestions(new_questions);
      } else {
        console.log("nothing")
        setQuestions([])
      }
    },500);
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
