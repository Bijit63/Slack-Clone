import React, { useContext } from 'react'
import './Styles/ChatSideBar.css'
import { RxCross1 } from "react-icons/rx";
import { Context } from '../Context/NoteContext';

const ChatSideBar = ({setTranslateX,Owner,translateX , deletechannel , existingusers,setexistingusers,setnewusers,newusers,adduser}) => {

    const handleTranslateClick = () => {
        setTranslateX(1800); // Adjust the translation amount as needed
      };

      const context = useContext(Context)
      const {alert} = context


      const moveUserTomembers = (userId) => {
        if(Owner)
        {
          
        const userToMove = newusers.find(user => user.userId === userId);
      
        if (userToMove) {
          // Remove the user from newusers
          const updatedNewUsers = newusers.filter(user => user.userId !== userId);
          setnewusers(updatedNewUsers);
      
          // Add the user to existingusers
          const updatedExistingUsers = [...existingusers, userToMove];
          setexistingusers(updatedExistingUsers);
        }
      }

      else{
        alert('warning',"You don't have the access to add Members")
      }
      };



  return (
    <div className='chat-sidebar-container' style={{ transform: `translateX(${translateX}px)` }}>

        
<div className='crossback' onClick={()=>{handleTranslateClick()}}>

</div>
        

        <div className='chat-sidebar'  >

            <div className='cross' >
            <RxCross1 onClick={()=>{handleTranslateClick()}} className='svg' />
            </div>



<div class='members-section'>
    <div className='members-header'>
        Members

    </div>
    {
        existingusers.map((user)=>{

            return (

                <div class='member'>
    <img src={user.image} alt='User 1'/>
    <span>{user.username}</span>
  </div>
                )

        })
    }



    {/* TO ADD MEMBERS  */}
    <div className='members-header-new'>
        Add New Users
    </div>
    {
        newusers.map((user)=>{

            return (

                <div onClick={()=>{ adduser(user.userId); moveUserTomembers(user.userId)}} class='member'>
    <img src={user.image} alt='User 1'/>
    <span>{user.username}</span>
  </div>
                )

        })
    }
    {/* TO ADD MEMBERS  */}
  
</div>



<button onClick={()=>{deletechannel()}} class='delete-channel-btn'>Delete Channel</button>

        </div>

    </div>
  )
}

export default ChatSideBar