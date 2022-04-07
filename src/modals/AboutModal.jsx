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
          In 2018, Changyuan Lin built the original <Link href='https://coreball.github.io/ScheduleStacker/' color='primary' target='_blank'>ScheduleStacker</Link> and in 2020, <Link href='https://coreball.github.io/schedulestacker-js/' color='primary' target='_blank'>schedulestacker-js</Link>—apps like this one to help Creek students through the self-scheduling process.<br/><br/>

          I built Schedule Sensei with the goal of continuing the helpful work of ScheduleStacker with more features. These include lunch period customizability, improved scheduling for PE/ILC/SAS, a mascot, smoother performance for students with large numbers of schedules, and downloadable schedules. I have also made Schedule Sensei more customizable so that students at other schools can replicate this work. However, the concept and much of the code in Schedule Sensei comes from straight from Changyuan.<br/><br/>

          To see the code, visit <Link href='https://github.com/matthewa313/schedule-sensei' color='primary'>the Schedule Sensei GitHub Repository</Link>. This project is open source, so I welcome anyone (especially Creek CS students) to contribute (and learn in the process). If you want to help, have any thoughts, or noticed any errors, please contact me at <Link href='mailto:manderson63@cherrycreekschools.org' color='primary'>manderson63@cherrycreekschools.org</Link>.<br/><br/>

          <span style={{float: 'right'}}><b>Matthew Anderson</b></span>
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
