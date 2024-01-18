    import React, { useContext } from 'react'
import styled from 'styled-components'
import { auth, provider } from '../firebase'
import db from '../firebase';
import { Context } from '../Context/NoteContext';

function Login({setcUser}) {

  const context = useContext(Context)
  
  const {setUser} = context


    const signIn = () => {
        auth.signInWithPopup(provider)
          .then((result) => {
            const newUser = {
              name: result.user.displayName,
              photo: result.user.photoURL,
              uid: result.user.uid,
              role:"user",
              accessToken:result.credential.accessToken
            };

            
            console.log(result)
      
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
                <SlackImg src="https://yt3.googleusercontent.com/ytc/AIf8zZQTjGhyv6zCabZQRDnnudwAJ7AoRvnucvEkhi4DSA=s900-c-k-c0x00ffffff-no-rj" />
                <h1>Sign in Slack</h1>
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
    padding: 100px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
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
