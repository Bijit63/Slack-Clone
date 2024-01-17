import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BsInfoCircle } from 'react-icons/bs';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import { useNavigate, useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import { BsPlus } from 'react-icons/bs';
import './Styles/Chat.css'
import { MdMoreHoriz } from 'react-icons/md';
import { IoMdMore } from 'react-icons/io';
import ChatSideBar from './ChatSideBar';


function Chat({ user }) {

  const navigate = useNavigate()
  

  let { channelId } = useParams();
  const [ channel, setChannel ] = useState();
  const [ messages, setMessages ] = useState([])
  const [ Owner, setOwner ] = useState(false)
  const [ Manager, setManager ] = useState(false)

  const [ newusers, setnewusers ] = useState([])
  const [ existingusers, setexistingusers ] = useState([])
  


  const deletechannel = async ()=>{
    if(Owner)
    {
      
    const roomRef = db.collection('rooms').doc(channelId);
    roomRef.delete()
    .then(() => {
      console.log(`Room ${channelId} deleted successfully`);
    })
    .catch((error) => {
      console.error('Error deleting room:', error);
    });
    navigate('/')

  }
  }
    
  const [translateX, setTranslateX] = useState(1800);

  const handleTranslateClick = () => {
    setTranslateX(0); // Adjust the translation amount as needed
  };


    

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
                console.log(existingMembers)
                
                const usersSnapshot = await db.collection('userlists').get();
                
                const newusersData = [];
                const existingusersData = [];
                usersSnapshot.forEach((doc) => {
                  const userId = doc.id;
                  const username = doc.data().name;
                  const image = doc.data().photo; 
                  const role = doc.data().role; 
                                
                  
                  if (!existingMembers.includes(userId)) {
                    const userData = {
                      userId: userId,
                      username: username,
                      image:image,
                      role:role
                    };
                    newusersData.push(userData);
                  }
                  else{

                    const userData = {
                      userId: userId,
                      username: username,
                      image:image,
                      role:role
                    };
                    existingusersData.push(userData);
                    
                  }
                });
                
                console.log(newusersData)
              setnewusers(newusersData);
              setexistingusers(existingusersData);
              
            } catch (error) {
              console.error('Error fetching usernames and IDs:', error);
              return [];
            }
          };
          fetchUsernamesAndIds();
    }, [channelId])






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
            <div>
              <div class="channel-name">
                  You are in Channel - { channel && channel.name}
              </div>
              <div class="channel-info">
                  Company-wide announcements and work-based matters
              </div>
            </div>

            <div className="more-chat" onClick={()=>{handleTranslateClick()}}>
      <IoMdMore className='more-chat-icon'/>
            </div>

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

            <ChatSideBar translateX={translateX} existingusers={existingusers} setexistingusers={setexistingusers}
            setnewusers={setnewusers} adduser={adduser} newusers={newusers} setTranslateX={setTranslateX} deletechannel={deletechannel} />
            </div>


    )
}

export default Chat;
