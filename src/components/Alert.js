import React, { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { RiErrorWarningFill} from 'react-icons/ri';
import { IoWarning } from 'react-icons/io5';
import { useContext } from 'react';
import { Context } from '../Context/NoteContext';
import './Styles/Alert.css'

const Alert = () => {

    const context=useContext(Context);
  const {alerttype,alertmessage,showAlert,setShowAlert}=context;
  const handleDismiss = () => {
    setShowAlert(false);
  };

  if (!showAlert) {
    return null; 
  }


  return (
    <div id='alert' className='alert-container' >
    
    <div className={`${alerttype==='warning'?'alert-warning':alerttype==='danger'?'alert-danger':'alert-success'}  alert-box `}>

      <div className="alert-text">

    {
      alerttype==='success'?<FaCheckCircle className={`icon-success`} />:alerttype==='warning'?<RiErrorWarningFill className={`icon-warning`} />:      
      <RiErrorWarningFill className={`icon-danger`} />
    }
        

        
        <span className={`${alerttype==='warning'?'text-warning':alerttype==='danger'?'text-danger':'text-success'}  alert-message `}>{alertmessage}</span>
      </div>

      <div
        onClick={handleDismiss}
        className="alert-button"
      >
        <FaTimes size={20} />
      </div>
    </div></div>
  )
}

export default Alert