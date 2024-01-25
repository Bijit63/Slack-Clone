import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';
import { sidebarItemsData } from '../data/SidebarData'
import db from '../firebase'
import {  useLocation, useNavigate } from 'react-router-dom'
import './Styles/Sidebar.css'
import { BsPeople } from 'react-icons/bs';
import { Context } from '../Context/NoteContext';
import firebase from 'firebase/compat/app';
import { BsGrid1X2Fill } from 'react-icons/bs';


function Sidebar(props) {

    

    const context = useContext(Context);

    const {usersChatRooms,rooms,user,admin } = context ;


    const navigate = useNavigate();
    
    const goToChannel = (id) => {
        if(id){
            navigate(`/room/${id}`)
        }

    }


    const goToDM = (id)=>{
        
        if(id){
            navigate(`/personalroom/${id}`)
        }
    }


    const addChannel = () => {
        const promptName = prompt("Enter channel name");
        if (promptName) {

            const alladmins = []

            admin.forEach(adminData => {
                alladmins.push({
                    userid: adminData.userId,
                    isRestricted: false,
                    joinTime: firebase.firestore.Timestamp.now(),
                });
            });

           
                db.collection('rooms').add({
                name: promptName,
                Creater: user.uid,
                members: [
                  {
                    userid: user.uid,
                    isRestricted: false,
                    joinTime:firebase.firestore.Timestamp.now(),
                  },
                  ...alladmins
                ]
              })

            
            
          }
    }

    return (
        <div className="container-sidebar">
        <div className="workspace-container-sidebar">
        <div className="name-sidebar">
                Chat n Task
            </div>

                <div className="new-message-sidebar">
                    <IoIosAddCircleOutline  />
                </div>
            </div>

            <div className='scroll-sidebar' >

            <div className="main-channels-sidebar">
                {
                    sidebarItemsData.map(item => (
                        <div key={item.text} className='main-channel-item-sidebar'>
                            {item.icon}
                            {item.text}
                            
                        </div>
                    ))
                }
                <div className='main-channel-item-sidebar' onClick={()=>{navigate('/Task')}} >
                    <BsGrid1X2Fill/>
                    Task
                </div>
                <div className='main-channel-item-sidebar' onClick={()=>{navigate('/Users')}} >
                    <BsPeople/>
                    UserList
                </div>
            </div>
            <div className="channels-container-sidebar">
                <div className="new-channel-container-sidebar ">
                    <div className='channel-header'>
                        Channels
                    </div>

                    {
                        user.role==='admin' ?
                        <FaPlus onClick={addChannel} /> :
                        user.role==='manager'?
                        <FaPlus onClick={addChannel} /> :
                        ''
                    }
                </div>
                <div className="channels-list-sidebar">
                    {
                        rooms.map(item => (
                            <div key={item.id} className='channel-sidebar' onClick={()=>goToChannel(item.id)}>
                                {item.name}
                            </div>
                        ))
                    }
                </div>
            </div>

            
            <div className="channels-container-sidebar">
                <div className="new-channel-container-sidebar">
                    <div>
                        Personal Messages
                    </div>
                </div>
                <div className="channels-list-sidebar">
                    {
                        usersChatRooms.map(item => (
                            <Channel onClick={()=>goToDM(item.roomId)}>
                                {item.otherUserName}
                            </Channel>
                        ))
                    }
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default Sidebar





const Channel = styled.div`
    height: 28px;
    display: flex;
    align-items: center;
    padding-left: 19px;
    cursor: pointer;
    :hover {
        background: #350D36;
    }
`
