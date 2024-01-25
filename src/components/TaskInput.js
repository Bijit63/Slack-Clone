import { useEffect, useState , useContext  } from 'react'
import styled from 'styled-components'
import Input from './Common/Input';
import StatusButton from './Common/StatusButton';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import db from '../firebase'
import firebase from 'firebase/compat/app';
import { Context } from '../Context/NoteContext';
const TaskInput = (props) => {
    const context = useContext(Context)
    const {userlists } = context
    const topOptions = [{ tag: 'Tag 1' },
    { tag: 'Tag 2' },
    { tag: 'Tag 3' }];
    const priorityValue = [{ priority: '1' },
    { priority: '2' },
    { priority: '3' },
    { priority: '4' },
    { priority: '5' }];
    const [taskData, settaskData] = useState({
        tags: "",
        assigned_to: "",
        reporting_person: "",
        due_date: "",
        priority: "",
        title: "",
        description: "",
    })
    const handleDueDateChange = (e) => {
        const { name, value } = e.target
        settaskData({
            ...taskData,
            [name]: value,
        });
        console.log(taskData)
    };
   
    const handleInputChange = (event, newValues) => {
        console.log(newValues)
        if (Array.isArray(newValues)) {
            const tags = newValues.map((newValue) =>
                newValue && newValue.inputValue ? newValue.inputValue : newValue.tag
            );
            settaskData({ ...taskData, tags });
        }
    };
    const filter = createFilterOptions();
    const filterOptions = (options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;

        const isExisting = options.some((option) => inputValue === option.tag);
        if (inputValue !== '' && !isExisting) {
            filtered.push({
                inputValue,
                tag: `Add "${inputValue}"`,
            });
        }
        return filtered;
    };


    const sendMessage = () => {
        const user = localStorage.getItem('userId')
        console.log(taskData)
        let payload = {
            created_on: firebase.firestore.Timestamp.now(),
            created_by: user,
            tag: taskData.tags,
            assigned_to: {id : taskData.assigned_to.userId, name: taskData.assigned_to.username}, 
            reporting_person:  {id : taskData.reporting_person.userId, name: taskData.reporting_person.username},
            due_date: taskData.due_date,
            priority: taskData.priority?.priority,
            title: taskData.title,
            description: taskData.description,
            status: "pending"
        }
        console.log(payload)
        db.collection("Task").add(payload)
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document:", error);
            });
    }
    return <div>
        <Main>
            <Container>
                <Input placeholder="Type title here" name="title" value={taskData.title} style={{ height: "25px", width: "355px", marginTop: "14px" }}
                    onChange={handleDueDateChange} />
                <Input placeholder="Description..." name="description" value={taskData.description} style={{ height: "30px", width: "355px", marginTop: "10px" }}
                    onChange={handleDueDateChange} />
                <TagSection>
                    <Autocomplete
                        multiple
                        value={taskData.tag}
                        onChange={handleInputChange}
                        filterOptions={filterOptions}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        options={topOptions}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.inputValue || option.tag || ''
                        }
                        renderOption={(props, option) => <li {...props}>{option.tag}</li>}

                        freeSolo
                        renderInput={(params) => <TextField {...params} sx={{ minWidth: '200px' }} size="small" label="Add Tags" />}
                    />

                    <Autocomplete
                        value={settaskData.priority}
                        onChange={(event, newValue) => {
                            settaskData({ ...taskData, priority: newValue })
                        }}
                        options={priorityValue}
                        renderOption={(props, option) => <li {...props}>{option.priority}</li>}
                        getOptionLabel={(option) =>
                            typeof option === 'string' ? option : option.priority 
                        }
                        renderInput={(params) => (
                            <TextField {...params} sx={{ width: '120px' }} label="Priority" size="small" />
                        )}
                    />
                    {/* </Status> */}
                </TagSection>
                <TagSection>
                    <Status style={{ width: "180px" }}  >
                        <input
                            type="date"
                            name="due_date"
                            style={{
                                border: "none",
                                outline: "none",
                            }}
                            value={taskData.due_date}
                            onChange={handleDueDateChange}
                        />
                    </Status>
                </TagSection>


                <TagSection>
                    {/* <div style={{ marginTop: "10px" }}>
                        Assigned To:
                    </div> */}
                    <Autocomplete
                        id="assigned-to-autocomplete"
                        value={taskData.assigned_to}
                        onChange={(event, newValue) => settaskData({
                            ...taskData,
                            assigned_to:newValue
                        })} 
                        options={userlists}
                        getOptionLabel={(option) => option.username}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{ width: '220px' }}
                                label="Assigned To"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                </TagSection>
                <TagSection>
                    {/* <div style={{ marginTop: "10px" }}>
                        Reporting Person:
                    </div> */}
                    <Autocomplete
                        id="assigned-to-autocomplete"
                        value={taskData.reporting_person}
                        onChange={(event, newValue) => settaskData({
                            ...taskData,
                            reporting_person: newValue,
                        })}
                        options={userlists}
                        getOptionLabel={(option) => option.username}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{ width: '220px' }}
                                label="Reporting to"
                                variant="outlined"
                                size="small"
                            />
                        )}
                    />
                </TagSection>
                <ButtonSection>
                    <StatusButton style={{ background: "#085FE2", width: "140.158px", cursor: "pointer" }} data={"Submit"} onClick={sendMessage} />
                </ButtonSection>
            </Container>
        </Main>
    </div>;
}

export default TaskInput;

const Container = styled.div`
border-radius: 6px;
border: 1px solid #717171;
width: 372px;
min-height: 362px;
flex-shrink: 0;
background: #F3F3F3;
box-shadow: 2px 2px 50px 0px rgba(0, 0, 0, 0.25);
display :flex;
flex-direction: column;
margin:5px;
padding-left :10px;
padding-right :10px;
`

const Main = styled.div`

display :flex;
justify-content: center;
flex-direction: row;
align-items: center;
`


const TagSection = styled.div`
display :flex;
margin-top : 14px;
flex-direction: coloumn;
justify-content: space-between;
`

const Select = styled.select`
width: 182px;
height: 36px;
&:focus {
    outline: none;
  }
flex-shrink: 0;
border-radius: 6px;
border: 1px solid #717171;
background: #FFF;
display :flex;
justify-content :center;
`

const ButtonSection = styled.div`
display :flex;
margin-top : 10px;
justify-content: flex-end;
`

const Status = styled.div`
border-radius: 6px;
border: 1px solid #717171;
min-width: 76px;
font-size: 15px;
    font-style: normal;
    font-weight: 400;
color :white;
min-height: 36.226px;
flex-shrink: 0;
display: flex;
flex-direction: column;
justify-content: center;
align-items :center;
padding: 1px 10px 2px 10px;
`