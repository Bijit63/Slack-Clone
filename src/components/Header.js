import React, { useContext } from 'react'
import styled from 'styled-components'
import { MdAccessTime } from 'react-icons/md';
import { BsQuestionCircle } from 'react-icons/bs';
import { Context } from '../Context/NoteContext';
import { RiLogoutBoxRLine } from "react-icons/ri";

function Header({setcUser,cuser}) {

    const context = useContext(Context)
  
  const {user,signOut} = context

  const clickedOut = ()=>{
    setcUser();
    signOut();
  }


    return (
        <Container>
            <Main>
                <MdAccessTime />
                <SearchContainer>
                    <Search>
                        <input type="text" placeholder="Search..." />
                    </Search>
                </SearchContainer>
                <BsQuestionCircle />

            </Main>
            <UserContainer>
                <Name>
                    {user.name}
                </Name>
                <UserImage  >
                    <img src={user.photo ? user.photo : "https://i.imgur.com/6VBx3io.png" } />
                </UserImage>

                <RiLogoutBoxRLine onClick={()=>{clickedOut()}} />
            </UserContainer>
        </Container>
    )
}

export default Header


const Container = styled.div`
    height : 6.5vh;
    background: #350d36;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: 0 1px 0 0 rgb(255 255 255 / 10%);
`

const Main = styled.div`
    display: flex;
    margin-right: 16px;
    margin-left 16px;
`

const SearchContainer = styled.div`
    min-width: 400px;
    margin-left: 16px;
    margin-right: 16px;
`

const Search = styled.div`
    box-shadow: inset 0 0 0 1px rgb(104 74 104);
    width: 100%;
    border-radius: 6px;
    display: flex;
    align-items: center;

    input {
        background-color: transparent;
        border: none;
        padding-left: 8px;
        padding-right: 8px;
        color: white;
        padding-top: 4px;
        padding-bottom: 4px;
    }

    input:focus {
        outline: none;
    }


`

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    padding-right: 16px;
    position: absolute;
    right: 0;
`

const Name = styled.div`
    padding-right: 16px;
`

const UserImage = styled.div`
    width: 28px;
    height: 28px;
    border: 2px solid white;
    border-radius: 3px;
    cursor: pointer;
    margin-right:15px;
    img {
        width: 100%;
    }
`
