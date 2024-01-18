import React, { useContext } from 'react'
import './Styles/UserList.css'
import { MdMoreHoriz } from "react-icons/md";
import db from '../firebase';
import { Context } from '../Context/NoteContext';

const UserList = () => {

    const context = useContext(Context)
    const {userlists , setUserLists , setUser,user} = context

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



        



  return (
    <div className='container-userlist'>
        
        <div className='userinfo-header '>
        <div className='userinfo-header-name'>UserName</div>
        <div className='userinfo-header-role'>Role</div>
        </div>

        {userlists.map((user)=>{ 

            let userrole = user.role
            
            return (
                <div className='userinfo'>
                    
                    <p className='username'>{user.username}</p>
                    {/* <p className='userrole'>{user.role}</p> */}
                    <div className="userrole">
                    <select id="role" value={user.role} 
                    onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                     className='userrole-dropdown' name="role">
                     <option value="user">User</option>
                     <option value="manager">Manager</option>
                     <option value="admin">Admin</option>
                    </select>
                    </div>

                    <p className='more'> <MdMoreHoriz/> </p>
                    </div>
            )
        } 

        )}

        
    </div>
  )
}

export default UserList