import React, { useContext } from 'react'
import styled from 'styled-components'
import firebase from 'firebase/compat/app';
import db from '../firebase';
import './Styles/ChatMessage.css'
import { Context } from '../Context/NoteContext';

function ChatMessage({ text, name, image, timestamp,uid }) {
    
    const context = useContext(Context)
    const {user}=context
    const checkOrCreateChatRoom = async (user1ID, user2ID) => {

        if(user1ID!==user2ID)
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
            console.log('already exist',room.id);
          } else {
            // Create a new chat room
            const newRoomRef = await db.collection('personalMessages').add({
              users,
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('new created',newRoomRef.id);
          }
        } catch (error) {
          console.error('Error checking or creating chat room:', error);
        }
    }
    else{
        console.log('sameuser')
    }
      };




    return (
        <div className={`${user.uid===uid?'container-ownchatmessage':"container-chatmessage"} `}>
        <div className="user-avatar">
            <img src={image} onClick={()=>{checkOrCreateChatRoom(uid,user.uid)}} />
        </div>
        <div className="message-content">
            <span className={`${user.uid===uid?'nameown':"name"} `}>
                {name}
                <span>{new Date(timestamp.toDate()).toUTCString()}</span>
            </span>
            <span className="text">
                {text}
            </span>
        </div>
    </div>
    )
}

export default ChatMessage




