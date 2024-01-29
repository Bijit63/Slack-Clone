import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BsInfoCircle } from 'react-icons/bs';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import { useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import './Styles/PersonalChat.css'
import { Context } from '../Context/NoteContext';

const PersonalChat = ({}) => {
  
  const messageContainerRef = useRef(null);

    const context = useContext(Context)
    const {user} = context

    let { channelId } = useParams();
    const [ messages, setMessages ] = useState([])
    const [ channel, setchannel ] = useState({})



    const getMessages = () => {
        db.collection('personalMessages')
        .doc(channelId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot)=>{
          let messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setMessages(messages);
          console.log(messages)
        })
    }

    const applyStyles = () => {
      if (messageContainerRef.current) {
        messageContainerRef.current.style.flexDirection = 'column-reverse';
  
      }
    };

    useEffect(()=>{
      applyStyles();
    }, [messages])




    // Function to send a message in a personal chat room
const sendMessage = async (text) => {
    try {
      const messageRef = db.collection('personalMessages').doc(channelId).collection('messages');
      await messageRef.add({
        text: text,
        timestamp: firebase.firestore.Timestamp.now(),
        user: user.name,
        userImage: user.photo,
        userID:user.uid,
        reactionCount:[],
        reactions:[]
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

 
  const getChannel = () => {
    db.collection('personalMessages')
    .doc(channelId)
    .onSnapshot((snapshot)=>{
        const filteredIds = snapshot.data().users.filter(userId => userId !== user.uid);
       

      db.collection('userlists').doc(filteredIds[0])
    .get()
    .then((userSnapshot) => {
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        setchannel(userData);
      
      } else {
        console.log('User not found');
        return null;
      }
    })
        
      })
      
}


useEffect(()=>{ 
    getChannel();
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
                <img src={channel.photo} alt="" />
                <p>{channel.name}</p>
            </div>
        </div>
        </div>

           <div class="pmessage-container" ref={messageContainerRef}>
                {
                    messages.length > 0 &&
                    messages.map((data, index)=>(
                        <ChatMessage
                            key={data.id}
                            uid={data.userID}
                            text={data.text}
                            name={data.user}
                            image={data.userImage}
                            timestamp={data.timestamp}
                            PersonalChat={true}
                            messageId={data.id}
                            channelId={channelId}
                            reactionCount={data.reactionCount}
                            reactions={data.reactions}
                        />
                    ))
                }
            </div>
            <ChatInput sendMessage={sendMessage} PersonalChat={true} />
            </div>
  )
}

export default PersonalChat;


