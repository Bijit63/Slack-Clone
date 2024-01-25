import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TaskInput from '../TaskInput';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

};

const Modals = ({ open, handleClose  , taskInputComponent: TaskInputComponent}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      
    >
      <Box sx={style}>
      {TaskInputComponent && <TaskInputComponent  />}
      </Box>
    </Modal>
  );
};
export default Modals; 
  