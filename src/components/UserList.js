import React, { useContext } from 'react'
import './Styles/UserList.css'
import { MdMoreHoriz } from "react-icons/md";
import db from '../firebase';
import { Context } from '../Context/NoteContext';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';

const UserList = () => {
    const navigate = useNavigate()
    
    const context = useContext(Context)
    const {userlists , setUserLists , setUser,user,usersChatRooms,setusersChatRooms} = context

    const handleRoleChange = async (userId, newRole) => {

        setUserLists((prevUserLists) =>
          prevUserLists.map((user) =>
            user.userId === userId ? { ...user, role: newRole } : user
          )
        );

        if(user.uid ===userId)
        {
          setUser((prevUser) => ({
            ...prevUser,
            role: newRole
          }));
        }

        

        try {
            const userRef = db.collection('userlists').doc(userId);
        
            await userRef.update({
              role: newRole
            });
        
            console.log(`User ${userId} role updated to ${newRole}`);
          } catch (error) {
            console.error('Error changing user role:', error);
          }
       


      };







     
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

          const newUser = {
            otherUserID: user1ID,
            otherUserName: name,
            otherUserPhoto: image,
            roomId: newRoomRef.id
          };
      
          setusersChatRooms([...usersChatRooms, newUser]);
          
          navigate(`/personalroom/${newRoomRef.id}`)
        }
      } catch (error) {
        console.error('Error checking or creating chat room:', error);
      }
  }


    };
        



  return (
    <div className='container-userlist'>
        
        <div className='userinfo-header '>
        <div className='userinfo-header-name'>UserName</div>
        <div className='userinfo-header-role'>Role</div>
        </div>

        {userlists.map((userdata)=>{ 

            
            return (
                <div className='userinfo'>
                    
                    <p className='username'>{userdata.username}</p>
                    {/* <p className='userrole'>{user.role}</p> */}
                    <div className="userrole">
                    <select id="role" value={userdata.role} 
                    disabled={user.role!=='admin'}
                    onChange={(e) => handleRoleChange(userdata.userId, e.target.value)}
                     className='userrole-dropdown' name="role">

                     <option value="admin">Admin</option>
                     <option value="manager">Manager</option>
                     <option value="user">User</option>
                    </select>
                    </div>
                    <p onClick={()=>{checkOrCreateChatRoom(userdata.userId,user.uid,userdata.username,userdata.image)}} className='DM'> DM User </p>
                    </div>
            )
        } 

        )}

        
    </div>
  )
}

export default UserList