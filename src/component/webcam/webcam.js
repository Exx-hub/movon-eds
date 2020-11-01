import React from 'react'
import Webcam from 'react-webcam';
import {Button} from 'antd';
import './webcam.scss'


const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

function WebCam(props){
    const webcamRef = React.useRef(null);
    const [isDisableCam,setDisableCam] = React.useState(false)
    const capture = React.useCallback(
      () => {
        const imageSrc = webcamRef.current.getScreenshot();
        props.onCapture(imageSrc)
        return () => {
          setDisableCam(true)
       }
      },
      [webcamRef,props]
    );
  
    return (
      <div className="component-webcam">
        {
            props.image ? 
                <div className="photo-img-container">
                    <img className='photo-img' src={props.image} alt="Package snapshot (reference for the package)" />
                </div> :
                <div className="photo-webcam-container">
                {
                  !isDisableCam && <Webcam
                  audio={false}
                  height={400}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={400}
                  videoConstraints={videoConstraints}
                  />
                }
                    
                </div>

        }  
        <div>
            <Button onClick={()=>{props.image ? props.onCapture(null) : capture()}}>{props.image ? "Retake photo" : "Capture photo"}</Button>
        </div>
      </div>
    );
}

export default WebCam;
