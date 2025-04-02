import React from 'react';
import CountdownTimer from '../custom_components/CountdownTimer.jsx';

import {
  Button,
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,

} from '@mui/material';


const CountdownModal = ({isOpen, handleClose}) => {

  return(
    
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle style={{fontFamily: 'Kaushan Script'}} className='modalTitle' variant='h5'>Countdown Until Self Scheduling</DialogTitle>
      
      <DialogContent>
        
        <CountdownTimer  />


      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Ok
        </Button>
 
      </DialogActions>
    </Dialog>


  );

};

export default CountdownModal;

