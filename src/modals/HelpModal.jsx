import React from 'react';
import '../App.css';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { makeStyles } from '@mui/styles';
import bearSensei from '../sensei-art/bearsensei.jpg';

const HelpModal = ({isOpen, handleClose, institutionShortName}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle style={{fontFamily: 'Kaushan Script'}} className='modalTitle' variant='h5'>Welcome to the Schedule Sensei Dojo!</DialogTitle>
      <DialogContent>
        <div style={{display: 'flex'}}>
          <div className='leftColumn' >
            <DialogContentText>
              <b>{institutionShortName} Students,</b><br/><br/>

              Making your own schedule can be difficult because it is hard to know what schedules you can get. On top of that, you want certain off periods and your favorite teachers!<br/><br/>

              This tool is here to help. Use it to find a list of all of your possible schedules and filter by off period or your favorite teacher! Then save the list to help during your self scheduling session.<br/><br/>

              Schedule Sensei works best on a computer.
            </DialogContentText>
          </div>
          <div className='rightColumn'>
            <img src={bearSensei} alt='bear sensei'/>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default HelpModal;
