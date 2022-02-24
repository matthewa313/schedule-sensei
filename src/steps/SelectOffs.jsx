import React from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

import '../App.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  compactFormGroup: {
    marginLeft: '10%',
    marginRight: '10%',
  },
}));

export default function SelectOffs(props) {
  const classes = useStyles();

  return (
    <div className="SelectOffs">
      <Typography gutterBottom>
        Select which periods you want off. This will force Schedule Sensei to chop together schedules with these periods free. (If your schedule has space for more offs, Schedule Sensei will add offs when they are available).
      </Typography>
      <FormControl className={classes.formControl}>
        <FormGroup row='true' className={classes.compactFormGroup}>
          {props.periods.map((checked, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox
                checked={checked}
                onChange={props.onChange}
                name={'' + index}
                color='secondary'
              />}
              label={'Period ' + (index + 1)}
            />
          ))}
        </FormGroup>
      </FormControl>
      <Typography gutterBottom>
        By default, the Schedule Sensei only chops together schedules which have a lunch period in either 4th, 5th, or 6th. To override the Schedule Sensei, select one of the boxes below:
      </Typography>
      <FormControl className={classes.formControl}>
        <FormGroup>
          {props.requiredOffOverride.map((checked, index) => (
            <FormControlLabel
              key={index}
              control={<Radio
                checked={checked}
                onChange={props.onChangeOverride}
                name={'' + index}
                color='secondary'
              />}
              label={'Lunch in ' + props.requiredOffOverrideOptions[index]}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}
