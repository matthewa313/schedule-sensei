import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from '@mui/material';

const AboutModal = ({isOpen, handleClose}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle style={{fontFamily: 'Kaushan Script'}} className='modalTitle' variant='h5'>About Schedule Sensei</DialogTitle>
      <DialogContent>
        <DialogContentText>
          In 2018, Changyuan Lin built the original <Link href='https://coreball.github.io/ScheduleStacker/' color='primary' target='_blank'>ScheduleStacker</Link> and in 2020, <Link href='https://coreball.github.io/schedulestacker-js/' color='primary' target='_blank'>schedulestacker-js</Link>—apps like this one to help Creek students through the self-scheduling process. Changyuan is now doing brilliant app development at Cornell University.<br/><br/>

          I built Schedule Sensei with the goal of continuing the helpful work of ScheduleStacker with more features. The concept and much of the code in Schedule Sensei comes from straight from Changyuan Lin.<br/><br/>

          To see the code, visit <Link href='https://github.com/matthewa313/schedule-sensei' color='primary'>the Schedule Sensei GitHub Repository</Link>. This project is open source, so I welcome anyone to collaborate as a team. If you want to work together, have any thoughts, or notice any errors, please contact me at <Link href='mailto:umatthew@umich.edu' color='primary'>umatthew@umich.edu</Link>.<br/><br/>

          <span style={{ float: 'right' }}><b>Matthew Anderson</b> <br /><br />
            <b>Contributors</b>
            <p>Matthew Anderson <br /> Owen Lennon</p>
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AboutModal;
