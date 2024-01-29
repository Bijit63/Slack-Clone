import React, { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { RiErrorWarningFill} from 'react-icons/ri';
import { IoWarning } from 'react-icons/io5';
import { useContext } from 'react';
import { Context } from '../Context/NoteContext';
import './Styles/ChatnTaskLoader.css'
import { AiFillWarning } from "react-icons/ai";
import logo from '../Images/UA_Logo.png'

const ChatnTaskLoader = () => {

    const context=useContext(Context);
  const {Loader,setLoader}=context;
  

//   if (!Loader) {
//     return null; 
//   }


  return (
    <div className={`${Loader?'Loader-container':'hidecontainer'}`} >
    
    <div className='Loader-box'>

        <img src={logo}  alt="" />
        <div id="loader-container">
        <div id="infinite-loader">
          <div id="bar"></div>
        </div>
    </div>
       
        <div className='Loader-head'>Chat Sphere</div>


        



    </div>

    </div>
  )
}

export default ChatnTaskLoader