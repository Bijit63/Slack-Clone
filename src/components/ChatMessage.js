import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import firebase from 'firebase/compat/app';
import db from '../firebase';
import './Styles/ChatMessage.css'
import { Context } from '../Context/NoteContext';
import { useNavigate } from 'react-router-dom';

function ChatMessage({ text, name, image, timestamp,uid,messageId,PersonalChat }) {
    
    const context = useContext(Context)
    const {user,usersChatRooms,setusersChatRooms}=context
    const navigate = useNavigate()

    const [activemessageID, setactivemessageID] = useState()

    
    const checkOrCreateChatRoom = async (user1ID, user2ID,name,image) => {


        if((user1ID!==user2ID) && (user.role==='admin' || user.role==='manager'))
        {
            
        const users = [user1ID, user2ID];
        users.sort();
        
        
  
        try {
          const roomQuery = await db
            .collection('personalMessages')
            .where('users', '==', users)
            .get();
  
          if (!roomQuery.empty) {
            // Chat room already exists
            const room = roomQuery.docs[0];
            navigate(`/personalroom/${room.id}`)
          } else {
            // Create a new chat room
            const newRoomRef = await db.collection('personalMessages').add({
              users,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            navigate(`/personalroom/${newRoomRef.id}`)
          }
        } catch (error) {
          console.error('Error checking or creating chat room:', error);
        }
    }


      };



      const mouseenter = ()=>{
        setactivemessageID(messageId)
      }

      const mouseexit= ()=>{
        setactivemessageID()
      }



    return (
        <div className={`${user.uid===uid?'container-ownchatmessage':"container-chatmessage"} `}>
        <div className="user-avatar" onMouseEnter={()=>{mouseenter()}} onMouseLeave={()=>{mouseexit()}} >
            <img src={image}  />

            <div onClick={()=>{checkOrCreateChatRoom(uid,user.uid,name,image)}} className={`${uid!==user.uid?activemessageID===messageId?PersonalChat!==true?"gotochat":"gotochathide":"gotochathide":"gotochathide"} `}>
              Go to Chat
            </div>
        </div>
        <div className="message-content">
            <span className={`${user.uid===uid?'nameown':"name"} `}>
                {name}
                <span>{new Date(timestamp.toDate()).toLocaleString('en-IN',{
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric',
    // timeZoneName: 'short',
    // timeZone: 'Asia/Kolkata',
  })}</span>
            </span>
            <span className="text">
                {text}
            </span>
        </div>
    </div>
    )
}

export default ChatMessage




