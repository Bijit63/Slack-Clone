import React, { useContext, useEffect, useRef, useState } from 'react'
import './Styles/ChatSideBar.css'
import { RxCross1 } from "react-icons/rx";
import { Context } from '../Context/NoteContext';
import { TfiMoreAlt } from "react-icons/tfi";
import db from '../firebase';
import firebase from 'firebase/compat/app';

const ChatSideBar = ({setTranslateX,translateX ,channelId, deletechannel , existingusers,setexistingusers,setnewusers,newusers,adduser}) => {

  
  const userPermissionsRef = useRef();
  const [activeuserid, setactiveuserid] = useState()

    const handleTranslateClick = () => {
        setTranslateX(1800); // Adjust the translation amount as needed
      };

      const context = useContext(Context)
      const {alert,user} = context



      const moveUserTomembers = (userId) => {
      };



      const mouseenter = (id)=>{
          setactiveuserid(id)
          console.log(id)
      }

      const mouseleave = (id)=>{
        setactiveuserid()
        console.log(id,"left")
      }



       // TO REMOVE THE USER 

    const removeUser = (userId,Restricted,joinTime) => {


      const roomRef = db.collection('rooms').doc(channelId);
      if (user.role==='admin' || user.role==='manager') {
        roomRef.update({
          members: firebase.firestore.FieldValue.arrayRemove({ userid: userId,isRestricted:Restricted,joinTime:joinTime })
        })
        .then(() => {
          console.log(`User ${userId} removed from group ${channelId}`);
        })
        .catch((error) => {
          console.error('Error removing user from group:', error);
        });
      } else {
        console.log('User is not the owner of the room');
      }
      
    };

  // TO REMOVE THE USER 



  const restrictuser = (userId, isRestricted) => {

    const roomRef = db.collection('rooms').doc(channelId);

    roomRef.get().then((doc) => {

        const roomData = doc.data();
        const members = roomData.members || [];
  
        const userIndex = members.findIndex(member => member.userid === userId);
  
        if (userIndex !== -1) {
          members[userIndex].isRestricted = true;
  
          roomRef.update({
            members: members
          })
          
        } else {
          console.log(`User ${userId} not found in room ${channelId}`);
        }
      
    })
  };



  const permituser = (userId, isRestricted)=>{
    const roomRef = db.collection('rooms').doc(channelId);

    roomRef.get().then((doc) => {

        const roomData = doc.data();
        const members = roomData.members || [];
  
        const userIndex = members.findIndex(member => member.userid === userId);
  
        if (userIndex !== -1) {
          members[userIndex].isRestricted = false;
  
          roomRef.update({
            members: members
          })
          
        } else {
          console.log(`User ${userId} not found in room ${channelId}`);
        }
      
    })
  }









  return (
    <div className='chat-sidebar-container' style={{ transform: `translateX(${translateX}px)` }}>

        
<div className='crossback' onClick={()=>{handleTranslateClick()}}>

</div>
        

        <div className='chat-sidebar'  >

            <div className='cross' >
            <RxCross1 onClick={()=>{handleTranslateClick()}} className='svg' />
            </div>



<div className='members-section'>
    <div className='members-header'>
        Members

    </div>
    {
        existingusers.map((member,index)=>{

            return (

                <div key={index} className='member'>
                  <div className="userinfo">
    <img src={member.image} alt='User 1'/>
    <span>{member.username}</span>
                  </div>
    
    <div onMouseEnter={()=>{mouseenter(member.uid)}}  onMouseLeave={()=>{mouseleave(member.uid)}} className={`${user.role==='admin' || user.role==='manager' ?'user-more': 'user-permissions-hide'}`}>  
    <TfiMoreAlt/> 

    <div className={`${activeuserid===member.uid?'user-permissions':'user-permissions-hide'} `}>
      
      <p onClick={()=>{removeUser(member.uid,member.isRestricted,member.joinTime)}}>Remove </p>
      {member.isRestricted===false?
      <p onClick={()=>{ restrictuser(member.uid,member.isRestricted)}}  >Restrict</p>:
      <p onClick={()=>{permituser(member.uid,member.isRestricted) }}  >Permit</p>
      }
    </div>
    </div>
  </div>
                )

        })
    }



    {/* TO ADD MEMBERS  */}
    <div className='members-header-new'>
        Add New Users
    </div>
    {
        newusers.map((user,index)=>{

            return (
              
                <div key={index} onClick={()=>{ adduser(user.uid,user.role); moveUserTomembers(user.uid)}} className='member'>
                  <div className="userinfo">
    <img src={user.image} alt='User 1'/>
    <span>{user.username}</span>
                  </div>

    
  </div>
                )

        })
    }
    {/* TO ADD MEMBERS  */}
  
</div>



<button onClick={()=>{deletechannel()}} className='delete-channel-btn'>Delete Channel</button>

        </div>

    </div>
  )
}

export default ChatSideBar