import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BsInfoCircle } from 'react-icons/bs';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import { useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import './Styles/PersonalChat.css'

const PersonalChat = ({user}) => {

    let { channelId } = useParams();
    const [ messages, setMessages ] = useState([])



    const getMessages = () => {
        db.collection('personalMessages')
        .doc(channelId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot)=>{
            let messages = snapshot.docs.map((doc)=>doc.data());
            setMessages(messages);
        })
    }



    // Function to send a message in a personal chat room
const sendMessage = async (text) => {
    try {
      const messageRef = db.collection('personalMessages').doc(channelId).collection('messages');
      await messageRef.add({
        text: text,
        timestamp: firebase.firestore.Timestamp.now(),
        user: user.name,
        userImage: user.photo,
        userID:JSON.parse(localStorage.getItem('user')).uid
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

 



useEffect(()=>{ 
    getMessages();
}, [channelId])




    
  return (
    <div class="container-pchat">
    <div class="header">
        <div class="pchannel">
            <div class="pchannel-name">
                {/* You are in Channel - { channel && channel.name} */}
            </div>
            <div class="pchannel-info">
                Personal Chat
            </div>
        </div>
        </div>

           <div class="pmessage-container">
                {
                    messages.length > 0 &&
                    messages.map((data, index)=>(
                        <ChatMessage
                            uid={data.userID}
                            text={data.text}
                            name={data.user}
                            image={data.userImage}
                            timestamp={data.timestamp}
                        />
                    ))
                }
            </div>
            <ChatInput sendMessage={sendMessage} />
            </div>
  )
}

export default PersonalChat;


