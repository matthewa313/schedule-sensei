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

import '../App.css';

export default function SelectTeachers(props) {
  return (
    <div className="SelectTeachers">
      <Typography gutterBottom>
        Select the teachers you want included in your schedule. At least one teacher must be selected per course, and selecting two or more teachers will allow either to appear in a schedule. (If no teachers are listed, you have selected offs in every period for which that course is offered).
      </Typography>
      <div className='teachersForm'>
        {Object.keys(props.options).map((course) => (
          <FormControl key={course} error={!props.error(course)}>
            <FormLabel>Teachers for {course}</FormLabel>
            <FormGroup className='teachersFormGroup'>
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
        <Backdrop className='backdrop' open={props.open}>
          <CircularProgress color='inherit'/>
          <Typography>
            Generated {!isNaN(props.progress) && props.progress.toString()}
          </Typography>
        </Backdrop>
      </div>
    </div>
  );
}
