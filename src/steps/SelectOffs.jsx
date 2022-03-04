import React from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  Typography,
} from '@mui/material';
import Bubble from '../custom_components/Bubble.jsx';

import '../App.css';
import {
  REQUIRED_OFF_OVERRIDE_OPTIONS
} from '../App.js';

export default function SelectOffs(props) {
  return (
    <div className='SelectOffs'>
      <Bubble
        bearAlign='left'
        text='Select which periods you want off. I will only chop together schedules with these periods free for the whole year.'
      />
      <div className='periodsForm'>
        <FormControl>
          <FormGroup row={true} className='periodsFormGroup'>
            {props.periods.map((checked, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox
                  checked={checked}
                  onChange={props.onChange}
                  name={'' + index}
                  color='primary'
                />}
                label={'Period ' + (index + 1)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
      <Bubble
        bearAlign='right'
        text='By default, I only slice together schedules that have one of 4th, 5th, or 6th off. To override this, select one of the boxes below.'
      />
      <div className='requiredOffOverideForm'>
        <FormControl>
          <FormGroup>
            {props.requiredOffOverride.map((checked, index) => (
              <FormControlLabel
                key={index}
                control={<Radio
                  checked={checked}
                  onChange={props.onChangeOverride}
                  name={'' + index}
                  color='primary'
                />}
                label={REQUIRED_OFF_OVERRIDE_OPTIONS[index][0]}
              />
            ))}
          </FormGroup>
        </FormControl>
      </div>
    </div>
  );
}
