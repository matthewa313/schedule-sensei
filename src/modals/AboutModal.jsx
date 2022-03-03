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
          In 2018, Changyuan Lin built the original <Link href='https://coreball.github.io/schedulestacker-js/' color='primary'>ScheduleStacker</Link>—an app like this one to help Creek students through the self-scheduling process. After he started attending Cornell in 2020, the programming frameworks on which the app was built slowly became deprecated (i.e. outdated).<br/><br/>

          I built Schedule Sensei with the goal of continuing the helpful work of ScheduleStacker with modern coding paradigms and more features. On the coding end, I have made Schedule Sensei more customizable so that students at other schools can replicate this work. However, much of the concept and code in Schedule Sensei comes from straight from Changyuan.<br/><br/>

          To see the code, visit <Link href='https://github.com/matthewa313/schedule-sensei' color='primary'>the Schedule Sensei GitHub Repository</Link>. This project is open source, so I welcome anyone (especially Creek computer science students) to contribute (and learn in the process). If you want to help, have any thoughts, or noticed any errors, please contact me at <Link href='mailto:manderson63@cherrycreekschools.org' color='primary'>manderson63@cherrycreekschools.org</Link>.<br/><br/>

          <span style={{marginLeft:'350px'}}><b>Matthew Anderson</b></span>
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
