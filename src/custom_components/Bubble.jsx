import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';

import bearSenseiHead from '../sensei-art/bearsenseihead.png';


export default function Bubble(props) { // is right, text
  if(props.bearAlign === 'right') {
    return (
      <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        <Box
          sx={{
            border:'3px solid #ddd',
            borderRadius:'6px',
            backgroundColor: '#ddd',
            clipPath: 'polygon(0% 0%, 95% 0, 95% 40%, 100% 50%, 95% 60%, 95% 100%, 0 100%)',
          }}
        >
          <Typography m={1} mr={3}>
            {props.text}
          </Typography>
        </Box>
        <img src={bearSenseiHead} width='20%'/>
      </div>
    );
  } else if(props.bearAlign === 'left') {
    return (
      <div style={{display: 'flex', alignItems: 'center', marginLeft: 'auto'}}>
        <img src={bearSenseiHead} width='20%' style={{transform: 'scale(-1,1)'}}/>
        <Box
          sx={{
            border:'3px solid #ddd',
            borderRadius:'6px',
            backgroundColor: '#ddd',
            clipPath: 'polygon(100% 0%, 5% 0, 5% 40%, 0% 50%, 5% 60%, 5% 100%, 100% 100%)',
          }}
        >
          <Typography m={1} ml='8%'>
            {props.text}
          </Typography>
        </Box>
      </div>
    );
  } else {
    return ( 'error!' );
  }
}
