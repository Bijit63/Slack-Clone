    import React, { useContext } from 'react'
import styled from 'styled-components'
import { auth, provider } from '../firebase'
import db from '../firebase';
import { Context } from '../Context/NoteContext';
import firebase from 'firebase/compat/app';
import logo from '../Images/UA_Logo.png'

function Login({setcUser}) {

  const context = useContext(Context)
  
  const {setUser} = context


    const signIn = () => {
        auth.signInWithPopup(provider)
          .then((result) => {
            const currentTimestamp = firebase.firestore.Timestamp.now().toDate();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const joinDate = currentTimestamp.toLocaleDateString('en-IN', options);


            const newUser = {
              name: result.user.displayName,
              photo: result.user.photoURL,
              uid: result.user.uid,
              role:"noaccess",
              accessToken:result.credential.accessToken,
              joinDate:joinDate,
              email:result.user.email
            };

      
            const userRef = db.collection('userlists').doc(newUser.uid);
      
            userRef.get().then((docSnapshot) => {
              if (!docSnapshot.exists) {
                userRef.set(newUser)
                  .then(() => {
                    localStorage.setItem('accesstoken', result.credential.accessToken);
                    setUser(newUser);
                    setcUser(newUser);
                    console.log('New user added to userlists collection:', newUser);
                  })
                  .catch((error) => {
                    console.error('Error adding new user to userlists collection:', error);
                  });
              } else {
                const existingUser = docSnapshot.data();
                const updatedUser = {
                  ...existingUser,
                  name:newUser.name,
                  photo: newUser.photo,
                  accessToken: newUser.accessToken
                };

                userRef.update(updatedUser)
                .then(() => {
                  localStorage.setItem('accesstoken', result.credential.accessToken);
                  setUser(updatedUser);
                  setcUser(updatedUser);
                  console.log('User data updated for existing user:', updatedUser);
                })
                .catch((error) => {
                  console.error('Error updating existing user data:', error);
                });
            }
            

            }).catch((error) => {
              console.error('Error checking for existing user:', error);
            });
          })
          .catch((error) => {
            alert(error.message);
          });
      };

    return (
        <Container>
            <Content>
                <SlackImg src={logo} />
                <h1>Chat n Task</h1>
                <SignInButton onClick={()=>signIn()}>
                    Sign In With Google
                </SignInButton>
            </Content>
        </Container>
    )
}

export default Login;


const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #f8f8f8;
    display: flex;
    justify-content: center;
    align-items: center;

`

const Content = styled.div`

    background: white;
    padding: 100px 60px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 3px black;

`

const SlackImg = styled.img`

    height: 100px;

`

const SignInButton = styled.button`
    margin-top: 50px;
    background-color: #0a8d48;
    color: white;
    border: none;
    height: 40px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
`
