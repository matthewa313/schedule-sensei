import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const AboutModal = ({isOpen, handleClose}) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle>About</DialogTitle>
      <DialogContent>
        <DialogContentText>
          About, about about about, and about some more, about that, about this, about him, about her. About your mother, your father, your sister, your brother, his wife, and about all of that and more. About about about.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AboutModal;
