import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Slide } from '@mui/material';

export default function SimpleSnackbar({message, setalerttrigger, vertical, horizontal, severity}) {
  const [open, setOpen] = useState(false);

  useEffect(()=> {
    setOpen(true)
    setTimeout(() => {
      setalerttrigger('')
    }, 10000);
  },[message])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setalerttrigger('')
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        sx={{width: '30%'}}
        open={open}
        autoHideDuration={6000}
        action={action}
      >
        <Alert onClose={handleClose} severity={severity ? severity : 'error'} sx={{ width: '100%', fontSize: '1rem' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}