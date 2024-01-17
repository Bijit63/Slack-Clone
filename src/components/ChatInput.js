import React, { useState } from 'react'
import styled from 'styled-components'
import { MdSend } from 'react-icons/md';
import './Styles/ChatInput.css'

function ChatInput({ sendMessage }) {

    const [input, setInput] = useState("");


    const send = (e) => {
        e.preventDefault();
        if(!input) return;
        sendMessage(input)
        setInput("")
    }


    return (
        <div class="container-chatinput">
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
    </div>
    )
}

export default ChatInput
