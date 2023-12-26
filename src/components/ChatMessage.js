import React from 'react'
import styled from 'styled-components'
import firebase from 'firebase/compat/app';
import db from '../firebase';

function ChatMessage({ text, name, image, timestamp,uid }) {


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
        <Container>
            <UserAvatar>
                <img src={image} onClick={()=>{checkOrCreateChatRoom(uid,JSON.parse(localStorage.getItem('user')).uid)}} />
            </UserAvatar>
            
            <MessageContent>
                <Name  >
                    {name}
                    <span>{new Date(timestamp.toDate()).toUTCString()}</span>
                </Name>
                <Text>
                    {text}
                </Text>
            </MessageContent>
        </Container>
    )
}

export default ChatMessage

const Container = styled.div`
    padding: 8px 20px;
    display: flex;
    align-items: center;
`

const UserAvatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 2px;
    overflow: hidden;
    margin-right: 8px;

    img {
        width: 100%;
    }
`

const MessageContent = styled.div`
    display: flex;
    flex-direction: column;
`

const Name = styled.span`
    font-weight: 900;
    font-size: 15px;
    line-height: 1.4;
    span {
        margin-left: 8px;
        font-weight: 400;
        color: rgb(97,96,97);
        font-size: 13px;
    }
`

const Text = styled.span``


