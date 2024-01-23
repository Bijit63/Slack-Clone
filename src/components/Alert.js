import React, { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { RiErrorWarningFill} from 'react-icons/ri';
import { IoWarning } from 'react-icons/io5';
import { useContext } from 'react';
import { Context } from '../Context/NoteContext';
import './Styles/Alert.css'
import { AiFillWarning } from "react-icons/ai";

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
    <div id='alert' className={`${alerttype==='normal'?'alert-normal-container':'alert-container'}`} >
    
    <div className={`${alerttype==='warning'?'alert-warning  alert-box ':alerttype==='danger'?'alert-danger alert-box ':alerttype==='success'?'alert-success alert-box ':'alert-normal'} `}>

      <div className="alert-text">

    <span className='alert-icon'>

    {
      alerttype==='success'?<FaCheckCircle className={`icon-success`} />:
      alerttype==='warning'?<AiFillWarning className={`icon-warning`} />:      
      alerttype==='danger'?<RiErrorWarningFill className={`icon-danger`} />:      
      <AiFillWarning className={`icon-danger`} />
    }
    </span>
        

        
        <span className={`${alerttype==='warning'?'text-warning':alerttype==='danger'?'text-danger':alerttype==='success'?'text-success':'text-normal'}  alert-message `}>{alertmessage}</span>

      </div>

      {/* <div
        onClick={handleDismiss}
        className={`${alerttype==='normal'?"hide-button":"alert-button"}`}
      >
        <FaTimes size={20} />
      </div> */}
    </div>
    </div>
  )
}

export default Alert