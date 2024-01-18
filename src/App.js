
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


function App() {

  
  const [ user, setUser ] = useState(JSON.parse(localStorage.getItem('user')));
  


  return (
      <Router>
    <NoteContext>
      <Alert/>
    <div className="App">
        
        {!user ? (
          <Login setUser={setUser} />
        ) : (
          <Container>
            <Header  />
            <Main>
              <Sidebar  />
              <Routes>
                <Route path="/Users" element={<UserList  />} />
                <Route path="/room/:channelId" element={<Chat user={user} />} />

                <Route path="/personalroom/:channelId" element={<PersonalChat user={user} />} />
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
  grid-template-rows: 38px minmax(0, 1fr);
`

const Main = styled.div`
  display: grid;
  grid-template-columns: 260px auto;
`
