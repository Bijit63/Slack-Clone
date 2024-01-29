import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import firebase from 'firebase/compat/app';
import db from '../firebase';
import './Styles/ChatMessage.css'
import { Context } from '../Context/NoteContext';
import { useNavigate } from 'react-router-dom';
import Picker from 'emoji-picker-react';
import { MdEmojiEmotions } from "react-icons/md";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';


function ChatMessage({ text, name, image,channelId, timestamp,uid,messageId,PersonalChat,reactions,reactionCount }) {
    
    const context = useContext(Context)
    const {user,usersChatRooms,setusersChatRooms}=context
    const navigate = useNavigate()

    const [activemessageID, setactivemessageID] = useState()

    const [ReactionmessageId, setReactionmessageId] = useState()

    
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





      // FOR Reaction BAR 
      const [isopen, setisopen] = useState(false)
    
    const handleReaction = (e) =>{
        updateReaction(e.emoji)
        setisopen(false);
    }

    const clicked = (e) =>{
        updateReaction(e.emoji)
        setisopen(false);
    }


    // to update reaction 
   

    const updateReaction = (emoji) => {
      if (channelId && messageId) {
        const userReaction = {
          userId: user.uid,
          username: user.name,
          userImage: user.photo,
          emoji: emoji
        };
    
        db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
          .doc(channelId)
          .collection('messages')
          .doc(messageId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const reactions = doc.data().reactions || [];
              
              // Check if the user has already reacted
              const existingReactionIndex = reactions.findIndex(reaction => reaction.userId === user.uid);
    
              if (existingReactionIndex !== -1) {
                reactions[existingReactionIndex].emoji = emoji;
              } else {
                reactions.push(userReaction);
              }
    
              db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
                .doc(channelId)
                .collection('messages')
                .doc(messageId)
                .update({
                  reactions: reactions
                })
                .then(() => {
                  console.log(`Reaction updated for message ${messageId}`);
                  
                  updateReactionCount(messageId);
                })
                .catch((error) => {
                  console.error('Error updating reaction:', error);
                });
            } else {
              console.log(`Message with ID ${messageId} not found`);
            }
          })
          .catch((error) => {
            console.error('Error fetching message data:', error);
          });
      }
    };




    const updateReactionCount = (messageId) => {
      if (channelId && messageId) {
        db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
          .doc(channelId)
          .collection('messages')
          .doc(messageId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const reactions = doc.data().reactions || [];
              const reactionCount = {};
    
              reactions.forEach((reaction) => {
                const emoji = reaction.emoji;
                reactionCount[emoji] = (reactionCount[emoji] || 0) + 1;
              });
    
              const reactionCountArray = Object.keys(reactionCount).map((emoji) => ({
                emoji: emoji,
                count: reactionCount[emoji]
              }));
    
              db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
                .doc(channelId)
                .collection('messages')
                .doc(messageId)
                .update({
                  reactionCount: reactionCountArray
                })
                .then(() => {
                  console.log(`Reaction count updated for message ${messageId}`);
                })
                .catch((error) => {
                  console.error('Error updating reaction count:', error);
                });
            } else {
              console.log(`Message with ID ${messageId} not found`);
            }
          })
          .catch((error) => {
            console.error('Error fetching message data:', error);
          });
      }
    };


     // to update reaction 





    //  to remove reaction 

    const removeReaction = (reacteduserId) => {

      if(reacteduserId===user.uid)
      {
        
        
      if (channelId && messageId) {
        db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
          .doc(channelId)
          .collection('messages')
          .doc(messageId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const reactions = doc.data().reactions || [];
    
              // Find the index of the user's reaction
              const userReactionIndex = reactions.findIndex(reaction => reaction.userId === user.uid);
    
              if (userReactionIndex !== -1) {
                // Remove the user's reaction from the array
                reactions.splice(userReactionIndex, 1);
    
                // Update the "reactions" array in Firestore
                db.collection(`${PersonalChat===true?'personalMessages':'rooms'}`)
                  .doc(channelId)
                  .collection('messages')
                  .doc(messageId)
                  .update({
                    reactions: reactions
                  })
                  .then(() => {
                    console.log(`Reaction removed for message ${messageId}`);
    
                    updateReactionCount(messageId);
                  })
                  .catch((error) => {
                    console.error('Error updating reactions:', error);
                  });
              } else {
                console.log(`User ${user.uid} has not reacted to message ${messageId}`);
              }
            } else {
              console.log(`Message with ID ${messageId} not found`);
            }
          })
          .catch((error) => {
            console.error('Error fetching message data:', error);
          });
      }
    }
    };

    

    //  to remove reaction 



    return (
      

        <div onMouseEnter={(e)=>{setReactionmessageId(messageId)}} onMouseLeave={(e)=>{setReactionmessageId(); setisopen(false) }} className={`${user.uid===uid?'container-ownchatmessage':"container-chatmessage"} `}>
          
          <div  className={`${user.uid===uid?'owntext-container':"text-container"} ${reactionCount.length>0? 'reactionCountpresent':''} `}>
          
         {uid!==user.uid && <div className="user-avatar" onMouseEnter={()=>{mouseenter()}} onMouseLeave={()=>{mouseexit()}} >
           <img src={image}  />

            <div onClick={()=>{checkOrCreateChatRoom(uid,user.uid,name,image)}} className={`${uid!==user.uid?activemessageID===messageId?PersonalChat!==true?"gotochat":"gotochathide":"gotochathide":"gotochathide"} `}>
              Go to Chat
            </div>
        </div>}

        <div className={`${user.uid===uid?'message-contentown':"message-content"} `}>
            <span className={`${user.uid===uid?'nameown':"name"} `}>
                {name}
                <span>{new Date(timestamp.toDate()).toLocaleString('en-IN',{
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })}</span>
            </span>
            <span className="text">
                {text}


            </span>

  


        </div>


    {/* To Click on emojis  */}
        { ((messageId === ReactionmessageId) && !isopen) &&  <MdEmojiEmotions onClick={()=>{setisopen(true)}} className={`${user.uid===uid?'EmojiSelectOwn':"EmojiSelect"} `} /> }


        <div className={`${user.uid===uid?'reaction-barown':"reaction-bar"} `}>
        { ((messageId === ReactionmessageId) && isopen) &&  <Picker reactionsDefaultOpen={true}  onEmojiClick={clicked} onReactionClick={handleReaction} />
      }  
      </div>
      {/* To Click on emojis  */}



      {/* to show the reaction from firebase  */}

        {
          reactionCount.length>0 && 
      <div  className={`${user.uid===uid?'reaction-countown':"reaction-count"} `}>
        
         { reactionCount.map((reaction)=>(

<PopupState variant="popover" popupId="demo-popup-popover">
{(popupState) => (
  <div className='reaction-details'>
    
    <div className='reactions' variant="contained" {...bindTrigger(popupState)}>
              <p className='reactions-emoji'>   {reaction.emoji}</p>
              <p className='reactions-count'>   {reaction.count}</p>
            </div>
   
   
            {reactions.length>0 && <Popover
  {...bindPopover(popupState)}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'center',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}
  PaperProps={{ style: {maxHeight: 300, overflowY: 'auto' },className: 'custom-scrollbar' }}
>
  <Typography sx={{ }}>
    
    {reactions.map((reactiondetail)=>(

       <div onClick={()=>{removeReaction(reactiondetail.userId)}} className="reaction-container">
       <div className='reaction-image-username'>
         <img src={reactiondetail.userImage} alt="" className="user-image-reaction" />
       <div className="username-reaction-text">
        <p className='username-reaction'>
           {reactiondetail.username.length>22?reactiondetail.username.slice(0,22)+'..':reactiondetail.username}
          </p>
        {
          reactiondetail.userId === user.uid &&
          <p className='remove-reaction'> Click to Remove </p>
        }
        </div>
       </div>

       <p>{reactiondetail.emoji}</p>
     </div>
    ))}


  </Typography>
</Popover>}

  </div>
)}
</PopupState>


          ))}

      </div>
        }


      {/* to show the reaction from firebase  */}


    </div>
    </div>
    )
}

export default ChatMessage




