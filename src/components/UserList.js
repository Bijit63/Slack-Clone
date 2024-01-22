import React, { useContext, useEffect, useState } from 'react'
import './Styles/UserList.css'
import { MdMoreHoriz } from "react-icons/md";
import db from '../firebase';
import { Context } from '../Context/NoteContext';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import { AiOutlineSearch } from 'react-icons/ai';

const UserList = () => {
    const navigate = useNavigate()
    
    const context = useContext(Context)
    const {userlists , setUserLists , setUser,user,usersChatRooms,setusersChatRooms} = context

    const [AllusersData, setAllusersData] = useState(userlists)

    useEffect(() => {
      setAllusersData(userlists)
    }, [userlists])
    

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
          const room = roomQuery.docs[0];
          navigate(`/personalroom/${room.id}`)
        } else {
          
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
        




    // Search 

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (value) => {
      setSearchTerm(value);

      const filtered = userlists.filter(user =>
        user.username.toLowerCase().includes(value.toLowerCase())
      );

      setAllusersData(filtered);
      
    };

    // Search 



  return (
    <div className='container-userlist'>

      <div className="search-box">
      <input
        type="text"
        placeholder="Search the user..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <AiOutlineSearch className="search-icon" />
    </div>

    <div className='userlist-table'>
        
        <div className='userinfo-header '>
        <div className='userinfo-header-name'>UserName</div>
        <div className='userinfo-header-email'>Email ID</div>
        <div className='userinfo-header-date'>Joining Date</div>
        <div className='userinfo-header-role'>Role</div>
        </div>

        {AllusersData.map((userdata)=>{ 

            {console.log(AllusersData)}
            return (
                <div className='userinfo'>
                    
                    <p className='username'>{userdata.username}</p>
                    <p className='email'>{userdata.email}</p>
                    <p className='joindate'>{userdata.joinDate}</p>
                    {/* <p className='userrole'>{user.role}</p> */}
                    <div className="userrole">
                    <select id="role" value={userdata.role} 
                    disabled={user.role!=='admin'}
                    onChange={(e) => handleRoleChange(userdata.userId, e.target.value)}
                     className='userrole-dropdown' name="role">

                     <option value="admin">Admin</option>
                     <option value="manager">Manager</option>
                     <option value="user">User</option>
                     <option value="noaccess">No Access</option>
                    </select>
                    </div>
                    <p onClick={()=>{checkOrCreateChatRoom(userdata.userId,user.uid,userdata.username,userdata.image)}} className='DM'> DM</p>
                    </div>
            )
        } 

        )}

</div>
    </div>
  )
}

export default UserList