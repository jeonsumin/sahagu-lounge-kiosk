import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { resetSurvey } from 'store';
import React,{ useEffect, useRef } from 'react';
import { TopArea, BottomArea} from 'components';
import { commonFunction } from 'common';

const Result = () => {
  const answers = useSelector((state:any) => state.userstate.answers);
  const finalResult = answers.length > 0 ? answers[answers.length - 1].result : null;
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      commonFunction.startTimer(timeoutRef, 30000, () => {
        dispatch(resetSurvey());
        navigate('/');
      })
    };

    const events: string[] = ['touchstart', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      commonFunction.cancelTimer(timeoutRef)
    };
  }, []);

  return (
    <div className="result">
      <TopArea />
      <div className="txt_box">
      {finalResult ? (
        <>
          <p>당신의 고민 유형은</p>
          <p className='round_txt'>{finalResult.title}</p>
          <div className="box_txt">
            <span>{finalResult.desc}</span>
          </div>
          <Link to="/Photo" className="link_btn"></Link>
        </>
      ) : (
        <></>
      )}
    </div>
      
      <BottomArea />
    </div>
  );
};

export default Result;
