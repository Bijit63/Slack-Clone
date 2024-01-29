import React, { useState } from 'react';
import Picker from 'emoji-picker-react';

function Emoji() {
    
    const [isopen, setisopen] = useState(false)
    
    const handleReaction = (e) =>{
        console.log(e.emoji)
        setisopen(false);
    }

    const clicked = (e) =>{
        console.log(e.emoji)
        setisopen(false);
    }

  return (
    <div>
      <button onClick={() => setisopen(true)}>Select Reaction</button>
      {
        isopen && 
          
      <Picker reactionsDefaultOpen={true}  onEmojiClick={clicked} onReactionClick={handleReaction} />
      }  

    </div>
  );
}
export default Emoji