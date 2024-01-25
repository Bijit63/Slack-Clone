import React from 'react';
import StatusButton from './Common/StatusButton';
import styled from 'styled-components'
import ReactVirtualizedTable from './Tablecomponent';
import { useState } from 'react';
const TableTask = ({data , setdetail }) => {
    const [filter, setfilter] = useState(data)
    const [sort, setsort] = useState("")
    const [select, setselect] = useState("all")
    const handleClick = (e) =>{
        setselect(e.target.id)
        if(e.target.id ==="all")
        setfilter(data)
        else if(e.target.id == "pending"){
            const filteredRows = data.filter(row => row.status.toLowerCase() == "pending");
           setfilter(filteredRows);
        }
        else if(e.target.id == "complete"){
            const filteredRows = data.filter(row => row.status.toLowerCase() === "complete");
            setfilter(filteredRows);
        }
        else if(e.target.id === "cancelled"){
            const filteredRows = data.filter(row => row.status.toLowerCase() === "cancelled");
            setfilter(filteredRows);
        }
    }
    const handleSort = (e) =>{
        setsort(e.target.id)
        if(e.target.id === "due")
        setfilter(data)
        else if(e.target.id === "priority"){
            const sortedDataDescending = data.sort((a, b) => parseInt(b.priority) - parseInt(a.priority));
            console.log(sortedDataDescending)
           setfilter(sortedDataDescending);
        }
    }
    return <div>
         <TagSection>
        <StatusButton  style={{borderRadius: "20px" , border:select === "all" ?   "0px" :" 1px solid #000" , background: select === "all" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: select === "all" ? "#FFF" : "#4F4F4F"}} data={"All"} id="all" onClick={handleClick} /> 
        <StatusButton  style={{borderRadius: "20px" , border:select === "pending" ?   "0px" :" 1px solid #000" , background: select === "pending" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: select === "pending" ? "#FFF" : "#4F4F4F"}} data={"Pending"}  id="pending" onClick={handleClick}/> 
        <StatusButton  style={{borderRadius: "20px" , border:select === "complete" ?   "0px" :" 1px solid #000" , background: select === "complete" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: select === "complete" ? "#FFF" : "#4F4F4F"}} data={"complete"}  id="complete" onClick={handleClick}/> 
        <StatusButton  style={{borderRadius: "20px" ,border:select === "cancelled" ?   "0px" :" 1px solid #000" ,background: select === "cancelled" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: select === "cancelled" ? "#FFF" : "#4F4F4F"}} data={"Cancelled"}  id="cancelled" onClick={handleClick} /> 
        </TagSection>
        <TagSection>
        <StatusButton  style={{borderRadius: "0px" ,background : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: "#4F4F4F"}} data={"Sort By"} /> 
        <StatusButton  style={{borderRadius: "20px" , border: sort === "due" ?  "0px" :" 1px solid #000",    background: sort === "due" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 , color: sort === "due" ? "#FFF" : "#4F4F4F"}} data={"Due Date"} id="due" onClick={handleSort} /> 
        <StatusButton  style={{borderRadius: "20px" , border: sort === "priority" ?  "0px" :" 1px solid #000", background: sort === "priority" ? "#085FE2" : "#FFF"}}   textstyle={{fontWeight: 700 ,  color: sort === "priority" ? "#FFF" : "#4F4F4F"}} data={"Priority"} id="priority" onClick={handleSort} /> 
       
        </TagSection>

        <ReactVirtualizedTable  data={filter} setdetail={setdetail}  />
    </div>;
}


export default TableTask;
const TagSection = styled.div`
display :flex;
margin-top : 14px;
justify-content: flex-start;
`
