import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { TopArea, BottomArea, Reward } from 'components';
import WebcamControl from './WebcamComponent';
import { update, updateImage } from 'store';
import { commonFunction } from 'common';
import html2canvas from 'html2canvas';
import { UTILS } from '../../utils';
import moment from 'moment/moment';

const Photo = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const answers = useSelector((state: any) => state.userstate.answers);
  const finalResult =
    answers.length > 0 ? answers[answers.length - 1].result : null;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const webcamRef = useRef<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const timer = useRef<any>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const loadingRef: any = useOutletContext();


  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    if (timeLeft === 0) {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          loadingRef.loadingRef.current.set({ show: true });
          setCapturedImage(imageSrc);
        }
      }
      commonFunction.startTimer(timer, 5000, () => {
        imagePrint().then(() => {
          dispatch(update({'photo':true}))
          dispatch(update({ 'endDate' : UTILS.formatData(moment(), 'YYYY-MM-DD HH:mm:ss') }));
          navigate('/outro');
        });
      });
    }

    return () => {
      clearInterval(timerId);
    };
  }, [timeLeft]);

  useEffect(() => {
    return () => commonFunction.cancelTimer(timer);
  }, []);

  const imagePrint = async () => {
    if (domRef.current) {
      await html2canvas(domRef.current, { scale: 1, useCORS:false, }).then((response) => {
        const imgData = response.toDataURL();
        loadingRef.loadingRef.current.set({ show: false });
        dispatch(updateImage(imgData));
      });
    }
  };

  return (
    <>
      <div className='result'>
        <TopArea />
        <div className='inner'>
          <div className='photo_area'>
            <div className='preview'>
              {capturedImage ? (
                <img src={capturedImage} alt='Captured' />
              ) : (
                <WebcamControl
                  webcamRef={webcamRef}
                  onCapture={setCapturedImage}
                />
              )}
            </div>

            {timeLeft <= 5 && timeLeft > 0 && (
              <div
                className='timer_wrap'
                style={{
                  background: `conic-gradient(
                rgba(255, 255, 255, 0.30) 0%,
                rgba(255, 255, 255, 0.30) ${timeLeft * 20}%,
                #D9D9D9 ${timeLeft * 20}%,
                #D9D9D9 100%
              )`,
                }}
              >
                <p className='timer'>{timeLeft}</p>
              </div>
            )}
          </div>
          <div className='round_box'>
            <p>{finalResult?.rc}</p>
          </div>
        </div>
        <BottomArea />
      </div>
      <Reward
        photo={capturedImage}
        resultTxt={finalResult.rc}
        domRef={domRef}
      />
    </>
  );
};

export default Photo;
