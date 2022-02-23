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


const useStyles = makeStyles((creekTheme) => ({
  title: {
    textAlign: 'center',
  },
}));

const HelpModal = ({isOpen, handleClose}) => {
  const classes = useStyles();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>Welcome to the Schedule Sensei Dojo!</DialogTitle>
      <DialogContent>
        <div style={{display: 'flex'}}>
          <div className='leftColumn' >
            <DialogContentText>
              Creek Students,<br/><br/>

              Making your own schedule can be hard because it is difficult to know what schedules you can get. On top of that, you want certain off periods and your favorite teachers!<br/><br/>

              This tool is here to help. Use this website to generate a list of all your possible schedules, and filter by your preferred off periods or your favorite teachers! Then save the list to help during your self scheduling session.<br/><br/>

              For the best experience, use a computer.
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
