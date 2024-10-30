import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetSurvey } from 'store/userState';
import { commonFunction } from 'common';
import { TopArea, BottomArea } from 'components';
import { useAppDispatch, useAppSelector } from 'store';

const Outro = () => {
  const timeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filename = useAppSelector((state: any) => state.userstate.filename);

  const imagePrint = () => {
    window.Main.send('image-print', { name: 'reward.png', data: filename });
  };
  const data = useAppSelector((state) => state.userstate.data);
  const saveData = () => {
    window.Main.send('save-data', data);
  };

  useEffect(() => {
    if (window.Main) saveData();
  }, []);
  useEffect(() => {
    if (window.Main) imagePrint();

    const resetTimer = () => {
      commonFunction.cancelTimer(timeoutRef);

      commonFunction.startTimer(timeoutRef, 10000, () => {
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

  return (
    <div className='outro'>
      <TopArea />
      <div className='inner'>
        <p>참여해 주셔서 감사합니다</p>
        <div className='round_box'>
          <p>상품은 아래에서 수령해주세요</p>
        </div>
        <div className='ani_obj'></div>
      </div>
      <BottomArea isSave={true}/>
    </div>
  );
};

export default Outro;
