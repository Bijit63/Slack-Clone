import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { MdSend } from 'react-icons/md';
import './Styles/ChatInput.css'
import { Context } from '../Context/NoteContext';

function ChatInput({ sendMessage,Restricted,PersonalChat }) {
    const context = useContext(Context)
    const {user}=context;
    const [input, setInput] = useState("");


    const send = (e) => {
        e.preventDefault();
        if(!input) return;
        sendMessage(input)
        setInput("")
    }
    


    return (
        <div class={`${(user.role==='admin' || user.role==='manager') || PersonalChat===true  ?'container-chatinput':''}`}>
            {
                (user.role==='admin' || user.role==='manager') || PersonalChat===true  ?
        <div class="input-container">
            <form>
                    <input 
                        onChange={(e)=>setInput(e.target.value)}
                        type="text" 
                        value={input}
                        placeholder="Message here..." />
                        
                        <button 
                        class="send-button"
                        type="submit"
                        onClick={send}>
                    <span class="send-icon">&#10148;</span>
                </button>
            </form>
            </div>
            :
            <div className='restricted-message'>
                Restricted: Messages on this channel are limited.

            </div>
            
        }
    </div>
    )
}

export default ChatInput
