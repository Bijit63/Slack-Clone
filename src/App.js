
import './App.css';
import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Chat from './components/Chat'
import Login from './components/Login'
import styled from 'styled-components'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import db from './firebase'
import { auth, provider } from "./firebase";
import PersonalChat from './components/PersonalChat';
import UserList from './components/UserList';


function App() {

  const [rooms, setRooms] = useState([]) 
  const [usersChatRooms, setusersChatRooms] = useState([]) 
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')));
  const [userlists,setUserLists] = useState([])





  // to get all the users 

  const getuserLists = async () => {
    try {
      const userListsSnapshot = await db.collection('userlists').get();
  
      const userListsData = [];
      userListsSnapshot.forEach((doc) => {
        const userData = {
          userId: doc.id,
          username: doc.data().name,
          image:doc.data().photo,
          role:doc.data().role
        };
        userListsData.push(userData);
      });
  
      console.log('User Lists:', userListsData);
      setUserLists(userListsData)
    } catch (error) {
      console.error('Error fetching user lists:', error);
      return [];
    }
  };

  // to get all the users 





  // to get all personal message rooms 

  const fetchPersonalChatRooms = async (uid) => {
    try {
      // Fetch personal chat rooms where the user is involved
      const roomsSnapshot = await db
        .collection('personalMessages')
        .where('users', 'array-contains', uid)
        .get();
  
      const personalChatRooms = [];
  
      for (const roomDoc of roomsSnapshot.docs) {
        const roomData = roomDoc.data();
        const otherUserID = roomData.users.find(id => id !== uid);
  
        // Fetch user information for the other user in the chat
        const otherUserDoc = await db.collection('userlists').doc(otherUserID).get();
        const otherUserData = otherUserDoc.data();
  
        // Create an object containing room details and other user's information
        const roomDetails = {
          roomId: roomDoc.id,
          otherUserID,
          otherUserName: otherUserData.name,
          otherUserPhoto: otherUserData.photo 
        };
  
        personalChatRooms.push(roomDetails);
      }
      
      console.log(personalChatRooms)
      setusersChatRooms(personalChatRooms)
      console.log('Personal Chat Rooms:', personalChatRooms);
    } catch (error) {
      console.error('Error fetching personal chat rooms:', error);
      return [];
    }
  };
  // to get all personal message rooms 





  
  // TO get channels 
  const getChannels = () => {
    db.collection('rooms')
      .where('members', 'array-contains', JSON.parse(localStorage.getItem('user')).uid)
      .onSnapshot((snapshot) => {
        setRooms(snapshot.docs.map((doc) => {
          return { id: doc.id, name: doc.data().name }
        }))
      });
  };
  // TO get channels 

  const signOut = () => {
    auth.signOut().then(()=>{
      console.log(user)
      localStorage.removeItem('user');
      setUser(null);
    })
  }

  useEffect(() =>{
    
    if(user)
    {
      getChannels();
      fetchPersonalChatRooms(JSON.parse(localStorage.getItem('user')).uid);
      getuserLists();
    }
  }, [user])


  return (
    <div className="App">
      <Router>
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <Container>
            <Header signOut={signOut} user={user} />
            <Main>
              <Sidebar rooms={rooms} usersChatRooms={usersChatRooms} />
              <Routes>
                <Route path="/Users" element={<UserList userlists={userlists} setUserLists={setUserLists} />} />
                <Route path="/room/:channelId" element={<Chat user={user} />} />
                <Route path="/personalroom/:channelId" element={<PersonalChat user={user} />} />
                <Route path="/"  />
              </Routes>
            </Main>
          </Container>
        )}
      </Router>
    </div>
  );
}

export default App;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 38px minmax(0, 1fr);
`

const Main = styled.div`
  display: grid;
  grid-template-columns: 260px auto;
`