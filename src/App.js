
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
import { NoteContext } from './Context/NoteContext';
import Alert from './components/Alert';
import firebase from 'firebase/compat/app';


function App() {



  
  const [cuser, setcUser] = useState({
    accessToken: "",
    name: "",
    photo: "",
    role: "",
    uid: ""
  });


  const getUserDataFromAccessToken = (accessToken) => {
    try {
      
      const unsubscribe = db.collection('userlists')
        .where('accessToken', '==', accessToken)
        .onSnapshot((userSnapshot) => {
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            setcUser(userData);
          } else {
            console.log('User not found in userlists collection.');
          }
        });
  
    } catch (error) {
      console.error('Error setting up real-time listener for user data:', error);
    }
  };
  
  useEffect(() => {
    getUserDataFromAccessToken(localStorage.getItem('accesstoken'))
    
  }, [localStorage])
  
  


  return (
      <Router>
    <NoteContext>
      
      <Alert/>
    <div className="App">
        
        {!cuser ? (
          <Login setcUser={setcUser} />
        ) : (
          <Container>
            <Header setcUser={setcUser} cuser={cuser} />
            <Main>
              <Sidebar  />
              <Routes>
                <Route path="/Users" element={<UserList  />} />
                <Route path="/room/:channelId" element={<Chat user={cuser} />} />

                <Route path="/personalroom/:channelId" element={<PersonalChat user={cuser} />} />
                <Route path="/"  />
              </Routes>
            </Main>
          </Container>
        )}
    </div>
        </NoteContext>
      </Router>
  );
}

export default App;

const Container = styled.div`
  
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 0px minmax(0, 1fr);
`

const Main = styled.div`
  display: grid;
  margin-top:6.5vh;
  grid-template-columns: 260px auto;
`
