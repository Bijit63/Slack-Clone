import React from 'react';
import styled from 'styled-components'
const Input = ({onChange ,style ,placeholder ,name ,value}) => {
    return <div>
        <StyledInput style={style} placeholder={placeholder} onChange={onChange} name={name} value={value}>

        </StyledInput>
    </div>;
}

export default Input;
const StyledInput = styled.textarea`
width: 336px;
height: 45px;
flex-shrink: 0;
font-size: 15px;
border-radius: 6px;
border: 1px solid #717171;
&:focus {
    outline: none;
  }

padding-left :7px;
padding-top :7px;
background: #FFF;
::placeholder {
    color: #000;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;