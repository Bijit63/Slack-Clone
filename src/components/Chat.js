import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BsInfoCircle } from 'react-icons/bs';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import { useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import { BsPlus } from 'react-icons/bs';
import './Styles/Chat.css'

function Chat({ user }) {

    let { channelId } = useParams();
    const [ channel, setChannel ] = useState();
    const [ messages, setMessages ] = useState([])
    const [ Owner, setOwner ] = useState(false)
    const [ Manager, setManager ] = useState(false)

    const [ users, setusers ] = useState([])
    

    const getMessages = () => {
        db.collection('rooms')
        .doc(channelId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot)=>{
            let messages = snapshot.docs.map((doc)=>doc.data());
            setMessages(messages);
        })
    }


    const sendMessage = (text) => {
        if(channelId){
            let payload = {
                text: text,
                timestamp: firebase.firestore.Timestamp.now(),
                user: user.name,
                userImage: user.photo,
                userID:JSON.parse(localStorage.getItem('user')).uid
            }
            db.collection("rooms").doc(channelId).collection('messages').add(payload);
        }
    }

    const getChannel = () => {
        db.collection('rooms')
        .doc(channelId)
        .onSnapshot((snapshot)=>{
            setChannel(snapshot.data());
        })
    }

    

    useEffect(()=>{
        checkIfUserIsOwner(channelId, JSON.parse(localStorage.getItem('user')).uid)
        getChannel();
        getMessages();
    }, [channelId])



    useEffect(() => {
        const fetchUsernamesAndIds = async () => {
            try {
                const roomSnapshot = await db.collection('rooms').doc(channelId).get();

                const roomData = roomSnapshot.data();
                const existingMembers = roomData.members || [];
                
                const usersSnapshot = await db.collection('userlists').get();
                
                const usersData = [];
                usersSnapshot.forEach((doc) => {
                  const userId = doc.id;
                  const username = doc.data().name;
                
                  // Check if the user is not already a member of the room
                  if (!existingMembers.includes(userId)) {
                    const userData = {
                      userId: userId,
                      username: username
                    };
                    usersData.push(userData);
                  }
                });
                
          
              console.log('Usernames and IDs:');
              setusers(usersData);
            } catch (error) {
              console.error('Error fetching usernames and IDs:', error);
              return [];
            }
          };
          fetchUsernamesAndIds();
    }, [])






    // to check if it is owner 
    const checkIfUserIsOwner = async (roomId, userId) => {
        try {
          const roomSnapshot = await db.collection('rooms').doc(roomId).get();
      
          if (roomSnapshot.exists) {
            const roomData = roomSnapshot.data();
            const owner = roomData.owner;
            const existingManagers = roomData.managers || [];

            if(owner ===userId)
            {
                setOwner(true)

                if (existingManagers.includes(userId)) {
                    
                    setManager(true)
                  }
                
            }
            else{
                setOwner(false)
                
                if (existingManagers.includes(userId)) {
                    
                    setManager(false)
                  }
                

            }
          } else {
            console.log('Room not found');
            setOwner(false)
          }
        } catch (error) {
          console.error('Error checking if user is owner:', error);
          return false;
        }
      };

    // to check if it is owner 








    const adduser = (userID)  =>{
        

            if (Owner) {
                const roomRef = db.collection('rooms').doc(channelId);
                
    roomRef.update({
      members: firebase.firestore.FieldValue.arrayUnion(userID)
    })
    .then(() => {
      console.log(`User ${userID} added to room ${channelId}`);
    })
    .catch((error) => {
      console.error('Error adding user to room:', error);
    });

            } else {
              console.log('User is not the owner of the room');
            }
    }




    // TO REMOVE THE USER 

    const removeUser = (channelId, userId) => {
        const roomRef = db.collection('rooms').doc(channelId);
      
        if (Owner) {
          roomRef.update({
            members: firebase.firestore.FieldValue.arrayRemove(userId)
          })
          .then(() => {
            console.log(`User ${userId} removed from room ${channelId}`);
          })
          .catch((error) => {
            console.error('Error removing user from room:', error);
          });
        } else {
          console.log('User is not the owner of the room');
        }
      };

    // TO REMOVE THE USER 



    // TO ADD MANAGERS 

    
    const addmanager = (userID)  =>{

            if (Owner) {
                const roomRef = db.collection('rooms').doc(channelId);
                
    roomRef.update({
      managers: firebase.firestore.FieldValue.arrayUnion(userID)
    })
    .then(() => {
      console.log(`User ${userID} added to room ${channelId}`);
    })
    .catch((error) => {
      console.error('Error adding user to room:', error);
    });

            } else {
              console.log('User is not the owner of the room');
            }
    }


    // TO ADD MANAGERS 
    


    
    // TO REMOVE THE MANAGER 

    const removeManager = (channelId, userId) => {
        const roomRef = db.collection('rooms').doc(channelId);
      
        if (Owner) {
          roomRef.update({
            managers: firebase.firestore.FieldValue.arrayRemove(userId)
          })
          .then(() => {
            console.log(`User ${userId} removed from room ${channelId}`);
          })
          .catch((error) => {
            console.error('Error removing user from room:', error);
          });
        } else {
          console.log('User is not the owner of the room');
        }
      };

    // TO REMOVE THE MANAGER 




    

    return (
      <div class="container-chat">
      <div class="header">
          <div class="channel">
              <div class="channel-name">
                  You are in Channel - { channel && channel.name}
              </div>
              <div class="channel-info">
                  Company-wide announcements and work-based matters
              </div>
          </div>
          <div class="usernames-container">
          <div className='username-container-p'>
            Add Users 
          </div>
    {
        users.map((u, index) => (
            <div className='username-container-p' onClick={()=>{adduser(u.userId)}} key={index}>{u.username}
            </div>
        ))
    }
 </div>
        </div>
        <div class="message-container">
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

export default Chat;
