import React, { useState } from 'react';
import CountdownTimer from '../custom_components/CountdownTimer.jsx';

import {
  Button,
  Dialog, 
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,

} from '@mui/material';


const CountdownModal = ({isOpen, handleClose}) => {

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);

  }

  return(
    
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle style={{fontFamily: 'Kaushan Script'}} className='modalTitle' variant='h5'>Countdown Until Self Scheduling</DialogTitle>
      
      <DialogContent>

        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Rising Seniors"/>
          <Tab label="Rising Juniors"/>
        </Tabs>

        {value === 0 && (
          <div>
            <CountdownTimer targetUTC={Date.UTC(2025,3,11)}/>

          </div>)}


        {value === 1 && (
          <div>
            <CountdownTimer targetUTC={Date.UTC(2025,3,23)}/>

          </div>)}

 


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

