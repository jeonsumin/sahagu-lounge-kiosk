import React, { useRef } from 'react';
import Webcam from 'react-webcam';

interface IWebcamControlProps {
  onCapture: (imageSrc: string) => void;
  webcamRef: React.RefObject<Webcam>;
}

const WebcamControl = ({ webcamRef }:IWebcamControlProps) => {
  return (
    <div className="preview">
      <Webcam 
        audio={false} 
        ref={webcamRef} 
        screenshotFormat="image/jpeg"
        screenshotQuality={3}
        className="webcam-preview" 
      />
    </div>
  ); 
};

export default WebcamControl;
