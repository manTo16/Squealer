import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import Webcam from "react-webcam";

import useAutoFocus from '@hooks/useAutoFocus';

import InputGroup from 'react-bootstrap/InputGroup';
import { convertToBase64 } from '../../utils';
import Form from 'react-bootstrap/Form';
import IconCamera from "@components/svg/CameraSvg";

import TestGeolocation from '@components/Geolocation/Geolocation';
import Button from 'react-bootstrap/Button';
import PasteImageComponent from './PasteImage';

interface CardBodyProps {
  type: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; // Usa onInputChange invece di handleInputChange
  charCount: number;
  textLines: number;
  Dchar: number;
  txtReadOnly: boolean;
  receiversOnlyUsers: boolean;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export default function CardBody({
  type,
  onInputChange,
  charCount,
  textLines,
  Dchar,
  txtReadOnly,
  receiversOnlyUsers
}: CardBodyProps) {


  const textInput = useAutoFocus();

  const handleImageUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const file = e.target.files[0];
    const convertedImage: any = await convertToBase64(file)
    console.log(convertedImage)
    // setUserImage(convertedImage)
    onInputChange({ target: { value: convertedImage } } as React.ChangeEvent<HTMLTextAreaElement>);
  }

  const handleVideoUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) return;
    const file = e.target.files[0];
    const convertedVideo: any = await convertToBase64(file)
    console.log(convertedVideo.slice(0,100))
    // setUserImage(convertedImage)
    onInputChange({ target: { value: convertedVideo } } as React.ChangeEvent<HTMLTextAreaElement>);
  }

  const [imageSrc, setImageSrc] = useState(''); 


  const webcamRef = React.useRef<Webcam | null>(null);

  const capture = React.useCallback(() => {
      const image = webcamRef.current?.getScreenshot() ?? ''
      setImageSrc(image);
      console.log("IMAGESOURCE", imageSrc);
      console.log("debug capture type: ", type)
      onInputChange({ target: { value: image, style: {lineHeight: '0px'} } } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [webcamRef, type]);

  const reset = () => {
    setImageSrc('');
  }


  const charState = receiversOnlyUsers ? 'info' : charCount < Dchar ? 'light' : charCount == Dchar ? 'warning' : 'danger';

  useEffect(() => {
    console.log("debug dentro cardbody type: ", type)
  }, [type])

  if (type === 'txt') {
    return (
      <>
      <Form.Label>{txtReadOnly ? ("Quota caratteri finita!") : ("Scrivi il tuo squeal")}</Form.Label>
      <InputGroup>
        {/* <Button variant={charState}>
          {charCount}/{Dchar}
        </Button>      */}
        <Form.Control 
          as="textarea" 
          readOnly={txtReadOnly}
          autoFocus
          aria-label="With textarea" 
          className="shareInput bg-dark text-white"
          placeholder={txtReadOnly ? "Quota caratteri finita!" : "Squillo calde nei paraggi"}
          onChange={onInputChange}
          rows={textLines}
          // maxLength={Dchar}
        />
      </InputGroup>
      </>
    );
  } else if (type === 'pst') {
    return (
      <>
        <PasteImageComponent
          onImagePaste={(image: string) => {
            onInputChange({ target: { value: image } } as ChangeEvent<HTMLTextAreaElement>);
          }}
          onChange={onInputChange}
        />
      </>
    );
  } else if (type === 'upl') {
    return (
      <Form.Group controlId="formFileMultiple" className="mb-3">
      <Form.Label>Carica una foto profilo</Form.Label>
      <Form.Control 
        type="file" 
        accept=".jpeg, .png, .jpg"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e)}
      />
      </Form.Group>
    );
  } else if (type === 'cmr') {
    return (
      <>
        <div style={{ width: '100%', height: 'auto' }}>
          {
            imageSrc !== '' ? 
            ( 
              <div className='d-flex flex-column aling-items-center justify-content-center'>
                <img src={imageSrc} alt="" />
                {/* <div className=""> */}
                  <Button className="mt-2" variant='danger' onClick={reset}>Reset</Button>
                {/* </div> */}
              </div> 
            ) : (
              <div className='d-flex flex-column aling-items-center justify-content-center'>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  // className='rounded'
                  style={{
                    // position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    // height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  videoConstraints={videoConstraints}
                />
                {/* <div className="d-flex align-items-center justify-content-center"> */}
                  <Button className="mt-2" variant='success' onClick={capture}><IconCamera/></Button>
              </div>
            )
          }        
          
          
        </div>
      </>
    );
  } else if (type === 'mp4') {
    return (
      <Form.Group controlId="formFileMultiple" className="mb-3">
        <Form.Label>Select Video(s)</Form.Label>
        <Form.Control 
          type="file" 
          multiple 
          accept="video/*" // Accetta solo file video MP4
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleVideoUpload(e)}
        />
      </Form.Group>
    );
  } else if (type === 'gps') {
    return <TestGeolocation onChange={onInputChange} />;
  } else {
    return null;
  }
}