import { useNavigate } from 'react-router-dom';
import { resetSurvey, useAppDispatch, useAppSelector } from 'store';
import { Img } from 'assets';
import React from 'react';

interface IBottomAreaProps {
  handlePreviousClick?: () => void;
  questionStack?: number[]; 
  showPrevButton?: boolean; 
  hideHomeButton?: boolean;
  bgShow?: boolean;
  isSave?: boolean;
}

// const BottomArea = (props: IBottomAreaProps) => {
export function BottomArea(props: IBottomAreaProps) {
  const { handlePreviousClick, questionStack = [], showPrevButton, hideHomeButton, bgShow } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const data = useAppSelector(state => state.userstate.data);
  const saveData = () => {
    window.Main.send('save-data', data)
  }

  const resetBtn = () => {
    dispatch(resetSurvey());
    if (!props.isSave) {
      if (window.Main) saveData();
    }
    navigate('/');
  };

  return (
    <div className={`bottom_area ${bgShow ? 'bgshow' : ''}`}>
      {showPrevButton && (
        <button
          className='prev_btn'
          onClick={handlePreviousClick}
          disabled={questionStack.length === 0} 
        >
        </button>
      )}
      <div className='img_box'>
        <img src={Img.logo} alt="Logo" />
      </div>
      {!hideHomeButton && (
        <button className="home_btn" onClick={resetBtn}></button>
      )}
    </div>
  );
}
// export default BottomArea;
