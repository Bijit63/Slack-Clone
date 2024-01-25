import React, { useState, useEffect ,useContext } from 'react';
import styled from 'styled-components'
import db from '../firebase'
import firebase from 'firebase/compat/app';
import TaskInput from './TaskInput';
import StatusButton from './Common/StatusButton';
import StyledInput from './Common/Input'
import TableTask from './TableTask';
import Modals from './Common/Models';
import { Context } from '../Context/NoteContext';
const Task = ({ userlist }) => {
    const [detail, setdetail] = useState([])
    const [CommentData, setCommentData] = useState([])
    const [commentInput, setcommentInput] = useState("")
    const [show, setshow] = useState(true)
    const [openModal, setOpenModal] = useState(false);

    const context = useContext(Context)
    const {TaskData} = context
    const handleCardClick = (clickedItem) => {
        setdetail(clickedItem);
        console.log(clickedItem)
    };
    useEffect(() => {
        if (detail.id) {
            getComments();
        }
    }, [detail])

    const handleSubmitComment = () => {
        if (commentInput.trim() !== '') {
            let payload = {
                created_on: firebase.firestore.Timestamp.now(),
                created_by: detail?.id,
                status: detail?.status,
                comment: commentInput,
            }
            db.collection('Task').doc(detail?.id).collection('comments').add(payload);
        }
    };

  
    const getComments = () => {
        if (detail.id)
            db.collection('Task').doc(detail?.id).collection('comments').onSnapshot((commentSnapshot) => {
                const taskComments = commentSnapshot.docs.map((commentDoc) => ({
                    id: commentDoc.id,
                    ...commentDoc.data(),
                }));
                setCommentData(taskComments)
            }, (error) => {
                console.log('Error fetching comments:', error);
            }
            )
    }


    const [selectOpen, setSelectOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(""); 

  const handleStatusButtonClick = () => {
    console.log("called")
    setSelectOpen(true);
  };

  const handleStatusSelectClose = () => {
    setSelectOpen(false);
    db.collection("Task")
    .doc(detail?.id)
    .update({
        status: selectedStatus,
    })
    .then(() => {
        console.log("Document status updated successfully");
    })
    .catch((error) => {
        console.error("Error updating document status:", error);
    });
    
    console.log('Selected Status:', selectedStatus);
  };
    return <div>

        <Main>
            {show ? (<>
                <Container>
                    {
                        TaskData.map(item => (
                            <Card onClick={() => handleCardClick(item)}>
                                <Item>
                                    Due on    {item.due_date}
                                </Item>
                                <TaskItem>
                                    {item.title}
                                </TaskItem>
                                <StatusButton style={{ background: item.color }} data={item.status} >
                                </StatusButton>
                                <Tags>
                                    <ul style={{ display: "flex" }}>

                                        {item.tag?.map((tagItem, index) => (
                                            <li style={{ marginRight: "20px" }} key={index}>{tagItem}</li>
                                        ))}



                                    </ul>
                                </Tags>
                            </Card>
                        ))
                    }

                </Container> </>) : (
                <TableTask data={TaskData} setdetail={setdetail} />)}
            {/* comment section */}
            <DetailCard>
                <Item>
                    Due on  {detail?.due_date}
                </Item>
                <TaskItem>
                    {detail?.title}
                </TaskItem>
                <StatusButton style={{ background: detail.color }} data={selectedStatus === "" ? detail.status :selectedStatus} onClick={handleStatusButtonClick}  >
                </StatusButton>
                {selectOpen && (
                    <select value={selectedStatus} onChange={(e)=>setSelectedStatus(e.target.value)} onBlur={handleStatusSelectClose}>
                        <option value="Running">Running</option>
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                        {/* Add other status options as needed */}
                    </select>
                )}

                <Tags>
                    <ul>
                        <li>
                            {detail?.tag?.map((tagItem, index) => (
                                <li key={index}>{tagItem}</li>
                            ))}
                        </li>
                    </ul>
                </Tags>
                <Line />
                <Container>
                    {
                        CommentData?.map(item => (<Comment>

                            <CommentHeader>
                                <p> {item.Name}</p>
                                {item.created_on?.toDate().toLocaleString()}
                            </CommentHeader>
                            <CommentBody> {item.comment}</CommentBody>
                        </Comment>))
                    }
                </Container>
                <StyledInput placeholder="Type here..." onChange={(e) => setcommentInput(e.target.value)} style={{ marginTop: "100px" }} />

                <StatusButton style={{ background: "#085FE2", cursor: "pointer" }} id={detail?.id} onClick={handleSubmitComment} data={"Submit"}>
                </StatusButton>
            </DetailCard>

        </Main>
        <StatusButton style={{ borderRadius: "20px", background: "#EC2929" }} textstyle={{ fontWeight: 700 }} data={"Add New"} onClick={() => setOpenModal(true)} />
        <StatusButton style={{ borderRadius: "20px", border: " 1px solid #000", background: "#FFF", color: "#4F4F4F" }} textstyle={{ fontWeight: 700, color: "#4F4F4F" }} data={"Table veiw"} onClick={() => setshow((prevShow) => !prevShow)} />
        <Modals open={openModal} handleClose={() => setOpenModal(false)}  taskInputComponent={TaskInput} />

    </div>;
}

export default Task;

const Container = styled.div`
display :flex;
flex-wrap: wrap;
`
const Main = styled.div`
display :flex;
margin-top 20px;
flex-wrap: wrap;
flex-direction: row;

`
const Card = styled.div`
border-radius: 6px;
border: 1px solid #717171;
background: #F3F3F3;
width: 216px;
height: 118px;
flex-shrink: 0;
display :flex;
flex-direction: column;
margin:5px;
padding-left :10px;
`
const Item = styled.div`
color: #000;
font-size: 13px;
font-style: italic;
font-weight: 400;
line-height: normal;
margin :4px;
`

const TaskItem = styled.div`
color: #000;
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: normal;
margin :4px;
`
const Tags = styled.div`
color: #000;
font-size: 13px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin-left :-16px;
`
const DetailCard = styled.div`
border-radius: 6px;
border: 1px solid #717171;
width: 353px;
min-height: 481px;
display :flex;
flex-direction: column;
background: #F3F3F3;
margin:5px;
padding-left :10px;
`

const Line = styled.div`
width: 365px;
height: 1px;
background: #ADADAD;
margin-top : 7px;
margin-left :-10px;
`
const Comment = styled.div`
border-radius: 6px;
border: 1px solid #717171;
width: 336px;
min-height: 67px;
flex-shrink: 0;
background: #FFF;
margin-top:14px;
color: #000;
`

const CommentHeader = styled.div`
display :flex;
margin 7px;
justify-content: space-between;
flex-wrap: wrap;
flex-direction: row;
font-size: 13px;
font-style: italic;
font-weight: 400;
`
const CommentBody = styled.div`
margin 7px;
color: #000;
font-size: 15px;
font-style: normal;
font-weight: 400;
line-height: normal;
`
