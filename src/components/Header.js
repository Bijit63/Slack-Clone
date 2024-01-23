import React, { useContext } from 'react'
import styled from 'styled-components'
import { MdAccessTime } from 'react-icons/md';
import { BsQuestionCircle } from 'react-icons/bs';
import { Context } from '../Context/NoteContext';
import { RiLogoutBoxRLine } from "react-icons/ri";
import './Styles/Header.css'


function Header({setcUser,cuser}) {

    const context = useContext(Context)
  
  const {user,signOut} = context

  const clickedOut = ()=>{
    setcUser();
    signOut();
  }


    return (
        <div className='header-container'>
            
            <div className='userheader'>
                <div className='userheader-name'>
                    {user.name}
                </div>
                <div className='userheader-image'  >
                    <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png" } />
                </div>

                <RiLogoutBoxRLine className='logout' onClick={()=>{clickedOut()}} />
            </div>
        </div>
    )
}

export default Header





