import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import db, { auth } from "../firebase";


export const Context=createContext();




export const NoteContext=(props)=>{
  
  const [Loader, setLoader] = useState(true) 
  

    const [rooms, setRooms] = useState([]) 
    const [admin, setadmin] = useState([]) 
    const [usersChatRooms, setusersChatRooms] = useState([]) 
    const [user, setUser] = useState({
      accessToken: "",
      name: "",
      photo: "",
      role: "",
      uid: ""
    });

    const [userlists,setUserLists] = useState([])

    const [TaskData, setTaskData] = useState([])








    // TO GET DATA

    const getUserDataFromAccessToken = (accessToken) => {

      
      


      try {
        
        const unsubscribe = db.collection('userlists')
          .where('accessToken', '==', accessToken)
          .onSnapshot((userSnapshot) => {
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data();
              setUser(userData);
              getuserLists(userData);
              console.log("first")
            } else {
              console.log('User not found in userlists collection.');
              setLoader(false)
            }
          });
    
      } catch (error) {
        console.error('Error setting up real-time listener for user data:', error);
      }
      
    };
    
    
    useEffect(() => {
      // setLoader(true)
      getUserDataFromAccessToken(localStorage.getItem('accesstoken'))
    }, [localStorage])


    // TO GET DATA





    // FUNCTION TO SHOW ALERT 

    const [alerttype, setalerttype] = useState('')
  const [alertmessage, setalertmessage] = useState('')
  const [showAlert, setShowAlert] = useState(false);


  useEffect(() => {
    if(user && user.role==='noaccess')
    {
        setalerttype('normal')
        setalertmessage('Access Denied')
        setShowAlert(true);
    
    
        setTimeout(() => {
          setShowAlert(false);
          setalerttype('')
          setalertmessage('')
        }, 200000000);   
    
    }

    else{
      setShowAlert(false);
      setalerttype('')
          setalertmessage('')
    }
  }, [user])
  

  const alert=(type,message,time)=>{

    setalerttype(type)
    setalertmessage(message)
    setShowAlert(true);


    setTimeout(() => {
      setShowAlert(false);
      setalerttype('')
      setalertmessage('')
    }, time);   

  }
  

  // FUNCTION TO SHOW ALERT 

  
  
  
  
  
    // to get all the users 
  
   const getuserLists = (userdata) => {
  try {
    
    const unsubscribe = db.collection('userlists').onSnapshot((userListsSnapshot) => {
      const userListsData = [];

      userListsSnapshot.forEach((doc) => {
        const userData = {
          userId: doc.id,
          username: doc.data().name,
          image: doc.data().photo,
          role: doc.data().role,
          joinDate: doc.data().joinDate,
          email: doc.data().email
        };
        userListsData.push(userData);
      });

      const adminUsers = userListsData.filter(userr => (userr.role === 'admin' && userdata.uid!=userr.userId));

      setadmin(adminUsers);
      setUserLists(userListsData);
    });


    
    getChannels(userdata);
    
  } catch (error) {
    console.error('Error setting up real-time listener for user lists:', error);
    return [];
  }
};

  
    // to get all the users 
  
  
  
  
  

    // to get all personal message rooms 
  
    const fetchPersonalChatRooms = (uid) => {
      try {
        const unsubscribe = db
          .collection('personalMessages')
          .where('users', 'array-contains', uid)
          .onSnapshot(async (roomsSnapshot) => {
            const personalChatRooms = [];
    
            for (const roomDoc of roomsSnapshot.docs) {
              const roomData = roomDoc.data();
              const otherUserID = roomData.users.find(id => id !== uid);
    
              // Fetch other user's information from 'userlists'
              const otherUserDoc = await db.collection('userlists').doc(otherUserID).get();
              const otherUserData = otherUserDoc.data();
    
              // Create an object containing room details and other user's information
              const roomDetails = {
                roomId: roomDoc.id,
                otherUserID,
                otherUserName: otherUserData.name,
                otherUserPhoto: otherUserData.photo,
              };
    
              personalChatRooms.push(roomDetails);
            }
    
            // Update state with the latest personal chat rooms
            setusersChatRooms(personalChatRooms);
          });
    
                
                 setTimeout(() => {
                   setLoader(false)
                  
                 }, 1500);
                
      } catch (error) {
        console.error('Error setting up real-time listener for personal chat rooms:', error);
      }

    };
    
    // to get all personal message rooms 
  
  




  
    // to get all task 
    const getTasks = () => {
      db.collection('Task')
      .where('assigned_to.id', '==', localStorage.getItem("userId"))
        .onSnapshot((snapshot) => {
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // console.log(tasksData);
          if (tasksData.length > 0) {
            setTaskData(tasksData);
          }
        });
    };
    // to get all task 
  
  
  
    
    
    
    // TO get channels 
    const getChannels = (userdata) => {
      
      db.collection('rooms')
.onSnapshot((snapshot) => {
  const userRooms = snapshot.docs
    .filter(doc => {
      const members = doc.data().members || [];
      return members.some(member => member.userid === userdata.uid);
    })
    .map(doc => {
      const roomData = doc.data();
      const memberData = (roomData.members || []).find(member => member.userid === userdata.uid);
      const isRestricted = memberData ? memberData.isRestricted : false;
      
      return {
        id: doc.id,
        name: roomData.name,
        isRestricted: isRestricted
      };
    });

    // console.log("Chatrooms",userRooms)
  setRooms(userRooms);
});



fetchPersonalChatRooms(userdata.uid);
      
  };
  // TO get channels 

  
  const signOut = () => {
    auth.signOut().then(()=>{
      // console.log(user)
      localStorage.removeItem('user');
      setUser(null);
    })
  }

  // useEffect(() =>{
    
  //   if(user)
  //   {
      
      
  //   }
  // }, [user])
  
    
  
    return(
        <Context.Provider value={{setUser,Loader,user,signOut,getuserLists,usersChatRooms,setusersChatRooms,admin,rooms,setUserLists,userlists ,
          setShowAlert,alert,showAlert,alertmessage,alerttype , TaskData,
          
          }} >
            {props.children}
        </Context.Provider>

    )

}