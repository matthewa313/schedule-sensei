import React from 'react';
import {
  Backdrop,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Typography,
} from '@mui/material';
import Bubble from '../custom_components/Bubble.jsx';

import '../App.css';

export default function SelectTeachers(props) {
  return (
    <div className="SelectTeachers">
      <Bubble
        bearAlign='left'
        text='Select the teachers you want included in your schedule. At least one teacher must be selected per course, and selecting two or more teachers will allow either to appear in your schedules. (If no teachers are listed, you have selected offs in every period for which that course is offered).'
      />
      <div className='teachersForm'>
        {Object.keys(props.options).map((course) => (
          <FormControl key={course} error={!props.error(course)}>
            <FormLabel>{course}</FormLabel>
            <FormGroup className='teachersFormGroup' style={{marginLeft: '16px'}}>
              {Object.keys(props.options[course]).sort().map((teacher) => (
                <FormControlLabel
                  key={teacher}
                  label={teacher}
                  control={<Checkbox
                    name={teacher}
                    checked={props.options[course][teacher]}
                    onChange={
                      (event) => props.onChange(event, course)
                    }
                  />}
                />
              ))}
            </FormGroup>
          </FormControl>
        ))}
      </div>
      <Bubble
        bearAlign='right'
        text='When you click finish, I will begin using my powers to find all of your schedules. It may take a while, so be patient while I work...'
      />
    </div>
  );
}
