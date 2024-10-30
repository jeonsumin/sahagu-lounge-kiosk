import {
  answerQuestion,
  resetSurvey, update,
  useAppDispatch,
  useAppSelector,
} from 'store';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { TopArea, BottomArea } from 'components';
import questions from 'data/data.json';
import { Img } from 'assets';
import { commonFunction } from 'common';

const Survey = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentQuestionId = useAppSelector(
    (state: any) => state.userstate.currentQuestionId
  );
  const [num, setNum] = useState<number>(1);
  const [progressBar, setProgressBar] = useState<number>(0);
  const [questionStack, setQuestionStack] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const [chooseAnswer, setChooseAnswer] = useState<any>({});

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }

      commonFunction.startTimer(timeoutRef, 30000, () => {
        dispatch(resetSurvey());
        navigate('/');
      });
    };

    const events: string[] = ['touchstart', 'click'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      commonFunction.cancelTimer(timeoutRef);
    };
  }, []);

  useEffect(() => {
    dispatch(update(chooseAnswer));
  }, [chooseAnswer]);

  useEffect(() => {
    if (num > 4) {
      navigate('/result');
    }
  }, [num]);

  const handleOptionClick = (
    nextId: number,
    resultId: number | null = null,
    index: number
  ) => {
    setProgressBar((prev) => Math.min(prev + 33, 100));
    setQuestionStack((prevStack) => [
      ...prevStack,
      currentQuestionId as number,
    ]);
    setNum((prevNum) => prevNum + 1);

    const nextAction: any = { nextId, resultId };
    dispatch(answerQuestion(nextAction));

    const answer = questions.filter((q) => q.id === currentQuestionId)[0]
      .options[index];

    setChooseAnswer((prev: any) => ({
      ...prev,
      [num]: answer.label,
    }));

  };

  const handlePreviousClick = () => {
    if (questionStack.length > 0) {
      const previousId = questionStack.pop();
      // console.log(previousId);
      setNum((prevNum) => Math.max(prevNum - 1, 1));
      setProgressBar((prev) => Math.max(prev - 33, 0));

      const nextAction: any = { nextId: previousId!, resultId: null };
      dispatch(answerQuestion(nextAction));

      setQuestionStack([...questionStack]);
    }
  };

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  return (
    <div className='survey'>
      <TopArea />
      <div className='progress_bar'>
        <div className='fill' style={{ width: `${progressBar}%` }}></div>
      </div>
      <div className='txt_box'>
        <h4 className='num'>Q.{num}</h4>
        <h2>{currentQuestion?.question}</h2>
      </div>
      <ul className='survey_list'>
        {currentQuestion &&
          currentQuestion.options.map((option, index) => {
            const hasDesc = 'desc' in option;

            return (
              <li key={index} className={hasDesc ? 'has_desc' : ''}>
                <button
                  onClick={() => {
                    const nextId = 'nextId' in option ? option.nextId : 0;
                    const resultId = 'resultId' in option ? option.resultId : 0;

                    handleOptionClick(nextId, resultId, index);
                  }}
                >
                  {!hasDesc && (
                    <div className='img_box icn'>
                      <img
                        src={Img[option.Img as keyof typeof Img]}
                        alt={option.label}
                      />
                    </div>
                  )}
                  <p>{option.label}</p>
                  {hasDesc && <span>{option.desc}</span>}
                </button>
              </li>
            );
          })}
      </ul>
      <BottomArea
        handlePreviousClick={handlePreviousClick}
        questionStack={questionStack}
        showPrevButton={true}
        hideHomeButton={false}
      />
      {/* <AlertPopup isOpen={isPopupOpen} onClose={() => setPopupOpen(false)} /> */}
    </div>
  );
};

export default Survey;
