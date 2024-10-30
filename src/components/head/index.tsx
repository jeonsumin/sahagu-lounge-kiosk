import React, { useState } from 'react';

// const TopArea: React.FC = () => {
export function TopArea() {
  // 클릭 시간을 저장하는 상태. 타입은 숫자 배열.
  const [clickTimes, setClickTimes] = useState<number[]>([]);

  const adminClick = () => {
    const now = Date.now();
    const updatedClickTimes = [...clickTimes, now];

    // 클릭 시간 배열에서 최근 3개의 클릭만 남김
    if (updatedClickTimes.length > 3) {
      updatedClickTimes.shift();
    }

    setClickTimes(updatedClickTimes);

    // 최근 3번의 클릭이 1초 안에 들어왔는지 체크
    if (
      updatedClickTimes.length === 3 &&
      updatedClickTimes[2] - updatedClickTimes[0] <= 1000
    ) {
      window.Main.Close();
      setClickTimes([]);
    }
  };

  return <button className='admin_btn' onClick={adminClick}></button>;
}

// export default TopArea;
