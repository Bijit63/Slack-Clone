import React, { useContext, useEffect, useState } from 'react'
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
import { Context } from '../Context/NoteContext';


function Chat({  }) {

  const context = useContext(Context)
  const {alert,user,rooms } = context;

  const navigate = useNavigate()
  

  let { channelId } = useParams();
  const [ channel, setChannel ] = useState();
  const [ messages, setMessages ] = useState([])
  const [ Manager, setManager ] = useState(false)

  const [ newusers, setnewusers ] = useState([])
  const [ existingusers, setexistingusers ] = useState([])
  const [ Restricted, setRestricted ] = useState(true)
  


  const deletechannel = async ()=>{
    if(user.role==='admin' || user.role==='manager')
    {
      
    const roomRef = db.collection('rooms').doc(channelId);
    roomRef.delete()
    .then(() => {
      console.log(`Room ${channelId} deleted successfully`);
      alert('danger','Channel deleted')
    })
    .catch((error) => {
      console.error('Error deleting room:', error);
    });
    navigate('/')

  }
  else{
    alert('warning',"You don't have the access to delete this Channel")
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
        .onSnapshot((snapshot) => {
            let messages = snapshot.docs.map((doc) => ({
                id: doc.id, // Get the document ID
                ...doc.data() // Get the document data
            }));
            setMessages(messages);
        });
};


    const sendMessage = (text) => {
        if(channelId){
            let payload = {
                text: text,
                timestamp: firebase.firestore.Timestamp.now(),
                user: user.name,
                userImage: user.photo,
                userID:user.uid
            }
            db.collection("rooms").doc(channelId).collection('messages').add(payload);
        }
    }

    const getChannel = () => {
        db.collection('rooms')
        .doc(channelId)
        .onSnapshot((snapshot)=>{
            setChannel(snapshot.data());

            // const existingMembers = snapshot.data().members || [];

            // TO GET THE MEMBERS OF THE CHANNEL 
            fetchUsernamesAndIds(snapshot.data().members)
            // TO GET THE MEMBERS OF THE CHANNEL 


            const targetUser = snapshot.data().members.find(userr => userr.userid === (user && user.uid));
            if(targetUser)
            {
               setRestricted(targetUser.isRestricted)
            }
          })
          
    }

    

    useEffect(()=>{
        getChannel();
        getMessages();
    }, [channelId,user])





    const fetchUsernamesAndIds = async (members)=>{
      const existingMembers = members || [];
                
      const usersSnapshot = await db.collection('userlists').get();
      
      const newusersData = [];
      const existingusersData = [];
      usersSnapshot.forEach((doc) => {

        const userId = doc.id;
        const username = doc.data().name;
        const image = doc.data().photo; 
        const role = doc.data().role;
                      
        const targetUser = existingMembers.find(user => user.userid === userId);
     
        if (!targetUser) {
          const userData = {
            uid: userId,
            username: username,
            image:image,
            role:role
          };
          newusersData.push(userData);
        }
        else{
          const userData = {
            uid: userId,
            username: username,
            image:image,
            role:role,
            isRestricted:targetUser.isRestricted
          };
          existingusersData.push(userData);
          
        }
      });
      
    setnewusers(newusersData);
    setexistingusers(existingusersData);
    }

    // useEffect(() => {
    //     const fetchUsernamesAndIds = async () => {
    //         try {
    //             const roomSnapshot = await db.collection('rooms').doc(channelId).get();

    //             const roomData = roomSnapshot.data();
                
    //             const existingMembers = roomData.members || [];
                
    //             const usersSnapshot = await db.collection('userlists').get();
                
    //             const newusersData = [];
    //             const existingusersData = [];
    //             usersSnapshot.forEach((doc) => {

    //               const userId = doc.id;
    //               const username = doc.data().name;
    //               const image = doc.data().photo; 
    //               const role = doc.data().role;
                                
    //               const targetUser = existingMembers.find(user => user.userid === userId);
               
    //               if (!targetUser) {
    //                 const userData = {
    //                   uid: userId,
    //                   username: username,
    //                   image:image,
    //                   role:role
    //                 };
    //                 newusersData.push(userData);
    //               }
    //               else{
    //                 const userData = {
    //                   uid: userId,
    //                   username: username,
    //                   image:image,
    //                   role:role,
    //                   isRestricted:targetUser.isRestricted
    //                 };
    //                 existingusersData.push(userData);
                    
    //               }
    //             });
                
    //           setnewusers(newusersData);
    //           setexistingusers(existingusersData);
              
    //         } catch (error) {
    //           console.error('Error fetching usernames and IDs:', error);
    //           return [];
    //         }
    //       };
    //       fetchUsernamesAndIds();
    // }, [channelId,user])














    const adduser = ( newMemberId,role) => {
      const roomRef = db.collection('rooms').doc(channelId);
      const restricted = role==='admin' || role === 'manager'
      
      roomRef.update({
        members: firebase.firestore.FieldValue.arrayUnion({
          userid: newMemberId,
          isRestricted: !restricted
        })
      })
      .then(() => {
        console.log(`New member ${newMemberId} added to room ${channelId}`);
      })
      .catch((error) => {
        console.error('Error adding new member to room:', error);
      });
    };
    




   



    // TO ADD MANAGERS 

    
    const addmanager = (userID)  =>{

            if (user.role==='admin' || user.role==='manager') {
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
      
        if (user.role==='admin' || user.role==='manager') {
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
                            key={data.id}
                            uid={data.userID}
                            text={data.text}
                            name={data.user}
                            image={data.userImage}
                            timestamp={data.timestamp}
                            messageId={data.id}
                        />
                    ))
                }
            </div>
            <ChatInput sendMessage={sendMessage} 
            Restricted={Restricted} 
            />

            <ChatSideBar channelId={channelId} translateX={translateX} existingusers={existingusers} setexistingusers={setexistingusers}
            setnewusers={setnewusers} adduser={adduser} newusers={newusers} setTranslateX={setTranslateX} deletechannel={deletechannel} />
            </div>


    )
}

export default Chat;
