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

function Sidebar(props) {

    

    const context = useContext(Context);

    const {usersChatRooms,rooms } = context ;


    const navigate = useNavigate();
    const [ownerID, setownerID] = useState(JSON.parse(localStorage.getItem('user')).uid)

    const goToChannel = (id) => {
        if(id){
            console.log(id);
            navigate(`/room/${id}`)
        }
    }


    const goToDM = (id)=>{
        
        if(id){
            console.log(id);
            navigate(`/personalroom/${id}`)
        }
    }


    const addChannel = () => {
        const promptName = prompt("Enter channel name");
        if(promptName){
            db.collection('rooms').add({
                name: promptName,
                restricted : true,
                owner : ownerID,
                members:[ownerID],
                managers : [ownerID]
            })
        }
    }

    return (
        <div className="container-sidebar">
        <div className="workspace-container-sidebar">
        <div className="name-sidebar">
                UA-Slack-App
            </div>

                <div className="new-message-sidebar">
                    <IoIosAddCircleOutline  />
                </div>
            </div>
            <div className="main-channels-sidebar">
                {
                    sidebarItemsData.map(item => (
                        <div className='main-channel-item-sidebar'>
                            {item.icon}
                            {item.text}
                        </div>
                    ))
                }
                <div className='main-channel-item-sidebar' onClick={()=>{navigate('/Users')}} >
                    <BsPeople/>
                    UserList
                </div>
            </div>
            <div className="channels-container-sidebar">
                <div className="new-channel-container-sidebar ">
                    <div>
                        Channels
                    </div>
                    <FaPlus onClick={addChannel} />
                </div>
                <div className="channels-list-sidebar">
                    {
                        rooms.map(item => (
                            <div className='channel-sidebar' onClick={()=>goToChannel(item.id)}>
                                # {item.name}
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
