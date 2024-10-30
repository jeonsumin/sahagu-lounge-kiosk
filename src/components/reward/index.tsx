import { Img } from 'assets';
import React, { RefObject, useRef } from 'react';

interface Props {
  photo: string | null;
  resultTxt: string;
  domRef: RefObject<HTMLDivElement>;
}

export const Reward = (props: Props) => {
  return (
    <div className='reward_wrap' ref={props.domRef} >
      <div>
        <img src={Img.rewardTitle} alt='' />
      </div>
      <div className=' mt20'>
        <img src={props.photo!} alt='' />
      </div>
      <div className='mt20'>
        <img src={Img.spread} alt='' />
      </div>
      <div className='mt20'>
        <p className='reward_desc'>{props.resultTxt}</p>
      </div>
      <div className='mt20'>
        <img src={Img.spread} alt='' />
      </div>
      <div className='mt20 img_box'>
        <img src={Img.rewardLogo} alt='Logo' />
      </div>
    </div>
  );
};
