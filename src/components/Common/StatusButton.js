import React from 'react';
import styled from 'styled-components'
const StatusButton = ({style ,data ,onClick ,textstyle={} , id, children = ""}) => {

    const backgroundColor = data === 'Complete' ? '#00DF16' : data === 'Running' ? '#4087F1' : style.background;
    return <div>
        <Status style={{ ...style, background: backgroundColor }} onClick={onClick} id={id}>
            <Text style={textstyle} id={id} >
              {data}
            </Text>
            {children}
        </Status>

    </div>;
}


export default StatusButton;
const Status = styled.div`
border-radius: 6px;
background: #FA5405;
width: 76px;
height: 28.226px;
flex-shrink: 0;
display: flex;
flex-direction: column;
justify-content: center;
align-items :center;
padding: 1px 10px 2px 10px;
margin :4px;
cursor :pointer;
`
const Text = styled.div`
color: #FFF;
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: normal;
cursor :pointer;
`