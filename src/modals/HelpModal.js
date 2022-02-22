import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const HelpModal = ({isOpen, handleClose}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Help! Helpity help helpity! Help me, help him, help her, and especially help the needy! Help. Yelp. Kelp. Telp. Doesnt matter, just elp! Elp Elp Elpity!
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

export default HelpModal;
