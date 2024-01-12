import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { BsInfoCircle } from 'react-icons/bs';
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import db from '../firebase'
import { useParams } from 'react-router-dom'
import firebase from 'firebase/compat/app';
import { BsPlus } from 'react-icons/bs';

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
        <Container>
            <Header>
                <Channel>
                    <ChannelName>
                        You are in Channel  - { channel && channel.name}
                    </ChannelName>
                    <ChannelInfo>
                    Company-wide announcements and work-based matters
                    </ChannelInfo>
                </Channel>

                <Usernamescontainer>
    {
        users.map((u, index) => (
            <Usernamescontainerp onClick={()=>{adduser(u.userId)}} key={index}>{u.username}
            </Usernamescontainerp>

        ))
    }
</Usernamescontainer>
            </Header>
            <MessageContainer>
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
            </MessageContainer>
            <ChatInput sendMessage={sendMessage} />
        </Container>

    )
}

export default Chat;

const Container = styled.div`
    display: grid;
    grid-template-rows: 64px auto min-content;
    min-height: 0;
`

const Channel = styled.div``

const ChannelDetails = styled.div`
    display: flex;
    align-items: center;
    color: #606060;
`

const ChannelName = styled.div`
    font-weight: 700;
`

const ChannelInfo = styled.div`
    font-weight: 400;
    color: #606060;
    font-size: 13px;
    margin-top: 8px;
`

const Info = styled(BsInfoCircle)`
    margin-left: 10px;
`

const Header = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(83, 39, 83,.13);
    justify-content: space-between;
`

const MessageContainer = styled.div`
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
`

const Usernamescontainer = styled.div`
background-color: #f0f0f0;
padding: 10px;
border-radius: 8px;
position : absolute;
right : 0;
top : 100px
`
const Usernamescontainerp = styled.div`
    margin: 5px 0;
    font-size: 16px;
    color: #333;

    &:hover {
        background-color: red;
        cursor: pointer;
    }
`;