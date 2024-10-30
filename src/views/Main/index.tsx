import React, { useEffect } from 'react';
import { Link} from 'react-router-dom';
import { TopArea, BottomArea } from 'components';
import { clear, update, useAppDispatch } from 'store';
import { UTILS } from 'utils';
import moment from 'moment';

const Main = () => {
  const dispatch = useAppDispatch();

  const start = () => {
    dispatch(update({ startDate: UTILS.formatData(moment(), 'YYYY-MM-DD HH:mm:ss') }));
  }
  useEffect(() => {
    dispatch(clear());
  }, []);
  return (
    <div className="intro">
      <TopArea />
      <div className="txt_box">
        <p>할 일도 고민도 많은 ‘바쁘다 바빠 현대사회!’</p>
        <p>
          간단한 유형 테스트를 통해
          <br />
          나의 고민을 분석하고,
          <br />
          응원 문구가 담긴 사진도 촬영해보세요!
        </p>
      </div>
      <Link to="/survey" className="start_btn btn_c" onClick={() => {start()}}></Link>
      <BottomArea hideHomeButton={true} bgShow={true} />
    </div>
  );
};

export default Main;
